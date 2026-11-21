"use client";

import { m } from "framer-motion";
import { site } from "../../data/site";
import { useYear } from "../../lib/useYear";
import { ArrowRightIcon, ContactIcon, ScrollIcon } from "../icons/GrisIcons";
import { useJourneyControls } from "../journey/JourneyContext";
import { fadeIn, fadeUp, group } from "../journey/motion";
import Emblem from "../ui/Emblem";
import SectionShell from "./SectionShell";

/** 01 — Accueil (identification) : le nom, le rôle, l'accroche. */
export default function Accueil() {
  const { goTo } = useJourneyControls();
  const [first, ...rest] = site.name.split(" ");
  const year = useYear();
  return (
    <SectionShell index={0} heading={false}>
      <div className="flex flex-col items-center text-center">
        {/* Emblème : anneaux concentriques, le nom dans l'anneau intérieur */}
        <div
          className="relative grid size-[min(20rem,78vw,46svh)] place-items-center sm:size-[min(28rem,50svh)]"
          style={{ ["--emblem-bg" as string]: "var(--sky-top)" }}
        >
          <m.div variants={fadeIn} className="absolute inset-0 text-ink">
            <Emblem className="h-full w-full" />
          </m.div>
          <m.h1 variants={fadeUp} className="title-spaced relative pl-[0.32em] text-xl leading-snug text-ink sm:text-3xl short:sm:text-2xl">
            {first}
            <br />
            {rest.join(" ")}
          </m.h1>
        </div>

        <m.p variants={fadeUp} className="label-spaced mt-6 text-balance text-ink short:mt-3">
          Portfolio - {year}
        </m.p>

        <m.div variants={group} className="mt-8 flex flex-wrap justify-center gap-3 short:mt-5 tiny:mt-4">
          <m.button
            variants={fadeUp}
            type="button"
            onClick={() => goTo(1)}
            className="group inline-flex items-center gap-2 stone rounded-full px-5 py-2.5 text-sm transition hover:-translate-y-0.5"
          >
            Commencer le voyage
            <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-0.5" />
          </m.button>
          <m.button
            variants={fadeUp}
            type="button"
            onClick={() => goTo(6)}
            className="veil inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-ink transition hover:border-accent"
          >
            <ContactIcon size={16} />
            Me contacter
          </m.button>
        </m.div>

        <m.p variants={fadeUp} className="mt-10 flex items-center gap-2 text-xs text-ink short:mt-5 tiny:hidden">
          <ScrollIcon size={20} />
          Faites défiler
        </m.p>
      </div>
    </SectionShell>
  );
}
