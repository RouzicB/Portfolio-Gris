// Parcours — la nuit dorée. Une grande lune (dessinée par la page), un ciel d'étoiles inégales, deux tours à dôme
// sur les bords, des dunes et une ville lointaine au centre. Le milieu reste calme : l'arborescence du parcours s'y pose.
import { blob, brush, canvas, rough } from "../paint.mjs";

export const SEED = 13;

export default function scene() {
  const c = canvas(SEED);
  const { rand } = c;
  const out = [];
  const add = (s) => out.push(s);

  // ── Ciel : un voile chaud près de la lune, des étoiles ──
  add(`<path d="${blob(1250, 160, 460, 170, { seed: 11 })}" fill="#8a6a26" opacity="0.22" filter="url(#bloom)"/>`);
  add(`<path d="${blob(300, 260, 380, 80, { seed: 12 })}" fill="#6b5221" opacity="0.2" filter="url(#bloom)"/>`);
  // Étoiles : plus nombreuses en haut, quelques grosses avec un halo et une petite croix
  const stars = [];
  for (let i = 0; i < 70; i++) {
    const y = Math.pow(rand(), 1.6) * 620;
    stars.push([rand() * 1600, y, 0.7 + rand() * rand() * 2.6]);
  }
  add(`<g fill="#fff1c2">${stars.map(([x, y, r]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" opacity="${(0.45 + r / 6).toFixed(2)}"/>`).join("")}</g>`);
  const bright = stars.filter(([, , r]) => r > 2.2);
  add(`<g fill="#fff1c2" filter="url(#glow-sm)" opacity="0.8">${bright.map(([x, y, r]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 2).toFixed(1)}"/>`).join("")}</g>`);
  add(`<g fill="#fff6dc" filter="url(#ink)" opacity="0.7">${bright
    .slice(0, 4)
    .map(([x, y], i) => `<path d="${brush([[x - 9, y], [x, y - 0.4], [x + 9, y]], { w: 1.4, seed: 20 + i, peak: 0.5 })}"/><path d="${brush([[x, y - 9], [x + 0.4, y], [x, y + 9]], { w: 1.4, seed: 30 + i, peak: 0.5 })}"/>`)
    .join("")}</g>`);

  // ── Ville lointaine au centre, sur l'horizon : petits dômes pâles ──
  const city = [];
  const base = 792;
  const domeHouse = (x, w, h, seed) => {
    city.push(rough([[x - w / 2, base], [x - w / 2, base - h], [x + w / 2, base - h], [x + w / 2, base]], { seed, wobble: 1, step: 14 }));
    city.push(`M${x - w / 2 + 3} ${base - h}C${x - w / 2 + 3} ${base - h - w * 0.5} ${x - 3} ${base - h - w * 0.55} ${x} ${base - h - w * 0.72}C${x + 3} ${base - h - w * 0.55} ${x + w / 2 - 3} ${base - h - w * 0.5} ${x + w / 2 - 3} ${base - h}Z`);
  };
  const block = (x, w, h, seed) => city.push(rough([[x - w / 2, base], [x - w / 2 + 2, base - h], [x + w / 2 - 2, base - h + 3], [x + w / 2, base]], { seed, wobble: 1.2, step: 14 }));
  block(520, 52, 22, 40); domeHouse(586, 46, 30, 41); block(640, 34, 40, 42); domeHouse(728, 70, 40, 43);
  city.push(rough([[792, base], [794, base - 104], [800, base - 118], [806, base - 104], [808, base]], { seed: 44, wobble: 0.8, step: 12 }));
  block(846, 60, 28, 45); domeHouse(914, 38, 24, 46); block(972, 46, 34, 47); domeHouse(1046, 52, 30, 48); block(1100, 30, 18, 49);
  add(`<g fill="#7d6024" opacity="0.65" filter="url(#wash-wet)">${city.map((d) => `<path d="${d}"/>`).join("")}</g>`);

  // ── Dunes ──
  const dune = (pts, fill, seed, op = 1) => `<path d="${rough(pts, { seed, wobble: 3, step: 60 })}" fill="${fill}" opacity="${op}" filter="url(#wash-dark)"/>`;
  add(dune([[-40, 900], [-40, 800], [300, 776], [640, 794], [980, 772], [1300, 790], [1640, 770], [1640, 900]], c.linear([[0, "#7a5c22"], [1, "#4d3a14"]]), 51));
  add(dune([[-40, 900], [-40, 850], [420, 836], [860, 856], [1240, 834], [1640, 852], [1640, 900]], "#3b2c0f", 52, 0.9));
  add(`<g fill="#c9a24a" filter="url(#ink)" opacity="0.45">
    <path d="${brush([[260, 778], [480, 782], [640, 794]], { w: 1.8, seed: 53 })}"/>
    <path d="${brush([[980, 773], [1160, 780], [1300, 790]], { w: 1.6, seed: 54 })}"/>
  </g>`);

  // ── Tours à dôme, sur les bords ──
  const tower = (x, w, top, dome, seed, flip = 1) => {
    const body = rough([[x - w / 2, 900], [x - w / 2 + 4, top], [x + w / 2 - 4, top], [x + w / 2, 900]], { seed, wobble: 2.4, step: 40 });
    const lip = rough([[x - w / 2 - 14, top + 4], [x + w / 2 + 14, top + 4], [x + w / 2 + 10, top - 14], [x - w / 2 - 10, top - 14]], { seed: seed + 1, wobble: 1.6, step: 30 });
    const domeD = `M${x - w / 2 + 2} ${top - 12}C${x - w / 2 + 2} ${top - 12 - dome * 0.9} ${x - 8} ${top - 12 - dome * 1.1} ${x} ${top - 14 - dome * 1.25}C${x + 8} ${top - 12 - dome * 1.1} ${x + w / 2 - 2} ${top - 12 - dome * 0.9} ${x + w / 2 - 2} ${top - 12}Z`;
    const bodyFill = c.linear([[0, "#b08a3c"], [1, "#6e5420"]]);
    const win = `M${x - 13} ${top + 150}V${top + 112}A13 13 0 0 1 ${x + 13} ${top + 112}V${top + 150}Z`;
    const win2 = `M${x - 10} ${top + 300}V${top + 270}A10 10 0 0 1 ${x + 10} ${top + 270}V${top + 300}Z`;
    return [
      `<path d="${body}" fill="${bodyFill}" filter="url(#wash-solid)"/>`,
      c.mottle(body, [x - w / 2, top, x + w / 2, 900], ["#c9a24a", "#4d3a14"], { count: 3, seed: seed + 5, opacity: 0.18, size: 0.4 }),
      `<path d="${domeD}" fill="#c9a24a" filter="url(#wash-solid)"/>`,
      `<path d="${lip}" fill="#d9b45c" filter="url(#wash-solid)"/>`,
      // Flèche au sommet du dôme
      `<path d="${brush([[x, top - 14 - dome * 1.25], [x + flip, top - 34 - dome * 1.25], [x, top - 52 - dome * 1.25]], { w: 3, seed: seed + 2, start: 1, end: 0.1, peak: 0.1 })}" fill="#3b2c0f" filter="url(#ink)"/>`,
      `<path d="${blob(x, top - 58 - dome * 1.25, 6, 8, { seed: seed + 3, lumps: 6, irregular: 0.15 })}" fill="#f2c14e" filter="url(#wash)"/>`,
      // Fenêtres éclairées
      `<g fill="#fff1c2" filter="url(#glow)" opacity="0.7"><path d="${win}"/><path d="${win2}"/></g>`,
      `<g fill="#ffe8a8" filter="url(#wash)"><path d="${win}"/><path d="${win2}"/></g>`,
      // Encre : un flanc, le bord du dôme, quelques assises
      `<g fill="#2d220b" filter="url(#ink)" opacity="0.75">
        <path d="${brush([[x - (w / 2) * flip + 4 * flip, top + 10], [x - (w / 2) * flip + 2 * flip, top + 300], [x - (w / 2) * flip, 896]], { w: 3, seed: seed + 4 })}"/>
        <path d="${brush([[x + (w / 2) * flip - 4 * flip, top + 40], [x + (w / 2) * flip - 3 * flip, top + 260]], { w: 1.8, seed: seed + 8, start: 0.6 })}"/>
        <path d="${brush([[x + w / 2 - 2, top - 14], [x + w / 2 - 10, top - 12 - dome * 0.9], [x + 2, top - 14 - dome * 1.25]], { w: 1.6, seed: seed + 9, peak: 0.6 })}"/>
        <path d="${brush([[x - w / 2 - 12, top + 4], [x, top + 6], [x + w / 2 + 12, top + 3]], { w: 2, seed: seed + 10 })}"/>
        <path d="${brush([[x - w / 2 + 2, top - 14], [x - w / 2 + 10, top - 12 - dome * 0.9], [x, top - 14 - dome * 1.25]], { w: 2.2, seed: seed + 6, peak: 0.6 })}"/>
        <path d="${brush([[x - w / 2 + 6, top + 210], [x, top + 207], [x + w / 2 - 6, top + 211]], { w: 1.4, seed: seed + 7 })}"/>
      </g>`,
    ].join("");
  };
  add(tower(150, 170, 430, 92, 61, 1));
  add(tower(1458, 190, 400, 104, 71, -1));
  // Fils qui pendent sous la corniche des tours, avec une goutte de lumière
  const hang = (x0, x1, y, seed) => {
    const r = Array.from({ length: 5 }, (_, i) => {
      const x = x0 + ((x1 - x0) * (i + 0.5)) / 5 + ((seed + i) % 3) * 4;
      const len = 30 + ((seed * 7 + i * 13) % 50);
      return { d: brush([[x, y], [x - 2, y + len * 0.5], [x - 5, y + len]], { w: 1.8, seed: seed * 10 + i, start: 0.9, end: 0.5 }), x: x - 5, y: y + len + 5 };
    });
    return `<g fill="#3b2c0f" filter="url(#ink)" opacity="0.7">${r.map((s) => `<path d="${s.d}"/>`).join("")}</g><g fill="#f2c14e" filter="url(#glow-sm)">${r
      .filter((_, i) => i % 2 === 0)
      .map((s) => `<circle cx="${s.x}" cy="${s.y}" r="4"/>`)
      .join("")}</g>`;
  };
  add(hang(64, 234, 440, 81));
  add(hang(1364, 1554, 410, 82));

  return { body: out.join("\n"), defs: c.defs.join("") };
}
