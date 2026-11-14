import type { Book, Universe } from "../types";

/**
 * DELTA — refonte éco-conçue (projet d'école, non officiel) de l'identité d'un festival de musique marseillais :
 * moins d'encre, moins de couleurs, des supports et des goodies choisis pour leur empreinte.
 * Repris de la présentation du projet (PDF) et des fichiers de l'affiche, du flyer et du logo.
 */
export const deltaUniverse: Universe = {
  intro:
    "Garder l'énergie d'un festival de plage, mais imprimer moins. Chaque choix graphique se mesure en taux d'encrage : deux tons seulement, de grands aplats de papier laissés en réserve, et la silhouette de Marseille plutôt qu'une profusion d'illustrations.",
  logo: {
    src: "/projets/delta/logo.svg",
    alt: "Logo Delta : le mot Delta écrit en script, au trait rose et rempli de blanc, posé sur un triangle saumon",
    background: "#F6EFE6",
    foreground: "#7A2E3B",
    glyphs: [
      { letter: "Triangle", meaning: "Le delta, la lettre grecque : un aplat unique, sans dégradé ni ombre." },
      { letter: "Lettrage", meaning: "Le script de l'original, gardé pour son geste mais réduit à un contour : presque plus d'encre." },
      { letter: "Deux tons", meaning: "Saumon et rose, et le blanc du papier comme troisième couleur, gratuite." },
    ],
    note: "Avant : des mains en dégradé, un néon violet, du bleu et du jaune. Après : deux encres.",
  },
  palette: [
    { name: "Saumon", hex: "#F3997B", role: "Aplats, triangle, silhouette de la ville" },
    { name: "Rose", hex: "#ED687F", role: "Contours, soleil, palmiers" },
    { name: "Papier", hex: "#F6EFE6", role: "La réserve : ce qui n'est pas imprimé" },
  ],
  // Typographies du projet (Quinn Display, PlaylistFF, Neon) : à ajouter quand leurs fichiers seront dans le site
  fonts: [],
  motif: {
    label: "Affiche",
    src: "/projets/delta/mockup-affiche.webp",
    alt: "Mockup de l'affiche dans le hall d'un cinéma : le logo Delta au-dessus de la silhouette de Notre-Dame-de-la-Garde, d'un soleil et de palmiers, « Plages du Prado, Marseille, 27 au 31 août 2025 »",
    text: "La topographie de Marseille en deux tons : Notre-Dame-de-la-Garde, un soleil couchant et des palmiers, le haut de l'affiche laissé au papier. Taux d'encrage : 86 % → 43 %.",
  },
  photo: {
    label: "Flyer",
    src: "/projets/delta/mockup-flyer.webp",
    alt: "Mockup de deux flyers de programmation : cinq journées du mercredi 27 au dimanche 31, des noms d'artistes en capitales condensées, des mouettes et des palmiers",
    text: "La programmation jour par jour, au trait et en capitales, sur papier ensemencé de graines aromatiques locales, fabriqué à Marseille. Taux d'encrage : 14 %.",
  },
};

const slide = (n: number, title: string, text: string) => {
  const id = String(n).padStart(2, "0");
  return { src: `/projets/delta/slides/${id}.webp`, mini: `/projets/delta/slides/mini/${id}.webp`, title, text };
};

/** La présentation du projet, slide par slide (texte repris des slides pour les lecteurs d'écran) */
export const deltaSlides: Book = {
  title: "La présentation, slide par slide",
  unit: "slide",
  chapters: [
    { title: "Logo", page: 3 },
    { title: "Affiche", page: 4 },
    { title: "Flyer", page: 6 },
    { title: "Goodies", page: 7 },
  ],
  pages: [
    slide(1, "Festival Delta", "Couverture : le titre « Festival Delta » et le nouveau logo, entre deux nuages en pixel art."),
    slide(2, "Sommaire", "Refonte éco : 1. logo, 2. affiche, 3. flyer, 4. goodies."),
    slide(3, "Logo", "Le logo original (des mains en dégradé, un lettrage jaune et un néon violet) devient un lettrage au contour sur un triangle. Deux couleurs : saumon #F3997B (taux d'encrage 100 %) et rose #ED687F (104 %)."),
    slide(4, "Affiche originale", "Taux d'encrage de 86 % (mesuré sur pagecoveragecalculator), trop de couleurs, trop d'éléments."),
    slide(5, "Nouvelle affiche", "Taux d'encrage de 43 %. La topographie de Marseille reprise en silhouette. Impression offset : adaptée aux grandes séries, éco-encre, bichromie."),
    slide(6, "Flyer", "Papier ensemencé de graines aromatiques locales, fabriqué à Marseille ; impression offset en bichromie et éco-encre ; taux d'encrage de 14 %, sous l'objectif de 30 à 40 % ; sous-traitant certifié ISO 14001."),
    slide(7, "Goodies n° 1 : des bouchons d'oreilles", "Des protections auditives réutilisables, en plastique océanique recyclé, fabriquées dans l'UE. Teinte noire pour faciliter l'approvisionnement, logo sérigraphié en une couleur. Une activité possible pendant le festival : le nettoyage de la plage."),
    slide(8, "Goodies n° 2 : des lunettes", "Des lunettes de soleil, le logo discret sur la branche."),
    slide(9, "Goodies n° 2 : la fabrication", "Des lunettes fabriquées dans le Jura à partir de coquillages ; logo sérigraphié en une couleur, adapté aux grandes séries, un design discret."),
    slide(10, "Merci", "Slide de fin."),
  ],
};
