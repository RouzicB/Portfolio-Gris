import type { Palette } from "../types";

/** Borne un index de section entre 0 et n - 1 */
export function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(Math.max(Math.round(index), 0), count - 1);
}

/**
 * Position continue dans le voyage : 0 = centre de la première section, 1 = centre de la deuxième…
 * `centers` = position verticale du centre de chaque section, `mid` = centre de l'écran.
 */
export function continuousIndex(centers: number[], mid: number): number {
  if (centers.length === 0) return 0;
  if (mid <= centers[0]) return 0;
  for (let i = 0; i < centers.length - 1; i++) {
    if (mid < centers[i + 1]) return i + (mid - centers[i]) / (centers[i + 1] - centers[i]);
  }
  return centers.length - 1;
}

/**
 * Courbe du fondu entre deux sections : la couleur reste posée quand une section est centrée,
 * et ne glisse vers la suivante que pendant le passage — sans à-coup (smoothstep).
 */
export function blendCurve(t: number): number {
  const x = Math.min(Math.max((t - 0.15) / 0.7, 0), 1);
  return x * x * (3 - 2 * x);
}

/** Décompose une position continue en (section de départ, section d'arrivée, avancement adouci) */
export function segment(f: number, count: number): { from: number; to: number; t: number } {
  const max = Math.max(count - 1, 0);
  const x = Math.min(Math.max(f, 0), max);
  const from = Math.floor(x);
  const to = Math.min(from + 1, max);
  return { from, to, t: from === to ? 0 : blendCurve(x - from) };
}

/** Poids de chaque ambiance du décor à une position donnée (la somme vaut 1) */
export function stageWeights<S extends string>(f: number, stages: S[]): Partial<Record<S, number>> {
  const { from, to, t } = segment(f, stages.length);
  const w: Partial<Record<S, number>> = {};
  w[stages[from]] = (w[stages[from]] ?? 0) + (1 - t);
  w[stages[to]] = (w[stages[to]] ?? 0) + t;
  return w;
}

/** Nom de la variable CSS d'une clé de palette : skyTop → --sky-top */
export function cssVarName(key: keyof Palette): string {
  return `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
}

/** Palette → variables CSS */
export function paletteToVars(palette: Palette): Record<string, string> {
  const vars: Record<string, string> = {};
  (Object.keys(palette) as (keyof Palette)[]).forEach((key) => {
    vars[cssVarName(key)] = palette[key];
  });
  return vars;
}

/**
 * Zoom d'une couche (scène ou contenu) selon sa distance à la position courante :
 * d > 0 : on l'a dépassée, on « entre » dedans (elle grossit) ; d < 0 : elle arrive du fond (un peu plus petite).
 */
export function zoomScale(d: number, ahead = 0.45, behind = 0.12): number {
  if (d >= 1 || d <= -1) return d > 0 ? 1 + ahead : 1 - behind;
  return d >= 0 ? 1 + blendCurve(d) * ahead : 1 + d * behind;
}

/** Opacité d'un contenu de section selon sa distance : net quand il est centré, effacé à mi-chemin */
export function contentOpacity(d: number): number {
  return Math.min(Math.max(1 - Math.abs(d) * 1.8, 0), 1);
}

/** Sens de navigation demandé par un geste (molette, glissé) : 1, -1 ou 0 sous le seuil */
export function gestureDirection(delta: number, threshold: number): -1 | 0 | 1 {
  if (Math.abs(delta) < threshold) return 0;
  return delta > 0 ? 1 : -1;
}

/** Un conteneur peut-il encore défiler dans ce sens ? (contenu plus haut que l'écran, sur mobile surtout) */
export function canScrollWithin(el: { scrollTop: number; scrollHeight: number; clientHeight: number }, dir: 1 | -1): boolean {
  if (dir > 0) return el.scrollTop + el.clientHeight < el.scrollHeight - 2;
  return el.scrollTop > 2;
}

/** Identifiant d'ancre d'une section */
export function anchorId(id: string): string {
  return `section-${id}`;
}

export const pad = (n: number) => String(n).padStart(2, "0");
