"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, group } from "../journey/motion";

/** Chapitre des pages longues (crédits, études de cas) : chiffre romain, titre espacé, entre deux filets */
export function Chapter({ numeral, title, id, children }: { numeral: string; title: string; id: string; children: ReactNode }) {
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-titre`}
      className="mt-20 scroll-mt-24 sm:mt-24"
      variants={group}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.header variants={fadeUp} className="legible mb-8 flex items-center justify-center gap-4">
        <span aria-hidden className="h-px max-w-40 flex-1 bg-ink/25" />
        <h2 id={`${id}-titre`} className="flex items-baseline gap-3 text-ink">
          <span className="font-display text-3xl font-light leading-none tracking-[0.04em] text-accent sm:text-4xl" aria-hidden>
            {numeral}
          </span>
          <span className="sr-only">Chapitre {numeral} : </span>
          <span className="label-spaced">{title}</span>
        </h2>
        <span aria-hidden className="h-px max-w-40 flex-1 bg-ink/25" />
      </motion.header>
      {children}
    </motion.section>
  );
}

/** Séparateur : trait, losange, trait */
export function Hairline({ className = "my-7" }: { className?: string }) {
  return (
    <span aria-hidden className={`flex items-center justify-center gap-3 text-ink-soft ${className}`}>
      <span className="h-px w-10 bg-current opacity-40" />
      <span className="size-1.5 rotate-45 bg-accent" />
      <span className="h-px w-10 bg-current opacity-40" />
    </span>
  );
}

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
