"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { credits } from "../../data/site";
import { CreditsIcon } from "../icons/GrisIcons";

/**
 * Lien discret vers la page Crédits, sur toutes les pages sauf les crédits.
 * Un petit emblème : pastille de verre et pinceau, cerclés d'un anneau ouvert (ensō) qui tourne lentement
 * avec sa pierre de clé ; à côté, un trait fin et le libellé espacé, qui s'allongent au survol.
 * Sur mobile, l'emblème seul (la navigation occupe le bas de l'écran sur l'accueil : il remonte en haut à gauche).
 */
export default function CreditsLink() {
  const pathname = usePathname();
  if (pathname === "/credits") return null;
  return (
    <Link
      href="/credits"
      aria-label={`Crédits — ${credits.short}`}
      className={`group fixed left-3 z-40 flex items-center gap-2.5 text-ink sm:left-5 ${
        pathname === "/" ? "top-3 md:top-auto md:bottom-4" : "bottom-3 sm:bottom-4"
      }`}
    >
      <span className="relative grid size-12 shrink-0 place-items-center">
        {/* Anneau ouvert et sa pierre de clé, en rotation lente */}
        <svg viewBox="0 0 48 48" className="absolute inset-0 size-full overflow-visible" aria-hidden focusable="false">
          <g className="emblem-spin-slow" style={{ transformOrigin: "24px 24px" }}>
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="88 12"
              className="opacity-45 transition-opacity duration-500 group-hover:opacity-90"
            />
            <path d="M24 -0.6 L26 2 L24 4.6 L22 2Z" fill="var(--accent)" />
          </g>
        </svg>
        <span className="veil grid size-9 place-items-center rounded-full transition duration-500 group-hover:scale-105">
          <CreditsIcon size={18} />
        </span>
      </span>

      {/* Le libellé sur une pastille de verre : lisible sur tous les décors (rochers rouges, falaises sombres…) */}
      <span className="veil hidden items-center gap-2.5 rounded-full py-1.5 pl-3 pr-4 sm:flex">
        <span aria-hidden className="h-px w-4 bg-current opacity-50 transition-all duration-500 group-hover:w-8" />
        <span className="label-spaced">Crédits</span>
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-xs text-ink transition-all duration-700 group-hover:max-w-96 lg:inline">
          {credits.short}
        </span>
      </span>
    </Link>
  );
}
