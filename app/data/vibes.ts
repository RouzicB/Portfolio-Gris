import type { Book, Universe } from "../types";

/**
 * VIBES — univers graphique et écrans, repris du document de projet (Figma) et du site Webflow en ligne.
 * « L'éco-responsabilité version Dark Mode » : la nuit, ses néons bleus et violets, et des typos de code.
 */
export const vibesUniverse: Universe = {
  intro:
    "Tourner le dos aux codes verts de l'écologie (pastels, kraft, petites feuilles) pour parler la langue de la nuit : ciels sombres, néons de scène, grilles de code. Les couleurs de VIBES sont celles de l'environnement qu'elle veut protéger : la nuit.",
  logo: {
    src: "/projets/vibes/logo.svg",
    alt: "Logotype VIBES : cinq lettres fines et géométriques, le B dessiné comme un bouton lecture",
    background: "#121212",
    glyphs: [
      { letter: "V", meaning: "une onde sonore en mouvement" },
      { letter: "I", meaning: "le silence habité entre deux notes" },
      { letter: "B", meaning: "un bouton « lecture » qui déclenche le son" },
      { letter: "E", meaning: "les curseurs d'un égaliseur de studio" },
      { letter: "S", meaning: "le groove d'une vibration de basse" },
    ],
    note: "Seul, le V devient le monogramme : favicon, icône d'application, avatar.",
  },
  palette: [
    { name: "Black", hex: "#121212", role: "Le fond : la nuit, partout" },
    { name: "White", hex: "#FEFEFE", role: "Textes et icônes, contraste maximal" },
    { name: "Purple", hex: "#735AA2", role: "Accent : les lumières de scène" },
    { name: "Lavande", hex: "#9A8BC1", role: "Accent doux, dégradés" },
    { name: "Blue", hex: "#1F65AE", role: "Appels à l'action, interactions" },
    { name: "Light Blue", hex: "#6CA4F8", role: "Pilule d'impact carbone" },
  ],
  fonts: [
    { name: "Major Mono Display", family: "'Major Mono Display', monospace", role: "Logo et signatures", use: "Monospace géométrique, réservée au logotype et à l'habillage : l'ADN underground." },
    { name: "Play", family: "'Play', sans-serif", role: "Titres et navigation", use: "Sans-serif numérique pour structurer les pages, percutante sans fatiguer l'œil." },
    { name: "IBM Plex Mono", family: "'IBM Plex Mono', monospace", role: "Texte et données", use: "Paragraphes, prix, impact carbone : une typo de code qui dit la transparence." },
  ],
  motif: {
    src: "/projets/vibes/motif.webp",
    alt: "Motif : des W, des M, des triangles et des sabliers au trait fin, répétés en grille sur fond noir",
    text: "Des W et des M entrelacés imitent les ondes et les fréquences de basses. Ces lignes brisées figurent aussi le réseau que VIBES tisse entre artistes et ateliers textiles.",
  },
  photo: {
    src: "/projets/vibes/photo.webp",
    alt: "Photographie de concert : un faisceau de lumière orange et des lasers au-dessus d'une foule dans le noir",
    text: "L'antithèse des banques d'images : lasers, foules en silhouette, écrans de scène, très sombres et contrastés. Ce traitement permet aussi de compresser fort les images.",
  },
};

/** L'interface, écran par écran : le site Webflow en ligne et les maquettes Figma */
export const vibesEcrans: Book = {
  title: "L'interface, écran par écran",
  unit: "écran",
  chapters: [
    { title: "Artistes", page: 2 },
    { title: "Concerts", page: 4 },
    { title: "Merch", page: 6 },
    { title: "Panier", page: 8 },
  ],
  pages: [
    {
      src: "/projets/vibes/ecrans/02.webp",
      mini: "/projets/vibes/ecrans/mini/02.webp",
      title: "Accueil (site en ligne)",
      text: "Page d'accueil du site Webflow : un défilement horizontal entre photo de concert, artiste à l'affiche et bandeau des artistes. Barre latérale avec le logo, le panier, le compte et le menu.",
    },
    {
      src: "/projets/vibes/ecrans/03.webp",
      mini: "/projets/vibes/ecrans/mini/03.webp",
      title: "Page artiste · Billie Eilish",
      text: "Maquette : la page prend la couleur signature de l'artiste, un bleu qui rappelle l'album Hit Me Hard and Soft. Prix du billet et bouton « Prends ta place », biographie, lecteur et liste des titres.",
    },
    {
      src: "/projets/vibes/ecrans/04.webp",
      mini: "/projets/vibes/ecrans/mini/04.webp",
      title: "Page artiste · Charli XCX",
      text: "Maquette : même composant, thème vert inspiré de l'album Brat. Chaque artiste a sa couleur, l'interface devient son écrin.",
    },
    {
      src: "/projets/vibes/ecrans/05.webp",
      mini: "/projets/vibes/ecrans/mini/05.webp",
      title: "La scène 2026 (site en ligne)",
      text: "Site Webflow : la liste des prochains concerts, avec date et lieu pour chaque artiste, et un lien vers tous les concerts.",
    },
    {
      src: "/projets/vibes/ecrans/06.webp",
      mini: "/projets/vibes/ecrans/mini/06.webp",
      title: "Billetterie d'un concert",
      text: "Maquette : plan de salle pour choisir sa zone (fosse, tribunes, carré or, pelouse), nombre de billets et sièges, récapitulatif avec frais de service offerts, puis ajout au panier ou paiement direct.",
    },
    {
      src: "/projets/vibes/ecrans/07.webp",
      mini: "/projets/vibes/ecrans/mini/07.webp",
      title: "Merch éco-responsable (site en ligne)",
      text: "Site Webflow : « Chaque concert laisse une trace. On choisit laquelle. » Les engagements de la boutique : coton bio, neutralité carbone, artistes engagés.",
    },
    {
      src: "/projets/vibes/ecrans/08.webp",
      mini: "/projets/vibes/ecrans/mini/08.webp",
      title: "Fiche produit · le parfum de la tournée",
      text: "Maquette : le parfum exclusif de la tournée de Billie Eilish, celui que les testeurs devaient trouver. Prix et livraison éco gratuite, choix du format, avis des acheteurs et reste de la collection.",
    },
    {
      src: "/projets/vibes/ecrans/09.webp",
      mini: "/projets/vibes/ecrans/mini/09.webp",
      title: "Panier unifié",
      text: "Maquette : un billet de concert et un hoodie dans le même panier, récapitulatif, code promo, et les points d'expérience gagnés annoncés juste avant la validation.",
    },
  ],
};
