import { site } from "../../data/site";
import Emblem from "./Emblem";

/**
 * Écran de chargement entre les pages : le monde redevient gris le temps d'un battement,
 * l'emblème se trace et tourne, puis tout s'efface et la page apparaît avec ses couleurs.
 * Rendu par app/template.tsx (recréé à chaque navigation) ; la disparition est en CSS pur,
 * donc l'écran ne peut jamais rester bloqué, même sans JavaScript.
 */
export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Chargement"
      className="page-loader pointer-events-none fixed inset-0 z-[60] grid place-items-center"
      style={{ background: "linear-gradient(180deg, #eeedeb 0%, #d3d1ce 100%)", color: "#2f2e2d" }}
    >
      <div className="relative grid h-56 w-56 place-items-center sm:h-64 sm:w-64" style={{ ["--emblem-bg" as string]: "#e6e4e1" }}>
        <Emblem className="absolute inset-0 h-full w-full" />
        <span className="title-spaced pl-[0.32em] text-sm sm:text-base">{site.logo}</span>
      </div>
    </div>
  );
}
