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
    glyphFont: "'Major Mono Display', monospace",
    glyphs: [
      { letter: "v", meaning: "une onde sonore en mouvement" },
      { letter: "i", meaning: "le silence habité entre deux notes" },
      { letter: "b", meaning: "un bouton « lecture » qui déclenche le son" },
      { letter: "e", meaning: "les curseurs d'un égaliseur de studio" },
      { letter: "s", meaning: "le groove d'une vibration de basse" },
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

/** L'interface, écran par écran : captures du site Webflow en ligne (version finale, après les tests) */
export const vibesEcrans: Book = {
  title: "Le site, écran par écran",
  unit: "écran",
  chapters: [
    { title: "Accueil", page: 1 },
    { title: "Artiste", page: 4 },
    { title: "Concerts", page: 7 },
    { title: "Merch", page: 8 },
    { title: "À propos", page: 9 },
    { title: "Compte", page: 11 },
  ],
  pages: [
    {
      src: "/projets/vibes/ecrans/01.webp",
      mini: "/projets/vibes/ecrans/mini/01.webp",
      title: "Accueil · l'artiste à l'affiche",
      text: "Le site défile à l'horizontale : après la photo de concert, l'artiste à l'affiche (Billie Eilish, Hit Me Hard and Soft Tour) avec « Réserver » et « Voir l'artiste ». À droite, la barre latérale : logo, panier, compte, menu et progression du défilement.",
    },
    {
      src: "/projets/vibes/ecrans/02.webp",
      mini: "/projets/vibes/ecrans/mini/02.webp",
      title: "Accueil · la scène 2026",
      text: "La liste des prochains concerts : artiste, tournée, date et ville, et un lien vers tous les concerts.",
    },
    {
      src: "/projets/vibes/ecrans/03.webp",
      mini: "/projets/vibes/ecrans/mini/03.webp",
      title: "Accueil · le merch",
      text: "« Chaque concert laisse une trace. On choisit laquelle. » Les engagements de la boutique (éco-responsable, neutralité carbone, artistes engagés) et l'accès au merch.",
    },
    {
      src: "/projets/vibes/ecrans/04.webp",
      mini: "/projets/vibes/ecrans/mini/04.webp",
      title: "Page artiste",
      text: "La page prend la couleur signature de l'artiste. Titre géant, album, prix et « Prends ta place », biographie, lecteur avec la liste des titres et les genres.",
    },
    {
      src: "/projets/vibes/ecrans/05.webp",
      mini: "/projets/vibes/ecrans/mini/05.webp",
      title: "Page artiste · billetterie",
      text: "La billetterie de l'artiste : photos de la tournée, date, salle, prix et bouton « Réserver ».",
    },
    {
      src: "/projets/vibes/ecrans/06.webp",
      mini: "/projets/vibes/ecrans/mini/06.webp",
      title: "Page artiste · merchandise",
      text: "Le merch de l'artiste en cartes : visuel, catégorie, prix, et un accès direct à chaque article.",
    },
    {
      src: "/projets/vibes/ecrans/07.webp",
      mini: "/projets/vibes/ecrans/mini/07.webp",
      title: "Tous les concerts",
      text: "Le catalogue des tournées en cartes photo, avec des filtres par genre, prix et certification à gauche.",
    },
    {
      src: "/projets/vibes/ecrans/08.webp",
      mini: "/projets/vibes/ecrans/mini/08.webp",
      title: "Eco-merch",
      text: "La boutique : vêtements, vinyles, affiches et accessoires, filtrables par catégorie, prix et certification.",
    },
    {
      src: "/projets/vibes/ecrans/09.webp",
      mini: "/projets/vibes/ecrans/mini/09.webp",
      title: "À propos · pourquoi VIBES ?",
      text: "Le manifeste en quelques lignes et les chiffres clés : coton bio certifié, zéro émission nette, 5 % reversés à des associations, artistes partenaires.",
    },
    {
      src: "/projets/vibes/ecrans/10.webp",
      mini: "/projets/vibes/ecrans/mini/10.webp",
      title: "À propos · les engagements",
      text: "Quatre engagements (éco-responsable, neutralité carbone, artistes engagés, impact local) et « les visages de VIBES », l'équipe.",
    },
    {
      src: "/projets/vibes/ecrans/11.webp",
      mini: "/projets/vibes/ecrans/mini/11.webp",
      title: "Compte · VIBES Rewards",
      text: "Le profil du fan : points d'expérience et paliers débloqués, informations personnelles et commandes avec leur suivi de livraison.",
    },
    {
      src: "/projets/vibes/ecrans/12.webp",
      mini: "/projets/vibes/ecrans/mini/12.webp",
      title: "Contact",
      text: "Un formulaire guidé par sujet (question générale, suivi de commande, partenariat artiste, presse), chacun avec son délai de réponse, et les coordonnées de l'équipe.",
    },
  ],
};
