"use client";

import { useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { useMotionValue } from "framer-motion";
import type { StageId } from "../../types";
import { palettes, stageSuns } from "../../data/palettes";
import { paletteToVars } from "../../lib/journey";
import Landscape from "../background/Landscape";
import { ChevronIcon } from "../icons/GrisIcons";

/**
 * Gabarit des pages hors accueil (études de cas, crédits) :
 * décor immobile dans l'ambiance choisie, pastille de retour flottante, contenu qui se lit de haut en bas.
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

      {/* Pas de barre : une pastille de retour flottante, et un repère discret à droite */}
      <nav aria-label="Navigation de la page" className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between p-4 sm:p-6">
        <Link
          href={back.href}
          className="veil pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-ink transition hover:-translate-x-0.5"
        >
          <ChevronIcon size={16} className="rotate-180" />
          {back.label}
        </Link>
        {aside && (
          <div className="veil pointer-events-auto inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs tabular-nums text-ink-soft">
            {aside}
          </div>
        )}
      </nav>

      {children}
    </div>
  );
}
