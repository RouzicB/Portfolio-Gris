"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { m, type Variants } from "framer-motion";
import { pad } from "../../lib/journey";
import { projectCategories } from "../../data/projects";
import type { ProjectCard, ProjectCategory } from "../../types";
import { ArrowRightIcon, ChevronIcon, ConceptionIcon, InterfaceIcon, type Icon } from "../icons/GrisIcons";
import { WASH, fadeUp, group } from "../journey/motion";
import { ROMAN } from "../ui/Chapter";
import ProjectThumb from "../ui/ProjectThumb";
import SectionShell from "./SectionShell";

const MotionLink = m.create(Link);

/** Cartes visibles à la fois selon la largeur disponible */
const perPageFor = (width: number) => (width < 600 ? 1 : width < 940 ? 2 : 3);

/**
 * Arches de la galerie : un seul maillon de la cascade de la section, qui les fait entrer au même pas qu'elle (0,06 s).
 * Les arches des pages suivantes, masquées, ne retardent ainsi pas le reste de la section.
 */
const cascade: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

/** Ce que dit l'arche d'ouverture de chaque chapitre */
const CHAPTER_TEXT: Record<ProjectCategory, string> = {
  design: "Recherche, interfaces, identités et design systems : du problème de départ à l'écran.",
  dev: "Des applications que j'ai conçues et développées de bout en bout, en entreprise.",
};

/** Icône de chaque chapitre : les mêmes que les profils designer et développeur de la section Aptitudes */
const CHAPTER_ICON: Record<ProjectCategory, Icon> = { design: ConceptionIcon, dev: InterfaceIcon };

type Item =
  | { kind: "chapter"; key: string; cat: ProjectCategory; numeral: string; label: string; count: number }
  | { kind: "project"; key: string; cat: ProjectCategory; project: ProjectCard; number: number; thumb: number };

/**
 * 06 — Projets : une galerie d'arches en deux chapitres.
 * Chaque famille de projets (design & UX/UI, puis développement) s'ouvre sur une arche de chapitre — son chiffre romain,
 * son nom, ce qu'on y trouve — suivie de ses études de cas, chacune une arche de verre dépoli avec sa vignette et une pierre
 * de clé. Sous la galerie, une frise de losanges regroupés par chapitre montre les deux familles d'un coup d'œil ; le nom
 * d'un chapitre y mène directement. Flèches, glissement au doigt ou geste horizontal du trackpad pour parcourir le reste.
 */
export default function Projets({ cards }: { cards: ProjectCard[] }) {
  let thumb = 0;
  const items: Item[] = projectCategories.flatMap(({ id, label }, c) => {
    const list = cards.filter((p) => p.category === id);
    if (!list.length) return [];
    return [
      { kind: "chapter" as const, key: `chapitre-${id}`, cat: id, numeral: ROMAN[c], label, count: list.length },
      ...list.map((p, i) => ({ kind: "project" as const, key: p.slug, cat: id, project: p, number: i + 1, thumb: thumb++ })),
    ];
  });

  return (
    <SectionShell index={5}>
      <Gallery items={items} />
    </SectionShell>
  );
}

function Gallery({ items }: { items: Item[] }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const [perPage, setPerPage] = useState(3);
  const [page, setPage] = useState(0);
  const pages = Math.ceil(items.length / perPage);
  const current = Math.max(0, Math.min(page, pages - 1));
  // Gardé à jour pour les gestes (écouteurs posés une seule fois)
  const nav = useRef({ current, pages });
  useEffect(() => {
    nav.current = { current, pages };
  });
  const step = (d: number) => setPage(Math.max(0, Math.min(nav.current.pages - 1, nav.current.current + d)));
  const first = current * perPage;
  const last = Math.min(first + perPage, items.length);

  // Chapitre de chaque page (celui de sa première arche) ; la frise les regroupe
  const pageCat = (k: number) => items[k * perPage].cat;
  const chapters = projectCategories
    .map((c, n) => ({ ...c, numeral: ROMAN[n], pages: Array.from({ length: pages }, (_, k) => k).filter((k) => pageCat(k) === c.id) }))
    .filter((c) => c.pages.length);
  const here = chapters.find((c) => c.id === pageCat(current));

  // Largeur du cadre → nombre d'arches visibles
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth > 0) setPerPage(perPageFor(el.clientWidth));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = (p: number) => setPage(Math.max(0, Math.min(pages - 1, p)));

  // Glissement au doigt et geste horizontal du trackpad (le voyage vertical les ignore)
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    let x0 = 0;
    let y0 = 0;
    let sum = 0;
    let last = 0;
    let used = false;
    const start = (e: TouchEvent) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const end = (e: TouchEvent) => {
      const dx = x0 - e.changedTouches[0].clientX;
      const dy = y0 - e.changedTouches[0].clientY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx > 0 ? 1 : -1);
    };
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - last > 200) {
        sum = 0;
        used = false;
      }
      last = now;
      sum += e.deltaX;
      if (used || Math.abs(sum) < 30) return;
      used = true;
      step(sum > 0 ? 1 : -1);
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
      el.removeEventListener("wheel", wheel);
    };
  }, []);

  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label="Galerie des études de cas"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(current + 1);
        else if (e.key === "ArrowLeft") go(current - 1);
      }}
    >
      {/* Marge haute assez grande pour la pierre de clé et le soulèvement au survol (sinon rognés par le cadre),
          reprise par une marge négative : la mise en page ne bouge pas */}
      <m.div ref={viewRef} variants={cascade} className="-mx-3 -mt-6 overflow-hidden px-3 pb-6 pt-8 short:pb-3">
        {/* `translate` et non `transform` : seule la première est animée (globals.css réserve `transform` à Framer) */}
        <ul
          className="flex transition-[translate] duration-700 motion-reduce:transition-none"
          style={{
            translate: `calc(${-current * 100}% - ${current} * var(--gap)) 0`,
            transitionTimingFunction: `cubic-bezier(${WASH.join(",")})`,
            ["--gap" as string]: "1.25rem",
            gap: "var(--gap)",
          }}
        >
          {items.map((item, i) => {
            const visible = i >= first && i < last;
            return (
              <li
                key={item.key}
                // Changement de page : les arches qui partent s'effacent, celles qui arrivent montent l'une après l'autre
                className="shrink-0 transition-[opacity,translate] ease-out motion-reduce:transition-none"
                style={{
                  width: `calc((100% - ${perPage - 1} * var(--gap)) / ${perPage})`,
                  opacity: visible ? 1 : 0,
                  translate: visible ? "0 0" : "0 14px",
                  transitionDuration: visible ? "650ms" : "300ms",
                  transitionDelay: visible ? `${120 + (i - first) * 90}ms` : "0ms",
                }}
                inert={!visible}
                aria-hidden={!visible}
              >
                {item.kind === "chapter" ? <ChapterArch item={item} /> : <ArchCard item={item} />}
              </li>
            );
          })}
        </ul>
      </m.div>

      {/* Frise : le chapitre en cours, les losanges des pages regroupés par chapitre, les flèches */}
      <m.div variants={group} className="flex items-center justify-between gap-4">
        {/* Chapitre en cours, en toutes lettres là où la frise est masquée (téléphone) ; ailleurs, la frise le dit déjà */}
        <m.p variants={fadeUp} className="label-spaced legible min-w-0 truncate text-ink md:invisible" aria-live="polite">
          {here && <ChapterIcon cat={here.id} className="mr-2 inline align-[-3px]" />}
          <span className="text-ink-soft">{here?.numeral} · </span>
          {here?.label}
        </m.p>
        <div className="flex items-center gap-2">
          <m.button
            variants={fadeUp}
            type="button"
            onClick={() => go(current - 1)}
            disabled={current === 0}
            aria-label="Projets précédents"
            className="veil grid size-10 shrink-0 place-items-center rounded-full text-ink transition hover:-translate-x-0.5 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronIcon size={18} className="rotate-180" />
          </m.button>
          <m.ol variants={fadeUp} className="flex items-center gap-3 max-md:hidden" aria-label="Chapitres et pages">
            {chapters.map((c, n) => (
              <Fragment key={c.id}>
                {/* Entre deux chapitres : une petite arche et sa pierre de clé, comme celles de la galerie */}
                {n > 0 && (
                  <li aria-hidden className="flex items-center gap-1.5 px-1">
                    <span className="h-px w-3 bg-gradient-to-r from-transparent to-ink/40" />
                    <svg viewBox="0 0 16 20" className="h-5 w-4 overflow-visible text-ink/55">
                      <path d="M2 19.5V9a6 6 0 0 1 12 0v10.5" fill="none" stroke="currentColor" strokeWidth="1" />
                      <path d="M5 19.5V9.5a3 3 0 0 1 6 0v10" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
                      <path d="M8 0.6 10 2.6 8 4.6 6 2.6Z" className="fill-accent" />
                    </svg>
                    <span className="h-px w-3 bg-gradient-to-l from-transparent to-ink/40" />
                  </li>
                )}
                <li className="flex items-center gap-1">
                  {/* Icône et nom du chapitre : y mènent directement */}
                  <button
                    type="button"
                    onClick={() => go(c.pages[0])}
                    aria-current={here?.id === c.id ? "true" : undefined}
                    className={`label-spaced mr-1 inline-flex items-center gap-2 whitespace-nowrap transition hover:text-ink ${here?.id === c.id ? "text-ink" : "text-ink-soft"}`}
                  >
                    <ChapterIcon cat={c.id} />
                    {c.label}
                  </button>
                  {c.pages.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => go(k)}
                      aria-label={`Page ${k + 1} sur ${pages}`}
                      aria-current={k === current ? "page" : undefined}
                      className="grid size-6 place-items-center"
                    >
                      <span
                        className={`block size-2.5 rotate-45 border border-ink transition duration-500 ${k === current ? "scale-110 bg-ink" : "bg-transparent"}`}
                      />
                    </button>
                  ))}
                </li>
              </Fragment>
            ))}
          </m.ol>
          <m.button
            variants={fadeUp}
            type="button"
            onClick={() => go(current + 1)}
            disabled={current === pages - 1}
            aria-label="Projets suivants"
            className="veil grid size-10 shrink-0 place-items-center rounded-full text-ink transition hover:translate-x-0.5 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronIcon size={18} />
          </m.button>
        </div>
      </m.div>
    </div>
  );
}

/** Icône d'un chapitre, à la taille d'un libellé */
function ChapterIcon({ cat, className = "" }: { cat: ProjectCategory; className?: string }) {
  const I = CHAPTER_ICON[cat];
  return <I size={15} aria-hidden className={`shrink-0 ${className}`} />;
}

/** Coque commune d'une arche : verre dépoli, pierre de clé au sommet */
const ARCH = "veil group relative flex h-full flex-col rounded-b-3xl arch p-2.5 text-left";
const Keystone = () => (
  <span aria-hidden className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent shadow-[0_0_12px_var(--accent)]" />
);

/**
 * Arche d'ouverture d'un chapitre : pas de vignette, mais une fenêtre gravée d'arches concentriques autour du chiffre
 * romain, puis le nom du chapitre, ce qu'on y trouve et le nombre d'études
 */
function ChapterArch({ item }: { item: Extract<Item, { kind: "chapter" }> }) {
  return (
    <m.div variants={fadeUp} className={ARCH}>
      <span className="relative block aspect-[5/4] overflow-hidden rounded-b-2xl arch bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] short:aspect-[2/1]">
        {/* Arches concentriques, comme une voûte vue de face */}
        {[0, 1, 2, 3].map((k) => (
          <span
            key={k}
            aria-hidden
            className="absolute rounded-b-xl arch border border-ink/15"
            style={{ inset: `${0.5 + k * 1.1}rem ${0.5 + k * 1.1}rem -1rem` }}
          />
        ))}
        {/* Le chiffre seul au centre de la fenêtre (l'espacement des lettres compensé à gauche, sinon il penche à gauche) ;
            le filet et son losange, posés dessous, ne le décentrent pas */}
        <span className="absolute inset-0 grid place-items-center">
          <span className="relative">
            <span className="block pl-[0.12em] font-display text-[clamp(3rem,6vw,4.5rem)] font-light leading-none tracking-[0.12em] text-ink short:text-5xl">
              {item.numeral}
            </span>
            <span aria-hidden className="absolute left-1/2 top-full mt-4 flex -translate-x-1/2 items-center gap-2 short:mt-2">
              <span className="h-px w-8 bg-ink/30" />
              <span className="size-2 rotate-45 bg-accent" />
              <span className="h-px w-8 bg-ink/30" />
            </span>
          </span>
        </span>
      </span>
      <Keystone />
      <span className="flex flex-1 flex-col px-3 pb-3 pt-4 text-center short:pb-2 short:pt-3">
        <span className="label-spaced inline-flex items-center justify-center gap-2 pl-[0.28em] text-ink-soft">
          <ChapterIcon cat={item.cat} />
          Chapitre {item.numeral}
        </span>
        <span className="title-spaced mt-2 pl-[0.32em] text-xl text-ink">{item.label}</span>
        <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink short:line-clamp-1">{CHAPTER_TEXT[item.cat]}</span>
        <span className="mt-auto flex items-center justify-center gap-3 pt-4 text-xs text-ink-soft short:pt-2">
          <span className="h-px w-6 bg-ink/30" aria-hidden />
          <span className="tabular-nums">
            {pad(item.count)} {item.count > 1 ? "études de cas" : "étude de cas"}
          </span>
          <span className="h-px w-6 bg-ink/30" aria-hidden />
        </span>
      </span>
    </m.div>
  );
}

/** Une étude de cas : la vignette peinte dans la fenêtre de l'arche */
function ArchCard({ item }: { item: Extract<Item, { kind: "project" }> }) {
  const p = item.project;
  return (
    <MotionLink
      href={`/projets/${p.slug}`}
      variants={fadeUp}
      className={`${ARCH} transition-[translate,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10`}
    >
      {/* Fenêtre de l'arche */}
      <span className="relative block aspect-[5/4] overflow-hidden rounded-b-2xl arch short:aspect-[2/1]">
        <span className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
          <ProjectThumb project={p} index={item.thumb} frame="arch" />
        </span>
        {/* Moulure intérieure */}
        <span aria-hidden className="absolute inset-2 rounded-b-xl arch border border-white/50" />
      </span>
      <Keystone />

      <span className="flex flex-1 flex-col px-3 pb-3 pt-4 text-center short:pb-2 short:pt-3">
        {/* Espacement des lettres compensé à gauche : le numéro et l'année restent au centre de l'arche */}
        <span className="label-spaced pl-[0.28em] tabular-nums text-ink-soft">
          <span className="text-ink">{pad(item.number)}</span> · {p.year}
        </span>
        <span className="title-spaced mt-2 pl-[0.32em] text-xl text-ink">{p.title}</span>
        <span className="mt-1 text-xs text-ink-soft">{p.context}</span>
        <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink short:line-clamp-1">{p.summary}</span>
        <span className="mt-auto flex items-center justify-center gap-3 pt-4 short:pt-2">
          <span className="h-px w-6 bg-ink/30" aria-hidden />
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
            Étude de cas
            <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
          <span className="h-px w-6 bg-ink/30" aria-hidden />
        </span>
      </span>
    </MotionLink>
  );
}
