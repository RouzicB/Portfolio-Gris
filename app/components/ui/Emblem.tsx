import type { ReactNode } from "react";

/**
 * L'emblème du site, en anneaux concentriques :
 * - un anneau épais doublé d'un anneau fin autour du nom,
 * - un anneau pointillé qui tourne lentement,
 * - un anneau qui porte une petite planète cerclée (en orbite),
 * - de grands anneaux très fins, légèrement décentrés, et une planète grise auréolée (en orbite inverse).
 * Les anneaux se tracent l'un après l'autre. Le contenu (nom) se place au centre, par-dessus.
 * Utilisé à l'accueil et comme écran de chargement entre les pages. Animations en CSS pur (globals.css).
 * Les anneaux qui tournent sont chacun un SVG à part, que l'on fait tourner en entier : le compositeur (carte graphique)
 * les fait pivoter sans redessiner. Une rotation posée sur un groupe à l'intérieur d'un SVG le redessinait à chaque image.
 */
export default function Emblem({ className = "" }: { className?: string }) {
  /** Anneau qui se trace, avec un léger décalage de départ */
  const ring = (r: number, width: number, opacity: number, delay: number, cx = 100, cy = 100) => (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      opacity={opacity}
      pathLength={100}
      strokeDasharray="101 101"
      className="emblem-draw"
      style={{ transformOrigin: `${cx}px ${cy}px`, transform: "rotate(-90deg)", animationDelay: `${delay}s` }}
    />
  );
  /** Calque superposé, aux mêmes dimensions ; `spin` : classe de rotation (autour du centre) */
  // La rotation porte sur un bloc HTML qui contient le SVG : Chrome ne confie pas à la carte graphique une animation
  // posée sur l'élément <svg> lui-même, et recalculait alors son style à chaque image, même au repos.
  const layer = (spin: string, children: ReactNode) => (
    <span className={`absolute inset-0 block ${spin}`}>
      <svg viewBox="0 0 200 200" className="size-full overflow-visible" aria-hidden focusable="false">
        {children}
      </svg>
    </span>
  );
  // Le conteneur porte les calques : il doit être positionné (sauf s'il l'est déjà par sa classe)
  const positioned = /\b(absolute|fixed|relative)\b/.test(className) ? "" : "relative ";

  return (
    <span className={`block ${positioned}${className}`} aria-hidden>
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full overflow-visible" aria-hidden focusable="false">
        {/* Grands anneaux très fins, légèrement décentrés */}
        {ring(98, 0.3, 0.3, 0.35)}
        {ring(93, 0.3, 0.22, 0.45, 101.5, 101)}
        {ring(87, 0.35, 0.3, 0.3, 99, 100.5)}

        {/* Anneau porteur de la planète */}
        {ring(76, 0.55, 0.6, 0.15)}

        {/* Anneau épais doublé d'un anneau fin, autour du nom */}
        {ring(61, 1.7, 0.9, 0)}
        {ring(57, 0.45, 0.6, 0.1)}
      </svg>

      {/* Anneau pointillé, rotation lente */}
      {layer(
        "emblem-spin-slow",
        <g className="emblem-fade">
          <circle cx="100" cy="100" r="67" fill="none" stroke="currentColor" strokeWidth="0.45" opacity="0.55" strokeDasharray="0.5 1.6" />
        </g>,
      )}

      {/* Planète cerclée en orbite sur l'anneau 76 (départ en haut) */}
      {layer(
        "emblem-orbit",
        <g className="emblem-fade">
          <circle cx="100" cy="24" r="6.5" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          <circle cx="100" cy="24" r="4" fill="var(--emblem-bg, #f4f3f1)" stroke="currentColor" strokeWidth="0.9" />
          <circle cx="100" cy="24" r="1.9" fill="currentColor" />
        </g>,
      )}

      {/* Planète grise auréolée, en orbite inverse sur l'anneau 87 (départ en bas à droite) */}
      {layer(
        "emblem-orbit-rev",
        <g className="emblem-fade">
          <g transform="rotate(140 100 100)">
            <circle cx="100" cy="13" r="8.5" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.35" />
            <circle cx="100" cy="13" r="6" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.5" />
            <circle cx="100" cy="13" r="3.6" fill="currentColor" opacity="0.35" />
          </g>
        </g>,
      )}
    </span>
  );
}
