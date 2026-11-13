"use client";

import { motion } from "framer-motion";
import { skillGroups, tools } from "../../data/skills";
import { pad } from "../../lib/journey";
import { OutilsIcon, icons } from "../icons/GrisIcons";
import { fadeUp, group } from "../journey/motion";
import SectionShell from "./SectionShell";

/** 04 — Aptitudes : trois familles, un niveau de 1 à 5 en gouttes. */
export default function Aptitudes() {
  return (
    <SectionShell index={3}>
      <div className="grid gap-4 md:grid-cols-3">
        {skillGroups.map((g, gi) => {
          const Icon = icons[g.icon];
          return (
            <motion.section key={g.name} variants={fadeUp} className="veil rounded-2xl p-6" aria-labelledby={`apt-${gi}`}>
              <div className="flex items-center justify-between">
                <Icon size={28} className="text-ink" />
                <span className="label-spaced tabular-nums text-ink-soft">Module {pad(gi + 1)}</span>
              </div>
              <h3 id={`apt-${gi}`} className="title-spaced mt-4 text-xl text-ink">
                {g.name}
              </h3>
              <ul className="mt-5 space-y-3">
                {g.skills.map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-3 text-sm text-ink">
                    {s.name}
                    <Drops level={s.level} />
                  </li>
                ))}
              </ul>
            </motion.section>
          );
        })}
      </div>

      <motion.div variants={group} className="mt-8 flex flex-wrap items-center gap-2">
        <motion.span variants={fadeUp} className="label-spaced mr-2 flex items-center gap-2 text-ink-soft">
          <OutilsIcon size={18} className="text-ink" />
          Outils
        </motion.span>
        {tools.map((t) => (
          <motion.span key={t} variants={fadeUp} className="veil rounded-full px-3 py-1 text-xs text-ink">
            {t}
          </motion.span>
        ))}
      </motion.div>
    </SectionShell>
  );
}

/** Niveau en cinq gouttes d'aquarelle */
function Drops({ level }: { level: number }) {
  return (
    <span className="flex shrink-0 gap-1" role="img" aria-label={`niveau ${level} sur 5`}>
      {Array.from({ length: 5 }, (_, k) => (
        <svg key={k} width="9" height="12" viewBox="0 0 9 12" aria-hidden>
          <path
            d="M4.5 1C6 3 7.8 5 7.8 7.4a3.3 3.3 0 0 1-6.6 0C1.2 5 3 3 4.5 1Z"
            fill={k < level ? "var(--accent)" : "none"}
            stroke="var(--ink)"
            strokeOpacity={k < level ? 0 : 0.35}
            strokeWidth="0.9"
          />
        </svg>
      ))}
    </span>
  );
}
