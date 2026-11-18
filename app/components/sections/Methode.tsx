"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { process } from "../../data/process";
import { pad } from "../../lib/journey";
import { ChevronIcon } from "../icons/GrisIcons";
import { WASH, fadeUp } from "../journey/motion";
import SectionShell from "./SectionShell";

/** Nœuds de la tige (repère 1000 × 140) : elle monte de gauche à droite, comme une pousse */
const NODES = process.map((_, i) => ({ x: 100 + i * 200, y: 112 - i * 19 }));
const STEM = `M0 128 Q50 126 ${NODES[0].x} ${NODES[0].y} ${NODES.slice(1)
  .map((n) => `T${n.x} ${n.y}`)
  .join(" ")} T1000 18`;

/**
 * 03 — Méthode : une tige qui pousse.
 * Cinq nœuds sur une tige ondulée ; elle se colore jusqu'à l'étape choisie et chaque étape atteinte porte sa
 * feuille en triangle (celles qui pendent dans la forêt). Le détail s'ouvre dans un panneau en forme de feuille.
 * Onglets accessibles : clic, flèches gauche / droite, Début / Fin.
 */
export default function Methode() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const step = process[active];
  const go = (i: number) => setActive((i + process.length) % process.length);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const next = e.key === "ArrowRight" ? active + 1 : e.key === "ArrowLeft" ? active - 1 : e.key === "Home" ? 0 : e.key === "End" ? process.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    go(next);
    document.getElementById(`${uid}-tab-${(next + process.length) % process.length}`)?.focus();
  };

  return (
    <SectionShell index={2}>
      {/* La tige et ses nœuds */}
      <m.div variants={fadeUp} className="legible relative mx-auto aspect-[1000/140] w-full max-w-5xl">
        <svg viewBox="0 0 1000 140" className="absolute inset-0 size-full overflow-visible" aria-hidden focusable="false">
          <path d={STEM} fill="none" stroke="var(--ink)" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />
          <path
            d={STEM}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${10 + active * 20} 200`}
            style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.22,1,0.36,1)" }}
          />
          {/* Feuilles en triangle, une par étape atteinte */}
          {NODES.map((n, i) => (
            <path
              key={i}
              d={`M${n.x + 30} ${n.y - 14} L${n.x + 62} ${n.y - 38} L${n.x + 52} ${n.y - 4}Z`}
              fill="var(--accent)"
              style={{
                transformBox: "fill-box",
                transformOrigin: "0% 100%",
                transform: `scale(${i <= active ? 1 : 0})`,
                opacity: i <= active ? 0.85 : 0,
                transition: "transform 600ms cubic-bezier(0.22,1,0.36,1), opacity 400ms",
              }}
            />
          ))}
        </svg>

        <div role="tablist" aria-label="Étapes de la méthode" onKeyDown={onKey}>
          {NODES.map((n, i) => {
            const current = i === active;
            const reached = i < active;
            return (
              <button
                key={i}
                id={`${uid}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={current}
                aria-controls={`${uid}-panel`}
                tabIndex={current ? 0 : -1}
                onClick={() => setActive(i)}
                className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center focus-visible:outline-none"
                style={{ left: `${n.x / 10}%`, top: `${(n.y / 140) * 100}%` }}
              >
                <span
                  className={`relative grid size-9 place-items-center rounded-full font-display text-xs tabular-nums outline-offset-[7px] outline-accent transition duration-500 group-focus-visible:outline-2 group-focus-visible:outline sm:size-11 sm:text-sm ${
                    current ? "bg-ink text-sky-top" : `veil ${reached ? "text-ink" : "text-ink-soft"} group-hover:scale-110`
                  }`}
                >
                  {current && (
                    <svg viewBox="0 0 48 48" className="pointer-events-none absolute -inset-[6px] overflow-visible text-ink" aria-hidden>
                      <g className="emblem-spin-slow" style={{ transformOrigin: "24px 24px" }}>
                        <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="0.9" pathLength={100} strokeDasharray="86 14" opacity="0.7" />
                        <path d="M24 -1 L26.2 1.6 L24 4.2 L21.8 1.6Z" fill="var(--accent)" />
                      </g>
                    </svg>
                  )}
                  {pad(i + 1)}
                </span>
                <span
                  className={`label-spaced absolute top-full mt-3 hidden whitespace-nowrap transition md:block ${
                    current ? "text-ink" : "text-ink opacity-90 group-hover:opacity-100"
                  }`}
                >
                  {process[i].name}
                </span>
              </button>
            );
          })}
        </div>
      </m.div>

      {/* Le détail, dans un panneau en forme de feuille */}
      <m.div
        variants={fadeUp}
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${active}`}
        className="veil relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-[3rem_0.75rem_3rem_0.75rem] md:mt-16 short:md:mt-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: WASH }}
            className="grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:gap-10 md:px-12 md:pr-28"
          >
            <span
              aria-hidden
              className="font-display text-7xl font-light leading-none text-transparent [-webkit-text-stroke:1.2px_var(--accent)] sm:text-8xl short:sm:text-7xl"
            >
              {pad(active + 1)}
            </span>
            <div>
              <p className="label-spaced text-ink-soft">
                Étape {active + 1} sur {process.length}
              </p>
              <h3 className="title-spaced mt-2 text-2xl text-ink sm:text-3xl">{step.name}</h3>
              <p className="mt-3 max-w-xl text-pretty leading-relaxed text-ink">{step.goal}</p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Méthodes">
                {step.methods.map((m) => (
                  <li key={m} className="flex items-center gap-2 text-sm text-ink">
                    <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        </AnimatePresence>

        {/* Étape précédente / suivante */}
        <div className="flex justify-end gap-1.5 px-6 pb-5 md:absolute md:right-5 md:top-5 md:p-0">
          {[
            [-1, "Étape précédente", "rotate-180"],
            [1, "Étape suivante", ""],
          ].map(([d, label, rot]) => (
            <button
              key={label as string}
              type="button"
              onClick={() => go(active + (d as number))}
              aria-label={label as string}
              className="grid size-8 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-ink/10"
            >
              <ChevronIcon size={14} className={rot as string} />
            </button>
          ))}
        </div>
      </m.div>
    </SectionShell>
  );
}

