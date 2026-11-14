import type { FlowKind, FlowNode } from "../types";

/** Géométrie de l'arborescence horizontale (px) */
export const COL_W = 150;
export const ROW_H = 104;
export const NODE_W = 132;
export const NODE_H = 72;
/** Place réservée en haut aux chapitres */
export const TOP = 34;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Position et taille d'un nœud sur le canevas */
export function nodeBox(node: Pick<FlowNode, "col" | "row">): Box {
  return { x: node.col * COL_W, y: TOP + node.row * ROW_H, w: NODE_W, h: NODE_H };
}

/** Taille du canevas pour contenir tous les nœuds */
export function canvasSize(nodes: Pick<FlowNode, "col" | "row">[]) {
  const maxCol = Math.max(...nodes.map((n) => n.col));
  const maxRow = Math.max(...nodes.map((n) => n.row));
  return { width: maxCol * COL_W + NODE_W, height: TOP + maxRow * ROW_H + NODE_H };
}

/**
 * Lien entre deux nœuds :
 * - même colonne : descend du bas de l'un au haut de l'autre ;
 * - sinon : part du bord droit, arrive au bord gauche, courbe aux tangentes horizontales.
 */
export function edgePath(a: Box, b: Box): string {
  if (Math.abs(a.x - b.x) < 1) {
    const x = a.x + a.w / 2;
    const [top, bottom] = a.y < b.y ? [a, b] : [b, a];
    return `M${x} ${top.y + top.h} V${bottom.y}`;
  }
  const x1 = a.x + a.w;
  const y1 = a.y + a.h / 2;
  const x2 = b.x;
  const y2 = b.y + b.h / 2;
  const mid = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
}

/** Chemin réellement parcouru (ni verrouillé, ni à venir) */
export function isTaken(kind: FlowKind): boolean {
  return kind !== "locked" && kind !== "future";
}

export const kindLabels: Record<FlowKind, string> = {
  start: "Départ",
  step: "Étape",
  choice: "Choix",
  current: "En cours",
  locked: "Non emprunté",
  future: "À venir",
};

/*
 * Arborescence verticale (téléphones) : le temps descend, les couloirs deviennent trois colonnes
 * (formation à gauche, expériences au centre, chemins non empruntés à droite).
 * Chaque chapitre ouvre sa propre ligne de titre au-dessus de ses étapes.
 */
export const V_LANE_W = 118;
export const V_NODE_W = 108;
export const V_NODE_H = 80;
export const V_STEP_H = 108;
export const V_CHAPTER_H = 36;

export type Orientation = "horizontal" | "vertical";

interface ChapterLike {
  cols: readonly [number, number];
}

export interface FlowLayout {
  nodeBox(node: Pick<FlowNode, "col" | "row">): Box;
  size: { width: number; height: number };
  edgePath(a: Box, b: Box): string;
  /** Position du titre d'un chapitre (sa hauteur est libre) */
  chapterBox(chapter: ChapterLike): Omit<Box, "h">;
  /** Point de départ d'un lien qui quitte la carte (l'étoile du chemin pris) */
  exit(box: Box): { x: number; y: number };
}

/** Lien vertical : du bas de l'un au haut de l'autre, ou de côté si les deux sont à la même hauteur */
export function edgePathVertical(a: Box, b: Box): string {
  if (Math.abs(a.y - b.y) < 1) {
    const [left, right] = a.x < b.x ? [a, b] : [b, a];
    const y = a.y + a.h / 2;
    return `M${left.x + left.w} ${y} H${right.x}`;
  }
  const x1 = a.x + a.w / 2;
  const y1 = a.y + a.h;
  const x2 = b.x + b.w / 2;
  const y2 = b.y;
  if (Math.abs(x1 - x2) < 1) return `M${x1} ${y1} V${y2}`;
  const mid = (y1 + y2) / 2;
  return `M${x1} ${y1} C${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`;
}

export function flowLayout(nodes: Pick<FlowNode, "col" | "row">[], chapters: ChapterLike[], orientation: Orientation): FlowLayout {
  if (orientation === "horizontal") {
    return {
      nodeBox,
      size: canvasSize(nodes),
      edgePath,
      chapterBox: (c) => ({ x: c.cols[0] * COL_W, y: 0, w: (c.cols[1] - c.cols[0]) * COL_W + NODE_W }),
      exit: (b) => ({ x: b.x + b.w, y: b.y + b.h / 2 }),
    };
  }
  // Nombre de titres de chapitre au-dessus d'une colonne de temps (le sien compris)
  const chaptersBefore = (col: number) => chapters.filter((c) => c.cols[0] <= col).length;
  const top = (col: number) => col * V_STEP_H + chaptersBefore(col) * V_CHAPTER_H;
  const maxCol = Math.max(...nodes.map((n) => n.col));
  const maxRow = Math.max(...nodes.map((n) => n.row));
  const width = maxRow * V_LANE_W + V_NODE_W;
  return {
    nodeBox: (n) => ({ x: n.row * V_LANE_W, y: top(n.col), w: V_NODE_W, h: V_NODE_H }),
    size: { width, height: top(maxCol) + V_NODE_H },
    edgePath: edgePathVertical,
    chapterBox: (c) => ({ x: 0, y: top(c.cols[0]) - V_CHAPTER_H + 2, w: width }),
    exit: (b) => ({ x: b.x + b.w / 2, y: b.y + b.h }),
  };
}
