"use client";

import { sections } from "../../data/sections";
import { icons } from "../icons/GrisIcons";
import { useJourney } from "./JourneyContext";

/**
 * Navigation par icônes : une par section.
 * Verticale à droite sur grand écran (libellé au survol), horizontale en bas sur mobile.
 */
export default function SectionNav() {
  const { active, goTo } = useJourney();

  return (
    <nav
      aria-label="Sections"
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 md:bottom-auto md:left-auto md:right-5 md:top-1/2 md:translate-x-0 md:-translate-y-1/2"
    >
      <ol className="veil flex items-center gap-0.5 rounded-full p-1 md:flex-col">
        {sections.map((s, i) => {
          const Icon = icons[s.icon];
          const current = i === active;
          return (
            <li key={s.id} className="group relative flex items-center">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={current ? "location" : undefined}
                aria-label={s.label}
                className={`grid h-9 w-9 place-items-center rounded-full transition duration-500 ${
                  current ? "bg-ink text-sky-top" : "text-ink-soft hover:text-ink"
                }`}
              >
                <Icon size={18} />
              </button>
              <span className="label-spaced veil pointer-events-none absolute right-12 hidden whitespace-nowrap rounded-full px-3 py-1 text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 md:block">
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
