// Aptitudes — la grotte bleue. Des parois sombres qui cadrent la scène, des rais de lumière qui tombent d'une
// ouverture, un temple en ruine qui flotte au fond, et l'arbre de lumière sur son socle à gradins : ses branches
// montent à la verticale et traversent deux cadres translucides.
import { blob, brush, canvas, rough } from "../paint.mjs";

export const SEED = 11;

export default function scene() {
  const c = canvas(SEED);
  const { rand } = c;
  const out = [];
  const add = (s) => out.push(s);

  // ── Lueur de l'eau au fond, et rais de lumière depuis une ouverture en haut à droite ──
  add(`<path d="${blob(800, 560, 560, 230, { seed: 14 })}" fill="#3a8ab0" opacity="0.22" filter="url(#bloom)"/>`);
  add(`<g filter="url(#wash-wet)" fill="#a8e6f7">
    <path d="${rough([[1080, -40], [1180, -40], [910, 900], [660, 900]], { seed: 11, wobble: 4, step: 90 })}" opacity="0.1"/>
    <path d="${rough([[1200, -40], [1246, -40], [1120, 900], [1000, 900]], { seed: 12, wobble: 4, step: 90 })}" opacity="0.08"/>
    <path d="${rough([[990, -40], [1024, -40], [560, 900], [480, 900]], { seed: 13, wobble: 4, step: 90 })}" opacity="0.06"/>
  </g>`);

  // ── Le temple du fond, pâle, en suspens au-dessus de l'eau sur son bloc de roche ──
  add(`<g transform="translate(-150 -96)">`);
  const rockUnder = rough([[566, 760], [1016, 758], [968, 800], [880, 846], [806, 826], [716, 852], [626, 806]], { seed: 27, wobble: 2, step: 36 });
  add(`<path d="${rockUnder}" fill="#2f7596" opacity="0.5" filter="url(#wash-wet)"/>`);
  add(`<path d="${rough([[806, 826], [880, 846], [968, 800], [860, 766]], { seed: 28, wobble: 2 })}" fill="#1d5a78" opacity="0.4" filter="url(#wash-wet)"/>`);
  const ruin = [];
  [610, 690, 910, 990].forEach((x, i) => {
    const broken = i === 3 ? 70 : 0;
    ruin.push(rough([[x - 16, 760], [x - 15, 474 + broken], [x - 4, 466 + broken + 6], [x + 15, 470 + broken], [x + 16, 760]], { seed: 21 + i, wobble: 2 }));
  });
  ruin.push(rough([[580, 476], [930, 472], [960, 450], [800, 404], [578, 450]], { seed: 25, wobble: 3 }));
  add(`<g fill="#3f86a6" opacity="0.5" filter="url(#wash-wet)">${ruin.map((d) => `<path d="${d}"/>`).join("")}</g>`);
  // Un morceau du fronton est tombé à côté, posé sur le bloc de roche
  add(`<path d="${rough([[934, 760], [952, 728], [998, 736], [994, 760]], { seed: 26, wobble: 2 })}" fill="#3f86a6" opacity="0.45" filter="url(#wash-wet)"/>`);
  add(`<path d="M742 760 V600 A58 58 0 0 1 858 600 V760" fill="none" stroke="#86c9e2" stroke-width="1.4" filter="url(#pencil)" opacity="0.5"/>`);

  add("</g>");
  // Son reflet sur l'eau, très pâle
  add(`<path d="${blob(650, 840, 230, 16, { seed: 29 })}" fill="#86c9e2" opacity="0.14" filter="url(#bloom)"/>`);

  // ── L'arbre de lumière, à droite (le titre reste lisible) ──
  const TX = 1050;
  add(`<path d="${blob(TX, 470, 300, 400, { seed: 140, lumps: 10, irregular: 0.15 })}" fill="#7fd3ea" opacity="0.08" filter="url(#bloom)"/>`);
  // Deux carrés d'eau de même taille, de part et d'autre du tronc, sans se toucher, et décalés en hauteur (le gauche
  // plus haut) : posés au même niveau, la silhouette devenait une figure en miroir. Chacun reçoit quatre branches,
  // les mêmes de chaque côté (épaisseur, écart, hauteur dans le carré) ; chaque branche monte dans son carré et s'y arrête.
  const SQ = { gap: 26, w: 180, h: 176, y: [88, 180] };
  const frames = [
    { x: TX - SQ.gap - SQ.w, y: SQ.y[0], w: SQ.w, h: SQ.h },
    { x: TX + SQ.gap, y: SQ.y[1], w: SQ.w, h: SQ.h },
  ];
  const box = ({ x, y, w, h }) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  add(`<g fill="#7fd3ea" opacity="0.16" filter="url(#wash)">${frames.map((f) => `<path d="${rough(box(f), { seed: 141, wobble: 1, step: 40 })}"/>`).join("")}</g>`);
  add(`<g fill="none" stroke="#bfe9f6" stroke-width="2" stroke-linejoin="round" opacity="0.5" filter="url(#line)">${frames
    .map((f) => `<path d="${rough(box(f), { seed: 145, wobble: 0.8, step: 30 })}"/>`)
    .join("")}</g>`);
  // Tronc évasé ; chaque branche part du tronc, s'écarte en courbe douce, puis monte droit jusqu'au haut de son carré.
  // Un côté est dessiné, l'autre en est le reflet exact.
  const bez = (p0, p1, p2, p3, n = 24) =>
    Array.from({ length: n + 1 }, (_, k) => {
      const t = k / n;
      const u = 1 - t;
      return [0, 1].map((j) => u * u * u * p0[j] + 3 * u * u * t * p1[j] + 3 * u * t * t * p2[j] + t * t * t * p3[j]);
    });
  // [départ sur le tronc, écart, épaisseur, fin sous le haut du carré] : de l'intérieur vers l'extérieur, plus basses
  // et plus fines
  const half = [
    [376, 46, 12, 20],
    [404, 88, 10, 28],
    [438, 130, 8, 40],
    [476, 172, 6, 58],
  ];
  const limbs = half.flatMap(([y0, dx, w, below], i) =>
    // Même dessin des deux côtés (à gauche retourné), chacun arrêté dans son propre carré
    [-1, 1].map((side, s) => {
      const top = SQ.y[s] + below;
      const bend = Math.max(top + 30, y0 - 120);
      const curve = bez([0, y0 + 10], [0, y0 - 46], [dx, bend + 40], [dx, bend]);
      const rise = Array.from({ length: 6 }, (_, k) => [dx, bend - ((bend - top) * (k + 1)) / 6]);
      const p = [...curve, ...rise].map(([x, y]) => [TX + side * x, y]);
      return {
        d: brush(p, { w, start: 0.95, end: 0.55, peak: 0.4, seed: 150 + i, jitter: 0 }),
        core: brush(p, { w: w * 0.32, start: 0.6, end: 0.3, peak: 0.5, seed: 158 + i, jitter: 0 }),
      };
    }),
  );
  const trunkLight = brush([[TX, 800], [TX, 660], [TX, 520], [TX, 360]], { w: 54, start: 1, end: 0.16, peak: 0.02, seed: 149, jitter: 0 });
  add(`<g fill="#7fd3ea" opacity="0.22" filter="url(#glow)"><path d="${trunkLight}"/>${limbs.map((l) => `<path d="${l.d}"/>`).join("")}</g>`);
  // Trait net (léger flou, sans le tremblé de l'encre) et un cœur plus clair au milieu de chaque branche
  add(`<g fill="#cdeef8" opacity="0.8" filter="url(#line)"><path d="${trunkLight}"/>${limbs.map((l) => `<path d="${l.d}"/>`).join("")}</g>`);
  add(`<g fill="#f2fcff" opacity="0.55" filter="url(#line)">${limbs.map((l) => `<path d="${l.core}"/>`).join("")}</g>`);
  // Socle en gradins, posé dans l'eau
  const tiers = [[TX - 80, TX + 80, 772, 22, "#5fa9c6"], [TX - 120, TX + 120, 794, 20, "#4f93b3"], [TX - 160, TX + 160, 814, 24, "#3d7f9f"]];
  add(`<g filter="url(#wash-solid)">${tiers
    .map(([x0, x1, y, h, fill], i) => `<path d="${rough([[x0, y], [x1, y], [x1, y + h], [x0, y + h]], { seed: 160 + i, wobble: 1.2, step: 30 })}" fill="${fill}"/>`)
    .join("")}</g>`);
  add(`<g fill="#b9ecf8" filter="url(#ink)" opacity="0.5">${tiers
    .map(([x0, x1, y], i) => `<path d="${brush([[x0 + 6, y + 1], [(x0 + x1) / 2, y], [x1 - 6, y + 1]], { w: 1.6, seed: 165 + i })}"/>`)
    .join("")}</g>`);
  // Reflet de l'arbre dans l'eau
  add(`<path d="${blob(TX, 864, 190, 22, { seed: 170 })}" fill="#bfe9f6" opacity="0.2" filter="url(#bloom)"/>`);
  add(`<path d="${rough([[TX - 20, 840], [TX + 20, 840], [TX + 14, 908], [TX - 14, 908]], { seed: 171, wobble: 2 })}" fill="#cdeef8" opacity="0.16" filter="url(#wash-wet)"/>`);
  // Surface de l'eau
  add(`<g fill="#a8e6f7" filter="url(#ink)" opacity="0.42">${Array.from({ length: 12 }, (_, i) => {
    const y = 806 + rand() * 84;
    const x = 260 + rand() * 1080;
    const w = 30 + rand() * 110;
    return `<path d="${brush([[x, y], [x + w / 2, y - 1.5], [x + w, y]], { w: 1.6, seed: 40 + i })}"/>`;
  }).join("")}</g>`);

  // ── Parois de la grotte : de grandes masses sombres qui cadrent ──
  const wallFill = c.linear([[0, "#04101a"], [1, "#0a2335"]]);
  const left = rough(
    [[-40, -40], [300, -40], [250, 40], [200, 120], [236, 210], [170, 330], [196, 430], [120, 560], [150, 690], [90, 800], [120, 940], [-40, 940]],
    { seed: 51, wobble: 8, step: 36 },
  );
  const right = rough(
    [[1640, -40], [1330, -40], [1380, 60], [1440, 150], [1410, 260], [1470, 380], [1430, 500], [1490, 620], [1460, 760], [1500, 940], [1640, 940]],
    { seed: 52, wobble: 8, step: 36 },
  );
  const ceiling = rough(
    [[-40, -40], [1640, -40], [1640, 50], [1420, 96], [1300, 70], [1180, 104], [1060, 62], [900, 86], [760, 40], [600, 92], [430, 60], [300, 110], [-40, 70]],
    { seed: 53, wobble: 6, step: 36 },
  );
  add(`<g fill="${wallFill}" filter="url(#wash-dark)"><path d="${left}"/><path d="${right}"/><path d="${ceiling}"/></g>`);
  add(c.mottle(left, [-40, -40, 300, 940], ["#17405a", "#020a10", "#1d4d68"], { count: 4, seed: 54, opacity: 0.45, size: 0.55 }));
  add(c.mottle(right, [1330, -40, 1640, 940], ["#17405a", "#020a10", "#1d4d68"], { count: 4, seed: 55, opacity: 0.45, size: 0.55 }));
  // Stalactites, peu, de longueurs inégales
  add(`<g fill="#06151f" filter="url(#wash-dark)">${[[340, 100, 80], [560, 84, 36], [790, 40, 62], [1340, 92, 70], [1290, 70, 48]]
    .map(([x, y, h], i) => `<path d="${rough([[x - 16 - (i % 2) * 8, y - 8], [x + 18, y - 8], [x + 4, y + h]], { seed: 60 + i, wobble: 2, step: 16 })}"/>`)
    .join("")}</g>`);
  // La lumière accroche le bord des parois
  add(`<g fill="#4f9cc0" filter="url(#ink)" opacity="0.4">
    <path d="${brush([[248, 44], [200, 122], [234, 210], [170, 330], [194, 430]], { w: 2.6, seed: 66, peak: 0.4 })}"/>
    <path d="${brush([[1382, 64], [1440, 152], [1410, 262], [1468, 380]], { w: 2.4, seed: 67, peak: 0.5 })}"/>
  </g>`);

  // ── Rochers sombres au premier plan, dans l'eau ──
  const rockL = rough([[-40, 940], [-40, 780], [80, 752], [200, 790], [260, 860], [300, 940]], { seed: 71, wobble: 4, step: 30 });
  const rockR = rough([[1640, 940], [1640, 760], [1530, 744], [1420, 790], [1370, 860], [1330, 940]], { seed: 72, wobble: 4, step: 30 });
  add(`<g fill="#030b12" filter="url(#wash-dark)"><path d="${rockL}"/><path d="${rockR}"/></g>`);
  add(`<g fill="#2b6f90" filter="url(#ink)" opacity="0.5">
    <path d="${brush([[-30, 780], [80, 752], [200, 790], [258, 858]], { w: 2.2, seed: 73 })}"/>
    <path d="${brush([[1630, 762], [1530, 745], [1420, 790], [1372, 858]], { w: 2.2, seed: 74 })}"/>
  </g>`);

  // ── Particules en suspension ──
  const motes = Array.from({ length: 16 }, () => [300 + rand() * 1000, 140 + rand() * 600, 1 + rand() * rand() * 3.5]);
  add(`<g fill="#cdf3fc" filter="url(#glow-sm)" opacity="0.75">${motes.map(([mx, my, r]) => `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${r.toFixed(1)}"/>`).join("")}</g>`);

  return { body: out.join("\n"), defs: c.defs.join("") };
}
