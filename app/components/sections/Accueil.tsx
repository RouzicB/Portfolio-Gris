"use client";

import { motion } from "framer-motion";
import { site } from "../../data/site";
import { ArrowRightIcon, ContactIcon, ScrollIcon } from "../icons/GrisIcons";
import { useJourney } from "../journey/JourneyContext";
import { fadeIn, fadeUp } from "../journey/motion";
import SectionShell from "./SectionShell";

/** 01 — Accueil (identification) : le nom, le rôle, l'accroche. */
export default function Accueil() {
  const { goTo } = useJourney();
  const [first, ...rest] = site.name.split(" ");
  return (
    <SectionShell index={0} heading={false}>
      <div className="flex flex-col items-center text-center">
        {/* Emblème : anneaux fins autour du nom */}
        <div className="relative grid h-72 w-72 place-items-center sm:h-96 sm:w-96">
          <motion.svg variants={fadeIn} viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-ink" aria-hidden>
            <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.4" strokeDasharray="1 3" />
            <circle cx="196" cy="100" r="3" fill="none" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="22" cy="140" r="2" fill="currentColor" opacity="0.6" />
          </motion.svg>
          <div className="relative">
            <motion.p variants={fadeUp} className="label-spaced text-ink-soft">
              Portfolio · 2026 — 2027
            </motion.p>
            <motion.h1 variants={fadeUp} className="title-spaced mt-4 pl-[0.32em] text-3xl leading-snug text-ink sm:text-5xl">
              {first}
              <br />
              {rest.join(" ")}
            </motion.h1>
          </div>
        </div>

        <motion.p variants={fadeUp} className="label-spaced mt-8 text-ink-soft">
          {site.role}
        </motion.p>
        <motion.p variants={fadeUp} className="mt-4 max-w-lg text-balance text-lg text-ink">
          {site.tagline}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(1)}
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-sky-top transition hover:bg-accent"
          >
            Commencer le voyage
            <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(6)}
            className="veil inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-ink transition hover:border-accent"
          >
            <ContactIcon size={16} />
            Me contacter
          </button>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-10 flex items-center gap-2 text-xs text-ink-soft">
          <ScrollIcon size={20} />
          Faites défiler
        </motion.p>
      </div>
    </SectionShell>
  );
}
