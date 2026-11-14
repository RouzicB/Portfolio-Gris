"use client";

import { motion } from "framer-motion";
import { site, specs } from "../../data/site";
import { icons } from "../icons/GrisIcons";
import { fadeUp, group } from "../journey/motion";
import SectionShell from "./SectionShell";

/**
 * 02 — Profil : un portrait dans une fenêtre en arche, la présentation, et la fiche
 * posée sur un fil de constellation (le même que la navigation).
 */
export default function Profil() {
  return (
    <SectionShell index={1}>
      <div className="grid items-center gap-8 md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1.2fr_1fr] lg:gap-12">
        <motion.div variants={fadeUp} className="mx-auto md:mx-0">
          <Portrait />
        </motion.div>

        <div className="legible">
          <motion.p variants={fadeUp} className="text-pretty text-lg leading-relaxed text-ink sm:text-xl">
            {site.bio}
          </motion.p>
          <motion.span variants={fadeUp} aria-hidden className="my-6 flex items-center gap-3 text-ink-soft">
            <span className="h-px w-10 bg-current opacity-50" />
            <span className="size-1.5 rotate-45 bg-accent" />
            <span className="h-px w-10 bg-current opacity-50" />
          </motion.span>
          {/* Signature */}
          <motion.p variants={fadeUp} className="text-ink">
            <span className="title-spaced block text-lg">{site.name}</span>
            <span className="label-spaced mt-1 block text-ink">{site.role}</span>
          </motion.p>
        </div>

        {/* Fiche : chaque information est une étoile du fil */}
        <motion.div variants={fadeUp} className="veil rounded-3xl px-5 py-4 md:col-span-2 lg:col-span-1">
          <motion.dl variants={group} className="relative">
            <span aria-hidden className="absolute bottom-6 left-[17px] top-6 w-px bg-ink/20" />
            {specs.map((s) => {
                const Icon = icons[s.icon];
                return (
                  <motion.div key={s.label} variants={fadeUp} className="relative flex items-center gap-4 py-2.5">
                    <span className="grid size-[35px] shrink-0 place-items-center rounded-full border border-ink/15 bg-[var(--sky-top)] text-ink">
                      <Icon size={17} />
                    </span>
                    <div className="min-w-0">
                      <dt className="label-spaced text-ink-soft">{s.label}</dt>
                      <dd className="mt-0.5 text-sm text-ink">{s.value}</dd>
                    </div>
                  </motion.div>
                );
            })}
          </motion.dl>
        </motion.div>
      </div>
    </SectionShell>
  );
}

/**
 * Portrait dans une fenêtre en arche, comme les ruines des décors : pierre de clé, moulure,
 * un astre cerclé au sommet et un petit relief hachuré à la teinte du décor. Sans photo, un monogramme.
 */
function Portrait() {
  const initials = site.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <div className="veil relative w-40 rounded-b-3xl rounded-t-[999px] p-2 sm:w-48 lg:w-56">
      <span aria-hidden className="absolute left-1/2 top-0 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent shadow-[0_0_12px_var(--accent)]" />
      <div className="relative aspect-[3/4] overflow-hidden rounded-b-2xl rounded-t-[999px]">
        {site.portrait ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={site.portrait} alt={site.name} className="absolute inset-0 size-full object-cover" />
        ) : (
          <>
            <svg viewBox="0 0 120 160" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden focusable="false">
              <defs>
                <linearGradient id="portrait-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--sky-top)" />
                  <stop offset="1" stopColor="var(--sky-bottom)" />
                </linearGradient>
              </defs>
              <rect width="120" height="160" fill="url(#portrait-sky)" />
              {/* Astre et ses anneaux */}
              <circle cx="60" cy="46" r="15" fill="var(--sun)" opacity="0.9" />
              <circle cx="60" cy="46" r="22" fill="none" stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="0.6" />
              <circle cx="60" cy="46" r="29" fill="none" stroke="var(--ink)" strokeOpacity="0.15" strokeWidth="0.5" />
              {/* Relief à deux faces et monticule hachuré */}
              <g filter="url(#wc-paint)">
                <path d="M18 138 L42 112 L66 138Z" fill="var(--wash-near)" opacity="0.45" />
                <path d="M42 112 L66 138 H50Z" fill="var(--wash-near)" opacity="0.3" />
                <path d="M-10 160 C10 138 40 132 64 134 S108 140 130 160Z" fill="var(--accent)" opacity="0.75" />
              </g>
              <path d="M-10 160 C10 138 40 132 64 134 S108 140 130 160Z" fill="url(#hatch)" />
              <rect x="90" y="116" width="6" height="6" fill="var(--accent)" transform="rotate(20 93 119)" />
            </svg>
            <span className="title-spaced absolute inset-x-0 top-[52%] pl-[0.32em] text-center text-2xl text-ink sm:text-3xl" aria-hidden>
              {initials}
            </span>
          </>
        )}
        {/* Moulure intérieure */}
        <span aria-hidden className="pointer-events-none absolute inset-1.5 rounded-b-xl rounded-t-[999px] border border-white/40" />
      </div>
    </div>
  );
}
