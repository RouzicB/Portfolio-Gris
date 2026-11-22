import type { StageId } from "../types";

/** Écrans où le décor est pré-rendu en images plutôt que dessiné en SVG (même requête que globals.css) */
export const TOUCH_QUERY = "(pointer: coarse), (max-width: 767px)";

/** Cadrage d'une image pré-rendue : large (cadre entier) sur un écran plus large que haut, portrait (centre du cadre) sinon */
export const WIDE_QUERY = "(min-aspect-ratio: 1/1)";

/**
 * Image pré-rendue d'une scène (public/decor/) : cadrage portrait ou large, en AVIF (~60 % plus léger)
 * ou en WebP pour les navigateurs qui ne lisent pas l'AVIF. Les AVIF se régénèrent avec scripts/decor-avif.mjs.
 */
export const bakedScene = (id: StageId, format: "portrait" | "wide", ext: "avif" | "webp" = "webp") => `/decor/${id}-${format}.${ext}`;

/**
 * Cadrage portrait en trois largeurs (540, 810 et 1081 px : scripts/decor-variants.mjs) : le navigateur prend la plus
 * petite qui couvre l'écran. Un téléphone ne télécharge plus l'image pleine taille (jusqu'à 200 Ko de moins par décor).
 */
export const bakedPortraitSet = (id: StageId, ext: "avif" | "webp") =>
  `/decor/${id}-portrait-540.${ext} 540w, /decor/${id}-portrait-810.${ext} 810w, ${bakedScene(id, "portrait", ext)} 1081w`;

/**
 * Largeur affichée d'un décor portrait : il déborde de 3 % de chaque côté (106 % de l'écran) et, l'image étant
 * deux fois plus haute que large, couvre toute la hauteur dès que l'écran est plus haut que deux largeurs (53 % de la hauteur).
 */
export const BAKED_PORTRAIT_SIZES = "max(106vw, 53vh)";

/** Pochette du lecteur de musique : petite vignette du décor de la zone (144 px) */
export const sceneThumb = (id: StageId) => `/decor/mini/${id}.webp`;

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
