"use client";

import { motion } from "framer-motion";
import { credits, site } from "../../data/site";
import { ArrowUpRightIcon, ChevronIcon, iconGallery } from "../icons/GrisIcons";
import { useJourney } from "../journey/JourneyContext";
import { fadeUp } from "../journey/motion";
import SectionShell from "./SectionShell";

/** 08 — Crédits de la direction artistique, ressources et icônes */
export default function Credits() {
  const { goTo } = useJourney();
  const { game } = credits;
  return (
    <SectionShell index={7}>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <motion.article variants={fadeUp} className="veil rounded-2xl p-6">
          <p className="label-spaced text-ink-soft">Direction artistique</p>
          <h3 className="title-spaced mt-2 text-2xl text-ink">{game.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink">
            Ce portfolio rend hommage à l&apos;univers de {game.title}, jeu développé par {game.studio} et publié par{" "}
            {game.publisher} ({game.year}), sous la direction artistique de {game.artDirector}. Ses lavis d&apos;aquarelle,
            ses architectures suspendues, sa typographie très espacée et son monde qui se teinte peu à peu ont inspiré les
            décors et le rythme de ce site.
          </p>
          <a
            href={game.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            {game.studio}
            <ArrowUpRightIcon size={14} />
          </a>
          <p className="mt-5 border-t border-ink/10 pt-4 text-xs leading-relaxed text-ink-soft">
            Projet personnel de {site.name}, sans lien avec {game.studio} ni {game.publisher} et sans usage commercial. Aucun
            personnage, logo ni visuel du jeu n&apos;est reproduit : décors et icônes sont dessinés pour ce site. Les marques
            citées appartiennent à leurs propriétaires.
          </p>
        </motion.article>

        <motion.div variants={fadeUp} className="flex flex-col gap-6">
          <section className="veil rounded-2xl p-6" aria-labelledby="ressources">
            <h3 id="ressources" className="label-spaced text-ink-soft">
              Ressources
            </h3>
            <ul className="mt-2 divide-y divide-ink/10">
              {credits.resources.map((r) => (
                <li key={r.name} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-sm text-ink">{r.name}</span>
                  <span className="text-xs text-ink-soft">{r.detail}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="veil rounded-2xl p-6" aria-labelledby="icones">
            <h3 id="icones" className="label-spaced text-ink-soft">
              Icônes
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              Dessinées pour ce portfolio : un trait fin et arrondi comme un pinceau, et une goutte d&apos;aquarelle qui prend
              la teinte du décor.
            </p>
            <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {iconGallery.map(({ name, Icon }) => (
                <li key={name} className="flex flex-col items-center gap-1.5 rounded-xl py-2 text-ink" title={name}>
                  <Icon size={24} />
                  <span className="max-w-full truncate text-[10px] text-ink-soft">{name}</span>
                </li>
              ))}
            </ul>
          </section>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => goTo(0)}
          className="veil inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-ink"
        >
          <ChevronIcon size={16} className="-rotate-90" />
          Revenir au début
        </button>
      </motion.div>
    </SectionShell>
  );
}
