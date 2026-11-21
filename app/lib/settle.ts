/**
 * Changement de palette sans fondu parasite.
 * Les éléments communs à toutes les pages (lecteur de musique, bouton des crédits, navigation) partent de la palette
 * de l'accueil, puis reçoivent celle de la page juste après l'affichage. Ceux qui ont une transition (boutons,
 * cartes) faisaient alors un fondu visible, comme un clignotement, surtout sur téléphone.
 * La classe `palette-settling` sur <html> coupe toutes les transitions (globals.css) le temps que la palette s'installe :
 * posée dès le rendu serveur pour le premier affichage, puis à chaque changement de page.
 */
const CLASS = "palette-settling";
let timer = 0;

/** Coupe les transitions, laisse la palette s'appliquer, puis les rétablit (après deux images et une courte marge) */
export function settlePalette(delay = 120) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.add(CLASS);
  window.clearTimeout(timer);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      timer = window.setTimeout(() => root.classList.remove(CLASS), delay);
    }),
  );
}
