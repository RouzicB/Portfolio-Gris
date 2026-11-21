/**
 * Petit chargement entre deux études de cas (boutons « Projet précédent / suivant ») :
 * un voile de verre passe sur la page, un anneau se trace autour d'un losange, puis tout s'efface.
 * Rendu par app/projets/template.tsx, recréé à chaque changement de projet. Disparition en CSS pur :
 * l'écran ne peut jamais rester bloqué. À l'arrivée depuis une autre page, il reste caché sous
 * le grand écran de chargement (plus haut et plus long).
 */
export default function ProjectLoader() {
  return (
    <div role="status" aria-label="Chargement du projet" className="project-loader veil veil-flat pointer-events-none fixed inset-0 z-[55] grid place-items-center border-0">
      <span className="relative grid size-20 place-items-center text-ink">
        <svg viewBox="0 0 80 80" className="absolute inset-0 size-full" aria-hidden focusable="false">
          <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="101 101"
            className="emblem-draw"
            style={{ transformOrigin: "40px 40px", transform: "rotate(-90deg)" }}
          />
        </svg>
        <span aria-hidden className="size-2.5 rotate-45 bg-accent" />
      </span>
    </div>
  );
}
