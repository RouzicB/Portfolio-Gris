"use client";

import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { sections } from "../../data/sections";
import { site } from "../../data/site";
import { ArrowUpRightIcon, CheckIcon, CopyIcon, DownloadIcon } from "../icons/GrisIcons";
import { useJourneyControls } from "../journey/JourneyContext";
import { fadeIn, fadeUp } from "../journey/motion";
import Emblem from "../ui/Emblem";
import SectionShell from "./SectionShell";

const SECTION = sections[6];

/**
 * 07 — Contact : le voyage se referme comme il a commencé.
 * L'emblème aux anneaux de l'accueil revient, « Écrivons la suite » en son centre, à côté de la grande lune ;
 * dessous, l'adresse en très grand soulignée d'un coup de pinceau, une ligne de liens, la disponibilité
 * et le retour au début. Tout est centré, sans panneau.
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

  const links = [
    ...site.socials.map((s) => ({ label: s.label, href: s.href, external: true })),
    { label: "CV", href: site.cv, external: false },
  ];

  return (
    <SectionShell index={6} heading={false}>
      <div className="legible flex flex-col items-center text-center">
        {/* L'emblème de l'accueil, refermé sur la suite */}
        <div
          className="@container relative grid size-[min(16rem,66vw,32svh)] place-items-center sm:size-[min(19rem,34svh)]"
          style={{ ["--emblem-bg" as string]: "var(--sky-top)" }}
          aria-hidden
        >
          <motion.div variants={fadeIn} className="absolute inset-0 text-ink">
            <Emblem className="size-full" />
          </motion.div>
          <motion.div variants={fadeUp} className="relative flex flex-col items-center">
            <span className="label-spaced text-[max(0.5625rem,3.6cqw)] text-ink-soft">07 · {SECTION.label}</span>
            <span className="title-spaced mt-[3.5cqw] pl-[0.32em] text-[5.2cqw] leading-snug text-ink">
              Écrivons
              <br />
              la suite
            </span>
          </motion.div>
        </div>

        <motion.p variants={fadeUp} className="mt-5 max-w-md text-balance text-ink short:mt-3">
          {SECTION.intro}
        </motion.p>

        {/* L'adresse, en très grand */}
        <motion.div variants={fadeUp} className="mt-4 flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2">
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
        </motion.div>

        {/* Les autres chemins, sur une ligne */}
        <motion.ul variants={fadeUp} className="veil mt-7 grid grid-cols-2 justify-items-center gap-x-6 gap-y-2 rounded-[1.75rem] px-6 py-3 short:mt-5 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-1 sm:py-2.5" aria-label="Ailleurs">
          {links.map((l, i) => (
            <Fragment key={l.label}>
              {i > 0 && <li aria-hidden className="mx-3 hidden size-1.5 rotate-45 bg-accent sm:block" />}
              <li>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noreferrer" } : { download: true })}
                  className="label-spaced inline-flex items-center gap-1.5 py-1 text-ink underline-offset-8 transition hover:underline"
                >
                  {l.external ? l.label : "Télécharger le CV"}
                  {l.external ? <ArrowUpRightIcon size={13} /> : <DownloadIcon size={13} />}
                  {l.external && <span className="sr-only">(nouvel onglet)</span>}
                </a>
              </li>
            </Fragment>
          ))}
        </motion.ul>

        {/* Disponibilité et retour au début */}
        <motion.div variants={fadeUp} className="mt-7 flex flex-col items-center gap-3 short:mt-4">
          <p className="veil inline-flex items-center gap-2.5 rounded-full py-1.5 pl-3 pr-4 text-sm text-ink">
            <span aria-hidden className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
            </span>
            {site.status}
          </p>
          <button
            type="button"
            onClick={() => goTo(0)}
            className="flex items-center gap-3 text-ink-soft transition hover:text-ink"
          >
            <span aria-hidden className="h-px w-8 bg-current opacity-60" />
            <span className="label-spaced text-ink">Revenir au début du voyage</span>
            <span aria-hidden className="h-px w-8 bg-current opacity-60" />
          </button>
        </motion.div>
      </div>
    </SectionShell>
  );
}
