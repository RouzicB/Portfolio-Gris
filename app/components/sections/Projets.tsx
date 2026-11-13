"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "../../data/projects";
import { pad } from "../../lib/journey";
import { ArrowRightIcon, ChevronIcon } from "../icons/GrisIcons";
import { WASH, fadeUp, group } from "../journey/motion";
import ProjectThumb from "../ui/ProjectThumb";
import SectionShell from "./SectionShell";

const MotionLink = motion.create(Link);

/** Cartes visibles à la fois selon la largeur disponible */
const perPageFor = (width: number) => (width < 600 ? 1 : width < 940 ? 2 : 3);

/**
 * 06 — Projets : une galerie d'arches.
 * Chaque projet est une arche de verre dépoli (l'architecture des décors), sa vignette peinte dans la fenêtre
 * et une pierre de clé au sommet. Une à trois arches visibles selon la largeur ; flèches, pagination en losanges,
 * glissement au doigt ou geste horizontal du trackpad pour parcourir le reste.
 */
export default function Projets() {
  const viewRef = useRef<HTMLDivElement>(null);
  const [perPage, setPerPage] = useState(3);
  const [page, setPage] = useState(0);
  const pages = Math.ceil(projects.length / perPage);
  const current = Math.max(0, Math.min(page, pages - 1));
  // Gardé à jour pour les gestes (écouteurs posés une seule fois)
  const nav = useRef({ current, pages });
  useEffect(() => {
    nav.current = { current, pages };
  });
  const step = (d: number) => setPage(Math.max(0, Math.min(nav.current.pages - 1, nav.current.current + d)));
  const first = current * perPage;
  const last = Math.min(first + perPage, projects.length);

  // Largeur du cadre → nombre d'arches visibles
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setPerPage(perPageFor(el.clientWidth)));
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
    <SectionShell index={5}>
      <div
        role="region"
        aria-roledescription="carrousel"
        aria-label="Galerie des études de cas"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(current + 1);
          else if (e.key === "ArrowLeft") go(current - 1);
        }}
      >
        <div ref={viewRef} className="-mx-3 overflow-hidden px-3 pb-6 pt-2 short:pb-3">
          <ul
            className="flex transition-transform duration-700"
            style={{
              transform: `translateX(calc(${-current * 100}% - ${current} * var(--gap)))`,
              transitionTimingFunction: `cubic-bezier(${WASH.join(",")})`,
              ["--gap" as string]: "1.25rem",
              gap: "var(--gap)",
            }}
          >
            {projects.map((p, i) => {
              const visible = i >= first && i < last;
              return (
                <li
                  key={p.slug}
                  className="shrink-0"
                  style={{ width: `calc((100% - ${perPage - 1} * var(--gap)) / ${perPage})` }}
                  inert={!visible}
                  aria-hidden={!visible}
                >
                  <ArchCard index={i} />
                </li>
              );
            })}
          </ul>
        </div>

        {/* Pagination : flèches, losanges, compteur */}
        <motion.div variants={group} className="flex items-center justify-between gap-4">
          <motion.p variants={fadeUp} className="label-spaced legible whitespace-nowrap tabular-nums text-ink" aria-live="polite">
            {pad(first + 1)}
            {last - first > 1 && <> — {pad(last)}</>} <span className="text-ink-soft">/ {pad(projects.length)}</span>
          </motion.p>
          <div className="flex items-center gap-2">
            <motion.button
              variants={fadeUp}
              type="button"
              onClick={() => go(current - 1)}
              disabled={current === 0}
              aria-label="Projets précédents"
              className="veil grid size-10 place-items-center rounded-full text-ink transition hover:-translate-x-0.5 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronIcon size={18} className="rotate-180" />
            </motion.button>
            <motion.ol variants={fadeUp} className="flex items-center gap-1" aria-label="Pages">
              {Array.from({ length: pages }, (_, k) => (
                <li key={k}>
                  <button
                    type="button"
                    onClick={() => go(k)}
                    aria-label={`Page ${k + 1} sur ${pages}`}
                    aria-current={k === current ? "page" : undefined}
                    className="grid size-6 place-items-center"
                  >
                    <span
                      className={`block size-2.5 rotate-45 border border-ink transition duration-500 ${
                        k === current ? "scale-110 bg-ink" : "bg-transparent"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </motion.ol>
            <motion.button
              variants={fadeUp}
              type="button"
              onClick={() => go(current + 1)}
              disabled={current === pages - 1}
              aria-label="Projets suivants"
              className="veil grid size-10 place-items-center rounded-full text-ink transition hover:translate-x-0.5 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronIcon size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

/** Une arche de verre : la vignette peinte dans la fenêtre, une pierre de clé au sommet */
function ArchCard({ index }: { index: number }) {
  const p = projects[index];
  return (
    <MotionLink
      href={`/projets/${p.slug}`}
      variants={fadeUp}
      className="veil group relative flex h-full flex-col rounded-b-3xl rounded-t-[999px] p-2.5 text-left transition-[translate,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
    >
      {/* Fenêtre de l'arche */}
      <span className="relative block aspect-[5/4] overflow-hidden rounded-b-2xl rounded-t-[999px] short:aspect-[2/1]">
        <span className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
          <ProjectThumb project={p} index={index} />
        </span>
        {/* Moulure intérieure */}
        <span aria-hidden className="absolute inset-2 rounded-b-xl rounded-t-[999px] border border-white/50" />
      </span>
      {/* Pierre de clé */}
      <span aria-hidden className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent shadow-[0_0_12px_var(--accent)]" />

      <span className="flex flex-1 flex-col px-3 pb-3 pt-4 text-center short:pb-2 short:pt-3">
        <span className="label-spaced tabular-nums text-ink-soft">
          <span className="text-ink">{pad(index + 1)}</span> · {p.year}
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
