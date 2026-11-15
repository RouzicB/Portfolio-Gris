import type { Book, Universe } from "../types";

/**
 * BAMBOU — guide d'entretien d'une plante d'intérieur, en livret A5 de 12 pages (projet de documentation, M1).
 * Repris du PDF du livret et de ses fichiers sources (logo, illustrations).
 */
export const bambouUniverse: Universe = {
  intro:
    "Le bambou allie force et souplesse : le livret aussi. Un vert profond et un papier clair, des formes rondes, des pictogrammes au trait, et une seule plante dessinée en aplats qui grandit de page en page.",
  logo: {
    src: "/projets/bambou/logo.svg",
    alt: "Logo : une pastille ronde où se découpent des tiges et des feuilles de bambou",
    background: "#112D23",
    glyphs: [
      { letter: "Pastille", meaning: "Une forme ronde et pleine, qu'on retrouve en coin de couverture et de dos." },
      { letter: "Tiges", meaning: "Les nœuds et les feuilles du bambou, découpés en réserve dans la pastille." },
    ],
  },
  palette: [
    { name: "Vert bambou", hex: "#112D23", role: "Fonds, textes, tiges" },
    { name: "Papier", hex: "#F5F6F5", role: "Pages d'étapes, respiration" },
    { name: "Terre", hex: "#A18C6C", role: "Le pot" },
    { name: "Eau", hex: "#5A9DB1", role: "L'eau et l'arrosoir" },
    { name: "Soleil", hex: "#E3BE3F", role: "La lumière" },
    { name: "Argile", hex: "#687576", role: "Les billes de drainage" },
  ],
  // Typographies du livret : à ajouter quand leurs fichiers seront dans le site
  fonts: [],
  motif: {
    label: "Illustrations",
    src: "/projets/bambou/illustration.webp",
    alt: "Étape 3 du livret : un arrosoir bleu verse de l'eau dans un pot où deux tiges de bambou sont plantées dans des billes d'argile ; en bas, une frise de quatre bambous dont trois sont remplis",
    text: "Un même bambou en aplats, d'étape en étape : on ajoute les billes, les tiges, l'eau, la lumière. En haut, ce que l'étape demande (1× eau) ; en bas, une frise qui se remplit.",
    background: "#F5F6F5",
  },
  photo: {
    label: "Couverture",
    src: "/projets/bambou/livret-couverture.webp",
    alt: "Couverture du livret : le mot BAMBOU en grandes lettres rondes découpées dans des photos de la plante, et « Guide d'entretien » en vert",
    text: "Le titre en lettres rondes et grasses, découpées comme des fenêtres sur la plante : la couverture annonce le ton, simple et vivant.",
    background: "#112D23",
  },
};

const spread = (n: number, title: string, text: string) => {
  const id = String(n).padStart(2, "0");
  return { src: `/projets/bambou/livret/${id}.webp`, mini: `/projets/bambou/livret/mini/${id}.webp`, title, text };
};

/** Le livret, double page par double page (texte repris du livret pour les lecteurs d'écran) */
export const bambouLivret: Book = {
  title: "Le livret, double page par double page",
  unit: "double-page",
  pdf: "/Guide%20Bambou.pdf",
  chapters: [
    { title: "Étapes", page: 3 },
    { title: "Entretien", page: 5 },
    { title: "Résultats", page: 6 },
  ],
  pages: [
    spread(1, "Couverture", "Le mot BAMBOU en grandes lettres rondes découpées dans des photos de la plante, « Guide d'entretien », et le logo en pastille."),
    spread(
      2,
      "Le bambou",
      "Le bambou, symbole d'harmonie et de résilience, est une plante qui allie force et souplesse. Sous son apparente simplicité, il cache un système racinaire robuste et une grande sensibilité à son environnement. Un bambou au trait et quatre pictogrammes : lumière, eau, temps, intérieur. En regard, une forêt de bambous et une citation de Santōka Taneda : « Il ne s'agit pas seulement de faire pousser une plante, mais de laisser grandir la patience en soi. »",
    ),
    spread(
      3,
      "Essentiels · étape 1",
      "Les essentiels : le bambou, de l'eau (de préférence sans calcaire), un pot ou un vase en verre, des billes d'argile pour le drainage, des ciseaux ou un sécateur. Étape 1 (1× billes d'argile, 1× pot) : verser les billes au fond du pot.",
    ),
    spread(4, "Étapes 2 et 3", "Étape 2 (1× bambou) : planter les tiges dans les billes d'argile. Étape 3 (1× eau) : remplir d'eau à l'arrosoir."),
    spread(5, "Étape 4 · entretien", "Étape 4 (1× lumière) : placer le bambou à la lumière. Entretien (1× ciseaux) : couper les feuilles jaunies."),
    spread(6, "Résultats", "Quatre photos de bambous en vase de verre, sur des galets blancs, et en pot."),
    spread(7, "Contact", "Le dos : un bambou en pot près d'une fenêtre, et les coordonnées de la boutique."),
  ],
};
