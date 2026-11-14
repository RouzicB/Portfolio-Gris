"use client";

import { startTransition, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { animate, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { sections } from "../../data/sections";
import { palettes } from "../../data/palettes";
import { parseColor, type RGBA } from "../../lib/color";
import { anchorId, canScrollWithin, clampIndex, cssVarName, gestureDirection, segment } from "../../lib/journey";
import type { Palette } from "../../types";
import { JourneyContext, JourneyControlsContext } from "./JourneyContext";
import Landscape from "../background/Landscape";
import SectionNav from "./SectionNav";

const STAGES = sections.map((s) => s.stage);
const SUNS = sections.map((s) => s.sun);
/** Palettes lues une fois pour toutes : chaque image ne fait plus que des mélanges de nombres */
const KEYS = Object.keys(palettes[STAGES[0]]) as (keyof Palette)[];
const VARS = KEYS.map(cssVarName);
const PARSED: RGBA[][] = STAGES.map((stage) => KEYS.map((k) => parseColor(palettes[stage][k])));
/** Durée du voyage d'une section à l'autre (zoom), en secondes */
const TRAVEL = 1.35;
/** Courbe : départ franc, arrivée très douce */
const EASE: [number, number, number, number] = [0.65, 0, 0.2, 1];

/**
 * Moteur du voyage, section par section.
 * Un geste (molette, glissé, flèches, Page↑/↓, Espace) amène à la section voisine :
 * la position `progress` glisse alors de l'une à l'autre et tout la suit — palette, décor qui zoome,
 * soleil, contenu qui s'efface en avant pendant que le suivant arrive du fond.
 * Si une section dépasse l'écran (mobile), on la parcourt d'abord, puis le geste suivant change de section.
 */
export default function Journey({ children }: Readonly<{ children: ReactNode }>) {
  const [active, setActive] = useState(0);
  const progress = useMotionValue(0);
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const travel = useRef<AnimationPlaybackControls | null>(null);
  const busyUntil = useRef(0);

  const goTo = useCallback(
    (index: number, instant = false) => {
      const target = clampIndex(index, sections.length);
      const forward = target >= activeRef.current;
      activeRef.current = target;
      travel.current?.stop();
      const duration = instant ? 0 : reduce ? 0.45 : TRAVEL;
      busyUntil.current = performance.now() + duration * 1000;
      // La section d'arrivée est rendue tout de suite (sans attendre React), et placée :
      // en haut en avançant, en bas en reculant (sections plus hautes que l'écran)
      const el = stageRef.current?.querySelector<HTMLElement>(`[data-section-index="${target}"]`);
      if (el) {
        el.style.contentVisibility = "visible";
        el.scrollTop = forward || instant ? 0 : el.scrollHeight;
      }
      if (instant) {
        travel.current = null;
        document.documentElement.removeAttribute("data-travel");
        progress.set(target);
      } else {
        // Voyage en cours : transitions de couleur suspendues (globals.css)
        const root = document.documentElement;
        root.setAttribute("data-travel", "");
        const run = animate(progress, target, { duration, ease: EASE });
        travel.current = run;
        run.then(() => {
          if (travel.current === run) root.removeAttribute("data-travel");
        });
      }
      // Le rendu React (section active, navigation, apparitions) passe en tâche de fond, interruptible :
      // il ne bloque plus les premières images du voyage
      if (instant) setActive(target);
      else startTransition(() => setActive(target));
      const hash = `#${anchorId(sections[target].id)}`;
      if (window.location.hash !== hash) window.history.replaceState(null, "", target === 0 ? window.location.pathname : hash);
    },
    [progress, reduce],
  );

  // La page d'accueil ne défile plus : chaque section est un écran
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  // Arrivée par une ancre (#section-projets depuis une page projet)
  useEffect(() => {
    const fromHash = () => sections.findIndex((s) => `#${anchorId(s.id)}` === window.location.hash);
    // Différé d'une image : le rendu serveur (sans ancre) s'hydrate d'abord tel quel
    const index = fromHash();
    const raf = index > 0 ? requestAnimationFrame(() => goTo(index, true)) : 0;
    // Ancre modifiée sans recharger la page (lien interne, saisie dans la barre d'adresse)
    const onHash = () => {
      const i = fromHash();
      if (i >= 0 && i !== activeRef.current) goTo(i);
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", onHash);
    };
  }, [goTo]);

  // La palette suit la position, image par image
  useEffect(() => {
    const root = document.documentElement;
    // Dernière valeur écrite par variable : seules celles qui changent sont réécrites
    const last: string[] = [];
    const apply = (f: number) => {
      const { from, to, t } = segment(f, sections.length);
      const a = PARSED[from];
      const b = PARSED[to];
      for (let i = 0; i < KEYS.length; i++) {
        const ca = a[i];
        const cb = b[i];
        const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
        const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
        const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
        const al = Math.round((ca[3] + (cb[3] - ca[3]) * t) * 1000) / 1000;
        const value = `rgba(${r}, ${g}, ${bl}, ${al})`;
        if (last[i] === value) continue;
        last[i] = value;
        root.style.setProperty(VARS[i], value);
      }
    };
    apply(progress.get());
    return progress.on("change", apply);
  }, [progress]);

  // Gestes : molette, glissé tactile, clavier
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const activeEl = () => stage.querySelector<HTMLElement>(`[data-section-index="${activeRef.current}"]`);
    const ready = () => performance.now() > busyUntil.current;

    /*
     * Molette : un geste = une section.
     * Un « geste » est une suite d'évènements sans pause de plus de 160 ms (un cran de souris,
     * ou un balayage de pavé tactile avec son inertie). Seul le premier pas d'un geste compte :
     * les crans en rafale et l'inertie ne font jamais sauter deux sections.
     */
    let wheelSum = 0;
    let lastWheel = 0;
    let gestureUsed = false;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // zoom du navigateur
      // Geste horizontal (trackpad, Maj + molette) : on laisse défiler le canevas du parcours
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const now = performance.now();
      if (now - lastWheel > 160) {
        wheelSum = 0;
        gestureUsed = false;
      }
      lastWheel = now;
      // Delta en pixels (Firefox peut compter en lignes)
      const delta = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      const dir = delta > 0 ? 1 : -1;
      const el = activeEl();
      // Seule une section qui dépasse vraiment l'écran défile d'abord à l'intérieur
      if (el && el.scrollHeight - el.clientHeight > 24 && canScrollWithin(el, dir)) return;
      e.preventDefault();
      if (gestureUsed || !ready()) return;
      wheelSum += delta;
      const step = gestureDirection(wheelSum, 4);
      if (!step) return;
      gestureUsed = true;
      const next = activeRef.current + step;
      if (next >= 0 && next < sections.length) goTo(next);
    };

    // Tactile : une section plus haute que l'écran se lit d'abord en entier. On ne change de section que si,
    // au début du geste, le contenu était déjà en butée dans ce sens (sinon le même geste qui amène en bas
    // enchaînerait aussitôt sur la section suivante). Les balayages horizontaux (canevas du parcours) sont ignorés.
    let touchX = 0;
    let touchY = 0;
    let edge = { down: true, up: true };
    const onTouchStart = (e: TouchEvent) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
      const el = activeEl();
      edge = el ? { down: !canScrollWithin(el, 1), up: !canScrollWithin(el, -1) } : { down: true, up: true };
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchX - e.changedTouches[0].clientX;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy)) return;
      const step = gestureDirection(dy, 50);
      if (!step || !ready()) return;
      if (!(step > 0 ? edge.down : edge.up)) return;
      goTo(activeRef.current + step);
    };

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      const next = ["ArrowDown", "PageDown", " "].includes(e.key);
      const prev = ["ArrowUp", "PageUp"].includes(e.key);
      if (!next && !prev && e.key !== "Home" && e.key !== "End") return;
      const el = activeEl();
      if ((next || prev) && el && canScrollWithin(el, next ? 1 : -1)) return;
      e.preventDefault();
      if (!ready()) return;
      if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(sections.length - 1);
      else goTo(activeRef.current + (next ? 1 : -1));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [goTo]);

  const controls = useMemo(() => ({ progress, goTo }), [progress, goTo]);
  const value = useMemo(() => ({ active, progress, goTo }), [active, progress, goTo]);

  return (
    <JourneyControlsContext.Provider value={controls}>
      <JourneyContext.Provider value={value}>
        <button
          type="button"
          onClick={() => goTo(1)}
          className="label-spaced sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-veil focus:px-4 focus:py-2"
        >
          Aller au contenu
        </button>
        <Landscape progress={progress} stages={STAGES} suns={SUNS} />
        <SectionNav />
        {/* Scène : les sections sont empilées, une seule est visible et active */}
        <main ref={stageRef} className="fixed inset-0 overflow-hidden">
          {children}
        </main>
      </JourneyContext.Provider>
    </JourneyControlsContext.Provider>
  );
}
