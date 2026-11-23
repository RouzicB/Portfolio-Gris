"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion, type MotionValue } from "framer-motion";
import type { StageId, Sun } from "../../types";
import { palettes } from "../../data/palettes";
import { segment, stageWeights, zoomScale } from "../../lib/journey";
import { BAKED_PORTRAIT_SIZES, BAKED_WIDE_SIZES, TOUCH_QUERY, WIDE_QUERY, bakedPortraitSet, bakedScene, bakedWideSet } from "../../lib/decor";
import { isLite } from "../../lib/perf";

/** Dégradé du ciel d'une ambiance, en couleurs fixes */
const skyOf = (id: StageId) => `linear-gradient(180deg, ${palettes[id].skyTop} 0%, ${palettes[id].skyBottom} 100%)`;

/** Cadrage portrait : tout écran qui n'est pas plus large que haut (le contraire exact de WIDE_QUERY) */
const PORTRAIT_QUERY = `not all and ${WIDE_QUERY}`;

/**
 * Le décor fixe : ciel, soleil (ou lune), une scène par ambiance, grain du papier.
 * `stages[i]` / `suns[i]` décrivent l'étape i ; `progress` est la position continue entre les étapes.
 * Les scènes se fondent l'une dans l'autre et le soleil glisse, sans transition déclenchée :
 * les styles sont écrits directement à chaque changement de `progress` (aucun rendu React par frame).
 * Une page projet passe une seule étape : le décor est alors immobile.
 *
 * Chaque scène est une aquarelle peinte d'avance (scripts/decor/) : une seule image, que la carte graphique zoome,
 * fond et déplace sans rien redessiner. Les scènes dessinées en direct (SVG passés dans des filtres aquarelle, sept à dix
 * calques plein écran par scène) faisaient saccader les voyages sur les portables à carte graphique modeste.
 */
export default function Landscape({ progress, stages, suns }: { progress: MotionValue<number>; stages: StageId[]; suns: Sun[] }) {
  const used = useMemo(() => Array.from(new Set(stages)), [stages]);
  const reduce = useReducedMotion();
  const sceneRefs = useRef<Partial<Record<StageId, HTMLDivElement | null>>>({});
  const scenesRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const skyFromRef = useRef<HTMLDivElement>(null);
  const skyToRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Les scènes voisines sont préparées d'avance (image décodée et posée, mais transparente) : un voyage n'a pas à
    // décoder d'un coup une grande image. Pas dès l'ouverture : une scène voisine affichée pendant le chargement
    // concourait avec la scène visible pour le plus grand affichage (LCP). Elles attendent la page chargée.
    let prewarm = false;
    let warmTimer = 0;
    const warm = () => {
      warmTimer = window.setTimeout(() => {
        prewarm = true;
        apply(progress.get());
      }, 1200);
    };
    if (document.readyState === "complete") warm();
    else window.addEventListener("load", warm, { once: true });
    // Dernier état écrit par scène : on ne touche au DOM que si quelque chose change
    const state: Partial<Record<StageId, "off" | "warm" | "on">> = {};
    let skyPair = "";
    const apply = (f: number) => {
      // Ciel : le dégradé de départ et celui d'arrivée, superposés ; seule l'opacité du second suit le voyage.
      // Le compositeur (carte graphique) fait le fondu sans rien redessiner.
      const seg = segment(f, stages.length);
      const pair = `${stages[seg.from]}>${stages[seg.to]}`;
      const skyFrom = skyFromRef.current;
      const skyTo = skyToRef.current;
      if (skyFrom && skyTo) {
        if (pair !== skyPair) {
          skyPair = pair;
          skyFrom.style.background = skyOf(stages[seg.from]);
          skyTo.style.background = skyOf(stages[seg.to]);
        }
        skyTo.style.opacity = String(seg.t);
      }
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
          // Scène écartée : ni mise en page, ni peinture
          el.style.contentVisibility = next === "off" ? "hidden" : "visible";
        }
        if (next === "off") return;
        // Scène préparée d'avance : opacité nulle (elle ne compte pas comme « plus grand affichage »)
        el.style.opacity = next === "warm" ? "0" : String(w);
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
        sun.style.visibility = "visible";
      }
    };
    apply(progress.get());
    const onResize = () => apply(progress.get());
    window.addEventListener("resize", onResize);
    const off = progress.on("change", apply);
    return () => {
      off();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", warm);
      window.clearTimeout(warmTimer);
    };
  }, [progress, stages, suns, used, reduce]);

  // Parallaxe à la souris : le paysage glisse de quelques pixels devant le ciel et l'astre, immobiles.
  // Un seul calque déplacé par la carte graphique (propriété `translate`), suivi en douceur, puis plus rien au repos.
  // Ni sur écran tactile, ni en mode léger, ni si le visiteur préfère moins d'animations.
  useEffect(() => {
    const layer = scenesRef.current;
    if (!layer || reduce || window.matchMedia(TOUCH_QUERY).matches) return;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const step = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      const done = Math.abs(tx - x) < 0.05 && Math.abs(ty - y) < 0.05;
      if (done) {
        x = tx;
        y = ty;
      }
      layer.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      raf = done ? 0 : requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const lite = isLite();
      tx = lite ? 0 : -((e.clientX / window.innerWidth) * 2 - 1) * 14;
      ty = lite ? 0 : -((e.clientY / window.innerHeight) * 2 - 1) * 6;
      if (!raf) raf = requestAnimationFrame(step);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  const initial = stageWeights(progress.get(), stages);
  const sun0 = suns[0];

  return (
    <div data-landscape className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* L'image du décor de départ est demandée dès la lecture du HTML (React la place dans <head>), en priorité
          haute, au lieu d'attendre que la page la découvre. `media` : chaque écran ne télécharge que son cadrage. */}
      <link
        rel="preload"
        as="image"
        type="image/avif"
        imageSrcSet={bakedPortraitSet(stages[0], "avif")}
        imageSizes={BAKED_PORTRAIT_SIZES}
        media={PORTRAIT_QUERY}
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        type="image/avif"
        imageSrcSet={bakedWideSet(stages[0], "avif")}
        imageSizes={BAKED_WIDE_SIZES}
        media={WIDE_QUERY}
        fetchPriority="high"
      />
      <div ref={skyFromRef} className="absolute inset-0" style={{ background: skyOf(stages[0]) }} />
      <div ref={skyToRef} className="absolute inset-0 will-change-[opacity]" style={{ background: skyOf(stages[0]), opacity: 0 }} />

      {/* Soleil (ou lune), entouré d'anneaux fins */}
      <div
        ref={sunRef}
        data-palette-live
        className="absolute -translate-x-1/2 -translate-y-1/2"
        // Masqué jusqu'à son placement par le script : sur un écran étroit, l'astre se range dans un coin, et ce saut
        // juste après l'affichage comptait comme un décalage de mise en page (PageSpeed : CLS de 0,22)
        style={{ left: `${sun0.x}%`, top: `${sun0.y}%`, width: sun0.size, height: sun0.size, opacity: Math.min(1, sun0.size / 70), visibility: "hidden" }}
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

      {/* Les scènes, dans un calque que la parallaxe déplace d'un bloc */}
      <div ref={scenesRef} className="absolute inset-0 will-change-transform">
        {used.map((id) => {
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
              <picture className="scene-baked absolute inset-[-3%]">
                {/* AVIF d'abord (bien plus léger), WebP sinon ; cadre entier sur un écran plus large que haut */}
                <source media={WIDE_QUERY} type="image/avif" srcSet={bakedWideSet(id, "avif")} sizes={BAKED_WIDE_SIZES} />
                <source media={WIDE_QUERY} type="image/webp" srcSet={bakedWideSet(id, "webp")} sizes={BAKED_WIDE_SIZES} />
                <source type="image/avif" srcSet={bakedPortraitSet(id, "avif")} sizes={BAKED_PORTRAIT_SIZES} />
                <img
                  src={bakedScene(id, "portrait")}
                  srcSet={bakedPortraitSet(id, "webp")}
                  sizes={BAKED_PORTRAIT_SIZES}
                  alt=""
                  // La scène de départ tout de suite ; les autres quand elles approchent (préparées d'avance, voir plus haut)
                  loading={w > 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover object-bottom"
                />
              </picture>
            </div>
          );
        })}
      </div>

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
