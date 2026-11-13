"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "../../data/projects";
import { ArrowRightIcon } from "../icons/GrisIcons";
import { fadeUp } from "../journey/motion";
import ProjectThumb from "../ui/ProjectThumb";
import SectionShell from "./SectionShell";

/** 06 — Projets : quatre cartes, chacune mène à la page de son étude de cas. */
export default function Projets() {
  return (
    <SectionShell index={5}>
      <ul className="grid gap-4 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.li key={p.slug} variants={fadeUp}>
            <Link
              href={`/projets/${p.slug}`}
              className="veil group flex h-full w-full flex-col overflow-hidden rounded-2xl text-left transition duration-500 hover:-translate-y-1 hover:shadow-xl sm:flex-row"
            >
              <div className="relative aspect-[16/7] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-2/5">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                  <ProjectThumb project={p} index={i} />
                </div>
              </div>
              <div className="flex min-w-0 flex-col p-4 sm:p-5">
                <p className="label-spaced text-ink-soft">
                  {p.context} · {p.year}
                </p>
                <h3 className="title-spaced mt-2 text-xl text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink">{p.summary}</p>
                <p className="mt-auto flex flex-wrap gap-1.5 pt-3">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-ink/20 px-2 py-0.5 text-[11px] text-ink-soft">
                      {t}
                    </span>
                  ))}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                  Lire l&apos;étude de cas
                  <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </SectionShell>
  );
}
