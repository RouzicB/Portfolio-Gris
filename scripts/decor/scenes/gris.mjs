// Accueil — le monde gris. Une grande arche de pierre brisée à gauche, une colonne qui penche à droite,
// des éclats au sol, des nuages lourds peints au lavis. Le centre reste vide : l'emblème s'y pose.
import { blob, brush, canvas, rough } from "../paint.mjs";

export const SEED = 3;

export default function scene() {
  const c = canvas(SEED);
  const { rand } = c;
  const out = [];
  const add = (s) => out.push(s);

  // ── Ciel : nuages lourds, lavis très dilués ─────────────────────────
  add(`<path d="${blob(1270, 120, 430, 120, { seed: 11, lumps: 11, irregular: 0.32 })}" fill="#b9b7b4" opacity="0.42" filter="url(#bloom)"/>`);
  add(`<path d="${blob(1420, 250, 260, 70, { seed: 12, irregular: 0.3 })}" fill="#c9c7c4" opacity="0.35" filter="url(#bloom)"/>`);
  add(`<path d="${blob(230, 80, 360, 85, { seed: 13, lumps: 10, irregular: 0.35 })}" fill="#c2c0bd" opacity="0.4" filter="url(#bloom)"/>`);
  add(`<path d="${blob(560, 200, 200, 45, { seed: 14 })}" fill="#d0cecb" opacity="0.28" filter="url(#bloom)"/>`);
  // Brume claire au-dessus de l'horizon
  add(`<path d="${blob(800, 690, 980, 70, { seed: 15, lumps: 12, irregular: 0.2 })}" fill="#ffffff" opacity="0.55" filter="url(#bloom)"/>`);

  // ── Traits de construction au crayon : l'horizon, et le cercle qui a servi à tracer l'arche ──
  add(`<g fill="none" stroke="#8d8a86" stroke-linecap="round" filter="url(#pencil)">
    <path d="M-20 744 C300 741 640 747 960 743 S1420 740 1620 745" stroke-width="1.3" opacity="0.7"/>
    <path d="M180 752 C520 750 900 755 1280 751" stroke-width="0.9" opacity="0.45"/>
    <circle cx="352" cy="566" r="214" stroke-width="0.9" opacity="0.38" stroke-dasharray="380 30 120 24 900"/>
    <path d="M1334 470 L1300 800" stroke-width="0.8" opacity="0.35"/>
  </g>`);

  // ── Lointains : deux pyramides pâles sur l'horizon ──
  add(`<g filter="url(#wash-wet)" opacity="0.9">
    <path d="${rough([[1108, 746], [1206, 668], [1312, 746]], { seed: 21, wobble: 2 })}" fill="#dad8d5"/>
    <path d="${rough([[1206, 668], [1312, 746], [1236, 746]], { seed: 22, wobble: 2 })}" fill="#ccc9c5" opacity="0.8"/>
    <path d="${rough([[1372, 746], [1430, 708], [1494, 746]], { seed: 23, wobble: 2 })}" fill="#dfddda"/>
  </g>`);

  // ── Sol : un lavis pâle, plus soutenu au premier plan ──
  const ground = c.linear([[0, "#f2f1ef"], [0.5, "#e9e8e5"], [1, "#d9d7d3"]]);
  add(`<path d="${rough([[-40, 744], [1640, 742], [1640, 940], [-40, 940]], { seed: 31, wobble: 2, step: 60 })}" fill="${ground}" filter="url(#wash)"/>`);
  // Traînées de pinceau sec sur le sol
  add(`<g fill="#a7a4a0" filter="url(#ink)" opacity="0.55">
    <path d="${brush([[140, 806], [420, 803], [700, 808]], { w: 2.2, seed: 32 })}"/>
    <path d="${brush([[880, 846], [1160, 842], [1380, 848]], { w: 2, seed: 33 })}"/>
    <path d="${brush([[40, 872], [260, 869]], { w: 1.6, seed: 34 })}"/>
  </g>`);

  // ── Ombres portées (posées avant les pierres) ──
  add(`<g filter="url(#wash-wet)" fill="#a19e9a">
    <path d="${blob(420, 800, 330, 16, { seed: 41, irregular: 0.15 })}" opacity="0.4"/>
    <path d="${blob(1360, 812, 150, 12, { seed: 42 })}" opacity="0.38"/>
  </g>`);

  // ── L'arche brisée ──────────────────────────────────────────────────
  // Une seule silhouette peinte d'un lavis dégradé (plus clair en haut), le sommet cassé côté droit.
  // Les pierres ne sont qu'esquissées : quelques joints au crayon, quelques claveaux repassés d'un second lavis.
  const cx = 352;
  const cy = 566;
  const ri = 172;
  const re = 268;
  const P = (deg, r) => [cx + Math.cos((deg * Math.PI) / 180) * r, cy - Math.sin((deg * Math.PI) / 180) * r];
  const arcPts = (from, to, r, step = 8, jit = 0) => {
    const pts = [];
    const n = Math.max(1, Math.round(Math.abs(to - from) / step));
    for (let i = 0; i <= n; i++) pts.push(P(from + ((to - from) * i) / n, r + (i && i < n ? (rand() - 0.5) * jit : 0)));
    return pts;
  };
  const leftArch = [
    [cx - re, 804], [cx - re + 2, cy + 40],
    ...arcPts(180, 64, re, 7, 7),
    P(60, re - 22), P(67, re - 50), P(58, re - 72), P(63, ri + 4),
    ...arcPts(62, 180, ri, 9, 3),
    [cx - ri, 804],
  ];
  const rightArch = [
    [cx + ri, 804], ...arcPts(0, 17, ri, 6),
    P(15, ri + 22), P(23, ri + 50), P(13, ri + 74), P(19, re),
    ...arcPts(20, 0, re, 7, 5),
    [cx + re + 2, 804],
  ];
  const stoneFill = c.linear([[0, "#e6e5e2"], [0.55, "#dcdad7"], [1, "#c9c6c2"]]);
  const leftD = rough(leftArch, { seed: 51, wobble: 2.2, step: 30 });
  const rightD = rough(rightArch, { seed: 52, wobble: 2.2, step: 30 });
  add(`<g filter="url(#wash)" fill="${stoneFill}"><path d="${leftD}"/><path d="${rightD}"/></g>`);
  // Gris chaud et gris froid repassés dans le lavis encore humide
  add(c.mottle(leftD, [cx - re, cy - re, cx + 200, 804], ["#b7ada3", "#a6adb4", "#c2bcb4"], { count: 5, seed: 55, opacity: 0.3, size: 0.32 }));
  add(c.mottle(rightD, [cx + ri, cy - 120, cx + re, 804], ["#a6adb4", "#b7ada3"], { count: 2, seed: 56, opacity: 0.28 }));
  // Second lavis sur quelques claveaux (le pigment n'est jamais égal d'une pierre à l'autre)
  const voussoir = (a0, a1, seed, fill, op) =>
    `<path d="${rough([P(a0, ri + 2), P(a0, re - 4), P(a1, re - 4), P(a1, ri + 2)], { seed, wobble: 1.6, step: 24 })}" fill="${fill}" opacity="${op}"/>`;
  add(`<g filter="url(#wash)">
    ${voussoir(166, 152, 61, "#b9b6b2", 0.32)}${voussoir(124, 111, 62, "#c4c1bd", 0.3)}${voussoir(97, 84, 63, "#b2afab", 0.26)}
    ${voussoir(71, 64, 64, "#bdbab6", 0.3)}${voussoir(12, 0, 65, "#b9b6b2", 0.3)}
  </g>`);
  // Volume : l'intrados et les flancs intérieurs dans l'ombre (lavis mouillé, fondu)
  add(`<g filter="url(#wash-wet)" fill="#8d8a86">
    <path d="${rough([[cx - ri, 800], ...arcPts(180, 112, ri - 2, 10), ...arcPts(108, 180, ri + 18, 10), [cx - ri + 16, 800]], { seed: 81, wobble: 2 })}" opacity="0.3"/>
    <path d="${rough([[cx + re - 30, 800], [cx + re - 28, cy - 8], [cx + re, cy - 4], [cx + re + 2, 800]], { seed: 82, wobble: 2 })}" opacity="0.3"/>
  </g>`);
  // Joints et assises, au crayon, à peine appuyés
  const joints = [];
  for (let a = 180 - 13.8; a > 62; a -= 13.8) joints.push(`M${P(a, ri + 3).join(" ")}L${P(a + (rand() - 0.5) * 2, re - 5).join(" ")}`);
  joints.push(`M${P(6.5, ri + 3).join(" ")}L${P(7, re - 5).join(" ")}`);
  for (const y of [742, 690, 646, 604]) joints.push(`M${cx - re + 4} ${y + (rand() - 0.5) * 4}L${cx - ri - 3} ${y + (rand() - 0.5) * 6}`);
  for (const y of [756, 712, 662, 618]) joints.push(`M${cx + ri + 3} ${y + (rand() - 0.5) * 4}L${cx + re - 4} ${y + (rand() - 0.5) * 6}`);
  add(`<path d="${joints.join("")}" fill="none" stroke="#7d7a76" stroke-width="1.1" stroke-linecap="round" filter="url(#pencil)" opacity="0.55"/>`);
  // Encre : le contour n'est jamais fermé, posé après coup, un peu à côté du lavis
  add(`<g fill="#4a4743" filter="url(#ink)" opacity="0.8">
    <path d="${brush(arcPts(177, 102, re + 5, 6, 5), { w: 3.6, seed: 91, peak: 0.45 })}"/>
    <path d="${brush(arcPts(170, 122, ri - 3, 6, 3), { w: 2.2, seed: 92, start: 0.4 })}"/>
    <path d="${brush([[cx - ri - 3, cy + 8], [cx - ri - 5, 700], [cx - ri - 2, 798]], { w: 2.4, seed: 94, start: 0.6 })}"/>
    <path d="${brush([[cx - re - 3, 620], [cx - re - 5, 712], [cx - re - 1, 798]], { w: 2.8, seed: 95, peak: 0.6 })}"/>
    <path d="${brush([[cx + re + 5, cy + 24], [cx + re + 2, 712], [cx + re + 5, 798]], { w: 2.6, seed: 96 })}"/>
    <path d="${brush([P(64, re + 3), P(60, re - 22), P(67, re - 50), P(58, re - 72)], { w: 1.6, seed: 97, start: 0.7 })}"/>
  </g>`);
  // Fissures
  add(`<g fill="#5b5854" filter="url(#ink)" opacity="0.55">
    <path d="${brush([P(100, re - 2), P(98, re - 30), P(102, re - 52), P(97, ri + 6)], { w: 1.3, seed: 101, start: 0.6, end: 0.1 })}"/>
    <path d="${brush([[110, 640], [128, 652], [126, 676], [146, 692]], { w: 1.1, seed: 103 })}"/>
  </g>`);
  // Anneaux sombres au pied gauche
  add(`<g fill="#6f6c68" filter="url(#ink)" opacity="0.62">
    ${[700, 738, 772].map((y, i) => `<path d="${brush([[cx - re + 2, y + i], [cx - re + 50, y - 2], [cx - ri - 4, y + 2]], { w: 3.4 - i * 0.5, seed: 110 + i, start: 0.5, end: 0.4 })}"/>`).join("")}
  </g>`);
  // Un claveau tombé de la brèche, au pied de l'arche
  add(`<path d="${rough([[650, 796], [668, 762], [716, 768], [708, 802]], { seed: 120, wobble: 2 })}" fill="#d6d4d1" filter="url(#wash)"/>`);
  add(`<path d="${brush([[650, 798], [684, 804], [708, 803]], { w: 1.6, seed: 121 })}" fill="#5b5854" filter="url(#ink)" opacity="0.6"/>`);

  // ── La colonne qui penche, à droite ──────────────────────────────────
  // Trois tambours empilés de travers, le dernier brisé ; un quatrième couché au sol
  const drum = (x, y, w, h, ang, seed, fill) => {
    const a = (ang * Math.PI) / 180;
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    const P = (u, v) => [x + u * ux - v * uy, y + u * uy + v * ux];
    return { d: rough([P(-w / 2, 0), P(w / 2, 0), P(w / 2, -h), P(-w / 2, -h)], { seed, wobble: 2 }), fill, P };
  };
  const tilt = 12;
  const d1 = drum(1304, 806, 92, 120, tilt, 131, "#dcdad7");
  const t1 = d1.P(4, -120);
  const d2 = drum(t1[0], t1[1], 86, 112, tilt + 2, 132, "#e3e1de");
  // Cassure en biais : le haut du dernier tambour s'est détaché
  const brk = [d2.P(43, -112), d2.P(30, -136), d2.P(12, -126), d2.P(-6, -158), d2.P(-26, -144), d2.P(-43, -150)];
  add(`<g filter="url(#wash)">
    <path d="${d1.d}" fill="${d1.fill}"/><path d="${d2.d}" fill="${d2.fill}"/>
    <path d="${rough([d2.P(-43, -112), ...brk], { seed: 133, wobble: 1.5, step: 14 })}" fill="#d6d4d1"/>
  </g>`);
  // Ombre sur le flanc droit de la colonne
  add(`<g filter="url(#wash-wet)" fill="#8f8c88" opacity="0.38">
    <path d="${rough([d1.P(24, 0), d1.P(46, 0), d1.P(44, -120), d1.P(22, -120)], { seed: 134 })}"/>
    <path d="${rough([d2.P(22, 0), d2.P(43, 0), d2.P(42, -112), d2.P(20, -112)], { seed: 135 })}"/>
  </g>`);
  // Cannelures au crayon, contour et cassure à l'encre
  add(`<g fill="none" stroke="#7d7a76" stroke-width="1" filter="url(#pencil)" opacity="0.6">
    ${[-26, -8, 10, 28].map((u) => `<path d="M${d1.P(u, -4).join(" ")}L${d1.P(u, -116).join(" ")}M${d2.P(u, -4).join(" ")}L${d2.P(u, -108).join(" ")}"/>`).join("")}
  </g>`);
  add(`<g fill="#4c4945" filter="url(#ink)" opacity="0.75">
    <path d="${brush([d1.P(-47, -2), d1.P(-46, -60), d1.P(-45, -118)], { w: 2.4, seed: 141 })}"/>
    <path d="${brush([d2.P(-44, -4), d2.P(-44, -110)], { w: 2.2, seed: 142, start: 0.5 })}"/>
    <path d="${brush([d1.P(-48, -121), d1.P(0, -125), d1.P(50, -119)], { w: 2.6, seed: 143, start: 0.6, end: 0.3 })}"/>
    <path d="${brush([...brk].reverse(), { w: 1.8, seed: 144, peak: 0.5 })}"/>
  </g>`);
  // Tambour couché au sol
  add(`<path d="${rough([[1404, 808], [1496, 802], [1500, 760], [1408, 764]], { seed: 151, wobble: 2 })}" fill="#d8d6d3" filter="url(#wash)"/>`);
  add(`<path d="${blob(1500, 784, 16, 23, { seed: 152, irregular: 0.1 })}" fill="#c3c0bc" filter="url(#wash)"/>`);
  add(`<path d="${brush([[1406, 762], [1450, 760], [1498, 758]], { w: 2, seed: 153 })}" fill="#4c4945" filter="url(#ink)" opacity="0.6"/>`);

  // ── Éclats au sol, de tailles et de valeurs différentes ──
  const shards = [
    [520, 828, 26, "#cfcdca"], [760, 812, 12, "#9c9995"], [905, 858, 20, "#d8d6d3"], [1010, 806, 9, "#8f8c88"],
    [1180, 840, 16, "#c9c7c4"], [1560, 822, 14, "#a6a39f"], [250, 850, 18, "#d1cfcc"],
  ];
  add(`<g filter="url(#wash)">${shards
    .map(([x, y, s, f], i) => {
      const k = rng2(i);
      return `<path d="${rough([[x - s, y], [x - s * 0.2 + k * 6, y - s * (0.9 + k * 0.5)], [x + s * 0.9, y - s * 0.2], [x + s * 0.7, y + 2]], { seed: 160 + i, wobble: 1.2, step: 14 })}" fill="${f}"/>`;
    })
    .join("")}</g>`);

  // ── Brume au ras du sol, devant ──
  add(`<path d="${blob(150, 900, 360, 70, { seed: 171 })}" fill="#ffffff" opacity="0.6" filter="url(#bloom)"/>`);
  add(`<path d="${blob(1460, 905, 320, 60, { seed: 172 })}" fill="#ffffff" opacity="0.55" filter="url(#bloom)"/>`);

  return { body: out.join("\n"), defs: c.defs.join("") };
}

function rng2(i) {
  return ((i * 37) % 11) / 11;
}
