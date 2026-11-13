"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { credits, site } from "../../data/site";
import { ArrowUpRightIcon, ChevronIcon, CreditsIcon, iconGallery } from "../icons/GrisIcons";
import { fadeUp, stagger } from "../journey/motion";
import PageScene from "../layouts/PageScene";

/** Page Crédits : direction artistique, mentions, ressources et galerie d'icônes */
export default function CreditsPage() {
  const { game } = credits;
  return (
    <PageScene stage="lune" back={{ href: "/", label: "Accueil" }}>
      <motion.main
        className="relative mx-auto max-w-[1100px] px-4 pb-24 pt-28 sm:px-8 sm:pt-36"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={fadeUp} className="label-spaced flex items-center gap-2 text-ink-soft">
          <CreditsIcon size={18} className="text-ink" />
          Crédits
        </motion.p>
        <motion.h1 variants={fadeUp} className="title-spaced mt-4 text-4xl leading-tight sm:text-6xl">
          Crédits
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-lg text-ink-soft">
          Ce qui a inspiré ce voyage, et comment il a été fabriqué.
        </motion.p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
          <motion.article variants={fadeUp} className="veil rounded-2xl p-6">
            <p className="label-spaced text-ink-soft">Direction artistique</p>
            <h2 className="title-spaced mt-2 text-2xl">{game.title}</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Ce portfolio rend hommage à l&apos;univers de {game.title}, jeu développé par {game.studio} et publié par{" "}
              {game.publisher} ({game.year}), sous la direction artistique de {game.artDirector}. Ses aplats géométriques,
              ses architectures en ruine, ses textures de pigment, sa typographie très espacée et son monde qui se teinte peu à
              peu ont inspiré les décors et le rythme de ce site.
            </p>
            <a
              href={game.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              {game.studio}
              <ArrowUpRightIcon size={14} />
            </a>
            <p className="mt-5 border-t border-ink/10 pt-4 text-xs leading-relaxed text-ink-soft">
              Projet personnel de {site.name}, sans lien avec {game.studio} ni {game.publisher} et sans usage commercial.
              Aucun personnage, logo ni visuel du jeu n&apos;est reproduit : décors et icônes sont dessinés pour ce site. Les
              marques citées appartiennent à leurs propriétaires.
            </p>
          </motion.article>

          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <section className="veil rounded-2xl p-6" aria-labelledby="ressources">
              <h2 id="ressources" className="label-spaced text-ink-soft">
                Ressources
              </h2>
              <ul className="mt-2 divide-y divide-ink/10">
                {credits.resources.map((r) => (
                  <li key={r.name} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <span className="text-sm">{r.name}</span>
                    <span className="text-xs text-ink-soft">{r.detail}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="veil rounded-2xl p-6" aria-labelledby="icones">
              <h2 id="icones" className="label-spaced text-ink-soft">
                Icônes
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                Dessinées pour ce portfolio : un trait fin et arrondi comme un pinceau, et une goutte d&apos;aquarelle qui prend
                la teinte du décor.
              </p>
              <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {iconGallery.map(({ name, Icon }) => (
                  <li key={name} className="flex flex-col items-center gap-1.5 rounded-xl py-2" title={name}>
                    <Icon size={24} />
                    <span className="max-w-full truncate text-[10px] text-ink-soft">{name}</span>
                  </li>
                ))}
              </ul>
            </section>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="mt-10 flex justify-center">
          <Link href="/" className="veil inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
            <ChevronIcon size={16} className="rotate-180" />
            Revenir au voyage
          </Link>
        </motion.div>
      </motion.main>
    </PageScene>
  );
}
