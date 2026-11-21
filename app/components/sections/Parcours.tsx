"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, m } from "framer-motion";
import { careerChapters, careerEdges, careerNodes, defaultNodeId } from "../../data/career";
import type { FlowNode } from "../../types";
import { flowLayout, isTaken, kindLabels, type Orientation } from "../../lib/flowchart";
import { AptitudesIcon, ArrowRightIcon, ChoixIcon, FormationIcon, TravailIcon, VerrouIcon } from "../icons/GrisIcons";
import { fadeIn, fadeUp, group, WASH } from "../journey/motion";
import SectionShell from "./SectionShell";

const byId = new Map(careerNodes.map((n) => [n.id, n]));

/** Téléphones : l'arborescence se lit de haut en bas (le temps descend) */
const NARROW = "(max-width: 767px)";
const subscribeNarrow = (cb: () => void) => {
  const mq = window.matchMedia(NARROW);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
function useOrientation(): Orientation {
  const narrow = useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW).matches,
    () => false,
  );
  return narrow ? "vertical" : "horizontal";
}

/** Icône d'un nœud selon son type et son domaine */
function NodeGlyph({ node, size, className }: { node: FlowNode; size: number; className?: string }) {
  const props = { size, className };
  if (node.kind === "choice") return <ChoixIcon {...props} />;
  if (node.kind === "locked") return <VerrouIcon {...props} />;
  if (node.kind === "future") return <AptitudesIcon {...props} />;
  return node.domain === "work" ? <TravailIcon {...props} /> : <FormationIcon {...props} />;
}

/** Apparence des cartes selon le type de nœud */
const kindClass: Record<FlowNode["kind"], string> = {
  start: "veil rounded-xl",
  step: "veil rounded-xl",
  current: "veil rounded-xl outline-2 -outline-offset-4 outline-accent",
  // Le choix a un fond plein, couleur du ciel teintée d'accent : lisible quelle que soit la scène derrière
  choice:
    "rounded-none bg-[color-mix(in_srgb,var(--sky-top)_80%,var(--accent))] px-5 [clip-path:polygon(14px_0,calc(100%-14px)_0,100%_50%,calc(100%-14px)_100%,14px_100%,0_50%)]",
  locked: "rounded-xl border border-dashed border-ink/40 bg-veil/70 backdrop-blur-md",
  future: "rounded-xl border border-dashed border-ink/40 bg-veil/70 backdrop-blur-md",
};

/**
 * 05 — Parcours : l'arborescence du portfolio principal, posée à l'horizontale
 * (sur téléphone, à la verticale : le temps descend et les couloirs deviennent des colonnes).
 * Le temps se lit de gauche à droite ; couloir du haut = formation, du milieu = expériences,
 * du bas = chemins non empruntés. Chaque étape se sélectionne pour afficher son détail.
 */
export default function Parcours() {
  const [selectedId, setSelectedId] = useState(defaultNodeId);
  const selected = byId.get(selectedId)!;
  const orientation = useOrientation();
  const vertical = orientation === "vertical";
  const layout = useMemo(() => flowLayout(careerNodes, careerChapters, orientation), [orientation]);
  const { size } = layout;
  const detailRef = useRef<HTMLDivElement>(null);

  // Le canevas défile à l'horizontale quand l'écran est plus étroit que lui : on le signale
  const scrollRef = useRef<HTMLDivElement>(null);
  // Un peu trop large (portables) : le canevas se réduit légèrement (jusqu'à 90 %) ; plus étroit : il défile
  const [fit, setFit] = useState({ overflowing: false, scale: 1 });
  const { overflowing, scale } = fit;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.clientWidth / size.width;
      // Vertical : l'arborescence tient toujours dans la largeur (au besoin un peu réduite), on ne défile pas de côté
      if (vertical) return setFit({ overflowing: false, scale: Math.min(1, r) });
      setFit(r >= 1 ? { overflowing: false, scale: 1 } : r >= 0.9 ? { overflowing: false, scale: r } : { overflowing: true, scale: 1 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [vertical, size.width]);

  const select = (id: string) => {
    setSelectedId(id);
    // Vertical : le détail est sous une longue arborescence, on l'amène à l'écran
    if (vertical) requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  return (
    <SectionShell index={4}>
      {/* Canevas : défile horizontalement sur petit écran */}
      <m.div
        ref={scrollRef}
        variants={group}
        tabIndex={overflowing ? 0 : undefined}
        aria-label={overflowing ? "Arborescence du parcours, défilable horizontalement" : undefined}
        // Ne défile (à l'horizontale seulement) que si l'arborescence est plus large que l'écran ;
        // sinon rien n'est rogné, même pendant l'apparition des cartes qui montent de quelques pixels
        className={overflowing ? "scrollbar-gris -mx-4 overflow-x-auto overflow-y-hidden px-4 pb-4 pt-1" : "pb-2"}
      >
        <div
          className="relative mx-auto"
          style={{ width: size.width, height: size.height, zoom: scale === 1 ? undefined : scale }}
          role="group"
          aria-label="Arborescence du parcours"
        >
          {/* Chapitres */}
          {careerChapters.map((c) => {
            const box = layout.chapterBox(c);
            return (
              <m.div
                key={c.id}
                variants={fadeIn}
                className={`absolute flex items-center gap-2 ${vertical ? "z-10" : ""}`}
                style={{ left: box.x, top: box.y, width: box.w }}
                aria-hidden
              >
                {/* Vertical : les liens traversent la ligne du chapitre, son titre se pose sur une pastille */}
                <span className={`flex items-center gap-2 ${vertical ? "veil rounded-full px-3.5 py-1.5" : ""}`}>
                  <span className="mark-caps size-1.5 shrink-0 rotate-45 bg-accent" />
                  <span className="label-spaced legible whitespace-nowrap text-ink">{c.title}</span>
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-ink/25 to-transparent" />
              </m.div>
            );
          })}

          {/* Liens */}
          <m.svg
            variants={fadeIn}
            className="pointer-events-none absolute inset-0 overflow-visible"
            width={size.width}
            height={size.height}
            aria-hidden
          >
            {careerEdges.map((e) => {
              const a = byId.get(e.from)!;
              const b = byId.get(e.to)!;
              const taken = isTaken(a.kind) && isTaken(b.kind);
              return (
                <path
                  key={`${e.from}-${e.to}`}
                  d={layout.edgePath(layout.nodeBox(a), layout.nodeBox(b))}
                  fill="none"
                  stroke={taken ? "var(--accent)" : "var(--ink)"}
                  strokeOpacity={taken ? 0.85 : 0.6}
                  strokeWidth={taken ? 1.6 : 1.8}
                  strokeLinecap="round"
                  strokeDasharray={taken ? undefined : "0.1 5"}
                />
              );
            })}
            {/* Une étoile à chaque départ du chemin pris */}
            {careerNodes
              .filter((n) => isTaken(n.kind) && n.kind !== "choice" && careerEdges.some((e) => e.from === n.id))
              .map((n) => {
                const p = layout.exit(layout.nodeBox(n));
                return <circle key={n.id} cx={p.x} cy={p.y} r="2.6" fill="var(--accent)" />;
              })}
          </m.svg>

          {/* Nœuds */}
          {careerNodes.map((node) => {
            const box = layout.nodeBox(node);
            const isSelected = node.id === selectedId;
            const muted = node.kind === "locked" || node.kind === "future";
            return (
              <m.button
                variants={fadeUp}
                key={node.id}
                type="button"
                onClick={() => select(node.id)}
                aria-pressed={isSelected}
                aria-label={`${kindLabels[node.kind]} : ${node.title}${node.period ? `, ${node.period}` : ""}`}
                className={`absolute flex flex-col justify-between p-2.5 text-left transition duration-300 hover:-translate-y-0.5 ${kindClass[node.kind]} ${
                  isSelected ? "outline outline-2 outline-offset-2 outline-ink/60" : ""
                }`}
                style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
              >
                {/* Téléphone : cartes étroites, libellé un peu plus serré pour tenir (« Non emprunté ») */}
                <span className={`flex min-w-0 items-center gap-1.5 whitespace-nowrap font-semibold uppercase text-ink-soft ${vertical ? "text-[10px] tracking-[0.02em]" : "text-[11px] tracking-[0.06em]"}`}>
                  <NodeGlyph node={node} size={13} className={muted ? "" : "text-ink"} />
                  {kindLabels[node.kind]}
                </span>
                {node.kind === "future" ? (
                  <span className="title-spaced text-center text-2xl text-ink-soft">?</span>
                ) : (
                  <span className={`line-clamp-2 hyphens-auto text-[12px] font-semibold leading-tight ${muted ? "text-ink-soft" : "text-ink"}`}>
                    {node.short ?? node.title}
                  </span>
                )}
                {node.kind === "current" && (
                  <span aria-hidden className="absolute -right-1.5 -top-1.5 size-3 animate-ping rounded-full bg-accent/70" />
                )}
              </m.button>
            );
          })}
        </div>
      </m.div>
      {overflowing && (
        <p className="legible mt-1 flex items-center gap-1.5 text-xs text-ink">
          Faites glisser pour parcourir la suite
          <ArrowRightIcon size={14} />
        </p>
      )}

      {/* Détail de l'étape sélectionnée */}
      {/* Le panneau de verre apparaît lui-même (fadeUp) ; seul son contenu change d'une étape à l'autre */}
      <m.div
        ref={detailRef}
        variants={fadeUp}
        className="veil panel mx-auto mt-6 scroll-mb-6 rounded-[1.5rem_0.6rem_1.5rem_0.6rem] sm:rounded-[2.25rem_0.75rem_2.25rem_0.75rem] px-6 py-6 sm:px-10 sm:py-8 short:mt-4 short:sm:py-6"
        style={{ maxWidth: vertical ? undefined : size.width }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.article
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: WASH }}
            className="grid gap-4 sm:grid-cols-[1fr_auto_1.4fr] sm:gap-10"
            aria-live="polite"
          >
            <div>
              <p className="label-spaced flex items-center gap-2 text-ink-soft">
                <NodeGlyph node={selected} size={16} className="text-ink" />
                {kindLabels[selected.kind]}
                {selected.period && <span className="tabular-nums">· {selected.period}</span>}
              </p>
              <h3 className="title-spaced mt-3.5 text-base leading-snug text-ink sm:text-lg">{selected.title}</h3>
              {selected.place && <p className="mt-2 text-sm text-ink-soft">{selected.place}</p>}
            </div>
            {/* Filet vertical et losange, comme une couture entre les deux colonnes */}
            <span aria-hidden className="relative hidden w-px bg-ink/15 sm:block">
              <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
            </span>
            <div>
              <p className="text-sm leading-[1.8] text-ink">{selected.text}</p>
              {selected.tags && (
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {selected.tags.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-xs text-ink">
                      <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </m.article>
        </AnimatePresence>
      </m.div>
    </SectionShell>
  );
}
