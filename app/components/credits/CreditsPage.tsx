"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { credits, site } from "../../data/site";
import { ArrowUpRightIcon, ChevronIcon, CreditsIcon, iconGallery } from "../icons/GrisIcons";
import { fadeIn, fadeUp, group, stagger } from "../journey/motion";
import PageScene from "../layouts/PageScene";
import { Chapter, Hairline } from "../ui/Chapter";
import Emblem from "../ui/Emblem";

const MotionLink = motion.create(Link);

const fonts = credits.resources.filter((r) => "specimen" in r);
const tools = credits.resources.filter((r) => !("specimen" in r));

/**
 * Page Crédits, lue comme un dernier chapitre :
 * l'emblème aux anneaux en ouverture, puis quatre chapitres numérotés en chiffres romains —
 * la direction artistique dans une arche de verre, la fabrication (spécimens des typographies, outils),
 * la galerie d'icônes en petites arches, les mentions — et le retour au voyage.
 */
export default function CreditsPage() {
  const { game } = credits;
  return (
    <PageScene stage="lune" back={{ href: "/", label: "Accueil" }}>
      <motion.main
        className="relative mx-auto max-w-[1100px] px-4 pb-24 pt-20 sm:px-8 sm:pt-24"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Ouverture : l'emblème, le titre en son centre */}
        <header className="flex flex-col items-center text-center">
          <div className="relative grid size-[min(17rem,72vw)] place-items-center sm:size-80" style={{ ["--emblem-bg" as string]: "var(--sky-top)" }}>
            <motion.div variants={fadeIn} className="absolute inset-0 text-ink">
              <Emblem className="size-full" />
            </motion.div>
            <motion.div variants={fadeUp} className="relative flex flex-col items-center gap-2">
              <CreditsIcon size={22} className="text-ink" />
              <h1 className="title-spaced pl-[0.32em] text-lg text-ink sm:text-2xl">Crédits</h1>
            </motion.div>
          </div>
          <motion.p variants={fadeUp} className="legible mt-6 max-w-xl text-balance text-lg text-ink">
            Ce qui a inspiré ce voyage, et comment il a été fabriqué.
          </motion.p>
          {/* Sommaire des chapitres */}
          <motion.nav variants={fadeUp} aria-label="Chapitres" className="legible mt-6">
            <ol className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {[
                ["I", "Direction artistique", "direction"],
                ["II", "Fabrication", "fabrication"],
                ["III", "Icônes", "icones"],
                ["IV", "Mentions", "mentions"],
              ].map(([n, label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className="label-spaced inline-flex items-baseline gap-2 text-ink underline-offset-8 transition hover:underline">
                    <span className="font-display text-sm tracking-[0.04em] text-[color-mix(in_srgb,var(--accent)_70%,var(--ink))]">{n}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </motion.nav>
        </header>

        {/* I — Direction artistique : une arche de verre */}
        <Chapter numeral="I" title="Direction artistique" id="direction">
          <motion.article
            variants={fadeUp}
            className="veil relative mx-auto max-w-3xl rounded-b-3xl rounded-t-[999px] px-6 pb-8 pt-[clamp(4rem,14vw,8rem)] text-center sm:px-14"
          >
            <span aria-hidden className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent shadow-[0_0_14px_var(--accent)]" />
            <span aria-hidden className="pointer-events-none absolute inset-3 rounded-b-2xl rounded-t-[999px] border border-ink/10" />
            <p className="label-spaced text-ink-soft">Hommage à</p>
            <h3 className="title-spaced mt-3 pl-[0.32em] text-[clamp(2.5rem,9vw,4.5rem)] font-light leading-none text-ink">{game.title}</h3>
            <dl className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {[
                ["Studio", game.studio],
                ["Éditeur", game.publisher],
                ["Année", String(game.year)],
                ["Direction artistique", game.artDirector],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="label-spaced text-[0.625rem] text-ink-soft">{k}</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <Hairline />
            <p className="mx-auto max-w-2xl text-pretty leading-relaxed text-ink">
              Ce portfolio rend hommage à l&apos;univers de {game.title}. Ses aplats géométriques, ses architectures en ruine,
              ses textures de pigment, sa typographie très espacée et son monde qui se révèle peu à peu ont inspiré les décors
              et le rythme de ce site.
            </p>
            <a
              href={game.url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition hover:decoration-ink"
            >
              Découvrir {game.studio}
              <ArrowUpRightIcon size={14} />
            </a>
          </motion.article>
        </Chapter>

        {/* II — Fabrication : spécimens des typographies, puis les outils */}
        <Chapter numeral="II" title="Fabrication" id="fabrication">
          <div className="grid gap-5 md:grid-cols-2">
            {fonts.map((f) => {
              const display = "specimen" in f && f.specimen === "display";
              return (
                <motion.figure key={f.name} variants={fadeUp} className="veil relative overflow-hidden rounded-3xl p-6">
                  <p className="label-spaced text-ink-soft">{"role" in f ? f.role : ""}</p>
                  <p aria-hidden className={`mt-3 text-6xl leading-none text-ink ${display ? "font-display font-light" : "font-sans font-medium"}`}>
                    Aa
                  </p>
                  <p
                    aria-hidden
                    className={`mt-3 truncate text-sm text-ink-soft ${display ? "font-display uppercase tracking-[0.2em]" : "font-sans"}`}
                  >
                    abcdefghijklmnopqrstuvwxyz 0123456789
                  </p>
                  <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-ink/10 pt-4">
                    <span className="font-semibold text-ink">{f.name}</span>
                    <span className="text-xs text-ink-soft">{f.detail}</span>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
          <motion.ul variants={fadeUp} className="veil mt-5 divide-y divide-ink/10 rounded-3xl px-6 py-2">
            {tools.map((r) => (
              <li key={r.name} className="flex flex-col gap-0.5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className="flex items-center gap-3 text-sm text-ink">
                  <span aria-hidden className="size-1.5 shrink-0 rotate-45 bg-accent" />
                  {r.name}
                </span>
                <span className="pl-[1.125rem] text-xs text-ink-soft sm:pl-0">{r.detail}</span>
              </li>
            ))}
          </motion.ul>
        </Chapter>

        {/* III — Icônes : chacune dans sa petite arche */}
        <Chapter numeral="III" title="Icônes" id="icones">
          <motion.p variants={fadeUp} className="legible mx-auto mb-6 max-w-2xl text-center text-sm leading-relaxed text-ink">
            Dessinées pour ce portfolio : un trait de pinceau qui s&apos;affine aux extrémités, des cercles ouverts et des
            facettes, et un lavis d&apos;aquarelle qui prend la teinte du décor.
          </motion.p>
          <ul className="grid grid-cols-3 gap-3 min-[420px]:grid-cols-4 sm:grid-cols-6 lg:grid-cols-9">
            {iconGallery.map(({ name, Icon }) => (
              <motion.li
                key={name}
                variants={fadeUp}
                className="veil group flex flex-col items-center gap-2 rounded-b-2xl rounded-t-[999px] px-1 pb-3 pt-6 transition-[translate] duration-500 hover:-translate-y-1"
                title={name}
              >
                <Icon size={30} className="text-ink transition-transform duration-500 group-hover:scale-110" />
                <span className="max-w-full truncate text-[11px] text-ink-soft">{name}</span>
              </motion.li>
            ))}
          </ul>
        </Chapter>

        {/* IV — Mentions */}
        <Chapter numeral="IV" title="Mentions" id="mentions">
          <motion.div variants={fadeUp} className="veil mx-auto max-w-3xl rounded-3xl px-6 py-6 text-center sm:px-10">
            <p className="text-pretty text-sm leading-relaxed text-ink">
              Projet personnel de {site.name}, sans lien avec {game.studio} ni {game.publisher} et sans usage commercial. Aucun
              personnage, logo ni visuel du jeu n&apos;est reproduit : décors et icônes sont dessinés pour ce site. Les marques
              citées appartiennent à leurs propriétaires.
            </p>
          </motion.div>
        </Chapter>

        {/* Fin : retour au voyage */}
        <motion.footer
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-20 flex flex-col items-center gap-6 text-center"
        >
          <motion.div variants={fadeIn} aria-hidden className="flex items-center gap-3 text-ink-soft">
            <span className="h-px w-12 bg-current opacity-40" />
            <span className="size-2 rotate-45 bg-accent" />
            <span className="h-px w-12 bg-current opacity-40" />
          </motion.div>
          <MotionLink
            variants={fadeUp}
            href="/"
            className="veil group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-ink transition-[translate] hover:-translate-y-0.5"
          >
            <ChevronIcon size={16} className="rotate-180 transition-transform group-hover:-translate-x-0.5" />
            Revenir au voyage
          </MotionLink>
        </motion.footer>
      </motion.main>
    </PageScene>
  );
}

