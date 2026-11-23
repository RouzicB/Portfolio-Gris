"use client";

import { startTransition, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { animate, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { sections } from "../../data/sections";
import { palettes } from "../../data/palettes";
import { parseColor, type RGBA } from "../../lib/color";
import { anchorId, canScrollWithin, clampIndex, cssVarName, gestureDirection, segment } from "../../lib/journey";
import { settlePalette } from "../../lib/settle";
import { isLite } from "../../lib/perf";
import type { Palette } from "../../types";
import { JourneyContext, JourneyControlsContext } from "./JourneyContext";
import Landscape from "../background/Landscape";
import SectionNav from "./SectionNav";
import { ambient } from "../../lib/ambient";

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
  /** Section visée par le voyage en cours (null : déplacement instantané) */
  const travelTo = useRef<number | null>(null);
  const travel = useRef<AnimationPlaybackControls | null>(null);
  const busyUntil = useRef(0);
  const listeners = useRef(new Set<(index: number) => void>());
  const prerenderTask = useRef(0);

  /**
   * Au repos, les sections voisines de la section active sont préparées (attribut data-ready) : leur contenu est rendu
   * (styles et mise en page calculés), visible au sens CSS mais à opacité nulle, et inerte. Au départ d'un voyage, la
   * section d'arrivée n'a plus qu'à changer d'opacité. Avant, elle passait de « masquée » à « visible » : la visibilité
   * se transmettant à tout son contenu, le navigateur en recalculait le style d'un coup (~500 éléments) à la première
   * image du trajet, un à-coup bien visible sur un PC lent. Les autres sections restent non rendues (content-visibility).
   */
  const prerenderNeighbors = useCallback((index: number) => {
    const run = () => {
      prerenderTask.current = 0;
      if (activeRef.current !== index) return;
      stageRef.current?.querySelectorAll<HTMLElement>("[data-section-index]").forEach((el) => {
        const i = Number(el.dataset.sectionIndex);
        if (i === index) return;
        const ready = Math.abs(i - index) === 1;
        el.toggleAttribute("data-ready", ready);
        // Les autres sections suivent cette règle à chaque image (SectionShell) ; ici, on l'applique tout de suite
        if (Number(getComputedStyle(el).opacity) < 0.01) {
          el.style.visibility = ready ? "visible" : "hidden";
          el.style.contentVisibility = ready ? "visible" : "hidden";
        }
      });
    };
    if (prerenderTask.current) window.clearTimeout(prerenderTask.current);
    // Après le voyage, une fois le navigateur au repos
    prerenderTask.current = window.setTimeout(
      () => ("requestIdleCallback" in window ? window.requestIdleCallback(run, { timeout: 1500 }) : run()),
      300,
    );
  }, []);

  const goTo = useCallback(
    (index: number, instant = false) => {
      const target = clampIndex(index, sections.length);
      const forward = target >= activeRef.current;
      const changed = target !== activeRef.current;
      activeRef.current = target;
      travelTo.current = instant ? null : target;
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
      // Voyage en cours : signal pour les autres scripts sur <html> (data-traveling, qu'aucune règle CSS ne lit : un attribut
      // lu par le CSS, posé sur <html>, ferait recalculer le style de toute la page), et attribut data-travel sur les
      // éléments qui suivent la palette (leurs transitions de couleur sont suspendues, globals.css)
      const setTravel = (on: boolean) => {
        document.documentElement.toggleAttribute("data-traveling", on);
        // Aussi en mode léger : sans cet attribut, le bouton de la section qui s'allume (ou s'éteint) faisait sa propre
        // transition de couleur pendant le voyage, et l'icône de chaque bouton, qui hérite de cette couleur, était
        // recalculée à chaque image (sur un portable lent : ~100 ms par image). Le recalcul que coûte l'attribut tombe au
        // départ, dans la même image que les nouvelles couleurs, et à l'arrivée, quand le mouvement est fini.
        document.querySelectorAll("[data-palette-live]").forEach((el) => el.toggleAttribute("data-travel", on));
      };
      if (instant) {
        travel.current = null;
        setTravel(false);
        progress.set(target);
      } else {
        setTravel(true);
        const run = animate(progress, target, { duration, ease: EASE });
        travel.current = run;
        run.then(() => {
          if (travel.current !== run) return;
          setTravel(false);
          // Le rendu React (accessibilité, interactivité de la section active) attend la fin du voyage : il change
          // aria-hidden et inert sur deux sections, ce qui fait recalculer le style de tout leur contenu (~600 éléments).
          // En plein trajet, sur un PC lent, c'étaient plusieurs images perdues. L'apparence, elle, suit déjà le geste.
          startTransition(() => setActive(target));
          prerenderNeighbors(target);
        });
      }
      // La musique d'ambiance (si elle joue) prend la gamme de la zone d'arrivée
      ambient().setStage(STAGES[target]);
      // Apparition du contenu et navigation : tout de suite, sans React
      if (changed) listeners.current.forEach((fn) => fn(target));
      if (instant) {
        setActive(target);
        prerenderNeighbors(target);
      }
      const hash = `#${anchorId(sections[target].id)}`;
      if (window.location.hash !== hash) window.history.replaceState(null, "", target === 0 ? window.location.pathname : hash);
    },
    [progress, reduce, prerenderNeighbors],
  );

  // La page d'accueil ne défile plus : chaque section est un écran.
  // Retour à l'accueil depuis une autre page : la palette des boutons communs change, sans fondu (lib/settle.ts)
  useEffect(() => {
    settlePalette(250);
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
    // Retour sur l'accueil depuis une autre page : la musique reprend le morceau de la première zone
    if (index <= 0) {
      ambient().setStage(STAGES[0]);
      prerenderNeighbors(0);
    }
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
  }, [goTo, prerenderNeighbors]);

  // La palette suit la position, image par image.
  // ⚠ Pas sur :root : Chrome recalculerait alors le style de tous les éléments affichés (~800) à chaque image.
  // Elle n'est écrite que sur les quelques éléments qui la suivent en direct (ciel, astre, navigation, crédits :
  // attribut data-palette-live) ; chaque section porte sa propre palette, fixe (SectionShell).
  useEffect(() => {
    let targets: HTMLElement[] = [];
    // Éléments chargés (navigation : ~190 descendants, lecteur de musique, crédits : tout est recalculé à chaque
    // changement de variable). Pendant un voyage, une image sur deux suffit : l'écart de teinte est invisible.
    // Mode léger (ordinateur modeste, téléphone) : ils prennent les couleurs d'arrivée d'un coup, au départ du voyage
    // (une seule mise à jour). Chaque mise à jour coûtait jusqu'à 100 ms sur un PC très lent ; un fondu de couleur, lui,
    // recalculait les ~580 tracés des icônes à chaque image : autant d'à-coups en plein trajet.
    // Le ciel et l'astre (sans descendants à recalculer) suivent, eux, chaque image.
    let heavy = new Set<HTMLElement>();
    let frame = 0;
    const collect = () => {
      targets = Array.from(document.querySelectorAll<HTMLElement>("[data-palette-live]"));
      heavy = new Set(targets.filter((el) => el.getElementsByTagName("*").length > 8));
      lastLight.length = 0;
      lastHeavy.length = 0;
    };
    // Dernière valeur écrite par variable (éléments légers / chargés) : seules celles qui changent sont réécrites
    const lastLight: string[] = [];
    const lastHeavy: string[] = [];
    const apply = (f: number) => {
      // Un élément suivi a pu être remplacé (navigation entre pages) : on relit la liste
      if (targets.length === 0 || targets.some((el) => !el.isConnected)) collect();
      // Position d'arrivée (entière) : toujours écrite partout
      const lite = isLite();
      const goal = travelTo.current;
      // Mode léger, voyage en cours : les éléments chargés prennent tout de suite les couleurs d'arrivée (leurs transitions
      // de couleur sont suspendues pendant le voyage, data-travel) : le changement suit le geste, sans coût pendant le trajet
      const jump = lite && goal !== null && !Number.isInteger(f);
      const withHeavy = Number.isInteger(f) || jump || (!lite && frame++ % 2 === 0);
      const { from, to, t } = segment(f, sections.length);
      const a = PARSED[from];
      const b = PARSED[to];
      const rgba = (ca: number[], cb: number[], t: number) =>
        `rgba(${Math.round(ca[0] + (cb[0] - ca[0]) * t)}, ${Math.round(ca[1] + (cb[1] - ca[1]) * t)}, ${Math.round(
          ca[2] + (cb[2] - ca[2]) * t,
        )}, ${Math.round((ca[3] + (cb[3] - ca[3]) * t) * 1000) / 1000})`;
      for (let i = 0; i < KEYS.length; i++) {
        const value = rgba(a[i], b[i], t);
        const heavyValue = jump ? rgba(PARSED[goal][i], PARSED[goal][i], 0) : value;
        const light = lastLight[i] !== value;
        const loaded = withHeavy && lastHeavy[i] !== heavyValue;
        if (light) lastLight[i] = value;
        if (loaded) lastHeavy[i] = heavyValue;
        if (!light && !loaded) continue;
        for (const el of targets) {
          if (heavy.has(el)) {
            if (loaded) el.style.setProperty(VARS[i], heavyValue);
          } else if (light) el.style.setProperty(VARS[i], value);
        }
      }
    };
    collect();
    apply(progress.get());
    const off = progress.on("change", apply);
    return () => {
      off();
      // Le lien Crédits survit à la page d'accueil : il reprend la palette de la page suivante
      for (const el of targets) VARS.forEach((name) => el.style.removeProperty(name));
    };
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

    // Tactile (téléphone, tablette) : pas de changement de section au glissé. Le doigt fait seulement défiler le contenu
    // d'une section plus haute que l'écran ; on change de section avec la barre de navigation en bas.

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
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [goTo]);

  const controls = useMemo(
    () => ({
      progress,
      goTo,
      getActive: () => activeRef.current,
      onActivate: (fn: (index: number) => void) => {
        listeners.current.add(fn);
        return () => {
          listeners.current.delete(fn);
        };
      },
    }),
    [progress, goTo],
  );
  const value = useMemo(() => ({ active, progress, goTo }), [active, progress, goTo]);

  return (
    <JourneyControlsContext.Provider value={controls}>
      <JourneyContext.Provider value={value}>
        <button
          data-palette-live
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
