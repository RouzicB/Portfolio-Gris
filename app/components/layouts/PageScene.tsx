"use client";

import { useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { useMotionValue } from "framer-motion";
import type { StageId } from "../../types";
import { palettes, stageSuns } from "../../data/palettes";
import { site } from "../../data/site";
import { paletteToVars } from "../../lib/journey";
import Landscape from "../background/Landscape";
import { ChevronIcon } from "../icons/GrisIcons";

/**
 * Gabarit des pages hors accueil (études de cas, crédits) :
 * décor immobile dans l'ambiance choisie, barre haute avec retour, contenu qui se lit de haut en bas.
 */
export default function PageScene({
  stage,
  back,
  aside,
  children,
}: {
  stage: StageId;
  back: { href: string; label: string };
  aside?: ReactNode;
  children: ReactNode;
}) {
  const vars = useMemo(() => paletteToVars(palettes[stage]), [stage]);
  const still = useMotionValue(0);
  const stages = useMemo(() => [stage], [stage]);
  const suns = useMemo(() => [stageSuns[stage]], [stage]);

  // <html> prend aussi l'ambiance (fond hors page, barre d'adresse mobile)
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [vars]);

  return (
    <div style={vars as CSSProperties} className="relative min-h-svh text-ink">
      <Landscape progress={still} stages={stages} suns={suns} />

      <header className="fixed inset-x-0 top-0 z-40">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28"
          style={{ background: "linear-gradient(180deg, var(--sky-top) 0%, var(--sky-top) 55%, transparent 100%)" }}
          aria-hidden
        />
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:h-20 sm:px-8">
          <Link href={back.href} className="flex flex-1 items-center gap-2 text-sm font-semibold text-ink">
            <ChevronIcon size={18} className="rotate-180" />
            {back.label}
          </Link>
          <Link href="/" className="title-spaced hidden pl-[0.32em] text-lg text-ink sm:block sm:text-xl" aria-label={`${site.name} — accueil`}>
            {site.logo}
          </Link>
          <div className="flex flex-1 items-center justify-end gap-2 text-xs tabular-nums text-ink-soft">{aside}</div>
        </div>
        <div className="mx-4 h-px bg-ink/15 sm:mx-8" aria-hidden />
      </header>

      {children}
    </div>
  );
}
