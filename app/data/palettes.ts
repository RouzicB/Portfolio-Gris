import type { Palette, StageId, Sun } from "../types";

/**
 * Les ambiances du décor. Le monde part du gris puis se teinte au fil du scroll ;
 * aucune section ne l'annonce, la couleur fait simplement partie du paysage.
 */
export const palettes: Record<StageId, Palette> = {
  /** Monde blanc et gris : arche brisée, nuages lourds, sol pâle */
  gris: {
    skyTop: "#d4d3d1",
    skyBottom: "#f3f2f0",
    accent: "#66625e",
    ink: "#2f2e2d",
    inkSoft: "#4c4946",
    veil: "rgba(250, 249, 248, 0.72)",
    washNear: "#a9a6a3",
    washFar: "#d9d7d4",
    sun: "#fbfaf8",
  },
  /** Désert rouge : montagnes triangulaires, rochers à facettes, arbre en peigne */
  rouge: {
    skyTop: "#f8f0ea",
    skyBottom: "#efdad2",
    accent: "#a8283a",
    ink: "#3a1418",
    inkSoft: "#683640",
    veil: "rgba(253, 246, 243, 0.76)",
    washNear: "#c43b4a",
    washFar: "#ecc7c0",
    sun: "#fff8f2",
  },
  /** Forêt verte : troncs-colonnes, triangles suspendus, tronc en arche */
  vert: {
    skyTop: "#f1f6ed",
    skyBottom: "#d5e5d1",
    accent: "#2a6a45",
    ink: "#14291c",
    inkSoft: "#33503c",
    veil: "rgba(246, 251, 244, 0.76)",
    washNear: "#5e9970",
    washFar: "#cfe3c4",
    sun: "#fbfff6",
  },
  /** Grotte bleue : arbre lumineux, rais de lumière, eau */
  bleu: {
    skyTop: "#081a2b",
    skyBottom: "#1d5677",
    accent: "#7fd3ea",
    ink: "#eaf7fc",
    inkSoft: "#c6e3ef",
    veil: "rgba(8, 28, 44, 0.64)",
    washNear: "#2b6f8f",
    washFar: "#4f93b3",
    sun: "#d9f4ff",
  },
  /** Nuit dorée : grande lune, tours à dômes, lianes */
  jaune: {
    skyTop: "#1c160a",
    skyBottom: "#4d3c17",
    accent: "#f2c14e",
    ink: "#fff6dc",
    inkSoft: "#f0e0b8",
    veil: "rgba(36, 28, 10, 0.64)",
    washNear: "#8a6a26",
    washFar: "#c9a24a",
    sun: "#fff1c2",
  },
  /** Ciel pastel au-dessus d'une mer de nuages */
  ciel: {
    skyTop: "#bfe3ea",
    skyBottom: "#f3dbe4",
    accent: "#b23f6a",
    ink: "#26304a",
    inkSoft: "#414a63",
    veil: "rgba(250, 252, 253, 0.72)",
    washNear: "#7fb2c4",
    washFar: "#e8b8cc",
    sun: "#fffaf4",
  },
  /** Nuit prune, grande lune */
  lune: {
    skyTop: "#1d1530",
    skyBottom: "#5a2448",
    accent: "#f06a8f",
    ink: "#fff1ec",
    inkSoft: "#efdce2",
    veil: "rgba(36, 22, 50, 0.7)",
    washNear: "#3a2140",
    washFar: "#7a3358",
    sun: "#fff4d6",
  },
};

export const stageIds = Object.keys(palettes) as StageId[];

/** Position du soleil (ou de la lune) par défaut pour chaque ambiance — utilisée par les pages projet */
export const stageSuns: Record<StageId, Sun> = {
  gris: { x: 50, y: 30, size: 150 },
  rouge: { x: 74, y: 14, size: 90 },
  vert: { x: 22, y: 20, size: 110 },
  bleu: { x: 67, y: 6, size: 0 }, // grotte : pas d'astre, la lumière vient de l'arbre
  jaune: { x: 84, y: 10, size: 200 },
  ciel: { x: 74, y: 18, size: 120 },
  lune: { x: 72, y: 40, size: 340 },
};
