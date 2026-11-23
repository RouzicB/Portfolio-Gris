// Projets — le ciel pastel. Une mer de nuages roses et blancs, une île flottante avec son escalier à droite, un temple
// grec brisé sur son île à gauche, quelques oiseaux à l'encre, des rais de lumière. Les cartes des projets passent au milieu.
import { blob, brush, canvas, rough } from "../paint.mjs";

export const SEED = 17;

export default function scene({ portrait = false } = {}) {
  const c = canvas(SEED);
  const out = [];
  const add = (s) => out.push(s);

  // ── Lumière en biais, depuis le soleil ──
  add(`<g filter="url(#wash-wet)" fill="#ffffff" opacity="0.2">
    <path d="${rough([[1240, -40], [1420, -40], [760, 900], [520, 900]], { seed: 11, wobble: 10 })}"/>
    <path d="${rough([[1460, -40], [1540, -40], [1100, 900], [980, 900]], { seed: 12, wobble: 10 })}" opacity="0.7"/>
  </g>`);

  // ── Nuages hauts, très dilués ──
  add(`<path d="${blob(330, 110, 340, 60, { seed: 21, lumps: 10 })}" fill="#ffffff" opacity="0.55" filter="url(#bloom)"/>`);
  add(`<path d="${blob(760, 70, 260, 44, { seed: 22 })}" fill="#f3c6d6" opacity="0.4" filter="url(#bloom)"/>`);
  add(`<path d="${blob(1460, 300, 240, 50, { seed: 23 })}" fill="#ffffff" opacity="0.5" filter="url(#bloom)"/>`);

  // ── Temple grec brisé, sur une île qui flotte au-dessus de la mer de nuages ──
  // Dessiné autour de (1320, 600) ; sur téléphone, le cadrage ne garde que le centre : le temple y vient, plus petit.
  // Sur grand écran, il flotte en haut à gauche, en miroir de l'île à l'escalier : chaque côté du ciel a sa ruine
  add(`<g transform="${portrait ? "translate(905 640) scale(0.72)" : "translate(200 236) scale(0.74)"} translate(-1320 -600)">`);
  const isle = rough([[1146, 604], [1494, 604], [1450, 640], [1392, 716], [1330, 672], [1256, 702], [1196, 646]], { seed: 31, wobble: 2.5, step: 30 });
  add(`<path d="${isle}" fill="${c.linear([[0, "#a9d2dc"], [1, "#6fa7bb"]])}" filter="url(#wash)"/>`);
  add(`<path d="${rough([[1330, 672], [1392, 716], [1450, 640], [1356, 606]], { seed: 32, wobble: 2 })}" fill="#5f98ad" opacity="0.45" filter="url(#wash)"/>`);
  add(c.mottle(isle, [1146, 604, 1494, 716], ["#d4ecf1", "#e8b8cc"], { count: 2, seed: 33, opacity: 0.3, size: 0.45 }));
  // Soubassement en deux marches
  const slab = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  add(`<g filter="url(#wash-solid)">
    <path d="${rough(slab(1162, 1478, 588, 606), { seed: 34, wobble: 1, step: 40 })}" fill="#c4e0e7"/>
    <path d="${rough(slab(1178, 1462, 574, 588), { seed: 35, wobble: 1, step: 40 })}" fill="#d6ebf0"/>
  </g>`);
  // Six colonnes : la cinquième brisée à mi-hauteur, la sixième réduite à un tronçon
  const cols = [];
  for (let i = 0; i < 6; i++) {
    const x = 1198 + i * 50;
    const top = i === 4 ? 528 : i === 5 ? 552 : 470;
    const crown =
      i === 4 ? [[x + 18, top - 4], [x + 12, top + 8], [x + 6, top - 10], [x, top + 2]] : i === 5 ? [[x + 18, top + 4], [x, top - 6]] : [[x + 18, top], [x, top]];
    cols.push({ x, top, d: rough([[x, 574], [x + 18, 574], ...crown], { seed: 40 + i, wobble: 0.8, step: 30 }) });
  }
  add(`<g filter="url(#wash-solid)">${cols
    .map(({ x, top, d }) => `<path d="${d}" fill="#deeff3"/><path d="${rough(slab(x + 11, x + 18, top + 6, 574), { seed: x, wobble: 0.6, step: 30 })}" fill="#a9cfd9" opacity="0.55"/>`)
    .join("")}</g>`);
  // Entablement et fronton, cassés côté droit (au-dessus des colonnes brisées)
  add(`<g filter="url(#wash-solid)">
    <path d="${rough([[1186, 456], [1372, 456], [1384, 462], [1366, 470], [1186, 470]], { seed: 48, wobble: 0.8, step: 30 })}" fill="#d6ebf0"/>
    <path d="${rough([[1186, 456], [1296, 412], [1352, 434], [1340, 446], [1350, 456]], { seed: 49, wobble: 0.8, step: 24 })}" fill="#e6f3f6"/>
    <path d="${rough([[1296, 412], [1352, 434], [1340, 446], [1350, 456], [1300, 456]], { seed: 50, wobble: 0.8, step: 24 })}" fill="#bcdbe3" opacity="0.7"/>
  </g>`);
  // Morceaux du fronton tombés, restés en suspens
  add(`<g filter="url(#wash-solid)">
    <path d="${rough([[1430, 424], [1466, 416], [1470, 430], [1434, 438]], { seed: 51, wobble: 0.6, step: 12 })}" fill="#d6ebf0"/>
    <path d="${rough([[1480, 470], [1496, 466], [1500, 480], [1484, 482]], { seed: 52, wobble: 0.6, step: 8 })}" fill="#e8b8cc"/>
    <path d="${rough([[1250, 530], [1262, 526], [1264, 538], [1252, 540]], { seed: 53, wobble: 0.6, step: 8 })}" fill="#a9d2dc"/>
  </g>`);
  // Encre et crayon, en partie seulement : arêtes du fronton, sol, cannelures
  add(`<g fill="#3d6274" filter="url(#ink)" opacity="0.5">
    <path d="${brush([[1184, 457], [1240, 434], [1296, 411], [1350, 433]], { w: 1.8, seed: 54, peak: 0.4 })}"/>
    <path d="${brush([[1160, 606], [1320, 605], [1480, 606]], { w: 1.6, seed: 55 })}"/>
    <path d="${brush([[1394, 716], [1450, 641], [1494, 605]], { w: 1.6, seed: 56, start: 0.6 })}"/>
  </g>`);
  add(`<g fill="none" stroke="#7fb2c4" stroke-width="0.9" filter="url(#pencil)" opacity="0.55">${cols
    .slice(0, 4)
    .map(({ x }) => `<path d="M${x + 6} 478 V570 M${x + 12} 478 V570"/>`)
    .join("")}<path d="M1180 470 L1460 470" opacity="0.6"/></g>`);
  add("</g>");

  // ── Île flottante à droite, sous le temple : un rocher renversé, un escalier qui monte vers rien ──
  // (dessinée à l'origine du cadre, puis posée à sa place, au bord droit, derrière la dernière carte)
  add(`<g transform="translate(1340 150) scale(0.66)">`);
  const island = rough([[-40, 470], [60, 446], [190, 452], [262, 476], [230, 520], [160, 610], [96, 690], [40, 640], [-40, 600]], { seed: 41, wobble: 3, step: 30 });
  const islandFill = c.linear([[0, "#7fb2c4"], [1, "#4f8ba1"]]);
  add(`<path d="${island}" fill="${islandFill}" filter="url(#wash)"/>`);
  add(c.mottle(island, [-40, 446, 262, 690], ["#a9d3df", "#3f7a90", "#e8b8cc"], { count: 3, seed: 42, opacity: 0.35, size: 0.5 }));
  const stairs = [];
  for (let i = 0; i < 6; i++) {
    const x = 60 + i * 26;
    const y = 446 - i * 22;
    stairs.push(rough([[x, y + 24], [x, y], [x + 30, y], [x + 30, y + 24]], { seed: 50 + i, wobble: 1, step: 14 }));
  }
  add(`<g fill="#a9d3df" filter="url(#wash)">${stairs.map((d) => `<path d="${d}"/>`).join("")}</g>`);
  add(`<g fill="#26304a" filter="url(#ink)" opacity="0.65">
    <path d="${brush([[-30, 470], [60, 447], [190, 453], [262, 477]], { w: 2.6, seed: 61 })}"/>
    <path d="${brush([[262, 478], [230, 522], [160, 612], [98, 690]], { w: 2, seed: 62, peak: 0.2 })}"/>
    <path d="${brush([[60, 446], [86, 424], [112, 402], [138, 380], [164, 358], [190, 336], [218, 322]], { w: 1.6, seed: 63, start: 0.7, end: 0.1 })}"/>
  </g>`);
  // Deux tiges d'herbe sur l'île
  add(`<g fill="#2f6a58" filter="url(#ink)" opacity="0.8">
    <path d="${brush([[200, 454], [204, 420], [196, 392]], { w: 2.4, start: 1, end: 0.1, peak: 0.1, seed: 64 })}"/>
    <path d="${brush([[212, 456], [222, 430], [232, 414]], { w: 2, start: 1, end: 0.1, peak: 0.1, seed: 65 })}"/>
  </g>`);

  add("</g>");

  // ── Oiseaux : quelques coups de pinceau en V, jamais deux pareils ──
  const bird = (x, y, s, seed) =>
    `<path d="${brush([[x - s, y - s * 0.3], [x - s * 0.45, y - s * 0.42], [x, y]], { w: s * 0.22, start: 0.1, end: 0.6, peak: 0.6, seed })}"/><path d="${brush([[x, y], [x + s * 0.5, y - s * 0.5], [x + s * 1.05, y - s * 0.38]], { w: s * 0.22, start: 0.6, end: 0.1, peak: 0.35, seed: seed + 1 })}"/>`;
  add(`<g fill="#414a63" filter="url(#ink)" opacity="0.75">${[[1010, 110, 20], [1060, 82, 13], [1096, 128, 16], [960, 150, 10], [1130, 96, 9]].map(([x, y, s], i) => bird(x, y, s, 70 + i * 3)).join("")}</g>`);
  // Une seconde volée, plus loin, à gauche sous le temple
  add(`<g fill="#5a6580" filter="url(#ink)" opacity="0.55">${[[250, 420, 11], [282, 404, 8], [300, 432, 7], [226, 446, 6]].map(([x, y, s], i) => bird(x, y, s, 80 + i * 3)).join("")}</g>`);

  // ── Écharpes de nuages à mi-hauteur, de chaque côté ──
  add(`<path d="${blob(150, 520, 230, 26, { seed: 101, lumps: 9, irregular: 0.3 })}" fill="#ffffff" opacity="0.45" filter="url(#bloom)"/>`);
  add(`<path d="${blob(1490, 640, 200, 22, { seed: 102, lumps: 9, irregular: 0.3 })}" fill="#fbe3ec" opacity="0.5" filter="url(#bloom)"/>`);

  // ── Aqueduc rosé, brisé, qui sort de la mer de nuages : un grand tronçon à gauche, un fragment à droite ──
  // Arches en plein cintre entre des piles ; le bas se perd dans les nuages peints ensuite. La fin du tronçon est cassée.
  const aqueduct = ({ x0, bays, bay, pier, top, deck, spring, base, broken, seed }) => {
    const r = (bay - pier) / 2;
    const x1 = x0 + bays * bay + pier;
    const pts = [[x0, base], [x0, top]];
    // Tablier, cassé en dents sur la fin si `broken`
    if (broken) pts.push([x1 - bay * 0.9, top], [x1 - bay * 0.7, top + 14], [x1 - bay * 0.5, top + 4], [x1 - bay * 0.3, top + 30], [x1, top + 22]);
    else pts.push([x1, top]);
    pts.push([x1, base]);
    // Retour par le bas, de droite à gauche : chaque arche monte d'une pile, s'arrondit, redescend sur la suivante
    for (let b = bays - 1; b >= 0; b--) {
      const left = x0 + b * bay + pier;
      const right = left + bay - pier;
      pts.push([right, base], [right, spring]);
      for (let k = 1; k < 12; k++) {
        const a = (k / 12) * Math.PI;
        pts.push([left + r + Math.cos(a) * r, spring - Math.sin(a) * r]);
      }
      pts.push([left, spring], [left, base]);
    }
    const d = rough(pts, { seed, wobble: 1, step: 30 });
    return `<path d="${d}" fill="#efcbd8" opacity="0.6" filter="url(#wash-wet)"/><path d="${brush([[x0, top + 1], [x1 - (broken ? bay : 0), top + 1]], { w: 1.4, seed: seed + 1 })}" fill="#b98aa0" opacity="0.4" filter="url(#ink)"/><path d="M${x0} ${top + deck} H${x1}" stroke="#c89aae" stroke-width="1" fill="none" opacity="0.35" filter="url(#pencil)"/>`;
  };
  add(aqueduct({ x0: -40, bays: 6, bay: 96, pier: 22, top: 612, deck: 26, spring: 690, base: 820, broken: true, seed: 111 }));
  add(aqueduct({ x0: 1330, bays: 3, bay: 96, pier: 22, top: 660, deck: 26, spring: 736, base: 840, broken: false, seed: 115 }));

  // ── Mer de nuages, en bas : couches de rose et de blanc ──
  add(`<path d="${blob(300, 830, 520, 120, { seed: 81, lumps: 12 })}" fill="#f3c6d6" opacity="0.75" filter="url(#bloom)"/>`);
  add(`<path d="${blob(1180, 820, 560, 130, { seed: 82, lumps: 12 })}" fill="#f6d3df" opacity="0.75" filter="url(#bloom)"/>`);
  add(`<path d="${blob(780, 880, 700, 110, { seed: 83, lumps: 13 })}" fill="#ffffff" opacity="0.85" filter="url(#bloom)"/>`);
  add(`<path d="${blob(120, 900, 360, 80, { seed: 84 })}" fill="#ffffff" opacity="0.8" filter="url(#bloom)"/>`);
  add(`<path d="${blob(1500, 900, 320, 90, { seed: 85 })}" fill="#ffffff" opacity="0.8" filter="url(#bloom)"/>`);

  // ── Pétales roses qui montent avec l'air chaud ──
  add(`<g fill="#e8a3bd" filter="url(#wash)" opacity="0.85">${[[420, 260, 7, 30], [1140, 340, 6, -20], [1280, 260, 5, 60], [330, 360, 5, -40]]
    .map(([x, y, s, r], i) => `<path d="${brush([[x - s, y], [x, y - s * 0.4], [x + s, y]], { w: s, start: 0.2, end: 0.1, peak: 0.5, seed: 90 + i })}" transform="rotate(${r} ${x} ${y})"/>`)
    .join("")}</g>`);

  return { body: out.join("\n"), defs: c.defs.join("") };
}
