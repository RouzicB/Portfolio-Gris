// Profil — le désert rouge. De grandes montagnes pâles derrière le texte, des rochers rouges à facettes au premier
// plan, et un arbre enraciné sur le rocher, aux longs fils pendants, à contre-jour devant le soleil. Des pétales emportés par le vent.
import { blob, brush, canvas, rough, sample } from "../paint.mjs";

export const SEED = 5;

export default function scene({ portrait = false } = {}) {
  const c = canvas(SEED);
  const { rand } = c;
  const out = [];
  const add = (s) => out.push(s);

  // ── Ciel : lavis chauds très dilués ──
  add(`<path d="${blob(380, 120, 420, 90, { seed: 11, lumps: 10, irregular: 0.3 })}" fill="#f2c4b8" opacity="0.32" filter="url(#bloom)"/>`);
  add(`<path d="${blob(1000, 300, 520, 60, { seed: 12, lumps: 11, irregular: 0.28 })}" fill="#f6d2c8" opacity="0.3" filter="url(#bloom)"/>`);

  // ── Montagnes lointaines : trois pyramides usées, pâles, le flanc droit dans l'ombre ──
  const mountain = (x0, apex, x1, base, seed, light, shade, op = 1) => {
    const top = [apex[0] + (rand() - 0.5) * 8, apex[1]];
    const d = rough([[x0, base], [top[0] - 14, top[1] + 10], [top[0] + 10, top[1] + 4], [x1, base]], { seed, wobble: 7, step: 44 });
    const shadow = rough([[top[0] + 10, top[1] + 4], [x1, base], [top[0] + (x1 - top[0]) * 0.32, base]], { seed: seed + 1, wobble: 6, step: 44 });
    return `<g opacity="${op}"><path d="${d}" fill="${light}" filter="url(#wash-wet)"/><path d="${shadow}" fill="${shade}" opacity="0.55" filter="url(#wash-wet)"/></g>`;
  };
  add(mountain(1060, [1430, 420], 1700, 720, 21, "#eccbc3", "#dba69f", 0.85));
  add(mountain(-80, [250, 430], 620, 720, 23, "#efd3cc", "#e0b0a8", 0.8));
  add(mountain(330, [880, 170], 1440, 720, 25, "#e9c2b9", "#d79891"));
  // Construction au crayon : l'axe et la base de la grande montagne
  add(`<g fill="none" stroke="#a5645f" stroke-linecap="round" filter="url(#pencil)" opacity="0.5">
    <path d="M820 300 L944 300" stroke-width="0.8" opacity="0.6"/>
    <path d="M-20 722 C400 719 900 725 1620 720" stroke-width="1.1"/>
  </g>`);

  // ── Dunes de rose, en deux passes ──
  const dune1 = c.linear([[0, "#e4aaa0"], [1, "#d8918a"]]);
  add(`<path d="${rough([[-40, 712], [260, 694], [620, 716], [980, 690], [1300, 706], [1640, 688], [1640, 940], [-40, 940]], { seed: 31, wobble: 4, step: 50 })}" fill="${dune1}" filter="url(#wash)" opacity="0.92"/>`);
  const dune2 = c.linear([[0, "#d9837f"], [1, "#c86a6d"]]);
  add(`<path d="${rough([[-40, 770], [380, 756], [760, 778], [1160, 752], [1640, 772], [1640, 940], [-40, 940]], { seed: 32, wobble: 4, step: 50 })}" fill="${dune2}" filter="url(#wash)" opacity="0.9"/>`);
  add(`<g fill="#a2414a" filter="url(#ink)" opacity="0.4">
    <path d="${brush([[180, 736], [420, 730], [640, 738]], { w: 1.6, seed: 33 })}"/>
    <path d="${brush([[900, 790], [1140, 784], [1300, 790]], { w: 1.4, seed: 34 })}"/>
  </g>`);

  // ── L'arbre aux fils, à contre-jour ──
  // Enraciné sur le grand rocher de droite (le rocher, peint ensuite, couvre son pied). Tronc courbe, ramure en
  // ombrelle : quatre arcs qui retombent, d'où pendent des fils droits à intervalles réguliers, certains refermés en boucle.
  const treeStart = out.length;
  const ink = "#6e1626";
  const trunk = brush([[1292, 760], [1280, 640], [1258, 530], [1270, 420], [1254, 320], [1262, 222]], { w: 20, start: 1, end: 0.45, peak: 0.04, seed: 91 });
  const top = [1262, 226];
  const arcs = [
    { pts: [top, [1200, 186], [1110, 186], [1040, 220], [1008, 262]], w: 9, n: 9 },
    { pts: [top, [1330, 184], [1420, 188], [1478, 222], [1500, 258]], w: 9, n: 7 },
    { pts: [[1262, 236], [1214, 222], [1160, 232], [1130, 262]], w: 7, n: 4 },
    { pts: [[1262, 236], [1316, 220], [1368, 228], [1394, 256]], w: 7, n: 4 },
  ];
  // Profil de pression des branches (celui de `brush`) : épaisses au tronc, affinées vers la pointe
  const ARC = { start: 1, end: 0.4, peak: 0.05 };
  const widthAt = (r, t) =>
    r.w * (t < ARC.peak ? ARC.start + (1 - ARC.start) * Math.sin((t / ARC.peak) * (Math.PI / 2)) : ARC.end + (1 - ARC.end) * Math.cos(((t - ARC.peak) / (1 - ARC.peak)) * (Math.PI / 2)));
  add(`<g fill="${ink}" filter="url(#ink)" opacity="0.92">
    <path d="${trunk}"/>
    ${arcs.map((r, i) => `<path d="${brush(r.pts, { w: r.w, ...ARC, seed: 92 + i })}"/>`).join("")}
  </g>`);
  // Les fils partent de la courbe même de la branche (celle du pinceau), un peu dedans : aucun jour entre les deux
  const curve = (pts) => Array.from({ length: 201 }, (_, k) => sample(pts, k / 200));
  const yAt = (line, x) => line.reduce((best, p) => (Math.abs(p[0] - x) < Math.abs(best[0] - x) ? p : best))[1];
  const strands = [];
  const loops = [];
  const drops = [];
  // Chaque fil est plus fin que la branche à l'endroit où il s'accroche, tombe droit (sans dériver au-delà de la pointe),
  // et aucun ne pend tout au bout, là où la branche est la plus fine
  arcs.forEach((r, k) => {
    const line = curve(r.pts);
    const dir = Math.sign(r.pts[0][0] - r.pts[r.pts.length - 1][0]); // vers le tronc
    for (let i = 0; i < r.n; i++) {
      const t = 0.14 + (i / (r.n - 1)) * 0.68;
      const [x, y] = sample(r.pts, t);
      const w = Math.min(3.2, widthAt(r, t) * 0.7);
      // Longueurs en rythme (long, court, moyen…), plus longues vers l'extérieur de la ramure
      const len = (k < 2 ? 70 : 50) + [0, 60, 25, 95, 40][i % 5] + t * 60 + rand() * 14;
      if (k < 2 && i % 4 === 2) {
        // Boucle : descend, tourne vers le tronc et remonte jusqu'à la branche : les deux bouts sont accrochés
        const back = yAt(line, x + dir * 12) - 2;
        loops.push({ w, d: `M${x.toFixed(1)} ${(y - 2).toFixed(1)} V${(y + len * 0.8).toFixed(1)} a6 6 0 0 ${dir > 0 ? 0 : 1} ${dir * 12} 0 V${back.toFixed(1)}` });
      } else {
        strands.push(brush([[x, y - 2], [x, y + len * 0.5], [x, y + len]], { w, start: 1, end: 0.6, peak: 0.1, seed: 100 + strands.length, jitter: 0.03 }));
        // Une goutte au bout de certains fils, qui chevauche leur extrémité
        if (i % 3 === 1) drops.push([x, y + len + 2, 3 + rand() * 1.2]);
      }
    }
  });
  add(`<g fill="${ink}" filter="url(#ink-wet)" opacity="0.85">${strands.map((d) => `<path d="${d}"/>`).join("")}</g>`);
  add(`<g fill="none" stroke="${ink}" stroke-linecap="round" filter="url(#ink-wet)" opacity="0.85">${loops
    .map(({ w, d }) => `<path d="${d}" stroke-width="${(w * 0.85).toFixed(2)}"/>`)
    .join("")}</g>`);
  add(`<g filter="url(#wash)">${drops.map(([x, y, r], i) => `<path d="${rough([[x, y - r * 1.4], [x + r, y], [x, y + r * 1.1], [x - r, y]], { seed: 140 + i, wobble: 0.6, step: 6 })}" fill="${i % 3 ? "#c43b4a" : "#e0606c"}"/>`).join("")}</g>`);

  // ── Pétales emportés par le vent, de l'arbre vers la gauche (avec l'arbre : sur téléphone, ils le suivent) ──
  // (à gauche de la ramure : entre les fils, un pétale se lirait comme un morceau détaché de l'arbre)
  const petals = [[968, 236, 9, 20], [912, 300, 7, -30], [962, 352, 6, 70], [872, 384, 5, 10], [930, 424, 4, -60]];
  add(`<g filter="url(#wash)">${petals
    .map(([x, y, s, r], i) => `<path d="${brush([[x - s, y], [x, y - s * 0.35], [x + s, y]], { w: s * 0.9, start: 0.2, end: 0.1, peak: 0.5, seed: 150 + i })}" transform="rotate(${r} ${x} ${y})" fill="${i % 2 ? "#c43b4a" : "#a8283a"}" opacity="0.85"/>`)
    .join("")}</g>`);

  // Sur téléphone, le cadrage ne garderait qu'un bout de ramure sans tronc : l'arbre entier, un peu plus petit,
  // vient se planter sur la pente du rocher de droite, encore visible au bord du cadre.
  if (portrait) {
    const tree = out.splice(treeStart);
    add(`<g transform="translate(1046 836) scale(0.78) translate(-1292 -760)">${tree.join("")}</g>`);
  }

  // ── Rochers rouges à facettes, au premier plan ──
  const rock = (facets, seed) =>
    facets
      .map(([pts, fill, op = 1], i) => `<path d="${rough(pts, { seed: seed + i, wobble: 2.4, step: 30 })}" fill="${fill}" opacity="${op}" filter="url(#wash-solid)"/>`)
      .join("");
  // Bas-gauche
  const lA = [[-40, 900], [-40, 770], [60, 700], [196, 742], [316, 820], [352, 900]];
  add(rock([[lA, "#c43b4a"], [[[60, 700], [196, 742], [150, 836], [30, 806]], "#e06a72", 0.9], [[[196, 742], [316, 820], [352, 900], [190, 900], [150, 836]], "#8a1c2d", 0.85], [[[-40, 770], [60, 700], [30, 806], [-40, 860]], "#a42838", 0.7]], 41));
  const lAd = rough(lA, { seed: 41, wobble: 2.4, step: 30 });
  add(c.mottle(lAd, [-40, 716, 352, 900], ["#e88b7c", "#6f1a2a"], { count: 3, seed: 45, opacity: 0.3 }));
  // Bas-droit, sous la fiche d'informations
  const rB = [[1000, 900], [1076, 756], [1196, 700], [1300, 676], [1452, 722], [1560, 688], [1640, 704], [1640, 900]];
  add(rock([[rB, "#b8323f"], [[[1076, 756], [1196, 700], [1300, 676], [1250, 796]], "#dc5c66", 0.9], [[[1300, 676], [1452, 722], [1560, 688], [1640, 704], [1640, 900], [1420, 900], [1250, 796]], "#7a1828", 0.8], [[[1250, 796], [1420, 900], [1170, 900]], "#9b2434", 0.75], [[[1000, 900], [1076, 756], [1250, 796], [1170, 900]], "#c94452", 0.6]], 51));
  const rBd = rough(rB, { seed: 51, wobble: 2.4, step: 30 });
  add(c.mottle(rBd, [1010, 690, 1640, 900], ["#e88b7c", "#5e1322", "#c96a5a"], { count: 4, seed: 55, opacity: 0.28 }));
  // Petit rocher au centre
  add(rock([[[[612, 900], [654, 830], [724, 808], [790, 900]], "#c64552"], [[[654, 830], [724, 808], [704, 870]], "#e2737a", 0.9], [[[724, 808], [790, 900], [690, 900], [704, 870]], "#8e1f30", 0.7]], 61));
  // Encre : arêtes principales, jamais toutes
  add(`<g fill="#4d0f1c" filter="url(#ink)" opacity="0.7">
    <path d="${brush([[-30, 768], [60, 700], [196, 742], [316, 820], [350, 896]], { w: 3, seed: 71, peak: 0.3 })}"/>
    <path d="${brush([[60, 704], [30, 806], [150, 836]], { w: 1.6, seed: 72, start: 0.6 })}"/>
    <path d="${brush([[1074, 758], [1196, 700], [1300, 676], [1452, 722], [1560, 688], [1630, 702]], { w: 3, seed: 73, peak: 0.55 })}"/>
    <path d="${brush([[1300, 680], [1252, 796], [1172, 898]], { w: 1.8, seed: 74 })}"/>
    <path d="${brush([[656, 830], [724, 806], [788, 898]], { w: 2, seed: 75 })}"/>
  </g>`);
  // Éclats rouges épars au sol
  add(`<g filter="url(#wash)">${[[470, 852, 9], [560, 806, 6], [880, 846, 11], [940, 804, 5], [420, 790, 5]]
    .map(([x, y, s], i) => `<path d="${rough([[x - s, y], [x, y - s * 1.3], [x + s, y + 1]], { seed: 80 + i, wobble: 1, step: 10 })}" fill="${i % 2 ? "#8e1f30" : "#c43b4a"}"/>`)
    .join("")}</g>`);

  return { body: out.join("\n"), defs: c.defs.join("") };
}
