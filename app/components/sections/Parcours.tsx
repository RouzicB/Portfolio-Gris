"use client";

import { motion } from "framer-motion";
import { career } from "../../data/career";
import { FormationIcon } from "../icons/GrisIcons";
import { fadeUp } from "../journey/motion";
import SectionShell from "./SectionShell";

/** 05 — Parcours : cinq années reliées par un fil, chaque étape un peu plus haut. */
export default function Parcours() {
  return (
    <SectionShell index={4}>
      <div className="relative">
        {/* Fil qui relie les années (grand écran) */}
        <svg className="absolute -top-6 left-0 hidden h-12 w-full lg:block" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0 30 C150 5 250 38 400 20 S700 0 1000 18"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
        </svg>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end lg:[--rise:22px]">
          {career.map((step, i) => (
            <motion.li
              key={step.year}
              variants={fadeUp}
              className="veil relative rounded-2xl p-5"
              style={{ marginBottom: `calc(var(--rise, 0px) * ${i})` }}
            >
              <span className="absolute -top-3 left-5 hidden h-6 w-6 place-items-center rounded-full bg-ink text-sky-top lg:grid" aria-hidden>
                <FormationIcon size={14} strokeWidth={1.6} />
              </span>
              <p className="flex items-baseline justify-between">
                <span className="font-display text-3xl font-light tracking-wider text-accent">{step.year}</span>
                <span className="text-xs text-ink-soft">{step.period}</span>
              </p>
              <h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
              <p className="text-xs text-ink-soft">{step.place}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink">{step.text}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {step.tags.map((t) => (
                  <li key={t} className="rounded-full border border-ink/20 px-2 py-0.5 text-[11px] text-ink-soft">
                    {t}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
