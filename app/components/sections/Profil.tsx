"use client";

import { motion } from "framer-motion";
import { site, specs, values } from "../../data/site";
import { icons } from "../icons/GrisIcons";
import { fadeIn, fadeUp } from "../journey/motion";
import SectionShell from "./SectionShell";

/** 02 — Profil : présentation, fiche et valeurs. */
export default function Profil() {
  return (
    <SectionShell index={1}>
      <div className="grid gap-8 lg:grid-cols-[auto_1fr_1fr] lg:items-start">
        <motion.div variants={fadeIn} className="mx-auto lg:mx-0">
          <Portrait />
        </motion.div>

        <div>
          <motion.p variants={fadeUp} className="text-lg leading-relaxed text-ink">
            {site.bio}
          </motion.p>
          <motion.ul variants={fadeUp} className="mt-6 space-y-4">
            {values.map((v) => (
              <li key={v.title}>
                <p className="font-semibold text-ink">{v.title}</p>
                <p className="text-sm text-ink-soft">{v.text}</p>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.dl variants={fadeUp} className="veil divide-y divide-ink/10 rounded-2xl px-5 py-2">
          {specs.map((s) => {
            const Icon = icons[s.icon];
            return (
              <div key={s.label} className="flex items-start gap-3 py-3">
                <Icon size={20} className="mt-0.5 shrink-0 text-ink" />
                <div>
                  <dt className="label-spaced text-ink-soft">{s.label}</dt>
                  <dd className="mt-0.5 text-sm text-ink">{s.value}</dd>
                </div>
              </div>
            );
          })}
        </motion.dl>
      </div>
    </SectionShell>
  );
}

/** Portrait dans un cercle peint ; sans photo, un monogramme */
function Portrait() {
  const initials = site.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <div className="relative h-48 w-48 sm:h-56 sm:w-56">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="100" cy="100" r="88" fill="var(--veil)" filter="url(#wc-edge)" />
        <circle cx="100" cy="100" r="97" fill="none" stroke="var(--ink)" strokeWidth="0.6" opacity="0.4" />
        <circle cx="168" cy="40" r="5" fill="var(--accent)" filter="url(#wc-edge)" />
      </svg>
      {site.portrait ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={site.portrait} alt={site.name} className="absolute inset-[12%] h-[76%] w-[76%] rounded-full object-cover" />
      ) : (
        <span className="title-spaced absolute inset-0 grid place-items-center pl-[0.32em] text-4xl text-ink" aria-hidden>
          {initials}
        </span>
      )}
    </div>
  );
}
