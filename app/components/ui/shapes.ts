/** Formes de base des vignettes peintes (ProjectThumb) */

/** Bloc percé d'une arche (règle evenodd) : x, y = coin haut-gauche ; ow = largeur de l'ouverture */
export function archPath(x: number, y: number, w: number, h: number, ow: number, sill = 0.35) {
  const ox = x + (w - ow) / 2;
  const r = ow / 2;
  const top = y + h * sill + r;
  return `M${x} ${y}H${x + w}V${y + h}H${x}Z M${ox} ${y + h}V${top}A${r} ${r} 0 0 1 ${ox + ow} ${top}V${y + h}Z`;
}

/** Monticule doux : du point (x0, sol) au point (x1, sol), sommet à la hauteur `peak` */
export function moundPath(x0: number, x1: number, ground: number, peak: number, lean = 0) {
  const w = x1 - x0;
  const cx = x0 + w / 2 + lean;
  return `M${x0} ${ground}C${x0 + w * 0.15} ${peak + 20} ${cx - w * 0.2} ${peak} ${cx} ${peak}S${x1 - w * 0.12} ${peak + 30} ${x1} ${ground}Z`;
}
