import type { Book, Universe } from "../types";

/**
 * LES PLUIES DE JUILLET — examen de 1re année de mastère UX/UI : refonte de l'interface du site d'un festival
 * normand (projet d'école, non officiel). Repris du fichier Figma (moodboard, personas, parcours, maquettes)
 * et d'une archive du site d'origine (Wayback Machine, 2025).
 */
export const pluiesUniverse: Universe = {
  intro:
    "Le site d'origine criait : un fond rouge et rose saturé, des capitales noires très grasses, des informations éparpillées. La refonte garde l'esprit d'un festival champêtre et engagé, mais le pose sur un vert profond et des roses dessinées, avec une seule couleur vive réservée aux actions.",
  logo: {
    src: "/projets/pluies-de-juillet/logo.webp",
    alt: "Logo Pluies de Juillet : un J et un P géométriques entrelacés, à côté du nom sur deux lignes",
    background: "#4B6E5B",
    glyphs: [
      { letter: "Le jour", meaning: "Un village engagé : conférences, ateliers, la programmation qui « prend soin »." },
      { letter: "La nuit", meaning: "Les concerts : on se retrouve, on danse. Deux pictogrammes, un soleil et une lune, pour s'y retrouver." },
      { letter: "Les roses", meaning: "Des roses dessinées en bordure de page : l'âme champêtre du festival, sans charger le contenu." },
    ],
    note: "Le logo et le nom restent ceux du festival ; c'est l'interface autour qui change.",
  },
  palette: [
    { name: "Vert profond", hex: "#4B6E5B", role: "Fond des sections, cartes, en-tête" },
    { name: "Vert nuit", hex: "#34493E", role: "Dégradés, pied de page" },
    { name: "Menthe", hex: "#B9DCC4", role: "Fonds clairs, respiration" },
    { name: "Rose pâle", hex: "#F9D0DE", role: "Boutons secondaires, roses" },
    { name: "Magenta", hex: "#B93278", role: "Actions principales, financement" },
    { name: "Blanc", hex: "#FBFBFB", role: "Cartes et contenu" },
  ],
  fonts: [
    {
      name: "Ostrich Sans Rounded",
      family: "'Ostrich Sans Rounded', sans-serif",
      role: "Titres et boutons",
      use: "Condensée et arrondie, en capitales : elle garde l'affiche de festival sans l'agressivité des capitales noires d'origine.",
    },
    {
      name: "Apfel Grotezk",
      family: "'Apfel Grotezk', sans-serif",
      role: "Texte courant",
      use: "Une grotesque douce pour les descriptions, les offres et les formulaires de la billetterie.",
    },
  ],
  motif: {
    label: "Les roses",
    src: "/projets/pluies-de-juillet/rose.webp",
    alt: "Une rose dessinée en aplats de roses et de verts, cernée de blanc",
    text: "Une rose en aplats, détourée de blanc, posée aux angles des sections et du pied de page : la nature du festival, en ornement.",
    background: "#B9DCC4",
  },
  photo: {
    label: "Photographie",
    src: "/projets/pluies-de-juillet/photo.webp",
    alt: "Photo du moodboard : un père serre son enfant dans ses bras devant la scène du festival",
    text: "Des photos du festival lui-même, prises dans la foule : des familles, des amis, la scène en fond. Le public de Marie comme celui de Léo.",
  },
};

const ecran = (n: number, title: string, text: string) => {
  const id = String(n).padStart(2, "0");
  return { src: `/projets/pluies-de-juillet/ecrans/${id}.webp`, mini: `/projets/pluies-de-juillet/ecrans/mini/${id}.webp`, title, text };
};

/** L'examen, écran par écran : l'existant, la recherche, puis les maquettes (accueil et billetterie) */
export const pluiesEcrans: Book = {
  title: "Le projet, écran par écran",
  unit: "écran",
  chapters: [
    { title: "Avant", page: 1 },
    { title: "Recherche", page: 2 },
    { title: "Accueil", page: 7 },
    { title: "Billetterie", page: 12 },
  ],
  pages: [
    ecran(1, "Avant · le site d'origine", "L'accueil du site en 2025 (archive) : un fond rouge et rose saturé, des capitales noires très grasses, la billetterie reléguée dans un petit bouton en haut à droite."),
    ecran(2, "Moodboard", "Les deux versions du logo, Ostrich Sans Rounded et Apfel Grotezk, une palette verte et rose, des photos du festival et des roses au soleil couchant."),
    ecran(3, "Persona · Marie", "42 ans, professeure à Rouen, en couple avec deux enfants. Elle veut trouver vite la programmation et les infos pratiques ; elle est frustrée par le manque de contraste et la navigation confuse."),
    ecran(4, "Persona · Léo", "23 ans, étudiant à Caen, tout sur smartphone. Il veut un site rapide et moderne, une billetterie simple avec paiement mobile ; il abandonne si le design est vieillot."),
    ecran(5, "Parcours · Marie", "De l'arrivée au paiement : agressée par le fond rouge, perdue dans la navigation, agacée de ne pas trouver la billetterie, puis rassurée une fois le billet acheté."),
    ecran(6, "Parcours · Léo", "Sur mobile : il détourne les yeux à l'arrivée, se perd dans l'amas d'informations, peine à trouver l'offre de groupe tout en bas, puis paie et envoie les billets à ses amis."),
    ecran(7, "Accueil · l'ouverture", "Le nom et les dates sur un panneau vert, une photo de la foule, des roses ; la billetterie toujours visible dans l'en-tête."),
    ecran(8, "Accueil · billetterie et compte à rebours", "Les quatre offres principales dès le haut de la page, un lien vers toutes les offres, et le compte à rebours jusqu'au festival."),
    ecran(9, "Accueil · le jour et la nuit", "Les deux faces du festival côte à côte : le village engagé le jour, les concerts la nuit, chacune avec son pictogramme et son bouton."),
    ecran(10, "Accueil · bal, cuisine, camping", "Trois cartes pour la vie du festival : un bal, une cuisine locale avec 24 producteurs, un camping au cœur du site."),
    ecran(11, "Accueil · aftermovie et pied de page", "L'aftermovie, la newsletter, la navigation reprise et les réseaux, entre deux roses."),
    ecran(12, "Billetterie · les offres", "Toutes les offres en liste, du pass 3 jours à 66 € au pack de 6 pass, chacune avec son prix en grand et un bouton panier."),
    ecran(13, "Billetterie · le financement", "La jauge du financement participatif (53,3 % de 60 000 €) et les paliers à débloquer, de 15 k€ à 60 k€."),
    ecran(14, "Achat · panier", "Les quatre étapes de l'achat toujours affichées (panier, coordonnées, paiement, confirmation), l'offre choisie, le total TTC, et « Paiement sécurisé » pour rassurer."),
    ecran(15, "Achat · coordonnées", "Un formulaire en une colonne : prénom, nom, date de naissance, e-mail et sa confirmation, champs obligatoires marqués."),
    ecran(16, "Achat · paiement", "Apple Pay en paiement express pour Léo, la carte bancaire pour les autres, le total et l'acheteur rappelés à droite."),
    ecran(17, "Achat · confirmation", "« Merci Marie. » Le billet en PDF à télécharger et un retour à l'accueil."),  ],
};
