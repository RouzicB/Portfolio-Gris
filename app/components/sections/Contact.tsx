"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { site } from "../../data/site";
import { ArrowUpRightIcon, CheckIcon, CopyIcon, DownloadIcon, MailIcon, StatutIcon } from "../icons/GrisIcons";
import { fadeUp } from "../journey/motion";
import SectionShell from "./SectionShell";

/** 07 — Contact */
export default function Contact() {
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
    <SectionShell index={6}>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <motion.p variants={fadeUp} className="text-balance text-2xl leading-snug text-ink sm:text-3xl">
            Cinq ans à apprendre à regarder, écouter et structurer.
            <br />
            <span className="text-ink-soft">La suite s&apos;écrit en équipe — peut-être la vôtre.</span>
          </motion.p>
          <motion.p variants={fadeUp} className="mt-6 flex items-center gap-2 text-sm text-ink">
            <StatutIcon size={20} />
            {site.status}
          </motion.p>
        </div>

        <motion.div variants={fadeUp} className="veil rounded-3xl p-6 sm:p-8">
          <p className="label-spaced flex items-center gap-2 text-ink-soft">
            <MailIcon size={18} className="text-ink" />
            Écrire
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="text-xl font-semibold text-ink underline decoration-ink/30 decoration-2 underline-offset-4 hover:decoration-accent"
            >
              {site.email}
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1 text-xs text-ink transition hover:border-ink/50"
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              <span aria-live="polite">{copied ? "Copié" : "Copier"}</span>
            </button>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm text-sky-top transition hover:opacity-85"
                >
                  {s.label}
                  <ArrowUpRightIcon size={14} />
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.cv}
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/25 px-4 py-2 text-sm text-ink transition hover:border-ink/60"
              >
                <DownloadIcon size={15} />
                Télécharger le CV
              </a>
            </li>
          </ul>
        </motion.div>
      </div>
    </SectionShell>
  );
}
