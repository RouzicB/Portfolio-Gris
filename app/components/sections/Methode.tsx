"use client";

import { motion } from "framer-motion";
import { process } from "../../data/process";
import { fadeUp } from "../journey/motion";
import SectionShell from "./SectionShell";

/** 03 — Méthode, comme une plante : chaque étape pousse un peu plus haut. */
export default function Methode() {
  return (
    <SectionShell index={2}>
      <ol className="grid gap-4 md:grid-cols-5 md:items-end md:[--grow:26px]">
        {process.map((step, i) => (
          <motion.li
            key={step.name}
            variants={fadeUp}
            className="veil rounded-2xl p-5"
            // Sur grand écran, les cartes montent comme une tige qui grandit
            style={{ marginBottom: `calc(var(--grow, 0px) * ${i})` }}
          >
            <div className="flex items-center gap-3">
              <Sprout stage={i} />
              <span className="label-spaced text-ink-soft">Étape {i + 1}</span>
            </div>
            <h3 className="title-spaced mt-3 text-xl text-ink">{step.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink">{step.goal}</p>
            <ul className="mt-4 space-y-1">
              {step.methods.map((m) => (
                <li key={m} className="flex items-center gap-2 text-xs text-ink-soft">
                  <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                  {m}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>
    </SectionShell>
  );
}

/** Pousse dessinée : une feuille de plus à chaque étape */
function Sprout({ stage }: { stage: number }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <path d="M14 27 V9" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
      {Array.from({ length: stage + 1 }, (_, k) => {
        const y = 24 - k * 4;
        const left = k % 2 === 0;
        return (
          <path
            key={k}
            d={left ? `M14 ${y} C10 ${y - 6} 5 ${y - 5} 4 ${y - 2} C7 ${y} 11 ${y + 1} 14 ${y}Z` : `M14 ${y} C18 ${y - 6} 23 ${y - 5} 24 ${y - 2} C21 ${y} 17 ${y + 1} 14 ${y}Z`}
            fill="var(--accent)"
            opacity={0.55 + k * 0.1}
          />
        );
      })}
    </svg>
  );
}
