"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { credits } from "../../data/site";
import { CreditsIcon } from "../icons/GrisIcons";

/**
 * Lien discret vers la page Crédits, en bas à gauche de l'écran, sur toutes les pages sauf les crédits.
 * Sur mobile, l'icône seule (la navigation occupe le centre du bas de l'écran).
 */
export default function CreditsLink() {
  const pathname = usePathname();
  if (pathname === "/credits") return null;
  return (
    <Link
      href="/credits"
      aria-label={`Crédits — ${credits.short}`}
      className={`veil group fixed left-4 z-40 flex items-center gap-2 rounded-full p-2.5 text-ink-soft transition hover:text-ink sm:left-6 sm:px-3 sm:py-1.5 ${
        // Sur l'accueil mobile, la navigation par icônes occupe le bas de l'écran : le lien remonte en haut à gauche
        pathname === "/" ? "top-4 md:top-auto md:bottom-5" : "bottom-4 sm:bottom-5"
      }`}
    >
      <CreditsIcon size={18} />
      <span className="label-spaced hidden sm:inline">Crédits</span>
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-xs transition-all duration-500 group-hover:max-w-80 lg:inline">
        · {credits.short}
      </span>
    </Link>
  );
}
