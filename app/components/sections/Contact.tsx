"use client";

import { useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { sections } from "../../data/sections";
import { site } from "../../data/site";
import BrandIcon, { type BrandName } from "../icons/BrandIcons";
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon, CopyIcon } from "../icons/GrisIcons";
import { useJourneyControls } from "../journey/JourneyContext";
import { fadeIn, fadeUp, group } from "../journey/motion";
import Emblem from "../ui/Emblem";
import SectionShell from "./SectionShell";

const SECTION = sections[6];

/** Feuille de papier, coin plié */
const CvIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
    <path d="M6 3.5h8.5L19 8v12.5H6Z" />
    <path d="M14.5 3.5V8H19" />
    <path d="M9 12.5h6.5M9 16h4.5" />
  </svg>
);

/**
 * 07 — Contact : le voyage se referme comme il a commencé.
 * L'emblème aux anneaux de l'accueil revient, « Écrivons la suite » en son centre, à côté de la grande lune ;
 * dessous, l'adresse en très grand soulignée d'un coup de pinceau, un bouton par réseau (avec son logo) et le CV,
 * la disponibilité et le retour au début. Tout est centré, sans panneau.
 */
export default function Contact() {
  const { goTo } = useJourneyControls();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };


  return (
    <SectionShell index={6} heading={false}>
      <div className="legible flex flex-col items-center text-center">
        {/* L'emblème de l'accueil, refermé sur la suite */}
        <div
          className="@container relative grid size-[min(16rem,66vw,32svh)] place-items-center sm:size-[min(19rem,34svh)]"
          style={{ ["--emblem-bg" as string]: "var(--sky-top)" }}
          aria-hidden
        >
          <m.div variants={fadeIn} className="absolute inset-0 text-ink">
            <Emblem className="size-full" />
          </m.div>
          <m.div variants={fadeUp} className="relative flex flex-col items-center">
            <span className="label-spaced text-[max(0.5625rem,3.6cqw)] text-ink-soft">07 · {SECTION.label}</span>
            <span className="title-spaced mt-[3.5cqw] pl-[0.32em] text-[5.2cqw] leading-snug text-ink">
              Écrivons
              <br />
              la suite
            </span>
          </m.div>
        </div>

        <m.p variants={fadeUp} className="mt-5 max-w-md text-balance text-ink short:mt-3">
          {SECTION.intro}
        </m.p>

        {/* L'adresse, en très grand */}
        <m.div variants={fadeUp} className="mt-4 flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a
            href={`mailto:${site.email}`}
            className="group relative max-w-full break-all font-display text-[clamp(1.6rem,6vw,3.25rem)] font-light leading-tight text-ink"
          >
            {site.email}
            <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full" aria-hidden focusable="false">
              <path
                d="M2 8 C40 3 90 2 130 4 S185 9 198 5 C170 10 120 10 70 9 S20 10 2 8Z"
                fill="var(--accent)"
                className="origin-left opacity-70 transition-transform duration-700 group-hover:scale-x-105"
              />
            </svg>
          </a>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Adresse copiée" : "Copier l'adresse"}
            className="veil grid size-11 shrink-0 place-items-center rounded-full text-ink transition hover:-translate-y-0.5"
          >
            {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Adresse copiée" : ""}
          </span>
        </m.div>

        {/* Les autres chemins : chaque réseau a son bouton, avec son logo ; le CV à part, en bouton plein */}
        <m.ul
          variants={group}
          className="mt-7 flex flex-wrap items-center justify-center gap-2.5 short:mt-5"
          aria-label="Ailleurs"
        >
          {site.socials.map((s) => (
            <m.li key={s.label} variants={fadeUp}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="veil group inline-flex h-11 items-center gap-2.5 rounded-full pl-3.5 pr-4 text-sm text-ink transition hover:-translate-y-0.5"
              >
                <BrandIcon name={s.label.toLowerCase() as BrandName} size={18} />
                {s.label}
                <ArrowUpRightIcon size={13} className="opacity-60 transition group-hover:opacity-100" />
                <span className="sr-only">(nouvel onglet)</span>
              </a>
            </m.li>
          ))}
          <m.li variants={fadeUp}>
            {/* Le CV s'ouvre d'abord dans le site (page /cv), où on choisit ensuite la version à télécharger */}
            <Link href="/cv" className="group inline-flex h-11 items-center gap-2.5 stone rounded-full pl-4 pr-5 text-sm transition [text-shadow:none] hover:-translate-y-0.5">
              <CvIcon />
              Voir le CV
            </Link>
          </m.li>
        </m.ul>

        {/* Disponibilité et retour au début */}
        <m.div variants={fadeUp} className="mt-7 flex flex-col items-center gap-3 short:mt-4">
          <p className="veil inline-flex items-center gap-2.5 rounded-full py-1.5 pl-3 pr-4 text-sm text-ink">
            <span aria-hidden className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
            </span>
            {site.status}
          </p>
          {/* Retour au début : un vrai bouton, lisible et assez grand pour être visé */}
          <button
            type="button"
            onClick={() => goTo(0)}
            className="veil group mt-1 inline-flex h-11 items-center gap-2.5 rounded-full pl-3 pr-5 text-sm text-ink transition hover:-translate-y-0.5"
          >
            <span className="grid size-7 place-items-center rounded-full bg-ink text-sky-top transition-transform group-hover:-translate-y-0.5">
              <ArrowRightIcon size={14} className="-rotate-90" />
            </span>
            Revenir au début du voyage
          </button>
        </m.div>
      </div>
    </SectionShell>
  );
}
