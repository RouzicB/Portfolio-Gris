"use client";

import { AnimatePresence, motion, useTransform } from "framer-motion";
import { sections } from "../../data/sections";
import { site } from "../../data/site";
import { pad } from "../../lib/journey";
import { ChevronIcon, icons } from "../icons/GrisIcons";
import { useJourney } from "./JourneyContext";
import { WASH } from "./motion";

/**
 * Barre haute, façon lecteur : section en cours à gauche, nom au centre,
 * précédent / suivant à droite. Le filet du bas avance avec le scroll.
 */
export default function TopBar() {
  const { active, progress, goTo } = useJourney();
  const section = sections[active];
  const Icon = icons[section.icon];
  const fill = useTransform(progress, [0, sections.length - 1], [0, 1]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Brume derrière la barre : le contenu s'y efface au lieu de passer dessous */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 sm:h-32"
        style={{ background: "linear-gradient(180deg, var(--sky-top) 0%, var(--sky-top) 55%, transparent 100%)" }}
        aria-hidden
      />
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:h-20 sm:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={section.id}
              className="flex min-w-0 items-center gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5, ease: WASH }}
            >
              <Icon size={22} className="shrink-0 text-ink" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{section.label}</p>
                <p className="text-xs tabular-nums text-ink-soft">
                  {pad(active + 1)} / {pad(sections.length)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => goTo(0)}
          className="title-spaced hidden pl-[0.32em] text-lg text-ink sm:block sm:text-xl"
          aria-label={`${site.name} — revenir à l'accueil`}
        >
          {site.logo}
        </button>

        <div className="flex flex-1 items-center justify-end gap-1">
          <NavArrow dir="prev" disabled={active === 0} onClick={() => goTo(active - 1)} />
          <NavArrow dir="next" disabled={active === sections.length - 1} onClick={() => goTo(active + 1)} />
        </div>
      </div>

      {/* Filet de progression */}
      <div className="relative mx-4 h-px bg-ink/15 sm:mx-8" aria-hidden>
        <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-ink/60" style={{ scaleX: fill }} />
      </div>
    </header>
  );
}

function NavArrow({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Section précédente" : "Section suivante"}
      className="grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-veil disabled:opacity-30"
    >
      <ChevronIcon size={18} className={dir === "prev" ? "-rotate-90" : "rotate-90"} />
    </button>
  );
}
