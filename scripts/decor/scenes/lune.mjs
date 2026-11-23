// Contact — la nuit prune, volontairement simple. La grande lune (dessinée par la page) se lève derrière deux chaînes
// de montagnes basses ; un lac calme la reflète. Un seul arbre aux feuilles en losange à gauche, des étoiles éparses. Le centre reste libre pour l'adresse et les boutons.
import { blob, brush, canvas, rough, sample } from "../paint.mjs";

export const SEED = 19;

/** Abscisse de la lune dans le cadre (72 % de la largeur) : son reflet tombe dessous */
const MOON_X = 1152;

export default function scene() {
  const c = canvas(SEED);
  const { rand } = c;
  const out = [];
  const add = (s) => out.push(s);

  // ── Étoiles éparses, plus rares près de la lune ──
  const stars = [];
  while (stars.length < 46) {
    const x = rand() * 1600;
    const y = Math.pow(rand(), 1.4) * 560;
    if (Math.hypot(x - MOON_X, y - 360) < 280) continue;
    stars.push([x, y, 0.6 + rand() * rand() * 2.2]);
  }
  add(`<g fill="#fff1ec">${stars.map(([x, y, r]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" opacity="${(0.4 + r / 5).toFixed(2)}"/>`).join("")}</g>`);
  add(`<g fill="#fff1ec" filter="url(#glow-sm)" opacity="0.7">${stars
    .filter(([, , r]) => r > 1.9)
    .map(([x, y, r]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 2.2).toFixed(1)}"/>`)
    .join("")}</g>`);
  // Voile de brume rose à l'horizon
  add(`<path d="${blob(800, 640, 900, 90, { seed: 11, lumps: 12 })}" fill="#a8466f" opacity="0.28" filter="url(#bloom)"/>`);

  // ── Deux chaînes de montagnes basses : la plus lointaine pâle, la plus proche sombre ──
  const far = rough([[-40, 780], [-40, 630], [170, 566], [300, 618], [470, 548], [640, 632], [800, 596], [980, 640], [1200, 572], [1380, 624], [1530, 574], [1640, 606], [1640, 780]], { seed: 21, wobble: 3, step: 60 });
  add(`<path d="${far}" fill="#5a2f58" opacity="0.85" filter="url(#wash-dark)"/>`);
  // Chaque sommet a son versant droit dans l'ombre (la lune éclaire de face, un peu de gauche)
  const shade = (pts, base, col, op, seed) =>
    pts.slice(2, -2).map((p, i) => {
      const next = pts[i + 3];
      if (p[1] > next[1]) return "";
      return `<path d="${rough([p, next, [next[0] - (next[0] - p[0]) * 0.35, base]], { seed: seed + i, wobble: 2, step: 40 })}" fill="${col}" opacity="${op}" filter="url(#wash-dark)"/>`;
    }).join("");
  add(shade([[-40,780],[-40,630],[170,566],[300,618],[470,548],[640,632],[800,596],[980,640],[1200,572],[1380,624],[1530,574],[1640,606],[1640,780]], 700, "#341a3a", 0.45, 25));
  const near = rough([[-40, 790], [-40, 684], [120, 640], [300, 704], [480, 668], [660, 734], [1000, 742], [1220, 692], [1420, 650], [1640, 694], [1640, 790]], { seed: 22, wobble: 3, step: 60 });
  const nearFill = c.linear([[0, "#3a2140"], [1, "#24142c"]]);
  add(`<path d="${near}" fill="${nearFill}" filter="url(#wash-dark)"/>`);
  add(shade([[-40,790],[-40,684],[120,640],[300,704],[480,668],[660,734],[1000,742],[1220,692],[1420,650],[1640,694],[1640,790]], 760, "#120818", 0.4, 27));
  add(c.mottle(near, [-40, 660, 1640, 790], ["#5a2448", "#1a0e20"], { count: 4, seed: 23, opacity: 0.35, size: 0.3 }));
  add(`<path d="${brush([[-30, 686], [120, 641], [300, 705], [480, 669], [660, 735]], { w: 2, seed: 24, peak: 0.3 })}" fill="#f0a9bf" filter="url(#ink)" opacity="0.3"/>`);

  // ── Le lac : sombre, avec le reflet de la lune en traits horizontaux ──
  const lake = rough([[-40, 790], [1640, 786], [1640, 940], [-40, 940]], { seed: 31, wobble: 2, step: 80 });
  const lakeFill = c.linear([[0, "#2c1a3a"], [1, "#170c1f"]]);
  add(`<path d="${lake}" fill="${lakeFill}" filter="url(#wash-dark)"/>`);
  const glints = [];
  for (let i = 0; i < 12; i++) {
    const y = 800 + i * 8 + rand() * 4;
    const w = 150 - i * 9 + rand() * 30;
    const x = MOON_X - w / 2 + (rand() - 0.5) * 30;
    glints.push(brush([[x, y], [x + w / 2, y - 1], [x + w, y]], { w: 2.6 - i * 0.12, seed: 40 + i, peak: 0.5 }));
  }
  add(`<g fill="#fff4d6" opacity="0.45" filter="url(#glow-sm)">${glints.map((d) => `<path d="${d}"/>`).join("")}</g>`);
  add(`<g fill="#fff4d6" filter="url(#ink)" opacity="0.7">${glints.map((d) => `<path d="${d}"/>`).join("")}</g>`);
  // Quelques rides plus loin sur l'eau
  add(`<g fill="#c785a6" filter="url(#ink)" opacity="0.35">${Array.from({ length: 6 }, (_, i) => {
    const x = 120 + rand() * 800;
    const y = 812 + rand() * 70;
    const w = 40 + rand() * 90;
    return `<path d="${brush([[x, y], [x + w / 2, y - 1], [x + w, y]], { w: 1.4, seed: 60 + i })}"/>`;
  }).join("")}</g>`);

  // ── L'arbre aux losanges, à gauche ──
  // Silhouette d'encre prune sur la nuit, liserée de lumière côté lune ; au bout de chaque rameau, un losange de pigment
  // rose qui luit doucement (les pierres de clé du site), posé par sa pointe basse sur le bout de son rameau.
  const ink = "#1e0f24";
  const rimLight = "#f3b6cb";
  // Tronc en points serrés : chaque branche part exactement de son axe (un point du tronc), et pas à côté
  const spine = [[210, 792], [206, 746], [205, 700], [210, 660], [216, 620], [212, 580], [206, 540]];
  const trunkAt = (y) => {
    for (let i = 1; i < spine.length; i++) {
      const [x0, y0] = spine[i - 1];
      const [x1, y1] = spine[i];
      if (y <= y0 && y >= y1) return x0 + ((x1 - x0) * (y0 - y)) / (y0 - y1);
    }
    return spine[spine.length - 1][0];
  };
  const trunk = brush(spine, { w: 14, start: 1, end: 0.55, peak: 0.1, seed: 71, jitter: 0.04 });
  const fork = (y, rest) => [[trunkAt(y), y], ...rest];
  const branches = [
    fork(604, [[176, 566], [124, 542], [92, 500]]),
    fork(566, [[252, 524], [298, 508], [330, 470]]),
    fork(548, [[200, 502], [204, 456]]),
    fork(652, [[258, 624], [300, 614]]),
  ];
  // Rameaux greffés sur les branches, au point exact de leur courbe
  const twig = (b, t, rest) => [sample(b, t), ...rest];
  const twigs = [
    twig(branches[0], 0.5, [[146, 528], [150, 494]]),
    twig(branches[1], 0.55, [[288, 494], [282, 462]]),
    twig(branches[3], 0.6, [[278, 604], [288, 578]]),
  ];
  const limbs = [...branches, ...twigs];
  const limbBrush = (pts, i, w) => brush(pts, { w, start: 1, end: 0.3, peak: 0.05, seed: 72 + i, jitter: 0.03 });
  const shift = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
  // Petite butte sous le pied de l'arbre, au bord du lac
  const mound = rough([[112, 806], [150, 786], [214, 778], [276, 788], [318, 806]], { seed: 69, wobble: 2, step: 24 });
  add(`<path d="${mound}" fill="${ink}" filter="url(#wash-dark)"/>`);
  // Liseré de lumière côté lune (à droite et en haut) : la même silhouette, décalée, que l'encre recouvre presque
  add(`<g fill="${rimLight}" opacity="0.5" filter="url(#ink-wet)"><path d="${brush(shift(spine, 2.6, -1), { w: 13, start: 1, end: 0.55, peak: 0.1, seed: 71, jitter: 0.04 })}"/>${limbs
    .map((b, i) => `<path d="${limbBrush(shift(b, 1.6, -1.6), i, i < 4 ? 6 : 4)}"/>`)
    .join("")}<path d="${brush([[150, 787], [214, 779], [276, 789]], { w: 2, seed: 68 })}"/></g>`);
  // Encre continue (sans le pinceau sec) : une jonction cassée détacherait la branche du tronc
  add(`<g fill="${ink}" filter="url(#ink-wet)"><path d="${trunk}"/>${limbs.map((b, i) => `<path d="${limbBrush(b, i, i < 4 ? 6.5 : 4.2)}"/>`).join("")}</g>`);
  // Feuilles : un losange au bout de chaque rameau, la pointe basse posée dessus ; la moitié droite dans l'ombre
  const leafFill = c.linear([[0, "#fbbfd2"], [1, "#d2467a"]]);
  const sizes = [30, 34, 40, 26, 22, 24, 20];
  const leaves = limbs.map((b, i) => {
    const [x, y] = b[b.length - 1];
    const s = sizes[i];
    const top = [x, y - s * 1.3];
    const right = [x + s * 0.45, y - s * 0.65];
    const left = [x - s * 0.45, y - s * 0.65];
    return { x, y, s, body: [[x, y + 2], right, top, left], shade: [[x, y + 2], right, top] };
  });
  add(`<g fill="#f06a8f" opacity="0.32" filter="url(#glow)">${leaves.map(({ x, y, s }) => `<circle cx="${x}" cy="${(y - s * 0.65).toFixed(1)}" r="${(s * 0.7).toFixed(1)}"/>`).join("")}</g>`);
  add(`<g filter="url(#wash-solid)">${leaves
    .map(({ body, shade }, i) => `<path d="${rough(body, { seed: 80 + i, wobble: 0.8, step: 12 })}" fill="${leafFill}"/><path d="${rough(shade, { seed: 90 + i, wobble: 0.6, step: 12 })}" fill="#7d1d47" opacity="0.32"/>`)
    .join("")}</g>`);
  // Une feuille tombée sur le lac, et son reflet
  add(`<path d="${rough([[346, 836], [358, 828], [370, 836], [358, 842]], { seed: 96, wobble: 0.5, step: 8 })}" fill="#e2779a" opacity="0.85" filter="url(#wash)"/>`);
  add(`<path d="${blob(358, 846, 16, 3, { seed: 97 })}" fill="#f06a8f" opacity="0.25" filter="url(#glow-sm)"/>`);

  // ── Petits losanges emportés vers la droite, depuis l'arbre ──
  add(`<g fill="#f06a8f" filter="url(#wash)" opacity="0.8">${[[420, 420, 6, 20], [560, 380, 5, -30], [700, 460, 4, 50], [380, 330, 4, 10]]
    .map(([x, y, s, r], i) => `<path d="${rough([[x, y - s], [x + s * 0.6, y], [x, y + s], [x - s * 0.6, y]], { seed: 110 + i, wobble: 0.3, step: 6 })}" transform="rotate(${r} ${x} ${y})"/>`)
    .join("")}</g>`);

  return { body: out.join("\n"), defs: c.defs.join("") };
}
