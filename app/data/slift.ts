import type { Universe } from "../types";

/** SLIFT — univers graphique, repris de la charte : la précision, un contraste marqué, un seul signal de couleur */
export const sliftUniverse: Universe = {
  intro:
    "Une salle tournée vers la performance demande une identité sans excès : des lignes nettes, un contraste marqué et un seul signal de couleur, le rouge. Du logo à la signalétique, tout part d'une même intention : la précision.",
  logo: {
    src: "/projets/slift/logo-blanc.webp",
    alt: "Logotype SLIFT : trois sommets stylisés au-dessus du mot SLIFT en lettres compactes et anguleuses",
    background: "#C14443",
    glyphFont: "'Righteous', sans-serif",
    glyphs: [
      { letter: "Sommets", meaning: "Un pictogramme montagneux : l'ascension, le dépassement." },
      { letter: "Lettres", meaning: "Une typographie compacte et anguleuse, comme une prise." },
      { letter: "Triangle", meaning: "Asymétrique, il rappelle les volumes d'un mur de bloc." },
    ],
    note: "Quatre traitements (plein rouge, rouge clair, noir, contour) ; le favicon garde les seuls sommets.",
  },
  palette: [
    { name: "Blanc", hex: "#FDFDFD", role: "Fonds clairs, respiration" },
    { name: "Gris", hex: "#DFDFDF", role: "Structure et fonds secondaires" },
    { name: "Noir", hex: "#1E1E1E", role: "Textes et structure" },
    { name: "Rouge", hex: "#C14443", role: "Le signal : logo, titres, boutons (10 à 15 %)" },
    { name: "Rouge clair", hex: "#DE5856", role: "En soutien : survol, dégradés" },
  ],
  fonts: [
    { name: "Righteous", family: "'Righteous', sans-serif", role: "Titres et temps forts", use: "Condensée, aux angles marqués : elle fait écho à la verticalité du mur. Jamais plus d'une ligne." },
    { name: "Kumbh Sans", family: "'Kumbh Sans', sans-serif", role: "Texte courant", use: "Géométrique et confortable pour les contenus longs, jamais sous 14 px à l'écran ni 9 pt à l'impression." },
  ],
  motif: {
    src: "/projets/slift/motif.webp",
    alt: "Motif : des triangles asymétriques rouges aux angles arrondis, dispersés sur fond blanc",
    text: "Des triangles asymétriques dérivés du logo, en arrière-plan ou en rupture. Leur opacité peut baisser, jamais leur géométrie : le motif ne recompose rien librement.",
  },
  photo: {
    src: "/projets/slift/photo.webp",
    alt: "Photographie : un mur d'escalade aux prises rouges et à la texture marquée, cadré serré dans un triangle",
    text: "Noir et blanc contrasté ou teintes désaturées, relevés par le rouge ; cadrages serrés sur les prises, les mains, la texture du mur : le geste plutôt que la mise en scène.",
  },
};
