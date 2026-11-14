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
import "@fontsource/metamorphous/latin-400.css";
import "@fontsource/mukta/latin-400.css";
import "@fontsource/mukta/latin-600.css";
import "@fontsource/ostrich-sans-rounded/latin-500.css";
import "@fontsource/apfel-grotezk/latin-400.css";
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
          <div className="grid gap-5 font-sans lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            {/* Le logo seul, sur le fond de la marque, dans un cadre à clé de voûte */}
            <motion.figure
              variants={fadeUp}
              className={`relative grid min-h-64 place-items-center px-8 py-12 sm:px-14 ${leaf()}`}
              style={{ background: logo.background }}
            >
              <span aria-hidden className="absolute -top-px left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
              <span aria-hidden className={`pointer-events-none absolute inset-2 border border-white/25 ${leaf()}`} />
              {/* eslint-disable-next-line @next/next/no-img-element -- logo vectoriel ou WebP déjà optimisé */}
              <img src={logo.src} alt={logo.alt} className={`h-auto w-full ${logo.wide || (logo.glyphs && logo.glyphs.length > 3) ? "max-w-sm" : "max-w-[15rem]"}`} />
            </motion.figure>

            {/* Sa lecture, élément par élément, sur un voile : texte sombre, lisible quel que soit le fond de la marque */}
            {(logo.glyphs || logo.note) && (
              <motion.div variants={fadeUp} className={`veil flex flex-col justify-center px-6 py-6 sm:px-8 ${leaf(true)}`}>
                {logo.glyphs && (
                  <ol className="divide-y divide-ink/15">
                    {logo.glyphs.map((g, i) => (
                      <li key={g.letter} className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                        {/* Repère : la lettre dans la typo du logo, ou le numéro de l'élément */}
                        <span
                          aria-hidden
                          className="grid size-11 place-items-center rounded-[0.9rem_0.3rem_0.9rem_0.3rem]"
                          style={{ background: logo.background, color: logo.foreground ?? "#ffffff", fontFamily: g.letter.length > 2 ? undefined : logo.glyphFont }}
                        >
                          <span className={g.letter.length > 2 ? "font-display text-sm font-semibold tabular-nums" : "text-2xl leading-none"}>
                            {g.letter.length > 2 ? String(i + 1).padStart(2, "0") : g.letter}
                          </span>
                        </span>
                        <span className="min-w-0">
                          {/* Une lettre seule est déjà dans le repère : on ne la répète que pour les lecteurs d'écran */}
                          <span className={g.letter.length > 2 ? "label-spaced mb-1 block text-ink" : "sr-only"}>{g.letter}</span>
                          <span className="block text-pretty text-sm leading-relaxed text-ink">{g.meaning}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
                {logo.note && (
                  <p className="mt-5 flex items-start gap-2.5 border-t border-ink/15 pt-4 text-pretty text-sm leading-relaxed text-ink">
                    <span aria-hidden className="mt-[0.45rem] size-1.5 shrink-0 rotate-45 bg-accent" />
                    {logo.note}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </Sub>
      )}

      {/* Les couleurs, chacune dans une petite arche */}
      <Sub title="Couleurs">
        {/* Autant de colonnes que de couleurs sur grand écran : la rangée est toujours pleine */}
        {/* Peu de couleurs : la rangée se resserre au centre plutôt que d'agrandir les arches */}
        <ul
          className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${
            palette.length <= 3 ? "mx-auto max-w-2xl sm:grid-cols-3" : palette.length === 4 ? "mx-auto max-w-4xl lg:grid-cols-4" : palette.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-6"
          }`}
        >
          {palette.map((c) => (
            <motion.li key={c.hex} variants={fadeUp} className="veil flex flex-col rounded-b-2xl rounded-t-[999px] p-1.5 pb-4">
              <span aria-hidden className="block aspect-[4/5] w-full rounded-b-lg rounded-t-[999px] ring-1 ring-inset ring-ink/15" style={{ background: c.hex }} />
              <span className="mt-3 px-2 text-center">
                <span className="label-spaced block text-ink">{c.name}</span>
                <span className="mt-1 block font-mono text-xs tracking-wider text-ink">{c.hex}</span>
                <span className="mt-2 block text-pretty text-sm leading-snug text-ink">{c.role}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </Sub>

      {/* Les typographies, en spécimen (seulement si leurs fichiers sont hébergés avec le site) */}
      {fonts.length > 0 && (
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
      )}

      {/* Le motif et la photographie, face à face */}
      {(motif || photo) && (
        <Sub title={motif?.label && photo?.label ? `${motif.label} & ${photo.label}` : "Motif & photographie"}>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { item: motif, label: motif?.label ?? "Motif", mirrored: false },
              { item: photo, label: photo?.label ?? "Photographie", mirrored: true },
            ].map(({ item, label, mirrored }) =>
              item ? (
                <motion.figure key={label} variants={fadeUp} className={`veil flex flex-col p-1.5 sm:p-2 ${leaf(mirrored)}`}>
                  <span
                    className={`relative block aspect-[16/10] overflow-hidden ${mirrored ? "rounded-[0.5rem_2.1rem_0.5rem_2.1rem]" : "rounded-[2.1rem_0.5rem_2.1rem_0.5rem]"}`}
                    style={item.background ? { background: item.background } : undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- fichiers statiques déjà optimisés (WebP) */}
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 size-full ${item.background ? "object-contain p-3 sm:p-4" : "object-cover"}`}
                    />
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
      {/* Le libellé sur une pastille de verre : lisible quel que soit le décor qui passe derrière */}
      <motion.h3 variants={fadeUp} className="mb-5 flex items-center gap-3 text-ink">
        <span className="veil inline-flex items-center gap-2.5 rounded-full py-1.5 pl-3 pr-4">
          <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
          <span className="label-spaced">{title}</span>
        </span>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-ink/25 to-transparent" />
      </motion.h3>
      {children}
    </section>
  );
}
