"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Outils de dessin partagés par toutes les scènes (déclarés une seule fois dans la page).
 * Le langage visuel : aplats géométriques nets (arches, troncs, triangles, carrés),
 * dégradés doux, grain de pigment dans les formes et hachures dans les ombres.
 *
 * - wc-paint : bord à peine irrégulier + grain de pigment à l'intérieur des aplats
 * - wc-edge  : bord irrégulier seul (ancien rendu, plus discret)
 * - wc-cloud : formes floues et déchirées pour les nuages et les brumes
 * - wc-glow  : halo doux (soleil, étoiles, lucioles)
 * - hatch / hatch-light : hachures pour les ombres des monticules
 */
export function WatercolorDefs() {
  // Téléphones et tablettes : mêmes filtres, moins d'octaves de bruit et sans grain fin.
  // Le rendu reste aquarelle, mais chaque scène se dessine plusieurs fois plus vite à haute densité de pixels.
  const [lite, setLite] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const update = () => setLite(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (lite) {
    return (
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <filter id="wc-paint" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" seed="9" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="wc-edge" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="1" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="wc-cloud" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="8" />
          </filter>
          <filter id="wc-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <Patterns />
        </defs>
      </svg>
    );
  }
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <filter id="wc-paint" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="9" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="4" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0 0 0 -0.46" result="spots" />
          <feComposite in="spots" in2="shape" operator="in" result="grain" />
          <feMerge>
            <feMergeNode in="shape" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>
        <filter id="wc-edge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wc-cloud" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="8" />
        </filter>
        <filter id="wc-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <Patterns />
      </defs>
    </svg>
  );
}

/** Hachures pour les ombres des monticules */
function Patterns() {
  return (
    <>
      <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
        <path d="M0 3.5h7" stroke="#000" strokeOpacity="0.22" strokeWidth="1.1" />
      </pattern>
      <pattern id="hatch-light" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <path d="M0 4.5h9" stroke="#fff" strokeOpacity="0.28" strokeWidth="1" />
      </pattern>
    </>
  );
}

/** Calque SVG plein cadre, ancré en bas (le paysage reste au sol quel que soit le format) */
export function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Nuage : grappe d'ellipses passées dans le filtre déchiré */
export function Cloud({
  x,
  y,
  s = 1,
  fill = "#ffffff",
  opacity = 0.9,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#wc-cloud)" opacity={opacity} fill={fill}>
      <ellipse cx="0" cy="0" rx="180" ry="70" />
      <ellipse cx="-120" cy="20" rx="120" ry="55" />
      <ellipse cx="130" cy="18" rx="140" ry="60" />
      <ellipse cx="40" cy="-45" rx="110" ry="70" />
    </g>
  );
}

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

/**
 * Hauteur de la surface d'un monticule (mêmes paramètres que moundPath) pour une abscisse donnée :
 * sert à planter herbes et objets exactement sur la courbe.
 */
export function moundSurface(x0: number, x1: number, ground: number, peak: number, lean = 0) {
  const w = x1 - x0;
  const cx = x0 + w / 2 + lean;
  const segs: [number, number][][] = [
    [[x0, ground], [x0 + w * 0.15, peak + 20], [cx - w * 0.2, peak], [cx, peak]],
    [[cx, peak], [2 * cx - (cx - w * 0.2), peak], [x1 - w * 0.12, peak + 30], [x1, ground]],
  ];
  const pts: [number, number][] = [];
  segs.forEach(([p0, p1, p2, p3]) => {
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const u = 1 - t;
      const f = (k: 0 | 1) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k];
      pts.push([f(0), f(1)]);
    }
  });
  return (x: number) => {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      if (x <= bx) return bx === ax ? by : ay + ((x - ax) / (bx - ax)) * (by - ay);
    }
    return pts[pts.length - 1][1];
  };
}

/** Pseudo-hasard déterministe (même rendu serveur et client) */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Arbre géométrique : un tronc qui se divise en branches fines et symétriques,
 * chaque extrémité portant un carré de couleur (une « feuille » d'aplat).
 */
export function GeoTree({
  x,
  y,
  height,
  depth = 4,
  seed = 1,
  stroke = "#d8b4c4",
  leaves = ["#c2416b", "#e0608a"],
  leafSize = 46,
}: {
  x: number;
  y: number;
  height: number;
  depth?: number;
  seed?: number;
  stroke?: string;
  leaves?: string[];
  leafSize?: number;
}) {
  const rand = seeded(seed);
  const lines: string[] = [];
  const tips: { x: number; y: number; s: number; c: string }[] = [];
  const grow = (bx: number, by: number, len: number, spread: number, level: number) => {
    const ty = by - len;
    lines.push(`M${bx} ${by}V${ty}`);
    if (level === 0) {
      tips.push({ x: bx, y: ty, s: leafSize * (0.55 + rand() * 0.6), c: leaves[Math.floor(rand() * leaves.length)] });
      return;
    }
    [-1, 1].forEach((dir) => {
      const nx = bx + dir * spread;
      const ny = ty + len * 0.12;
      lines.push(`M${bx} ${ty + len * 0.3}C${bx} ${ny} ${nx} ${ny + len * 0.2} ${nx} ${ny}`);
      grow(nx, ny, len * (0.62 + rand() * 0.12), spread * 0.55, level - 1);
    });
  };
  grow(x, y, height * 0.42, height * 0.22, depth);
  return (
    <g>
      <path d={lines.join(" ")} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      {tips.map((t, i) => (
        <rect key={i} x={t.x - t.s / 2} y={t.y - t.s} width={t.s} height={t.s} fill={t.c} opacity="0.85" />
      ))}
    </g>
  );
}

/** Triangles suspendus à des tiges courbes (forêt) */
export function HangingTriangles({
  items,
  stroke = "#2b1b24",
  fill = "#2b1b24",
}: {
  items: { x: number; len: number; size: number; bend?: number }[];
  stroke?: string;
  fill?: string;
}) {
  return (
    <g>
      {items.map((t, i) => {
        const bend = t.bend ?? 0;
        const tipY = t.len;
        return (
          <g key={i}>
            <path d={`M${t.x} -10C${t.x + bend} ${tipY * 0.4} ${t.x + bend} ${tipY * 0.7} ${t.x + bend} ${tipY}`} fill="none" stroke={stroke} strokeWidth="2" />
            <path d={`M${t.x + bend - t.size / 2} ${tipY}H${t.x + bend + t.size / 2}L${t.x + bend} ${tipY + t.size * 1.25}Z`} fill={fill} />
          </g>
        );
      })}
    </g>
  );
}
