"use client";

import { m } from "framer-motion";
import { bridge, profiles } from "../../data/skills";
import type { SkillProfile } from "../../types";
import BrandIcon from "../icons/BrandIcons";
import { OutilsIcon, icons } from "../icons/GrisIcons";
import { fadeUp } from "../journey/motion";
import SectionShell from "./SectionShell";

/**
 * 04 — Aptitudes : deux faces, une même main.
 * Comme les visages jumeaux des décors, deux panneaux-feuilles se font face : le designer et le développeur web.
 * Pas de niveau chiffré : chaque savoir-faire dit ce qu'il produit, et les outils sont montrés par leur logo.
 * Entre les deux, un fil et l'anneau « & » portent ce qui relie les deux métiers.
 */
export default function Aptitudes() {
  const [design, dev] = profiles;
  return (
    <SectionShell index={3}>
      <div className="grid gap-5 lg:grid-cols-[1fr_8.5rem_1fr] lg:gap-0">
        <Profile profile={design} />
        <Bridge />
        <Profile profile={dev} mirrored />
      </div>
    </SectionShell>
  );
}

function Profile({ profile, mirrored = false }: { profile: SkillProfile; mirrored?: boolean }) {
  const Icon = icons[profile.icon];
  const id = `apt-${profile.id}`;
  return (
    <m.section
      variants={fadeUp}
      aria-labelledby={id}
      className={`veil panel flex flex-col px-6 py-6 sm:px-8 short:py-4 ${
        mirrored ? "rounded-[0.6rem_1.75rem_0.6rem_1.75rem] sm:rounded-[0.75rem_3rem_0.75rem_3rem]" : "rounded-[1.75rem_0.6rem_1.75rem_0.6rem] sm:rounded-[3rem_0.75rem_3rem_0.75rem]"
      }`}
    >
      {/* Les deux en-têtes se regardent, comme les visages jumeaux */}
      <header className={`flex items-center gap-4 ${mirrored ? "lg:flex-row-reverse lg:text-right" : ""}`}>
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-ink/20 text-ink short:size-10">
          <Icon size={24} />
        </span>
        <div>
          <p className="label-spaced text-ink-soft">{profile.side}</p>
          <h3 id={id} className="title-spaced mt-1 text-xl text-ink sm:text-2xl">
            {profile.name}
          </h3>
        </div>
      </header>
      <p className="mt-4 text-pretty text-sm leading-relaxed text-ink short:mt-2.5">{profile.pitch}</p>

      <ul className="mt-5 space-y-2.5 short:mt-3 short:space-y-1.5" aria-label="Savoir-faire">
        {profile.skills.map((s) => (
          <li key={s.name} className="flex items-baseline gap-3 text-sm">
            <span aria-hidden className="size-1.5 shrink-0 -translate-y-0.5 rotate-45 bg-accent" />
            <span>
              <span className="text-ink">{s.name}</span>
              <span className="text-ink-soft"> · {s.detail}</span>
            </span>
          </li>
        ))}
      </ul>

      <h4 className="label-spaced mt-auto flex items-center gap-2 pt-6 text-ink-soft short:pt-3">
        <OutilsIcon size={16} />
        Outils
        <span aria-hidden className="h-px flex-1 bg-ink/15" />
      </h4>
      <ul className="mt-3 flex flex-wrap gap-2 short:mt-2 short:gap-1.5">
        {profile.tools.map((t) => (
          <li
            key={t.brand}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 py-1.5 pl-2.5 pr-3 text-xs text-ink transition hover:border-ink/40"
          >
            <BrandIcon name={t.brand} size={16} />
            {t.name}
          </li>
        ))}
      </ul>
    </m.section>
  );
}

/** Le lien entre les deux : un fil vertical (en ligne sur petit écran), l'anneau « & » et ce qui est partagé */
function Bridge() {
  return (
    <m.div
      variants={fadeUp}
      className="legible max-md:mist order-last flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:order-none lg:flex-col lg:flex-nowrap lg:justify-center lg:gap-3 lg:px-2"
    >
      <span aria-hidden className="hidden w-px flex-1 bg-gradient-to-b from-transparent to-ink/25 lg:block" />
      <span className="relative grid size-14 shrink-0 place-items-center text-ink" aria-hidden>
        <svg viewBox="0 0 48 48" className="absolute inset-0 size-full overflow-visible">
          <g className="emblem-spin-slow" style={{ transformOrigin: "24px 24px" }}>
            <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="0.9" pathLength={100} strokeDasharray="86 14" opacity="0.7" />
            <path d="M24 -0.5 L26.2 2 L24 4.5 L21.8 2Z" fill="var(--accent)" />
          </g>
        </svg>
        <span className="font-display text-2xl font-light">&amp;</span>
      </span>
      <p className="label-spaced w-full text-center text-ink sm:w-auto lg:w-full">Entre les deux</p>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 lg:flex-col lg:items-center lg:gap-2.5" aria-label="Ce qui relie les deux profils">
        {bridge.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm text-ink lg:flex-col lg:gap-1.5 lg:text-center">
            <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
            {b}
          </li>
        ))}
      </ul>
      <span aria-hidden className="hidden w-px flex-1 bg-gradient-to-t from-transparent to-ink/25 lg:block" />
    </m.div>
  );
}
