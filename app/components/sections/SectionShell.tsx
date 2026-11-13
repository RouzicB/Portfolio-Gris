"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { sections } from "../../data/sections";
import { anchorId, pad } from "../../lib/journey";
import { icons } from "../icons/GrisIcons";
import { fadeUp, stagger } from "../journey/motion";

/**
 * Gabarit d'une section : un écran plein.
 * Le contenu réapparaît en cascade à chaque passage, comme un souvenir qui revient.
 */
export default function SectionShell({
  index,
  children,
  heading = true,
  className = "",
}: {
  index: number;
  children: ReactNode;
  /** Affiche l'en-tête standard (numéro, titre, introduction) */
  heading?: boolean;
  className?: string;
}) {
  const section = sections[index];
  const titleId = `${anchorId(section.id)}-titre`;
  const Icon = icons[section.icon];
  return (
    <section
      id={anchorId(section.id)}
      data-section-index={index}
      aria-labelledby={titleId}
      className={`relative flex min-h-svh snap-start items-center px-4 pb-28 pt-24 sm:px-8 md:pb-16 md:pr-24 ${className}`}
    >
      <motion.div
        className="mx-auto w-full max-w-[1200px]"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.25 }}
      >
        {heading ? (
          <motion.header variants={fadeUp} className="mb-8 md:mb-12">
            <p className="label-spaced flex items-center gap-2 text-ink-soft">
              <Icon size={18} className="text-ink" />
              <span className="tabular-nums">{pad(index + 1)}</span>
              <span aria-hidden className="h-px w-6 bg-current opacity-50" />
              {section.label}
            </p>
            <h2 id={titleId} className="title-spaced mt-4 text-3xl leading-tight text-ink sm:text-5xl">
              {section.title}
            </h2>
            {section.intro && <p className="mt-3 max-w-xl text-ink-soft">{section.intro}</p>}
          </motion.header>
        ) : (
          <h2 id={titleId} className="sr-only">
            {section.title}
          </h2>
        )}
        {children}
      </motion.div>
    </section>
  );
}
