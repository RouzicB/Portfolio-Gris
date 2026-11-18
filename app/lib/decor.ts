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
