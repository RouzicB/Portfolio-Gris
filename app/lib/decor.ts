import type { StageId } from "../types";
import { DECOR_DIR } from "./decor-dir";

/** Écrans tactiles ou étroits (même requête que globals.css) */
export const TOUCH_QUERY = "(pointer: coarse), (max-width: 767px)";

/** Cadrage d'une image pré-rendue : large (cadre entier) sur un écran plus large que haut, portrait (centre du cadre) sinon */
export const WIDE_QUERY = "(min-aspect-ratio: 1/1)";

/** Dossier des décors peints : son nom est une empreinte des images, tenue à jour par scripts/decor/bake.mjs */
const DIR = DECOR_DIR;

/**
 * Les décors sont des aquarelles peintes d'avance (scripts/decor/), sur tous les écrans : une seule image par scène,
 * que la carte graphique déplace et fond sans rien redessiner. Les scènes dessinées en direct (SVG et filtres aquarelle,
 * plusieurs calques plein écran) faisaient saccader les voyages sur les portables modestes.
 * AVIF d'abord (bien plus léger), WebP pour les navigateurs qui ne le lisent pas.
 */
export const bakedScene = (id: StageId, format: "portrait" | "wide", ext: "avif" | "webp" = "webp") =>
  format === "wide" ? `${DIR}/${id}-wide-1600.${ext}` : `${DIR}/${id}-portrait-810.${ext}`;

/** Cadre entier (écrans larges) en trois largeurs : le navigateur prend la plus petite qui couvre l'écran */
export const bakedWideSet = (id: StageId, ext: "avif" | "webp") =>
  [1600, 2400, 3200].map((w) => `${DIR}/${id}-wide-${w}.${ext} ${w}w`).join(", ");

/**
 * Largeur affichée d'un décor large : il déborde de 3 % de chaque côté (106 % de l'écran) et, l'image étant au format
 * 16/9, couvre toute la hauteur dès que l'écran est moins large que 16/9 (106 % de la hauteur × 16/9 ≈ 189 % de la hauteur).
 */
export const BAKED_WIDE_SIZES = "max(106vw, 189vh)";

/** Centre du cadre (écrans en hauteur) en quatre largeurs : un téléphone ne télécharge que ce que son écran affiche */
export const bakedPortraitSet = (id: StageId, ext: "avif" | "webp") =>
  [540, 810, 1080, 1440].map((w) => `${DIR}/${id}-portrait-${w}.${ext} ${w}w`).join(", ");

/**
 * Largeur affichée d'un décor portrait : il déborde de 3 % de chaque côté (106 % de l'écran) et, le cadrage portrait
 * faisant 560 × 900, couvre toute la hauteur dès que l'écran est plus étroit que lui (106 % × 560 / 900 ≈ 66 % de la hauteur).
 */
export const BAKED_PORTRAIT_SIZES = "max(106vw, 66vh)";

/** Pochette du lecteur de musique : petite vignette du décor de la zone (144 px) */
export const sceneThumb = (id: StageId) => `${DIR}/mini/${id}.webp`;

/** Le navigateur lit-il l'AVIF ? (une image d'un pixel, décodée une seule fois) */
let avif: Promise<boolean> | null = null;
export function supportsAvif(): Promise<boolean> {
  avif ??= new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src =
      "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAACJpbG9jAAAAAERAAAEAAQAAAAAA+gABAAAAAAAAABoAAAAjaWluZgAAAAAAAQAAABVpbmZlAgAAAAABAABhdjAxAAAAAA5waXRtAAAAAAABAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAibWRhdBIACgc4AAaQENBpMg0ZQmMEwAA0AASQQM1A";
  });
  return avif;
}
