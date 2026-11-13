"use client";

import { motion } from "framer-motion";
import { site } from "../../data/site";
import { ArrowRightIcon, ContactIcon, ScrollIcon } from "../icons/GrisIcons";
import { useJourney } from "../journey/JourneyContext";
import { fadeIn, fadeUp, group } from "../journey/motion";
import Emblem from "../ui/Emblem";
import SectionShell from "./SectionShell";

/** 01 — Accueil (identification) : le nom, le rôle, l'accroche. */
export default function Accueil() {
  const { goTo } = useJourney();
  const [first, ...rest] = site.name.split(" ");
  return (
    <SectionShell index={0} heading={false}>
      <div className="flex flex-col items-center text-center">
        {/* Emblème : anneaux concentriques, le nom dans l'anneau intérieur */}
        <div
          className="relative grid size-[min(20rem,78vw,46svh)] place-items-center sm:size-[min(28rem,50svh)]"
          style={{ ["--emblem-bg" as string]: "var(--sky-top)" }}
        >
          <motion.div variants={fadeIn} className="absolute inset-0 text-ink">
            <Emblem className="h-full w-full" />
          </motion.div>
          <motion.h1 variants={fadeUp} className="title-spaced relative pl-[0.32em] text-xl leading-snug text-ink sm:text-3xl short:sm:text-2xl">
            {first}
            <br />
            {rest.join(" ")}
          </motion.h1>
        </div>

        <motion.p variants={fadeUp} className="label-spaced mt-6 text-balance text-ink-soft short:mt-3">
          Portfolio · 2026 — 2027 · {site.role}
        </motion.p>
        <motion.p variants={fadeUp} className="mt-4 max-w-lg text-balance text-lg text-ink short:mt-2 short:text-base">
          {site.tagline}
        </motion.p>

        <motion.div variants={group} className="mt-8 flex flex-wrap justify-center gap-3 short:mt-5 tiny:mt-4">
          <motion.button
            variants={fadeUp}
            type="button"
            onClick={() => goTo(1)}
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm text-sky-top shadow-ink/20 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Commencer le voyage
            <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-0.5" />
          </motion.button>
          <motion.button
            variants={fadeUp}
            type="button"
            onClick={() => goTo(6)}
            className="veil inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-ink transition hover:border-accent"
          >
            <ContactIcon size={16} />
            Me contacter
          </motion.button>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-10 flex items-center gap-2 text-xs text-ink-soft short:mt-5 tiny:hidden">
          <ScrollIcon size={20} />
          Faites défiler
        </motion.p>
      </div>
    </SectionShell>
  );
}
