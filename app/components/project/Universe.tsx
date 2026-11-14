"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
// Typographies des projets présentés en spécimen (hébergées avec le site ; chargées seulement sur cette page)
import "@fontsource/major-mono-display/latin-400.css";
import "@fontsource/play/latin-400.css";
import "@fontsource/play/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/righteous/latin-400.css";
import "@fontsource/kumbh-sans/latin-400.css";
import "@fontsource/kumbh-sans/latin-700.css";
import type { Universe as UniverseData } from "../../types";
import { fadeUp } from "../journey/motion";

const leaf = (mirrored = false) => (mirrored ? "rounded-[0.75rem_2.5rem_0.75rem_2.5rem]" : "rounded-[2.5rem_0.75rem_2.5rem_0.75rem]");

/**
 * Univers graphique d'une marque, présenté dans le vocabulaire du portfolio :
 * le logotype sur le fond de la marque, ses couleurs dans de petites arches, ses typographies en spécimen,
 * puis son motif et sa photographie face à face. Les couleurs du projet restent dans les échantillons et les images.
 */
export default function Universe({ universe }: { universe: UniverseData }) {
  const { logo, palette, fonts, motif, photo } = universe;
  return (
    <div className="space-y-14">
      <motion.p variants={fadeUp} className={`veil mx-auto max-w-3xl px-6 py-5 text-center text-pretty leading-relaxed text-ink sm:px-10 ${leaf()}`}>
        {universe.intro}
      </motion.p>

      {/* Le logotype, sur le fond de la marque, et le sens de chaque lettre */}
      {logo && (
        <Sub title="Logotype">
          <motion.figure
            variants={fadeUp}
            className={`relative overflow-hidden px-6 py-10 sm:px-12 sm:py-14 ${leaf()}`}
            style={{ background: logo.background, color: "#fefefe" }}
          >
            <span aria-hidden className="absolute -top-px left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
            {/* eslint-disable-next-line @next/next/no-img-element -- logo vectoriel (SVG) */}
            <img src={logo.src} alt={logo.alt} className="mx-auto h-auto w-full max-w-md" />
            {logo.glyphs && (
              <ol className={`mt-10 grid gap-x-6 gap-y-6 border-t border-white/15 pt-8 ${logo.glyphs.length > 3 ? "grid-cols-2 sm:grid-cols-5" : "sm:grid-cols-3"}`}>
                {logo.glyphs.map((g) => (
                  <li key={g.letter} className="flex flex-col items-center text-center">
                    <span aria-hidden className={`leading-none ${g.letter.length > 2 ? "text-2xl uppercase tracking-wide" : "text-4xl"}`} style={{ fontFamily: logo.glyphFont }}>
                      {g.letter}
                    </span>
                    <span className="mt-3 text-sm leading-relaxed text-white">
                      <span className="sr-only">{g.letter} : </span>
                      {g.meaning}
                    </span>
                  </li>
                ))}
              </ol>
            )}
            {logo.note && (
              <figcaption className="mt-8 text-center text-sm text-white">
                {logo.note}
              </figcaption>
            )}
          </motion.figure>
        </Sub>
      )}

      {/* Les couleurs, chacune dans une petite arche */}
      <Sub title="Couleurs">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {palette.map((c) => (
            <motion.li key={c.hex} variants={fadeUp} className="veil flex flex-col rounded-b-2xl rounded-t-[999px] p-1.5 pb-4">
              <span aria-hidden className="block aspect-[4/5] rounded-b-lg rounded-t-[999px] ring-1 ring-inset ring-ink/15" style={{ background: c.hex }} />
              <span className="mt-3 px-2 text-center">
                <span className="title-spaced block text-xs text-ink">{c.name}</span>
                <span className="mt-1 block font-mono text-xs tracking-wider text-ink">{c.hex}</span>
                <span className="mt-1.5 block text-xs leading-snug text-ink">{c.role}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </Sub>

      {/* Les typographies, en spécimen */}
      <Sub title="Typographies">
        <motion.ul variants={fadeUp} className={`veil divide-y divide-ink/15 px-6 sm:px-8 ${leaf(true)}`}>
          {fonts.map((f) => (
            <li key={f.name} className="grid grid-cols-1 items-center gap-x-8 gap-y-3 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
              <div aria-hidden className="min-w-0 text-ink" style={{ fontFamily: f.family }}>
                <span className="block text-5xl leading-none sm:text-6xl">Aa</span>
                <span className="mt-3 block truncate text-sm opacity-90">ABCDEFGHIJKLM abcdefghijklm 0123456789</span>
              </div>
              <div>
                <p className="label-spaced text-ink">{f.role}</p>
                <h4 className="mt-1 text-lg text-ink" style={{ fontFamily: f.family }}>
                  {f.name}
                </h4>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-ink">{f.use}</p>
              </div>
            </li>
          ))}
        </motion.ul>
      </Sub>

      {/* Le motif et la photographie, face à face */}
      {(motif || photo) && (
        <Sub title="Motif & photographie">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { item: motif, label: "Motif", mirrored: false },
              { item: photo, label: "Photographie", mirrored: true },
            ].map(({ item, label, mirrored }) =>
              item ? (
                <motion.figure key={label} variants={fadeUp} className={`veil flex flex-col p-1.5 sm:p-2 ${leaf(mirrored)}`}>
                  <span className={`relative block aspect-[16/10] overflow-hidden ${mirrored ? "rounded-[0.5rem_2.1rem_0.5rem_2.1rem]" : "rounded-[2.1rem_0.5rem_2.1rem_0.5rem]"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- fichiers statiques déjà optimisés (WebP) */}
                    <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                  </span>
                  <figcaption className="px-4 pb-4 pt-5 sm:px-5">
                    <span className="label-spaced text-ink">{label}</span>
                    <span className="mt-2 block text-pretty text-sm leading-relaxed text-ink">{item.text}</span>
                  </figcaption>
                </motion.figure>
              ) : null,
            )}
          </div>
        </Sub>
      )}
    </div>
  );
}

/** Sous-partie : losange, libellé espacé, filet */
function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <motion.h3 variants={fadeUp} className="legible mb-5 flex items-center gap-3 text-ink">
        <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
        <span className="label-spaced">{title}</span>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-ink/25 to-transparent" />
      </motion.h3>
      {children}
    </section>
  );
}
