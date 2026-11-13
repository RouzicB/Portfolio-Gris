"use client";

import { useEffect, useMemo, useRef, type ComponentType } from "react";
import type { MotionValue } from "framer-motion";
import type { StageId, Sun } from "../../types";
import { segment, stageWeights } from "../../lib/journey";
import { PointerProvider } from "./Parallax";
import { WatercolorDefs } from "./art/shared";
import GrisArt from "./art/GrisArt";
import RougeArt from "./art/RougeArt";
import VertArt from "./art/VertArt";
import BleuArt from "./art/BleuArt";
import JauneArt from "./art/JauneArt";
import CielArt from "./art/CielArt";
import LuneArt from "./art/LuneArt";

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
export default function Landscape({
  progress,
  stages,
  suns,
}: {
  progress: MotionValue<number>;
  stages: StageId[];
  suns: Sun[];
}) {
  const used = useMemo(() => Array.from(new Set(stages)), [stages]);
  const sceneRefs = useRef<Partial<Record<StageId, HTMLDivElement | null>>>({});
  const sunRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = (f: number) => {
      const weights = stageWeights(f, stages);
      used.forEach((id) => {
        const el = sceneRefs.current[id];
        if (!el) return;
        const w = weights[id] ?? 0;
        el.style.opacity = String(w);
        el.style.visibility = w < 0.004 ? "hidden" : "visible";
      });
      const { from, to, t } = segment(f, suns.length);
      const a = suns[from];
      const b = suns[to];
      const sun = sunRef.current;
      if (sun && a && b) {
        sun.style.left = `${a.x + (b.x - a.x) * t}%`;
        sun.style.top = `${a.y + (b.y - a.y) * t}%`;
        const size = a.size + (b.size - a.size) * t;
        sun.style.width = `${size}px`;
        sun.style.height = `${size}px`;
      }
    };
    apply(progress.get());
    return progress.on("change", apply);
  }, [progress, stages, suns, used]);

  const initial = stageWeights(progress.get(), stages);
  const sun0 = suns[0];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <WatercolorDefs />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, var(--sky-top) 0%, var(--sky-bottom) 100%)" }} />

      {/* Soleil (ou lune), entouré d'anneaux fins */}
      <div
        ref={sunRef}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${sun0.x}%`, top: `${sun0.y}%`, width: sun0.size, height: sun0.size }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--sun) 0%, var(--sun) 52%, transparent 71%)",
            boxShadow: "0 0 140px 30px color-mix(in srgb, var(--sun) 45%, transparent)",
          }}
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
            className="absolute inset-0 will-change-[opacity]"
            style={{ opacity: w, visibility: w < 0.004 ? "hidden" : "visible" }}
          >
            <PointerProvider>
              <Art />
            </PointerProvider>
          </div>
        );
      })}

      {/* Grain du papier et léger vignettage */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
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
