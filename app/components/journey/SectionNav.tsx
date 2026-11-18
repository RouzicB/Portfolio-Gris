"use client";

import { useSyncExternalStore } from "react";
import { m, useTransform } from "framer-motion";
import { sections } from "../../data/sections";
import { ChevronIcon, icons } from "../icons/GrisIcons";
import { useJourneyControls } from "./JourneyContext";

const LAST = sections.length - 1;

/**
 * Navigation du voyage, comme un fil de constellation :
 * un trait fin relie les sections et se remplit au fil du parcours (il suit la transition en continu) ;
 * chaque section est un petit disque de verre, la section active un disque d'encre cerclé d'un anneau ouvert
 * (ensō) qui tourne lentement avec sa pierre de clé. Une flèche au-dessus pour remonter, une au-dessous pour avancer.
 * Verticale à droite sur grand écran (libellé au survol), horizontale en bas sur mobile.
 */
export default function SectionNav() {
  const { goTo, progress, getActive, onActivate } = useJourneyControls();
  // Section active suivie au geste, en rendu immédiat (la navigation est légère) : pas d'attente du rendu
  // différé de la page pour voir le bouton s'allumer
  const active = useSyncExternalStore(onActivate, getActive, () => 0);
  // Part du fil déjà parcourue (0 → 1), lue en CSS par le trait de remplissage
  const filled = useTransform(progress, (f) => Math.min(1, Math.max(0, f / LAST)));

  return (
    <nav
      data-palette-live
      aria-label="Sections"
      className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:bottom-auto md:left-auto md:right-4 md:top-1/2 md:translate-x-0 md:-translate-y-1/2"
    >
      <div className="flex items-center gap-1 md:flex-col md:gap-2.5 tiny:md:gap-1">
        <StepButton dir={-1} disabled={active === 0} onClick={() => goTo(active - 1)} />

        <div className="relative">
          {/* Le fil, et sa part déjà parcourue */}
          <span
            aria-hidden
            className="absolute left-[17px] right-[17px] top-1/2 h-px -translate-y-1/2 bg-ink/25 md:bottom-5 md:left-1/2 md:right-auto md:top-5 md:h-auto md:w-px md:-translate-x-1/2 md:translate-y-0 tiny:md:bottom-4 tiny:md:top-4"
          />
          <m.span
            aria-hidden
            style={{ ["--fill" as string]: filled }}
            className="absolute left-[17px] right-[17px] top-1/2 h-px origin-left bg-ink [transform:translateY(-50%)_scaleX(var(--fill))] md:bottom-5 md:left-1/2 md:right-auto md:top-5 md:h-auto md:w-px md:origin-top md:[transform:translateX(-50%)_scaleY(var(--fill))] tiny:md:bottom-4 tiny:md:top-4"
          />

          <ol className="relative flex items-center md:flex-col md:gap-2 tiny:md:gap-1">
            {sections.map((s, i) => {
              const Icon = icons[s.icon];
              const current = i === active;
              const visited = i < active;
              return (
                <li key={s.id} className="group relative flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={current ? "location" : undefined}
                    aria-label={s.label}
                    className={`relative grid size-[34px] place-items-center rounded-full transition duration-500 md:size-10 tiny:md:size-8 ${
                      current
                        ? "bg-ink text-sky-top"
                        : `veil scale-[0.82] hover:scale-100 ${visited ? "text-ink" : "text-ink-soft hover:text-ink"}`
                    }`}
                  >
                    {current && <ActiveRing />}
                    <Icon size={current ? 18 : 17} />
                  </button>
                  {/* Libellé au survol (grand écran) */}
                  <span className="label-spaced veil pointer-events-none absolute right-full mr-3 hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-ink opacity-0 transition duration-300 group-hover:-translate-x-1 group-hover:opacity-100 group-focus-within:opacity-100 md:flex">
                    <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <StepButton dir={1} disabled={active === LAST} onClick={() => goTo(active + 1)} />
      </div>
    </nav>
  );
}

/** Anneau ouvert et pierre de clé autour de la section active, en rotation lente */
function ActiveRing() {
  return (
    <svg viewBox="0 0 48 48" className="pointer-events-none absolute -inset-[6px] overflow-visible text-ink" aria-hidden focusable="false">
      <g className="emblem-spin-slow" style={{ transformOrigin: "24px 24px" }}>
        <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" pathLength={100} strokeDasharray="86 14" opacity="0.7" />
        <path d="M24 -1 L26.2 1.6 L24 4.2 L21.8 1.6Z" fill="var(--accent)" />
      </g>
    </svg>
  );
}

/** Flèche pour monter (section précédente) ou descendre (section suivante) */
function StepButton({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir < 0 ? "Section précédente" : "Section suivante"}
      className={`group/step grid size-[34px] place-items-center rounded-full text-ink transition duration-300 disabled:pointer-events-none disabled:opacity-30 md:size-9 tiny:md:size-7 ${
        dir < 0 ? "hover:-translate-y-0.5" : "hover:translate-y-0.5"
      }`}
    >
      <span className="veil grid size-7 place-items-center rounded-full transition group-hover/step:scale-110 md:size-8 tiny:md:size-6">
        <ChevronIcon size={15} className={dir < 0 ? "-rotate-90" : "rotate-90"} />
      </span>
    </button>
  );
}
