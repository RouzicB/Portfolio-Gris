import type { Book, Universe } from "../types";

/**
 * IA & ROBOTIQUE INDUSTRIELLE — affiche sur les apports de l'IA dans la robotique et la production industrielle
 * (projet de M1). Reprise du PDF d'impression de l'affiche.
 */
export const afficheIaUniverse: Universe = {
  intro:
    "L'industrie de précision demande une affiche précise : une grille fine, des blocs aux angles arrondis comme des composants, des pistes bleues pour circuler de l'un à l'autre, et un seul bleu pour tout ce qui compte.",
  palette: [
    { name: "Bleu circuit", hex: "#2698D4", role: "Pistes, bandeaux de titres, accents" },
    { name: "Graphite", hex: "#2C2E35", role: "Titres et textes" },
    { name: "Blanc", hex: "#FAFAFA", role: "Blocs et fond quadrillé" },
    { name: "Orange soudure", hex: "#AA481E", role: "La chaleur des photos de robots" },
  ],
  // Typographie technique de l'affiche : à ajouter quand ses fichiers seront dans le site
  fonts: [],
  motif: {
    label: "Circuit",
    src: "/projets/affiche-ia/circuit.webp",
    alt: "Détail de l'affiche : des pistes bleues coudées sur un fond quadrillé, les repères B1 et C1, une photo d'impression 3D métal et le bloc « Impression 3D industrielle »",
    text: "Des pistes bleues coudées à 45°, un fond quadrillé et des repères de composants (A1, B1, C1…) : l'affiche se lit comme une carte électronique, du titre jusqu'à la signature.",
  },
  photo: {
    label: "Chiffres clés",
    src: "/projets/affiche-ia/chiffres.webp",
    alt: "Six cartes de chiffres : +40 % de productivité, −70 % de rebut, robots opérationnels 24/7, précision de ±1 µm, 99,97 % de défauts détectés, −45 % d'arrêts",
    text: "Six chiffres en grand, une ligne d'explication chacun : le lecteur pressé repart avec l'essentiel sans lire un seul paragraphe.",
    background: "#FAFAFA",
  },
};

const detail = (n: number, title: string, text: string) => {
  const id = String(n).padStart(2, "0");
  return { src: `/projets/affiche-ia/details/${id}.webp`, mini: `/projets/affiche-ia/details/mini/${id}.webp`, title, text };
};

/** L'affiche entière, puis ses blocs en détail (texte repris de l'affiche pour les lecteurs d'écran) */
export const afficheIaDetails: Book = {
  title: "L'affiche, bloc par bloc",
  unit: "détail",
  chapters: [],
  pages: [
    detail(
      1,
      "L'affiche entière",
      "« IA & Robotique industrielle » en titre, puis des blocs reliés par des pistes bleues : vision et performance, performances clés, impression 3D industrielle, secteurs industriels, avantages de l'IA, et l'IA au cœur de la production. À droite, un bras robotisé en pleine soudure ; en pied, un QR code, les réseaux et la signature de l'Atrium, espace régional de découverte scientifique et technique.",
    ),
    detail(
      2,
      "Vision et performance · performances clés",
      "Zéro défaut, précision absolue : les systèmes d'IA atteignent des tolérances de ±0,001 mm, surpassant les capacités humaines sur les tâches répétitives à haute cadence industrielle. Performances clés : +40 % de productivité gagnée par l'automatisation, −70 % de taux de rebut grâce au contrôle par IA, des robots opérationnels 24/7, une précision de ±1 µm en micro-usinage assisté, 99,97 % de défauts détectés par vision artificielle, −45 % d'arrêts grâce à la maintenance prédictive.",
    ),
    detail(
      3,
      "Impression 3D industrielle",
      "SLM / DMLS métal : fusion laser sélective de poudres (titane, Inconel, acier), des pièces à géométrie impossible en usinage, contrôlées couche par couche par l'IA. −60 % de matière par rapport à l'usinage conventionnel ; l'optimisation topologique garde la même résistance avec une masse réduite jusqu'à 40 %. Pièces sur mesure : prototypes fonctionnels en 24 h, pièces de rechange à la demande, outillage complexe sans moule.",
    ),
    detail(
      4,
      "Secteurs industriels · avantages de l'IA",
      "Quatre secteurs : aéronautique et spatial (tolérances critiques, titane imprimé en 3D pour des structures allégées), automobile (lignes robotisées, moules et prototypes 3D, contrôle qualité en ligne), énergie et nucléaire (composants haute fiabilité sous contrôle continu), défense et outillage (pièces sur mesure, gabarits sans délai ni moule). Trois avantages : fiabilité sur des millions de cycles, réactivité des paramètres en temps réel, traçabilité par un passeport numérique pour chaque pièce.",
    ),
    detail(
      5,
      "L'IA au cœur de la production",
      "Chaque pièce dispose d'un passeport numérique complet, de la matière première à la livraison. Les capteurs IoT et l'IA anticipent les pannes jusqu'à 72 h à l'avance, réduisent les arrêts non planifiés de 45 % et garantissent une production zéro défaut en continu. En pied : un QR code, les réseaux et le site de l'Atrium.",
    ),
  ],
};
