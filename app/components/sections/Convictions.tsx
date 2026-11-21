"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { convictions } from "../../data/convictions";
import { ArrowRightIcon } from "../icons/GrisIcons";
import { fadeUp } from "../journey/motion";
import { ROMAN } from "../ui/Chapter";
import SectionShell from "./SectionShell";

/**
 * 03 — Convictions : une rangée d'arches.
 * Chaque conviction est une arche du design system (lavis, filet intérieur, pierre de clé au sommet), comme les cartes
 * de projet et le portrait : son numéro dans un anneau, son titre, ce qu'elle veut dire, puis le projet où elle
 * s'est vérifiée. Grand écran : les cinq arches sont alignées, toutes de la même hauteur (« Vu dans » toujours en bas).
 */
export default function Convictions() {
  return (
    <SectionShell index={2}>
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-5 xl:gap-5">
        {convictions.map((c, i) => (
          <m.li
            key={c.title}
            variants={fadeUp}
            className={`veil panel arch group flex flex-col items-center rounded-b-3xl px-6 pb-6 pt-9 text-center transition-[translate] duration-500 hover:-translate-y-1 xl:px-5 ${
              i === convictions.length - 1 ? "md:col-span-2 md:mx-auto md:w-[calc(50%-0.625rem)] xl:col-span-1 xl:w-auto" : ""
            }`}
          >
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/25 bg-[color-mix(in_srgb,var(--veil)_55%,var(--sky-top))] font-display text-[0.95rem] tracking-[0.04em] text-[color-mix(in_srgb,var(--accent)_75%,var(--ink))]"
            >
              {/* Capitales sans jambage : redescendues pour paraître centrées dans l'anneau */}
              <span className="translate-y-[0.23em]">{ROMAN[i]}</span>
            </span>
            <h3 className="mt-4 text-balance font-display text-lg leading-snug text-ink">{c.title}</h3>
            <p className="mb-5 mt-2.5 text-pretty text-sm leading-relaxed text-ink">{c.text}</p>

            {/* Le projet où elle s'est vérifiée, sous un filet */}
            <Link
              href={`/projets/${c.proof.slug}`}
              className="group/link mt-auto flex w-full flex-col items-center gap-1 border-t border-ink/15 pt-4 text-ink"
            >
              <span className="label-spaced text-ink-soft">Vu dans</span>
              {/* Titre et flèche insécables : la flèche ne part jamais seule à la ligne */}
              <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm">
                <span className="underline decoration-ink/30 underline-offset-4 transition group-hover/link:decoration-ink">{c.proof.title}</span>
                <ArrowRightIcon size={13} className="transition-transform group-hover/link:translate-x-0.5" />
              </span>
            </Link>
          </m.li>
        ))}
      </ul>
    </SectionShell>
  );
}
