import type { Palette, StageId, Sun } from "../types";

/**
 * Les ambiances du décor. Le monde part du gris puis se teinte au fil du scroll ;
 * aucune section ne l'annonce, la couleur fait simplement partie du paysage.
 */
export const palettes: Record<StageId, Palette> = {
  /** Brume et ruines */
  gris: {
    skyTop: "#eeedeb",
    skyBottom: "#d3d1ce",
    accent: "#77736f",
    ink: "#2f2e2d",
    inkSoft: "#625f5b",
    veil: "rgba(250, 249, 248, 0.72)",
    washNear: "#a9a6a3",
    washFar: "#d9d7d4",
    sun: "#fbfaf8",
  },
  /** Forêt de troncs rouges */
  rouge: {
    skyTop: "#f6e9e1",
    skyBottom: "#efd2c9",
    accent: "#a8323a",
    ink: "#3a1a1f",
    inkSoft: "#6f414a",
    veil: "rgba(253, 244, 240, 0.74)",
    washNear: "#c43b4a",
    washFar: "#e7a7a8",
    sun: "#fff6ef",
  },
  /** Jardin de feuilles */
  vert: {
    skyTop: "#eef3e4",
    skyBottom: "#c9dcbc",
    accent: "#2f6f49",
    ink: "#1a3022",
    inkSoft: "#46644f",
    veil: "rgba(246, 251, 242, 0.74)",
    washNear: "#5e9970",
    washFar: "#cfe3c4",
    sun: "#fbfff2",
  },
  /** Sous la surface */
  bleu: {
    skyTop: "#d9edf2",
    skyBottom: "#8cc0d3",
    accent: "#235f8c",
    ink: "#112a38",
    inkSoft: "#3f6478",
    veil: "rgba(241, 249, 252, 0.72)",
    washNear: "#4f8fbf",
    washFar: "#bcd8ea",
    sun: "#f4fbff",
  },
  /** Crépuscule doré, pierres flottantes */
  jaune: {
    skyTop: "#3b2f55",
    skyBottom: "#d9a46b",
    accent: "#f2c14e",
    ink: "#fff7e6",
    inkSoft: "#eadbc0",
    veil: "rgba(52, 40, 74, 0.55)",
    washNear: "#5b4372",
    washFar: "#a9768a",
    sun: "#ffe3a1",
  },
  /** Ciel pastel au-dessus d'une mer de nuages */
  ciel: {
    skyTop: "#bfe3ea",
    skyBottom: "#f3dbe4",
    accent: "#b23f6a",
    ink: "#26304a",
    inkSoft: "#56607a",
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
    inkSoft: "#e2c6cf",
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
  rouge: { x: 70, y: 18, size: 110 },
  vert: { x: 22, y: 20, size: 110 },
  bleu: { x: 50, y: 4, size: 220 },
  jaune: { x: 78, y: 26, size: 120 },
  ciel: { x: 74, y: 18, size: 120 },
  lune: { x: 72, y: 40, size: 340 },
};
