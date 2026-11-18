"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { convictions } from "../../data/convictions";
import { ArrowRightIcon } from "../icons/GrisIcons";
import { fadeUp } from "../journey/motion";
import SectionShell from "./SectionShell";

/**
 * Les troncs, dans les tons de ceux du décor (scène de la forêt) : pâles comme les troncs lointains, pour que le texte
 * reste bien lisible dessus. Largeur et hauteur de départ du texte
 * varient d'un tronc à l'autre, comme dans la forêt.
 */
const TRUNKS = [
  { top: "#e6f0e3", bottom: "#d3e5d0", width: "100%", drop: 2.5 },
  { top: "#dcebd9", bottom: "#c8dec6", width: "88%", drop: 0 },
  { top: "#e3eee0", bottom: "#cfe2cc", width: "94%", drop: 4 },
  { top: "#d9e9d6", bottom: "#c5dcc3", width: "100%", drop: 1 },
  { top: "#e6f0e3", bottom: "#d1e3ce", width: "90%", drop: 3 },
] as const;

/**
 * 03 — Convictions : une forêt.
 * Chaque conviction est gravée sur un tronc peint comme ceux du décor (même bord d'aquarelle, sans grain sous le texte) ;
 * les troncs sortent de la brume par le haut, passent derrière le titre et se fondent dans le sol.
 * Chacune renvoie au projet où elle s'est vérifiée.
 */
export default function Convictions() {
  return (
    <SectionShell index={2}>
      <ul className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-5 xl:items-start xl:gap-7">
        {convictions.map((c, i) => {
          const t = TRUNKS[i % TRUNKS.length];
          return (
            <m.li
              key={c.title}
              variants={fadeUp}
              style={{ "--drop": `${t.drop}rem`, "--w": t.width } as CSSProperties}
              className={`group relative isolate mx-auto w-full xl:mt-(--drop) xl:w-(--w) ${i === convictions.length - 1 ? "md:col-span-2 xl:col-span-1" : ""}`}
            >
              {/* Le tronc : il sort de la brume au-dessus (grand écran) et se fond dans le sol en bas */}
              <svg
                aria-hidden
                focusable="false"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
                className="trunk absolute left-0 top-0 -z-10 h-[calc(100%+1.5rem)] w-full transition-[filter] duration-500 group-hover:brightness-[1.04] xl:-top-48 xl:h-[calc(100%+13.5rem)]"
              >
                <defs>
                  <linearGradient id={`trunk-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={t.top} />
                    <stop offset="1" stopColor={t.bottom} />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100" height="100" fill={`url(#trunk-${i})`} filter="url(#wc-edge)" />
              </svg>

              <div className="px-5 pb-8 pt-5 sm:px-6 xl:px-5 xl:pb-12 xl:pt-6">
                <h3 className="text-balance font-display text-xl font-normal leading-snug text-ink sm:text-2xl xl:text-[1.35rem]">{c.title}</h3>
                <p className="mt-2.5 text-pretty text-[0.9375rem] font-medium md:max-xl:text-sm leading-relaxed text-ink">{c.text}</p>
                <Link
                  href={`/projets/${c.proof.slug}`}
                  className="group/link mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink transition"
                >
                  <span className="label-spaced whitespace-nowrap">Vu dans</span>
                  {/* Titre et flèche insécables : la flèche ne part jamais seule à la ligne */}
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span className="text-ink underline decoration-ink/30 underline-offset-4 transition group-hover/link:decoration-ink">{c.proof.title}</span>
                    <ArrowRightIcon size={13} className="transition-transform group-hover/link:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            </m.li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
