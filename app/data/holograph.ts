import type { Book, Universe } from "../types";

/**
 * HOLOGRAPH' — site d'une marque de vêtements holographiques et métalliques, pensé en anti-design
 * (projet de début de M1). Repris de la présentation du projet (PDF) : note d'intention, moodboard, maquette.
 */
export const holographUniverse: Universe = {
  intro:
    "Briller, sortir des normes : l'univers d'Holograph' emprunte au cyberpunk, à l'espace et au chrome. Les matières des vêtements deviennent des formes liquides et irisées, posées sur un noir profond où flottent des étoiles, et les typographies se heurtent au lieu de s'aligner.",
  logo: {
    src: "/projets/holograph/logo.webp",
    alt: "Logotype Holograph' en lettres gothiques blanches, terminé par une apostrophe",
    background: "#161616",
    wide: true,
    note: "Une lettre gothique pour une marque futuriste : le décalage fait partie du choc.",
  },
  palette: [
    { name: "Noir", hex: "#161616", role: "Le fond : le vide spatial" },
    { name: "Rose holographique", hex: "#FFA9FF", role: "Reflets, étoiles, formes" },
    { name: "Violet", hex: "#703383", role: "Profondeur, nébuleuses" },
    { name: "Rose", hex: "#EA7EBE", role: "Accents et titres" },
    { name: "Ambre", hex: "#DE900A", role: "Titres chauds" },
    { name: "Pêche", hex: "#F2C3AA", role: "Étoiles et lumière" },
  ],
  // Typographies (une gothique et une condensée) : à ajouter quand leurs fichiers seront dans le site
  fonts: [],
  motif: {
    label: "Moodboard",
    src: "/projets/holograph/moodboard.webp",
    alt: "Moodboard : cinq pastilles de couleur, des tenues holographiques en ville et au coucher du soleil, un astronaute dans un nuage rose, une nébuleuse violette, des étoiles et des lunes, et les mots « future/holographics » et « Clothing edition »",
    text: "Mode holographique, néons de ville, nébuleuses, un astronaute : les inspirations qui ont guidé le site, et les cinq teintes de la palette.",
  },
  photo: {
    label: "Maquette",
    src: "/projets/holograph/maquette.webp",
    alt: "Haut de la maquette : le logo Holograph' en gothique, une navigation Shop, Brand, Contact, compte et panier, « Now » en gothique blanche, « Future » et « clothes » en grand, une forme chromée irisée et des étoiles",
    text: "Des titres qui se chevauchent, des mots posés à la verticale, du chrome liquide et des photos cadrées en biais. Seule la navigation reste sage : on doit pouvoir acheter.",
  },
};

const slide = (n: number, title: string, text: string) => {
  const id = String(n).padStart(2, "0");
  return { src: `/projets/holograph/slides/${id}.webp`, mini: `/projets/holograph/slides/mini/${id}.webp`, title, text };
};

/** La présentation du projet, slide par slide (texte repris des slides pour les lecteurs d'écran) */
export const holographSlides: Book = {
  title: "La présentation, slide par slide",
  unit: "slide",
  chapters: [
    { title: "Moodboard", page: 3 },
    { title: "Maquette", page: 4 },
  ],
  pages: [
    slide(1, "Holograph'", "Couverture : le nom Holograph' en lettres gothiques, une forme chromée et irisée, une lune violette et des étoiles pêche."),
    slide(
      2,
      "Présentation",
      "Holograph' est une marque de vêtements à l'esthétique futuriste et spatiale : vestes, pantalons et autres pièces en matières holographiques et métalliques, pour se sentir unique, briller et affirmer son identité. Son site est pensé selon les principes de l'anti-design, qui privilégie la créativité, l'impact visuel et l'originalité, quitte à sacrifier certaines règles de lisibilité ou de structure : provoquer chez l'utilisateur le choc visuel qu'on ressent en croisant quelqu'un habillé en Holograph'. Devise : « Ose briller. Sors des normes. Sois Holograph'. »",
    ),
    slide(3, "Moodboard", "Cinq teintes (rose, violet, rose vif, ambre, pêche), des tenues holographiques en ville, un astronaute, une nébuleuse, des étoiles et des lunes, les mots « future/holographics » et « Clothing edition »."),
    slide(
      4,
      "Maquette",
      "La page d'accueil en deux colonnes : « Now / Future clothes » sur une forme chromée, « Our brand » et « anti-normalization », puis « Product » et quatre collections (Quantum, Cybernetics, Hologram, Virtuality), et le pied de page.",
    ),
  ],
};
