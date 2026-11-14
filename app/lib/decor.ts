import type { StageId } from "../types";

/** Écrans où le décor est pré-rendu en images plutôt que dessiné en SVG (même requête que globals.css) */
export const TOUCH_QUERY = "(pointer: coarse), (max-width: 767px)";

/** Image pré-rendue d'une scène (public/decor/) : cadrage portrait (centre du cadre) ou large (cadre entier) */
export const bakedScene = (id: StageId, format: "portrait" | "wide") => `/decor/${id}-${format}.webp`;
