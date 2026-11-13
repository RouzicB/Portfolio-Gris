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
