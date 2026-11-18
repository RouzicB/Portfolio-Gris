import { Layer } from "../Parallax";
import { Frame, HangingTriangles, moundPath, moundSurface, seeded } from "./shared";

/**
 * Convictions — forêt verte, un seul ton décliné :
 * troncs-colonnes, triangles suspendus en rideau, grand tronc qui se tord en arche,
 * monticule clair à la crête sombre, pousses.
 */
export default function VertArt() {
  const rand = seeded(11);
  // Rideau de triangles : courts au-dessus du contenu, longs sur les bords
  const hang = Array.from({ length: 46 }, (_, i) => {
    const x = -20 + i * 36 + rand() * 20;
    const edge = x < 130 || x > 1250;
    return {
      x,
      len: (edge ? 120 : 30) + rand() * (edge ? 260 : 90),
      size: 16 + rand() * 22,
      bend: (rand() - 0.5) * 50,
      dark: rand() > 0.45,
    };
  });
  const ground = moundSurface(-120, 1720, 960, 640, 380);
  const sprouts = [380, 620, 900, 1080, 1180].map((x) => ({ x, y: ground(x) }));
  const petals = Array.from({ length: 16 }, () => {
    const x = 300 + rand() * 1200;
    return { x, y: ground(x) - 4 - rand() * 10 };
  });

  return (
    <>
      <Layer depth={0.05}>
        <Frame>
          {/* Troncs lointains, très pâles */}
          <g fill="#dce9d8" filter="url(#wc-paint)">
            {[60, 230, 700, 860, 1010, 1180].map((x, i) => (
              <rect key={x} x={x} y="-20" width={50 + (i % 3) * 24} height="760" />
            ))}
          </g>
          <path d={moundPath(200, 1300, 780, 560, 120)} fill="#e3eee0" filter="url(#wc-paint)" />
        </Frame>
      </Layer>

      <Layer depth={0.25}>
        <Frame>
          <defs>
            <linearGradient id="vert-trunk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a7c9ae" />
              <stop offset="1" stopColor="#7fae8b" />
            </linearGradient>
            <linearGradient id="vert-arch" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3f7a54" />
              <stop offset="1" stopColor="#24502f" />
            </linearGradient>
          </defs>
          {/* Troncs-colonnes */}
          <g fill="url(#vert-trunk)" filter="url(#wc-paint)">
            <rect x="330" y="-20" width="130" height="820" />
            <rect x="560" y="-20" width="96" height="820" />
          </g>
          {/* Grand tronc qui se tord en arche */}
          <g filter="url(#wc-paint)">
            <path
              d="M1170 820 C1170 600 1220 500 1320 450 C1400 410 1420 300 1430 -20 H1580 C1572 300 1600 430 1660 520 V820 H1570 C1570 680 1510 610 1440 610 C1360 610 1290 680 1290 820Z"
              fill="url(#vert-arch)"
            />
            <path d="M1214 820 C1214 640 1260 540 1350 490 C1420 450 1460 330 1470 -20" stroke="#5e9970" strokeWidth="3" fill="none" opacity="0.6" />
            <path d="M1260 820 C1262 680 1300 600 1370 560 C1450 520 1500 420 1520 -20" stroke="#5e9970" strokeWidth="3" fill="none" opacity="0.45" />
          </g>
          {/* Petites arches de racines */}
          <g stroke="#24502f" strokeWidth="9" fill="none" strokeLinecap="round">
            <path d="M1080 830 v-50 a26 26 0 0 1 52 0 v50" />
            <path d="M1012 840 v-28 a16 16 0 0 1 32 0 v28" />
          </g>
          {/* Rideau de triangles */}
          <HangingTriangles items={hang.filter((h) => h.dark)} stroke="#1f3a2a" fill="#1f3a2a" />
          <HangingTriangles items={hang.filter((h) => !h.dark)} stroke="#4f7e62" fill="#6f9f80" />
        </Frame>
      </Layer>

      <Layer depth={0.65}>
        <Frame>
          {/* Monticule clair à la crête sombre */}
          <path d={moundPath(-120, 1720, 960, 640, 380)} fill="#cfe1cd" filter="url(#wc-paint)" />
          <path d={moundPath(-120, 1720, 960, 640, 380)} fill="none" stroke="#1f3a2a" strokeWidth="7" filter="url(#wc-edge)" />
          <path d={moundPath(-120, 1720, 960, 640, 380)} fill="url(#hatch)" opacity="0.35" />
          {/* Monticule de premier plan */}
          <path d={moundPath(-200, 900, 960, 820, -60)} fill="#9cc2a2" filter="url(#wc-paint)" />
          <path d={moundPath(-200, 900, 960, 820, -60)} fill="none" stroke="#1f3a2a" strokeWidth="5" filter="url(#wc-edge)" />
          {/* Pousses et pétales sur la crête */}
          {sprouts.map((s, i) => (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              <path d="M0 0 C-2 -14 2 -26 0 -40" stroke="#1f3a2a" strokeWidth="2.5" fill="none" />
              <path d="M0 -30 C-8 -44 -26 -48 -34 -42 C-26 -34 -12 -30 0 -30Z" fill="#5e9970" />
              <path d="M0 -38 C8 -52 26 -56 34 -50 C26 -42 12 -38 0 -38Z" fill="#7fae8b" />
            </g>
          ))}
          <g fill="#2a6a45">
            {petals.map((p, i) => (
              <path key={i} d={`M${p.x} ${p.y} l5 -9 5 9z`} />
            ))}
          </g>
        </Frame>
      </Layer>
    </>
  );
}
