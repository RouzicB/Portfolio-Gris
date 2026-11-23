// Convictions — la forêt verte. Des troncs pâles dans la brume, de plus en plus francs vers l'avant, quelques lianes
// aux feuilles en triangle qui descendent du haut, une butte d'herbe au premier plan, des rais de lumière.
import { blob, brush, canvas, rough } from "../paint.mjs";

export const SEED = 7;

export default function scene() {
  const c = canvas(SEED);
  const { rand } = c;
  const out = [];
  const add = (s) => out.push(s);

  // ── Brume et lumière ──
  add(`<path d="${blob(820, 420, 700, 160, { seed: 11, lumps: 12, irregular: 0.25 })}" fill="#ffffff" opacity="0.35" filter="url(#bloom)"/>`);
  add(`<g filter="url(#wash-wet)" fill="#ffffff" opacity="0.22">
    <path d="${rough([[250, -20], [380, -20], [760, 900], [520, 900]], { seed: 12, wobble: 8 })}"/>
    <path d="${rough([[470, -20], [540, -20], [980, 900], [860, 900]], { seed: 13, wobble: 8 })}" opacity="0.7"/>
  </g>`);

  // ── Troncs : du plus lointain (pâle, fondu dans la brume) au plus proche ──
  // Chaque tronc s'efface vers le haut (le pigment se dilue), penche un peu, s'élargit au pied.
  const trunk = (x, w, lean, top, fill, seed, filter = "wash-wet", base = 780) => {
    const fade = c.linear([[0, fill, 0.15], [0.35, fill, 0.85], [1, fill, 1]]);
    const pts = [[x - w / 2 + lean, top], [x + w / 2 + lean, top], [x + w / 2 + 2, base - 40], [x + w / 2 + w * 0.25, base], [x - w / 2 - w * 0.22, base], [x - w / 2 - 2, base - 40]];
    return `<path d="${rough(pts, { seed, wobble: 3, step: 60 })}" fill="${fade}" filter="url(#${filter})"/>`;
  };
  const far = [[90, 46, 6], [300, 70, -8], [455, 38, 4], [640, 84, 10], [930, 52, -6], [1110, 76, 8], [1300, 44, -4], [1430, 66, 6]];
  add(`<g opacity="0.75">${far.map(([x, w, l], i) => trunk(x, w, l, -30, i % 2 ? "#c3d9bb" : "#b6d0ad", 21 + i)).join("")}</g>`);
  const mid = [[205, 58, -10], [790, 46, 8], [1225, 62, -6]];
  add(mid.map(([x, w, l], i) => trunk(x, w, l, -30, "#93b98f", 31 + i, "wash")).join(""));
  add(`<g fill="none" stroke="#5c8a66" stroke-width="1" filter="url(#pencil)" opacity="0.5">
    ${mid.map(([x, w, l], i) => `<path d="M${x - w / 2 + l + 6} ${60 + i * 40}L${x - w / 2 + 4} 700"/>`).join("")}
  </g>`);

  // ── Grand tronc proche, à droite, et un plus mince à gauche ──
  const bigTrunk = rough([[1500, -30], [1640, -30], [1640, 900], [1440, 900], [1470, 820], [1488, 600], [1494, 300]], { seed: 41, wobble: 4, step: 50 });
  const bigFill = c.linear([[0, "#2f6a48"], [1, "#1f4a33"]], { x1: 0, y1: 0, x2: 1, y2: 0 });
  add(`<path d="${bigTrunk}" fill="${bigFill}" filter="url(#wash)"/>`);
  add(c.mottle(bigTrunk, [1440, -30, 1640, 900], ["#4f8a5e", "#163826"], { count: 4, seed: 42, opacity: 0.35, size: 0.6 }));
  add(`<path d="${brush([[1498, -20], [1492, 300], [1486, 620], [1468, 822], [1440, 898]], { w: 3.4, seed: 43, peak: 0.6 })}" fill="#122a1c" filter="url(#ink)" opacity="0.8"/>`);
  // Écorce : quelques traits courbes, au pinceau sec
  add(`<g fill="#163826" filter="url(#ink)" opacity="0.5">
    ${[180, 420, 610].map((y, i) => `<path d="${brush([[1520, y], [1560, y + 14], [1600, y + 10]], { w: 2, seed: 44 + i })}"/>`).join("")}
  </g>`);
  add(trunk(-10, 70, 8, -30, "#5e9970", 45, "wash", 820));

  // ── Lianes qui descendent du haut, feuilles en triangle de tailles inégales ──
  const vines = [[150, 230], [340, 120], [560, 300], [690, 90], [1010, 210], [1180, 340], [1350, 160]];
  const leaves = [];
  const stems = [];
  vines.forEach(([x, len], i) => {
    const sway = (rand() - 0.5) * 30;
    const pts = [[x, -10], [x + sway * 0.4, len * 0.5], [x + sway, len]];
    stems.push(brush(pts, { w: 2.4, start: 0.9, end: 0.5, peak: 0.2, seed: 50 + i, jitter: 0.1 }));
    const count = 1 + Math.floor(rand() * 3);
    for (let k = 0; k < count; k++) {
      const t = k === 0 ? 1 : 0.35 + rand() * 0.45;
      const lx = x + sway * t;
      const ly = len * t;
      const s = k === 0 ? 20 + rand() * 18 : 10 + rand() * 12;
      const tilt = (rand() - 0.5) * 30;
      leaves.push({ lx, ly, s, tilt, fill: rand() < 0.5 ? "#2a6a45" : "#5e9970", seed: 60 + leaves.length });
    }
  });
  add(`<g fill="#1d4630" filter="url(#ink-wet)" opacity="0.85">${stems.map((d) => `<path d="${d}"/>`).join("")}</g>`);
  add(`<g filter="url(#wash)">${leaves
    // Feuille en losange étiré, la moitié droite dans l'ombre : entre le triangle et l'amande
    .map(({ lx, ly, s, tilt, fill, seed }) => {
      const top = [lx, ly - 2], right = [lx + s * 0.42, ly + s * 0.55], tip = [lx, ly + s * 1.5], left = [lx - s * 0.42, ly + s * 0.55];
      return `<g transform="rotate(${tilt} ${lx} ${ly})"><path d="${rough([top, right, tip, left], { seed, wobble: 1.2, step: 8 })}" fill="${fill}"/><path d="${rough([top, right, tip], { seed: seed + 1, wobble: 1, step: 8 })}" fill="#0f2a1a" opacity="0.28"/></g>`;
    })
    .join("")}</g>`);

  // ── Butte d'herbe au premier plan ──
  const hill = rough([[-40, 900], [-40, 770], [200, 730], [520, 708], [860, 716], [1180, 742], [1460, 770], [1640, 760], [1640, 900]], { seed: 71, wobble: 3, step: 60 });
  const hillFill = c.linear([[0, "#a5c79b"], [1, "#6f9f74"]]);
  // Sous-couche opaque : le lavis laisse passer la lumière par endroits, et les troncs se verraient à travers la butte
  add(`<path d="${hill}" fill="#93b98c" filter="url(#solid)"/>`);
  add(`<path d="${hill}" fill="${hillFill}" filter="url(#wash)"/>`);
  add(c.mottle(hill, [-40, 708, 1640, 900], ["#c8dcae", "#4f8a5e", "#93b98f"], { count: 5, seed: 72, opacity: 0.3, size: 0.25 }));
  add(`<path d="${brush([[-30, 772], [200, 731], [520, 709], [860, 717], [1180, 743], [1440, 770]], { w: 3.6, seed: 73, peak: 0.3 })}" fill="#1d4630" filter="url(#ink)" opacity="0.75"/>`);
  // Seconde butte, plus sombre, devant
  const hill2 = rough([[-40, 900], [-40, 840], [300, 820], [620, 838], [980, 818], [1400, 846], [1640, 830], [1640, 900]], { seed: 74, wobble: 3, step: 60 });
  add(`<path d="${hill2}" fill="#6f9f78" filter="url(#solid)"/>`);
  add(`<path d="${hill2}" fill="#5e9970" opacity="0.85" filter="url(#wash)"/>`);
  // Touffes d'herbe : trois ou quatre brins, jamais pareils
  const tuft = (x, y, h, seed) => {
    const r = Array.from({ length: 3 + (seed % 2) }, (_, k) => {
      const dx = (k - 1.5) * 4;
      const bend = (k - 1.5) * 6 + (seed % 3) * 2;
      return brush([[x + dx, y], [x + dx + bend * 0.3, y - h * 0.6], [x + dx + bend, y - h * (0.8 + ((seed + k) % 3) * 0.12)]], { w: 2.6, start: 1, end: 0.05, peak: 0.1, seed: seed * 7 + k });
    });
    return r.map((d) => `<path d="${d}"/>`).join("");
  };
  add(`<g fill="#24553a" filter="url(#ink)" opacity="0.8">${[[120, 742, 26], [410, 714, 18], [690, 712, 22], [980, 728, 16], [1290, 756, 24], [260, 836, 30], [860, 832, 26], [1180, 846, 20]]
    .map(([x, y, h], i) => tuft(x, y, h, 80 + i))
    .join("")}</g>`);
  // Fleurs blanches, quelques points
  add(`<g fill="#f7fbf2" filter="url(#wash)" opacity="0.9">${[[330, 722], [352, 716], [770, 714], [1080, 734], [520, 830], [1330, 842]]
    .map(([x, y], i) => `<path d="${blob(x, y, 4, 3.4, { seed: 90 + i, lumps: 6 })}"/>`)
    .join("")}</g>`);

  return { body: out.join("\n"), defs: c.defs.join("") };
}
