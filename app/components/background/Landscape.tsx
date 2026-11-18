"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore, type ComponentType } from "react";
import { useReducedMotion, type MotionValue } from "framer-motion";
import type { StageId, Sun } from "../../types";
import { segment, stageWeights, zoomScale } from "../../lib/journey";
import { TOUCH_QUERY, WIDE_QUERY, bakedScene } from "../../lib/decor";
import { PointerProvider } from "./Parallax";
import { WatercolorDefs } from "./art/shared";
import GrisArt from "./art/GrisArt";
import RougeArt from "./art/RougeArt";
import VertArt from "./art/VertArt";
import BleuArt from "./art/BleuArt";
import JauneArt from "./art/JauneArt";
import CielArt from "./art/CielArt";
import LuneArt from "./art/LuneArt";

/**
 * Scènes vivantes (SVG) seulement sur les écrans à souris : ailleurs, les images pré-rendues les remplacent.
 * Côté serveur, aucune : le HTML ne transporte plus ~2 000 éléments SVG que les téléphones masquaient sans les afficher.
 * Sur ordinateur, elles se montent juste après l'hydratation, sous l'écran de chargement.
 */
const subscribeTouch = (cb: () => void) => {
  const mq = window.matchMedia(TOUCH_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useLiveScenes = () =>
  useSyncExternalStore(
    subscribeTouch,
    () => !window.matchMedia(TOUCH_QUERY).matches,
    () => false,
  );

const ART: Record<StageId, ComponentType> = {
  gris: GrisArt,
  rouge: RougeArt,
  vert: VertArt,
  bleu: BleuArt,
  jaune: JauneArt,
  ciel: CielArt,
  lune: LuneArt,
};

/**
 * Le décor fixe : ciel, soleil (ou lune), une scène par ambiance, grain du papier.
 * `stages[i]` / `suns[i]` décrivent l'étape i ; `progress` est la position continue entre les étapes.
 * Les scènes se fondent l'une dans l'autre et le soleil glisse, sans transition déclenchée :
 * les styles sont écrits directement à chaque changement de `progress` (aucun rendu React par frame).
 * Une page projet passe une seule étape : le décor est alors immobile.
 */
export default function Landscape({ progress, stages, suns }: { progress: MotionValue<number>; stages: StageId[]; suns: Sun[] }) {
  const used = useMemo(() => Array.from(new Set(stages)), [stages]);
  const reduce = useReducedMotion();
  const sceneRefs = useRef<Partial<Record<StageId, HTMLDivElement | null>>>({});
  const sunRef = useRef<HTMLDivElement>(null);
  const live = useLiveScenes();

  useEffect(() => {
    // Téléphones et tablettes : les scènes voisines sont dessinées d'avance (quasi transparentes),
    // pour qu'un voyage n'ait pas à peindre d'un coup une scène aquarelle à haute densité de pixels.
    // (Sur ordinateur, inutile : et leurs nuages animés se redessineraient en continu.)
    const prewarm = window.matchMedia(TOUCH_QUERY).matches;
    // Dernier état écrit par scène : on ne touche au DOM que si quelque chose change
    const state: Partial<Record<StageId, "off" | "warm" | "on">> = {};
    const apply = (f: number) => {
      const weights = stageWeights(f, stages);
      const lo = Math.floor(f) - 1;
      const hi = Math.ceil(f) + 1;
      used.forEach((id) => {
        const el = sceneRefs.current[id];
        if (!el) return;
        const w = weights[id] ?? 0;
        // Étape de cette scène la plus proche de la position courante
        let idx = stages.indexOf(id);
        stages.forEach((s, i) => {
          if (s === id && Math.abs(i - f) < Math.abs(idx - f)) idx = i;
        });
        const next = w >= 0.004 ? "on" : prewarm && idx >= lo && idx <= hi ? "warm" : "off";
        if (state[id] !== next) {
          state[id] = next;
          el.style.visibility = next === "off" ? "hidden" : "visible";
          // Scène écartée : ni styles, ni mise en page, ni peinture (le recalcul de la palette l'ignore)
          el.style.contentVisibility = next === "off" ? "hidden" : "visible";
        }
        if (next === "off") return;
        el.style.opacity = next === "warm" ? "0.002" : String(w);
        // Zoom : on entre dans la scène qu'on quitte, la suivante arrive du fond
        el.style.transform = reduce ? "" : `scale(${zoomScale(f - idx)})`;
      });
      const { from, to, t } = segment(f, suns.length);
      const a = suns[from];
      const b = suns[to];
      const sun = sunRef.current;
      if (sun && a && b) {
        // Écrans étroits : l'astre rétrécit et, le texte occupant toute la largeur,
        // il se range dans le coin haut, de son côté, pour ne jamais passer derrière un titre
        const vw = window.innerWidth;
        const k = Math.min(1, Math.max(0.45, vw / 1200));
        const corner = vw < 1100;
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        sun.style.left = `${corner ? (x >= 50 ? 96 : 4) : x}%`;
        sun.style.top = `${corner ? 2 : y}%`;
        const base = a.size + (b.size - a.size) * t;
        const size = base * k;
        sun.style.width = `${size}px`;
        sun.style.height = `${size}px`;
        // Sans astre (grotte bleue) : le halo s'efface avec la taille, sinon il resterait visible à taille nulle
        sun.style.opacity = String(Math.min(1, base / 70));
      }
    };
    apply(progress.get());
    const onResize = () => apply(progress.get());
    window.addEventListener("resize", onResize);
    const off = progress.on("change", apply);
    return () => {
      off();
      window.removeEventListener("resize", onResize);
    };
  }, [progress, stages, suns, used, reduce]);

  const initial = stageWeights(progress.get(), stages);
  const sun0 = suns[0];

  return (
    <div data-landscape className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <WatercolorDefs />
      <div
        data-palette-live
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, var(--sky-top) 0%, var(--sky-bottom) 100%)" }}
      />

      {/* Soleil (ou lune), entouré d'anneaux fins */}
      <div
        ref={sunRef}
        data-palette-live
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${sun0.x}%`, top: `${sun0.y}%`, width: sun0.size, height: sun0.size, opacity: Math.min(1, sun0.size / 70) }}
      >
        {/* Halo : un dégradé plutôt qu'une ombre floue de 140 px, bien moins coûteuse à redessiner
            à chaque image pendant les voyages (la couleur de l'astre change en continu) */}
        <div
          className="absolute inset-[-170px] rounded-full"
          style={{
            background:
              "radial-gradient(circle closest-side, color-mix(in srgb, var(--sun) 45%, transparent) 25%, color-mix(in srgb, var(--sun) 18%, transparent) 60%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, var(--sun) 0%, var(--sun) 52%, transparent 71%)" }}
        />
        <div className="absolute inset-[-30%] rounded-full border opacity-25" style={{ borderColor: "var(--sun)" }} />
        <div className="absolute inset-[-60%] rounded-full border opacity-15" style={{ borderColor: "var(--sun)" }} />
      </div>

      {used.map((id) => {
        const Art = ART[id];
        const w = initial[id] ?? 0;
        return (
          <div
            key={id}
            ref={(el) => {
              sceneRefs.current[id] = el;
            }}
            data-scene={id}
            className="absolute inset-0 origin-[50%_58%] will-change-[opacity,transform]"
            style={{
              opacity: w,
              visibility: w < 0.004 ? "hidden" : "visible",
              contentVisibility: w < 0.004 ? "hidden" : "visible",
            }}
          >
            {/* Ordinateur : la scène vivante (SVG, filtres aquarelle, parallaxe, nuages qui dérivent) */}
            {live && (
              <div className="scene-live absolute inset-0">
                <PointerProvider>
                  <Art />
                </PointerProvider>
              </div>
            )}
            {/* Écrans tactiles : la même scène, pré-rendue en image (globals.css choisit l'une ou l'autre).
                Les filtres aquarelle se calculent pixel par pixel sur le processeur : à densité ×3, une seule
                scène pouvait demander plusieurs secondes de dessin à sa première apparition. */}
            <picture className="scene-baked absolute inset-[-3%]">
              {/* AVIF d'abord (bien plus léger), WebP sinon ; cadrage large sur un écran plus large que haut */}
              <source media={WIDE_QUERY} type="image/avif" srcSet={bakedScene(id, "wide", "avif")} />
              <source media={WIDE_QUERY} srcSet={bakedScene(id, "wide")} />
              <source type="image/avif" srcSet={bakedScene(id, "portrait", "avif")} />
              <img
                src={bakedScene(id, "portrait")}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-bottom"
              />
            </picture>
          </div>
        );
      })}

      {/* Grain du papier et léger vignettage */}
      <div
        className="paper-grain pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.45 0 0 0 0 0.4 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(30, 16, 36, 0.12) 100%)" }}
      />
    </div>
  );
}
