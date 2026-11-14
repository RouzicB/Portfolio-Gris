"use client";

import { useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { useMotionValue } from "framer-motion";
import type { SceneTheme, StageId } from "../../types";
import { palettes, stageSuns } from "../../data/palettes";
import { paletteToVars } from "../../lib/journey";
import Landscape from "../background/Landscape";
import { ArrowRightIcon } from "../icons/GrisIcons";

/**
 * Gabarit des pages hors accueil (études de cas, crédits) :
 * décor immobile dans l'ambiance choisie, pastille de retour flottante, contenu qui se lit de haut en bas.
 */
export default function PageScene({
  stage,
  back,
  aside,
  theme,
  children,
}: {
  stage: StageId;
  back: { href: string; label: string };
  aside?: ReactNode;
  /** Couleurs propres à la page (étude de cas) : remplacent celles de l'ambiance */
  theme?: SceneTheme;
  children: ReactNode;
}) {
  const vars = useMemo(() => paletteToVars({ ...palettes[stage], ...theme?.palette }), [stage, theme]);
  const still = useMotionValue(0);
  const stages = useMemo(() => [stage], [stage]);
  // Page qui défile : le texte passe partout, l'astre se range donc dans le coin haut, plus petit
  const suns = useMemo(() => [{ x: 92, y: 10, size: Math.min(stageSuns[stage].size, 180) }], [stage]);

  // <html> prend aussi l'ambiance (fond hors page, barre d'adresse mobile)
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [vars]);

  return (
    <div style={vars as CSSProperties} className="relative min-h-svh text-ink">
      <Landscape progress={still} stages={stages} suns={suns} />
      {/* Reteinte du décor aux couleurs du projet : même plan que le décor, peinte par-dessus */}
      {theme?.tint && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{ background: theme.tint, mixBlendMode: "color", opacity: theme.tintOpacity ?? 0.5 }}
        />
      )}

      {/* Pas de barre : une pastille de retour flottante, et un repère discret à droite */}
      <nav aria-label="Navigation de la page" className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between p-4 sm:p-6">
        {/* Retour : une pastille de verre, une flèche fine qui recule au survol, un filet, le libellé espacé des titres */}
        <Link
          href={back.href}
          className="veil group pointer-events-auto inline-flex h-10 items-center gap-3 rounded-full pl-4 pr-5 text-ink transition hover:border-ink/25"
        >
          <ArrowRightIcon size={16} className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
          <span aria-hidden className="h-4 w-px bg-ink/25" />
          <span className="label-spaced">{back.label}</span>
        </Link>
        {aside && (
          <div className="veil pointer-events-auto inline-flex h-10 items-center gap-3 rounded-full px-5 text-ink">
            {aside}
          </div>
        )}
      </nav>

      {children}
    </div>
  );
}
