// Boîte à outils de peinture des décors : aquarelle, encre et crayon, en SVG.
// Ces filtres sont lourds (plusieurs bruits, flous et fusions par forme) : ils ne servent qu'au rendu des images
// (scripts/decor/bake.mjs), jamais dans le navigateur des visiteurs, qui reçoit des images déjà peintes.
//
// Ce qui rend une aquarelle « faite main », et que ces outils imitent :
// - un bord jamais net : il ondule (le papier boit l'eau inégalement) et le pigment s'y accumule en séchant (bord plus foncé) ;
// - un aplat jamais uniforme : des zones plus claires où l'eau a repoussé le pigment, un grain fin là où il s'est déposé ;
// - un trait d'encre qui s'épaissit et s'affine (pression du pinceau), se casse un peu quand le pinceau sèche ;
// - la couleur et le trait ne tombent pas pile l'un sur l'autre (on peint d'abord, on encre ensuite) ;
// - des traits de construction au crayon, laissés visibles.

/** Pseudo-hasard déterministe : la même scène se repeint à l'identique */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;
const pt = ([x, y]) => `${r1(x)} ${r1(y)}`;

/** Courbe lisse passant par les points (Catmull-Rom), ouverte ou fermée */
export function smooth(points, closed = true, k = 1 / 6) {
  const n = points.length;
  const at = (i) => (closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pt(points[0])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2 = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  return closed ? `${d}Z` : d;
}

/**
 * Polygone tracé à main levée : chaque côté est redécoupé et légèrement bombé ou creusé, les angles restent francs.
 * `wobble` : écart de la main (en unités du cadre), `step` : longueur d'un segment.
 */
export function rough(points, { wobble = 3, step = 36, seed = 1, closed = true } = {}) {
  const rand = rng(seed);
  // Entre deux : la main tremble moins, les formes gardent leur géométrie (côtés presque droits, angles francs)
  wobble *= GEOMETRY;
  const out = [];
  const n = points.length;
  const edges = closed ? n : n - 1;
  for (let i = 0; i < edges; i++) {
    const a = points[i];
    const b = points[(i + 1) % n];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const nx = -(b[1] - a[1]) / (len || 1);
    const ny = (b[0] - a[0]) / (len || 1);
    // Un côté entier bombe d'un même sens (geste de la main), avec un peu de tremblement en plus
    const bow = (rand() - 0.5) * wobble * 2.2;
    const parts = Math.max(1, Math.round(len / step));
    out.push(a);
    for (let j = 1; j < parts; j++) {
      const t = j / parts;
      const off = Math.sin(Math.PI * t) * bow + (rand() - 0.5) * wobble;
      out.push([a[0] + (b[0] - a[0]) * t + nx * off, a[1] + (b[1] - a[1]) * t + ny * off]);
    }
  }
  if (!closed) out.push(points[n - 1]);
  return `M${out.map(pt).join("L")}${closed ? "Z" : ""}`;
}

/** Part du tremblé de la main gardée sur les polygones (1 = très libre, 0 = règle et compas) */
export const GEOMETRY = 0.45;

/**
 * Point d'une courbe Catmull-Rom ouverte, au paramètre t (0 → 1) : celle que suit `brush`. Pour accrocher un élément
 * à un coup de pinceau (fil qui pend d'une branche…), on le fait partir d'ici, pas d'une ligne droite entre les points.
 */
export function sample(points, t) {
  const n = points.length - 1;
  const f = Math.min(n - 1e-9, Math.max(0, t * n));
  const i = Math.floor(f);
  const u = f - i;
  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[Math.min(n, i + 2)];
  const c = (k) =>
    0.5 *
    (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u * u + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u * u * u);
  return [c(0), c(1)];
}

/**
 * Coup de pinceau : une forme pleine le long d'une ligne, fine au départ, pleine au milieu, effilée au bout.
 * `w` : épaisseur maximale ; `start` / `end` : épaisseur relative aux extrémités ; `peak` : où le trait est le plus épais.
 */
export function brush(points, { w = 4, start = 0.15, end = 0.05, peak = 0.35, seed = 1, jitter = 0.1 } = {}) {
  const rand = rng(seed);
  const N = Math.max(12, Math.round(points.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1]) : 0), 0) / 6));
  const left = [];
  const right = [];
  let wob = 0;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const [x, y] = sample(points, t);
    const [x2, y2] = sample(points, Math.min(1, t + 0.002));
    const [x0, y0] = sample(points, Math.max(0, t - 0.002));
    const len = Math.hypot(x2 - x0, y2 - y0) || 1;
    const nx = -(y2 - y0) / len;
    const ny = (x2 - x0) / len;
    // Profil de pression : monte jusqu'au pic, redescend vers la fin ; la main tremble un peu
    const prof = t < peak ? start + (1 - start) * Math.sin((t / peak) * (Math.PI / 2)) : end + (1 - end) * Math.cos(((t - peak) / (1 - peak)) * (Math.PI / 2));
    wob = wob * 0.7 + (rand() - 0.5) * jitter;
    const half = (w / 2) * Math.max(0.05, prof * (1 + wob));
    left.push([x + nx * half, y + ny * half]);
    right.push([x - nx * half, y - ny * half]);
  }
  return `M${left.map(pt).join("L")}L${right.reverse().map(pt).join("L")}Z`;
}

/** Forme organique fermée autour d'un centre (tache, nuage, buisson) : rayon irrégulier */
export function blob(cx, cy, rx, ry, { lumps = 9, irregular = 0.25, seed = 1, rot = 0 } = {}) {
  const rand = rng(seed);
  const pts = [];
  for (let i = 0; i < lumps; i++) {
    const a = rot + (i / lumps) * Math.PI * 2 + (rand() - 0.5) * 0.4;
    const k = 1 + (rand() - 0.5) * 2 * irregular;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smooth(pts, true);
}

/** Dégradé linéaire (vertical par défaut) ; stops : [[offset, couleur, opacité?], …] */
export function linear(id, stops, { x1 = 0, y1 = 0, x2 = 0, y2 = 1, units = "objectBoundingBox" } = {}) {
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="${units}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join("")}</linearGradient>`;
}

export function radial(id, stops, { cx = 0.5, cy = 0.5, r = 0.5, units = "objectBoundingBox" } = {}) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="${units}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join("")}</radialGradient>`;
}

/**
 * Filtres de peinture, propres à une scène (`seed` : chaque scène a son propre papier et ses propres coulures).
 * - wash      : lavis franc (bord ondulé, pigment accumulé au bord, densité inégale, grain)
 * - wash-wet  : lavis mouillé (bord fondu dans l'eau : lointains, brumes)
 * - wash-solid: lavis couvrant (objets qui doivent rester présents : tours, rochers, feuilles)
 * - solid     : aplat opaque au même contour que les lavis (sous-couche : ce qui est derrière ne transparaît plus)
 * - wash-dark : lavis sur fond de nuit (le bord s'éclaircit au lieu de foncer, comme un pigment couvrant)
 * - bloom     : grande tache diluée (ciel, nuages, reflets), bord en chou-fleur
 * - ink       : trait d'encre (tremblé, cassé par endroits)
 * - ink-wet   : trait d'encre continu (fils, tiges fines)
 * - pencil    : crayon (gris, granuleux, discontinu)
 * - line      : trait net, à peine adouci (formes lumineuses régulières : l'arbre de lumière)
 * - glow      : halo doux (lumières)
 */
export function filters(seed = 1) {
  const s = (k) => seed * 10 + k;
  return `
  ${washFilter("wash", s, { rim: "0.7 0 0 0 0  0 0.68 0 0 0  0 0 0.7 0 0  0 0 0 1.15 0", speck: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0", grain: 0.12 })}
  ${washFilter("wash-solid", s, { rim: "0.72 0 0 0 0  0 0.7 0 0 0  0 0 0.72 0 0  0 0 0 1.1 0", speck: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0", grain: 0.1, density: "-1.1 0 0 0 1.5" })}
  ${washFilter("wash-dark", s, { rim: "1.2 0 0 0 0.04  0 1.2 0 0 0.04  0 0 1.2 0 0.05  0 0 0 0.8 0", speck: "0 0 0 0 1  0 0 0 0 1  0 0 0 0 1", grain: 0.06 })}
  <filter id="solid" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.007" numOctaves="3" seed="${s(1)}" result="n1"/>
    <feDisplacementMap in="SourceGraphic" in2="n1" scale="7" xChannelSelector="R" yChannelSelector="G" result="w1"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="${s(2)}" result="n2"/>
    <feDisplacementMap in="w1" in2="n2" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="wash-wet" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="${s(5)}" result="n1"/>
    <feDisplacementMap in="SourceGraphic" in2="n1" scale="14" xChannelSelector="R" yChannelSelector="G" result="w1"/>
    <feGaussianBlur in="w1" stdDeviation="2.2" result="shape"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.004 0.007" numOctaves="3" seed="${s(6)}" result="n3"/>
    <feColorMatrix in="n3" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -1.7 0 0 0 1.62" result="density"/>
    <feComposite in="shape" in2="density" operator="arithmetic" k1="1" result="body"/>
    <feGaussianBlur in="w1" stdDeviation="7" result="soft"/>
    <feComposite in="w1" in2="soft" operator="out" result="rim"/>
    <feGaussianBlur in="rim" stdDeviation="1.4" result="rimSoft"/>
    <feColorMatrix in="rimSoft" type="matrix" values="0.8 0 0 0 0  0 0.8 0 0 0  0 0 0.8 0 0  0 0 0 0.7 0" result="rimDark"/>
    <feMerge><feMergeNode in="body"/><feMergeNode in="rimDark"/></feMerge>
  </filter>
  <filter id="bloom" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="4" seed="${s(7)}" result="n1"/>
    <feDisplacementMap in="SourceGraphic" in2="n1" scale="60" xChannelSelector="R" yChannelSelector="G" result="w1"/>
    <feGaussianBlur in="w1" stdDeviation="9" result="shape"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="2" seed="${s(8)}" result="n3"/>
    <feColorMatrix in="n3" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -2 0 0 0 1.6" result="density"/>
    <feComposite in="shape" in2="density" operator="arithmetic" k1="1" result="body"/>
    <feGaussianBlur in="w1" stdDeviation="2" result="edge0"/>
    <feGaussianBlur in="w1" stdDeviation="14" result="far"/>
    <feComposite in="edge0" in2="far" operator="out" result="rim"/>
    <feColorMatrix in="rim" type="matrix" values="0.86 0 0 0 0  0 0.86 0 0 0  0 0 0.88 0 0  0 0 0 0.55 0" result="rimDark"/>
    <feMerge><feMergeNode in="body"/><feMergeNode in="rimDark"/></feMerge>
  </filter>
  <filter id="ink" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${s(9)}" result="n1"/>
    <feDisplacementMap in="SourceGraphic" in2="n1" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="line"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.22 0.5" numOctaves="2" seed="${s(10)}" result="n2"/>
    <feColorMatrix in="n2" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  5 0 0 0 -0.75" result="dry"/>
    <feComposite in="line" in2="dry" operator="in" result="broken"/>
    <feGaussianBlur in="broken" stdDeviation="0.35"/>
  </filter>
  <filter id="ink-wet" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${s(9)}" result="n1"/>
    <feDisplacementMap in="SourceGraphic" in2="n1" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="line"/>
    <feGaussianBlur in="line" stdDeviation="0.4"/>
  </filter>
  <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="${s(11)}" result="n1"/>
    <feDisplacementMap in="SourceGraphic" in2="n1" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="line"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${s(12)}" result="n2"/>
    <feColorMatrix in="n2" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  3.4 0 0 0 -1.15" result="tooth"/>
    <feComposite in="line" in2="tooth" operator="in"/>
  </filter>
  <filter id="line" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="0.5"/></filter>
  <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="glow-sm" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.2"/></filter>`;
}

/**
 * Lavis franc. Étapes : bord ondulé (deux échelles), densité de pigment inégale (grandes taches plus claires),
 * bord où le pigment s'accumule (`rim` : matrice de couleur appliquée à une bande intérieure, large et fondue),
 * grain en amas (le pigment granule dans le creux du papier).
 */
function washFilter(id, s, { rim, speck, grain, density = "-2.6 0 0 0 2.12" }) {
  return `<filter id="${id}" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.007" numOctaves="3" seed="${s(1)}" result="n1"/>
    <feDisplacementMap in="SourceGraphic" in2="n1" scale="7" xChannelSelector="R" yChannelSelector="G" result="w1"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="${s(2)}" result="n2"/>
    <feDisplacementMap in="w1" in2="n2" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="shape"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.008" numOctaves="4" seed="${s(3)}" result="n3"/>
    <feColorMatrix in="n3" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${density}" result="density"/>
    <feComposite in="shape" in2="density" operator="arithmetic" k1="1" result="body"/>
    <feGaussianBlur in="shape" stdDeviation="5" result="soft"/>
    <feComposite in="shape" in2="soft" operator="out" result="rim0"/>
    <feGaussianBlur in="rim0" stdDeviation="0.8" result="rim1"/>
    <feComposite in="rim1" in2="shape" operator="in" result="rim2"/>
    <feColorMatrix in="rim2" type="matrix" values="${rim}" result="rim"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="${s(4)}" result="n4"/>
    <feColorMatrix in="n4" type="matrix" values="${speck}  -5 0 0 0 1.95" result="specks"/>
    <feComposite in="specks" in2="shape" operator="in" result="grain0"/>
    <feComponentTransfer in="grain0" result="grain"><feFuncA type="linear" slope="${grain}"/></feComponentTransfer>
    <feMerge><feMergeNode in="body"/><feMergeNode in="rim"/><feMergeNode in="grain"/></feMerge>
  </filter>`;
}

/** Document SVG complet d'une scène : cadre 1600 × 900 (ou le cadrage demandé), défs, filtres et contenu */
export function svgDocument({ body, defs = "", seed = 1, viewBox = "0 0 1600 900", width, height }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" preserveAspectRatio="xMidYMax slice"><defs>${filters(seed)}${defs}</defs>${body}</svg>`;
}

/** Contexte de dessin d'une scène : graine, dégradés à déclarer, raccourcis */
export function canvas(seed) {
  const defs = [];
  let gid = 0;
  const rand = rng(seed * 7919);
  return {
    rand,
    defs,
    /** Nouveau hasard indépendant (une forme garde son dessin si on en ajoute d'autres ailleurs) */
    seedOf: () => Math.floor(rand() * 1e9),
    linear(stops, opts) {
      const id = `g${gid++}`;
      defs.push(linear(id, stops, opts));
      return `url(#${id})`;
    },
    radial(stops, opts) {
      const id = `g${gid++}`;
      defs.push(radial(id, stops, opts));
      return `url(#${id})`;
    },
    /**
     * Repasses de couleur dans une forme encore humide : quelques taches d'une autre teinte, fondues, qui restent
     * dans la forme (le pigment ne passe pas sur le papier sec). `box` : [x0, y0, x1, y1] de la forme.
     */
    mottle(d, box, colors, { count = 3, opacity = 0.28, size = 0.45, seed = 1 } = {}) {
      const id = `m${gid++}`;
      defs.push(`<clipPath id="${id}"><path d="${d}"/></clipPath>`);
      const r = rng(seed);
      const [x0, y0, x1, y1] = box;
      const w = x1 - x0;
      const h = y1 - y0;
      const spots = Array.from({ length: count }, (_, i) => {
        const cx = x0 + w * (0.1 + r() * 0.8);
        const cy = y0 + h * (0.1 + r() * 0.8);
        return `<path d="${blob(cx, cy, w * size * (0.5 + r() * 0.6), h * size * (0.5 + r() * 0.6), { seed: seed * 13 + i, irregular: 0.35 })}" fill="${colors[i % colors.length]}" opacity="${opacity * (0.6 + r() * 0.6)}"/>`;
      });
      return `<g clip-path="url(#${id})"><g filter="url(#wash-wet)">${spots.join("")}</g></g>`;
    },
  };
}

/** Raccourcis de balisage */
export const path = (d, attrs = "") => `<path d="${d}" ${attrs}/>`;
export const g = (attrs, ...children) => `<g ${attrs}>${children.flat().join("")}</g>`;
