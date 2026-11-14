"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { careerChapters, careerEdges, careerNodes, defaultNodeId } from "../../data/career";
import type { FlowNode } from "../../types";
import { COL_W, NODE_W, canvasSize, edgePath, isTaken, kindLabels, nodeBox } from "../../lib/flowchart";
import { AptitudesIcon, ArrowRightIcon, ChoixIcon, FormationIcon, TravailIcon, VerrouIcon } from "../icons/GrisIcons";
import { fadeIn, fadeUp, group, WASH } from "../journey/motion";
import SectionShell from "./SectionShell";

const byId = new Map(careerNodes.map((n) => [n.id, n]));
const size = canvasSize(careerNodes);

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
  current: "veil rounded-xl ring-2 ring-accent shadow-[0_0_28px_-6px_var(--accent)]",
  // Le choix a un fond plein, couleur du ciel teintée d'accent : lisible quelle que soit la scène derrière
  choice:
    "rounded-none bg-[color-mix(in_srgb,var(--sky-top)_80%,var(--accent))] px-5 [clip-path:polygon(14px_0,calc(100%-14px)_0,100%_50%,calc(100%-14px)_100%,14px_100%,0_50%)]",
  locked: "rounded-xl border border-dashed border-ink/40 bg-veil/70 backdrop-blur-md",
  future: "rounded-xl border border-dashed border-ink/40 bg-veil/70 backdrop-blur-md",
};

/**
 * 05 — Parcours : l'arborescence du portfolio principal, posée à l'horizontale.
 * Le temps se lit de gauche à droite ; couloir du haut = formation, du milieu = expériences,
 * du bas = chemins non empruntés. Chaque étape se sélectionne pour afficher son détail.
 */
export default function Parcours() {
  const [selectedId, setSelectedId] = useState(defaultNodeId);
  const selected = byId.get(selectedId)!;

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
      setFit(r >= 1 ? { overflowing: false, scale: 1 } : r >= 0.9 ? { overflowing: false, scale: r } : { overflowing: true, scale: 1 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <SectionShell index={4}>
      {/* Canevas : défile horizontalement sur petit écran */}
      <motion.div
        ref={scrollRef}
        variants={group}
        tabIndex={overflowing ? 0 : undefined}
        aria-label={overflowing ? "Arborescence du parcours, défilable horizontalement" : undefined}
        // Ne défile (à l'horizontale seulement) que si l'arborescence est plus large que l'écran ;
        // sinon rien n'est rogné, même pendant l'apparition des cartes qui montent de quelques pixels
        className={overflowing ? "scrollbar-gris -mx-4 overflow-x-auto overflow-y-hidden px-4 pb-4 pt-1" : "pb-2"}
      >
        <div className="relative mx-auto" style={{ width: size.width, height: size.height, zoom: scale === 1 ? undefined : scale }} role="group" aria-label="Arborescence du parcours">
          {/* Chapitres */}
          {careerChapters.map((c) => (
            <motion.div
              key={c.id}
              variants={fadeIn}
              className="absolute top-0 flex items-center gap-2"
              style={{ left: c.cols[0] * COL_W, width: (c.cols[1] - c.cols[0]) * COL_W + NODE_W }}
              aria-hidden
            >
              <span className="size-1.5 shrink-0 rotate-45 bg-accent" />
              <span className="label-spaced legible whitespace-nowrap text-ink">{c.title}</span>
              <span className="h-px flex-1 bg-gradient-to-r from-ink/25 to-transparent" />
            </motion.div>
          ))}

          {/* Liens */}
          <motion.svg variants={fadeIn} className="pointer-events-none absolute inset-0 overflow-visible" width={size.width} height={size.height} aria-hidden>
            {careerEdges.map((e) => {
              const a = byId.get(e.from)!;
              const b = byId.get(e.to)!;
              const taken = isTaken(a.kind) && isTaken(b.kind);
              return (
                <path
                  key={`${e.from}-${e.to}`}
                  d={edgePath(nodeBox(a), nodeBox(b))}
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
                const b = nodeBox(n);
                return <circle key={n.id} cx={b.x + b.w} cy={b.y + b.h / 2} r="2.6" fill="var(--accent)" />;
              })}
          </motion.svg>

          {/* Nœuds */}
          {careerNodes.map((node) => {
            const box = nodeBox(node);
            const isSelected = node.id === selectedId;
            const muted = node.kind === "locked" || node.kind === "future";
            return (
              <motion.button
                variants={fadeUp}
                key={node.id}
                type="button"
                onClick={() => setSelectedId(node.id)}
                aria-pressed={isSelected}
                aria-label={`${kindLabels[node.kind]} : ${node.title}${node.period ? `, ${node.period}` : ""}`}
                className={`absolute flex flex-col justify-between p-2.5 text-left transition duration-300 hover:-translate-y-0.5 ${kindClass[node.kind]} ${
                  isSelected ? "outline outline-2 outline-offset-2 outline-ink/60" : ""
                }`}
                style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
              >
                <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-soft">
                  <NodeGlyph node={node} size={13} className={muted ? "" : "text-ink"} />
                  {kindLabels[node.kind]}
                </span>
                {node.kind === "future" ? (
                  <span className="title-spaced text-center text-2xl text-ink-soft">?</span>
                ) : (
                  <span className={`line-clamp-2 text-[12px] font-semibold leading-tight ${muted ? "text-ink-soft" : "text-ink"}`}>
                    {node.short ?? node.title}
                  </span>
                )}
                {node.kind === "current" && (
                  <span aria-hidden className="absolute -right-1.5 -top-1.5 size-3 animate-ping rounded-full bg-accent/70" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
      {overflowing && (
        <p className="legible mt-1 flex items-center gap-1.5 text-xs text-ink">
          Faites glisser pour parcourir la suite
          <ArrowRightIcon size={14} />
        </p>
      )}

      {/* Détail de l'étape sélectionnée */}
      {/* Le panneau de verre apparaît lui-même (fadeUp) ; seul son contenu change d'une étape à l'autre */}
      <motion.div
        variants={fadeUp}
        className="veil relative mx-auto mt-6 rounded-[2.25rem_0.75rem_2.25rem_0.75rem] px-6 py-5 sm:px-8 short:mt-4"
        style={{ maxWidth: Math.max(size.width, 0) || undefined }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: WASH }}
            className="grid gap-3 sm:grid-cols-[1fr_auto_1.4fr] sm:gap-7"
            aria-live="polite"
          >
            <div>
              <p className="label-spaced flex items-center gap-2 text-ink-soft">
                <NodeGlyph node={selected} size={16} className="text-ink" />
                {kindLabels[selected.kind]}
                {selected.period && <span className="tabular-nums">· {selected.period}</span>}
              </p>
              <h3 className="title-spaced mt-2.5 text-base leading-snug text-ink sm:text-lg">{selected.title}</h3>
              {selected.place && <p className="mt-1 text-sm text-ink-soft">{selected.place}</p>}
            </div>
            {/* Filet vertical et losange, comme une couture entre les deux colonnes */}
            <span aria-hidden className="relative hidden w-px bg-ink/15 sm:block">
              <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
            </span>
            <div>
              <p className="text-sm leading-relaxed text-ink">{selected.text}</p>
              {selected.tags && (
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                  {selected.tags.map((t) => (
                    <li key={t} className="flex items-center gap-2 text-xs text-ink">
                      <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.article>
        </AnimatePresence>
      </motion.div>
    </SectionShell>
  );
}

