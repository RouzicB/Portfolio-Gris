"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { adjacentProjects, projects } from "../../data/projects";
import { pad } from "../../lib/journey";
import PageScene from "../layouts/PageScene";
import {
  ChevronIcon,
  ClockIcon,
  ConceptionIcon,
  FormationIcon,
  MethodeIcon,
  OutilsIcon,
  ProfilIcon,
  ProjetsIcon,
  RechercheIcon,
  AptitudesIcon,
  type Icon,
} from "../icons/GrisIcons";
import { fadeUp, group, stagger } from "../journey/motion";
import ProjectThumb from "../ui/ProjectThumb";

/**
 * Étude de cas sur sa propre page.
 * Le décor reprend l'ambiance du projet, immobile ; le contenu se lit de haut en bas.
 */
export default function ProjectCase({ slug }: { slug: string }) {
  const nav = adjacentProjects(slug)!;
  const project = projects[nav.index];

  return (
    <PageScene
      stage={project.stage}
      back={{ href: "/#section-projets", label: "Projets" }}
      aside={
        <>
          <ProjetsIcon size={18} className="text-ink" />
          {pad(nav.index + 1)} / {pad(projects.length)}
        </>
      }
    >

      <motion.main
        className="relative mx-auto max-w-[1100px] px-4 pb-24 pt-24 sm:px-8 sm:pt-28"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* En-tête */}
        <motion.p variants={fadeUp} className="label-spaced legible flex items-center gap-2 text-ink">
          <ProjetsIcon size={18} className="text-ink" />
          Étude de cas · {project.context}
        </motion.p>
        <motion.h1 variants={fadeUp} className="title-spaced legible mt-4 text-[clamp(1.75rem,7vw,3.75rem)] leading-tight [overflow-wrap:anywhere]">
          {project.title}
        </motion.h1>
        <motion.p variants={fadeUp} className="legible mt-4 max-w-2xl text-lg sm:text-xl">
          {project.summary}
        </motion.p>

        <motion.dl variants={fadeUp} className="veil mt-8 grid grid-cols-2 gap-5 rounded-2xl p-5 text-sm sm:grid-cols-4">
          {[
            { Icon: ProfilIcon, label: "Rôle", value: project.role },
            { Icon: ClockIcon, label: "Durée", value: project.duration },
            { Icon: FormationIcon, label: "Année", value: String(project.year) },
            { Icon: OutilsIcon, label: "Outils", value: project.tools.join(" · ") },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex items-start gap-2.5">
              <Icon size={20} className="mt-0.5 shrink-0" />
              <div>
                <dt className="label-spaced text-ink-soft">{label}</dt>
                <dd className="mt-1">{value}</dd>
              </div>
            </div>
          ))}
        </motion.dl>

        <motion.div variants={fadeUp} className="relative mt-6 aspect-[16/7] overflow-hidden rounded-3xl shadow-xl shadow-ink/10">
          <ProjectThumb project={project} index={nav.index} />
        </motion.div>

        {/* Problème / réponse */}
        <Block>
          <div className="grid gap-4 md:grid-cols-2">
            <Card icon={RechercheIcon} title="Le problème">
              {project.problem}
            </Card>
            <Card icon={ConceptionIcon} title="La réponse">
              {project.solution}
            </Card>
          </div>
        </Block>

        {/* Démarche */}
        <Block icon={MethodeIcon} title="Démarche">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {project.process.map((step, i) => (
              <motion.li key={step.title} variants={fadeUp} className="veil rounded-2xl p-5">
                <span className="font-display text-2xl font-light tracking-wider text-accent">{pad(i + 1)}</span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </motion.li>
            ))}
          </ol>
        </Block>

        {/* Résultats */}
        <Block icon={AptitudesIcon} title="Résultats">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {project.outcomes.map((o) => (
              <motion.li key={o.label} variants={fadeUp} className="veil rounded-2xl p-5">
                <p className="font-display text-3xl font-light tracking-wide text-accent">{o.value}</p>
                <p className="mt-1 text-sm text-ink-soft">{o.label}</p>
              </motion.li>
            ))}
          </ul>
        </Block>

        {/* Enseignements */}
        <Block icon={ProfilIcon} title="Ce que j'en retiens">
          <motion.ul variants={fadeUp} className="veil space-y-3 rounded-2xl p-6">
            {project.learnings.map((l) => (
              <li key={l} className="flex gap-3 leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {l}
              </li>
            ))}
          </motion.ul>
          <motion.ul variants={fadeUp} className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full border border-ink/20 px-2.5 py-0.5 text-xs text-ink-soft">
                {t}
              </li>
            ))}
          </motion.ul>
        </Block>

        {/* Navigation entre études de cas */}
        <nav aria-label="Autres études de cas" className="mt-20 grid gap-4 sm:grid-cols-2">
          {[
            { p: nav.prev, label: "Projet précédent", dir: "prev" as const },
            { p: nav.next, label: "Projet suivant", dir: "next" as const },
          ].map(({ p, label, dir }) => (
            <Link
              key={dir}
              href={`/projets/${p.slug}`}
              className={`veil group flex items-center gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5 ${dir === "next" ? "sm:flex-row-reverse sm:text-right" : ""}`}
            >
              <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                <ProjectThumb project={p} index={projects.indexOf(p)} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`label-spaced flex items-center gap-1 text-ink-soft ${dir === "next" ? "sm:justify-end" : ""}`}>
                  {dir === "prev" && <ChevronIcon size={14} className="rotate-180" />}
                  {label}
                  {dir === "next" && <ChevronIcon size={14} />}
                </span>
                <span className="title-spaced mt-1 block text-lg">{p.title}</span>
              </span>
            </Link>
          ))}
        </nav>
      </motion.main>
    </PageScene>
  );
}

function Block({ icon: IconCmp, title, children }: { icon?: Icon; title?: string; children: ReactNode }) {
  return (
    <motion.section
      className="mt-16"
      variants={group}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {title && (
        <motion.h2 variants={fadeUp} className="label-spaced legible mb-5 flex items-center gap-2 text-ink">
          {IconCmp && <IconCmp size={18} className="text-ink" />}
          {title}
        </motion.h2>
      )}
      {children}
    </motion.section>
  );
}

function Card({ icon: IconCmp, title, children }: { icon: Icon; title: string; children: ReactNode }) {
  return (
    <motion.article variants={fadeUp} className="veil rounded-2xl p-6">
      <h2 className="label-spaced flex items-center gap-2 text-ink-soft">
        <IconCmp size={18} className="text-ink" />
        {title}
      </h2>
      <p className="mt-3 leading-relaxed">{children}</p>
    </motion.article>
  );
}
