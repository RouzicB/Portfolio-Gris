"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import type { Project, ProjectCard } from "../../types";
import { pad } from "../../lib/journey";
import PageScene from "../layouts/PageScene";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChevronIcon,
  ClockIcon,
  ConceptionIcon,
  FormationIcon,
  OutilsIcon,
  ProfilIcon,
  RechercheIcon,
  type Icon,
} from "../icons/GrisIcons";
import { fadeUp, stagger } from "../journey/motion";
import { Chapter, Hairline, ROMAN } from "../ui/Chapter";
import ProjectThumb from "../ui/ProjectThumb";
import BookReader from "./BookReader";
import Universe from "./Universe";

/** Panneau en feuille ; « mirrored » inverse les coins, pour deux panneaux qui se font face */
const leaf = (mirrored = false) => (mirrored ? "rounded-[0.75rem_2.5rem_0.75rem_2.5rem]" : "rounded-[2.5rem_0.75rem_2.5rem_0.75rem]");

/**
 * Étude de cas sur sa propre page, lue comme un petit livre :
 * une ouverture (titre, fiche, image dans un cadre à clé de voûte), puis des chapitres en chiffres romains —
 * le problème et la réponse face à face, la démarche sur un fil, le document à feuilleter s'il existe,
 * les résultats, ce que j'en retiens — et le passage aux études voisines.
 */
export default function ProjectCase({
  project,
  nav,
}: {
  project: Project;
  /** Position de l'étude et ses voisines (cartes seulement) */
  nav: { index: number; total: number; prev: ProjectCard & { index: number }; next: ProjectCard & { index: number } };
}) {
  // Chapitres présents (le document à feuilleter est facultatif)
  const chapters = [
    { id: "enjeu", title: "L'enjeu" },
    { id: "demarche", title: "Démarche" },
    ...(project.universe ? [{ id: "univers", title: "L'univers graphique" }] : []),
    ...(project.book ? [{ id: "document", title: project.book.title }] : []),
    { id: "resultats", title: "Résultats" },
    { id: "retenu", title: "Ce que j'en retiens" },
  ].map((c, i) => ({ ...c, numeral: ROMAN[i] }));
  const chapter = Object.fromEntries(chapters.map((c) => [c.id, c]));

  return (
    <PageScene
      stage={project.stage}
      theme={project.theme}
      back={{ href: "/#section-projets", label: "Projets" }}
      aside={
        // Numéro d'étude : libellé espacé, puis « 03 ◆ 10 » le long d'un filet, comme les chapitres
        <p className="flex items-center gap-3">
          <span className="label-spaced hidden sm:inline">Étude</span>
          <span className="flex items-center gap-2 font-display tabular-nums">
            <span className="text-base font-semibold leading-none">{pad(nav.index + 1)}</span>
            <span aria-hidden className="relative h-px w-7 bg-ink/35">
              <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
            </span>
            <span className="sr-only">sur</span>
            <span className="text-sm leading-none">{pad(nav.total)}</span>
          </span>
        </p>
      }
    >
      <m.main
        className="relative mx-auto max-w-[1100px] px-4 pb-24 pt-24 sm:px-8 sm:pt-28"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Ouverture */}
        <header className="legible">
          <m.p variants={fadeUp} className="label-spaced flex items-center gap-2.5 text-ink">
            <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
            Étude de cas · {project.context}
          </m.p>
          <m.h1
            variants={fadeUp}
            className="title-spaced mt-4 text-[clamp(1.75rem,7vw,3.75rem)] leading-tight text-ink [overflow-wrap:anywhere]"
          >
            {project.title}
          </m.h1>
          <m.p variants={fadeUp} className="mt-4 max-w-2xl text-pretty text-lg text-ink sm:text-xl">
            {project.summary}
          </m.p>
          {project.link && (
            <m.p variants={fadeUp} className="mt-6">
              <ExternalLink href={project.link} label={project.linkLabel} />
            </m.p>
          )}
        </header>

        {/* Fiche : quatre repères séparés par des filets */}
        <m.dl
          variants={fadeUp}
          className={`veil mt-8 grid grid-cols-2 gap-y-5 px-5 py-5 text-sm sm:px-7 lg:grid-cols-4 lg:divide-x lg:divide-ink/15 ${leaf()}`}
        >
          {[
            { Icon: ProfilIcon, label: "Rôle", value: project.role },
            { Icon: ClockIcon, label: "Durée", value: project.duration },
            { Icon: FormationIcon, label: "Année", value: String(project.year) },
            { Icon: OutilsIcon, label: "Outils", value: project.tools.join(" · ") },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 pr-3 lg:px-5 lg:first:pl-0">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/20 text-ink">
                <Icon size={18} />
              </span>
              <div>
                <dt className="label-spaced text-ink-soft">{label}</dt>
                <dd className="mt-1 text-ink">{value}</dd>
              </div>
            </div>
          ))}
        </m.dl>

        {/* L'image du projet, dans un cadre de verre à clé de voûte */}
        <m.figure variants={fadeUp} className={`veil relative mt-6 p-1.5 sm:p-2 ${leaf()}`}>
          <span aria-hidden className="absolute -top-[5px] left-1/2 z-10 size-2.5 -translate-x-1/2 rotate-45 bg-accent" />
          <div
            className={`relative overflow-hidden rounded-[2.1rem_0.5rem_2.1rem_0.5rem] ${project.cover ? "aspect-video" : "aspect-[16/7]"}`}
          >
            {project.cover ? (
              // eslint-disable-next-line @next/next/no-img-element -- fichiers statiques déjà optimisés (WebP)
              <img src={project.cover} alt={`Couverture du projet ${project.title}`} className="absolute inset-0 size-full object-cover" />
            ) : (
              <ProjectThumb project={project} index={nav.index} />
            )}
          </div>
        </m.figure>

        {/* Sommaire */}
        <m.nav variants={fadeUp} aria-label="Chapitres de l'étude de cas" className="mt-8 flex justify-center">
          <ol className="veil inline-flex flex-wrap justify-center gap-1 rounded-[1.5rem] p-1.5">
            {chapters.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="label-spaced inline-flex items-baseline gap-2 rounded-full px-3 py-1.5 text-ink transition hover:bg-ink/10"
                >
                  <span className="font-display text-sm tracking-[0.04em] text-[color-mix(in_srgb,var(--accent)_70%,var(--ink))]">
                    {c.numeral}
                  </span>
                  {c.title}
                </a>
              </li>
            ))}
          </ol>
        </m.nav>

        {/* L'enjeu : le problème et la réponse se font face */}
        <Chapter {...chapter.enjeu}>
          <div className="grid gap-5 lg:grid-cols-[1fr_5.5rem_1fr] lg:gap-0">
            <Face icon={RechercheIcon} title="Le problème">
              {project.problem}
            </Face>
            <m.div variants={fadeUp} aria-hidden className="flex items-center justify-center lg:flex-col">
              <span className="hidden w-px flex-1 bg-gradient-to-b from-transparent to-ink/25 lg:block" />
              <Ring className="my-1 lg:my-3">
                <ArrowRightIcon size={18} className="rotate-90 lg:rotate-0" />
              </Ring>
              <span className="hidden w-px flex-1 bg-gradient-to-t from-transparent to-ink/25 lg:block" />
            </m.div>
            <Face icon={ConceptionIcon} title="La réponse" mirrored>
              {project.solution}
            </Face>
          </div>
        </Chapter>

        {/* Démarche : les étapes posées sur un fil */}
        <Chapter {...chapter.demarche}>
          <Steps steps={project.process} />
        </Chapter>

        {/* L'univers graphique de la marque */}
        {project.universe && (
          <Chapter {...chapter.univers}>
            <Universe universe={project.universe} />
          </Chapter>
        )}

        {/* Le document (ou les écrans), feuilletable sans quitter le site */}
        {project.book && (
          <Chapter {...chapter.document}>
            <BookReader book={project.book} />
            {project.link && (
              <m.p variants={fadeUp} className="mt-8 flex justify-center">
                <ExternalLink href={project.link} label={project.linkLabel} />
              </m.p>
            )}
          </Chapter>
        )}

        {/* Résultats : de grands chiffres sur une seule plaque */}
        <Chapter {...chapter.resultats}>
          <m.ul
            variants={fadeUp}
            className={`veil grid gap-y-6 px-6 py-7 sm:grid-cols-3 sm:divide-x sm:divide-ink/15 sm:px-4 ${leaf()}`}
          >
            {project.outcomes.map((o) => (
              <li key={o.label} className="flex flex-col items-center text-center sm:px-4">
                <span className="font-display text-[clamp(2rem,5vw,3rem)] font-light leading-none tracking-wide text-ink">{o.value}</span>
                <span aria-hidden className="my-3 size-1.5 rotate-45 bg-accent" />
                <span className="text-sm text-ink">{o.label}</span>
              </li>
            ))}
          </m.ul>
        </Chapter>

        {/* Ce que j'en retiens : des phrases, pas des cartes */}
        <Chapter {...chapter.retenu}>
          <m.div variants={fadeUp} className={`veil mx-auto max-w-3xl px-6 py-8 text-center sm:px-10 sm:py-10 ${leaf()}`}>
            {project.learnings.map((l, i) => (
              <div key={l}>
                {i > 0 && <Hairline />}
                <p className="text-balance text-lg leading-relaxed text-ink sm:text-xl">{l}</p>
              </div>
            ))}
            <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-ink/15 pt-6" aria-label="Mots-clés">
              {project.tags.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-ink">
                  <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </m.div>
        </Chapter>

        {/* Études voisines : deux feuilles qui se font face */}
        <nav aria-label="Autres études de cas" className="mt-24 grid gap-4 sm:grid-cols-2">
          {[
            { p: nav.prev, label: "Projet précédent", dir: "prev" as const },
            { p: nav.next, label: "Projet suivant", dir: "next" as const },
          ].map(({ p, label, dir }) => (
            <Link
              key={dir}
              href={`/projets/${p.slug}`}
              className={`veil group flex items-center gap-4 p-3 transition hover:-translate-y-0.5 ${leaf(dir === "next")} ${dir === "next" ? "sm:flex-row-reverse sm:text-right" : ""}`}
            >
              <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-t-[999px] rounded-b-lg">
                <ProjectThumb project={p} index={p.index} frame="arch" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`label-spaced flex items-center gap-1 text-ink-soft ${dir === "next" ? "sm:justify-end" : ""}`}>
                  {dir === "prev" && <ChevronIcon size={14} className="rotate-180" />}
                  {label}
                  {dir === "next" && <ChevronIcon size={14} />}
                </span>
                <span className="title-spaced mt-1 block text-lg text-ink">{p.title}</span>
              </span>
            </Link>
          ))}
        </nav>
      </m.main>
    </PageScene>
  );
}

/** Lien vers le projet en ligne : pastille d'encre, la plus visible de la page */
function ExternalLink({ href, label = "Voir le projet" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-3 rounded-full bg-ink py-2.5 pl-5 pr-3 text-sm font-semibold text-sky-top shadow-lg shadow-ink/15 transition [text-shadow:none] hover:-translate-y-0.5"
    >
      {label}
      <span className="grid size-7 place-items-center rounded-full bg-sky-top/15 transition group-hover:rotate-45">
        <ArrowUpRightIcon size={14} />
      </span>
      <span className="sr-only">(nouvel onglet)</span>
    </a>
  );
}

/** Un des deux panneaux de l'enjeu */
function Face({
  icon: IconCmp,
  title,
  mirrored = false,
  children,
}: {
  icon: Icon;
  title: string;
  mirrored?: boolean;
  children: ReactNode;
}) {
  return (
    <m.article variants={fadeUp} className={`veil p-6 sm:p-8 ${leaf(mirrored)}`}>
      <h3 className={`flex items-center gap-3 ${mirrored ? "lg:flex-row-reverse lg:text-right" : ""}`}>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/20 text-ink">
          <IconCmp size={20} />
        </span>
        <span className="title-spaced text-lg text-ink">{title}</span>
      </h3>
      <p className="mt-4 text-pretty leading-relaxed text-ink">{children}</p>
    </m.article>
  );
}

/** Anneau ouvert (comme l'emblème), avec sa clé de voûte */
function Ring({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative grid size-12 shrink-0 place-items-center text-ink ${className}`}>
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <g className="emblem-spin-slow" style={{ transformOrigin: "24px 24px" }}>
          <circle
            cx="24"
            cy="24"
            r="23"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
            pathLength={100}
            strokeDasharray="86 14"
            opacity="0.7"
          />
          <path d="M24 -1 L26.2 1.6 L24 4.2 L21.8 1.6Z" fill="var(--accent)" />
        </g>
      </svg>
      {children}
    </span>
  );
}

/** La démarche : un fil horizontal (vertical sur mobile), une perle numérotée par étape */
function Steps({ steps }: { steps: Project["process"] }) {
  return (
    <m.div variants={fadeUp} className={`veil relative px-6 py-8 sm:px-8 lg:px-6 lg:py-9 ${leaf()}`}>
      {/* Le fil : vertical sur mobile, horizontal sur grand écran (du centre de la première perle à la dernière) */}
      <span
        aria-hidden
        className="absolute bottom-14 left-12 top-14 w-px sm:left-14 bg-gradient-to-b from-ink/30 via-accent/70 to-ink/30 lg:hidden"
      />
      <span
        aria-hidden
        className="absolute top-[3.75rem] hidden h-px bg-gradient-to-r from-ink/30 via-accent/70 to-ink/30 lg:block"
        style={{
          left: `calc(1.5rem + (100% - 3rem) * ${1 / (2 * steps.length)})`,
          right: `calc(1.5rem + (100% - 3rem) * ${1 / (2 * steps.length)})`,
        }}
      />
      <ol className="relative grid gap-8 lg:auto-cols-fr lg:grid-flow-col lg:gap-6">
        {steps.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 lg:grid-cols-1 lg:justify-items-center lg:text-center">
            <Ring>
              <span className="grid size-9 place-items-center rounded-full bg-ink font-display text-sky-top text-sm tabular-nums">
                {pad(i + 1)}
              </span>
            </Ring>
            <div className="pt-1 lg:pt-3">
              <h3 className="title-spaced text-base text-ink">{s.title}</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-ink">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </m.div>
  );
}
