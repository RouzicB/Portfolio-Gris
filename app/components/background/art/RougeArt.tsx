import { Layer } from "../Parallax";
import { Frame, HangingTriangles, moundPath, seeded } from "./shared";

/** Profil — une forêt de troncs rouges, des triangles suspendus, des monticules clairs et sombres */
export default function RougeArt() {
  const rand = seeded(17);
  const petals = Array.from({ length: 26 }, () => ({ x: rand() * 1600, y: 700 + rand() * 190, r: 2 + rand() * 2.5 }));
  return (
    <>
      <Layer depth={0.08}>
        <Frame>
          {/* Troncs lointains, très pâles */}
          <g fill="#efcfcb" filter="url(#wc-paint)">
            {[120, 330, 470, 610, 980, 1110, 1260, 1420].map((x, i) => (
              <rect key={x} x={x} y="-20" width={26 + (i % 3) * 14} height="760" />
            ))}
          </g>
          <path d={moundPath(300, 1300, 760, 560, 80)} fill="#e9d6d0" filter="url(#wc-paint)" />
        </Frame>
      </Layer>

      <Layer depth={0.3}>
        <Frame>
          <defs>
            <linearGradient id="rouge-trunk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e08a90" />
              <stop offset="1" stopColor="#c4505d" />
            </linearGradient>
          </defs>
          <g fill="url(#rouge-trunk)" filter="url(#wc-paint)">
            <rect x="60" y="-20" width="70" height="790" />
            <rect x="230" y="-20" width="44" height="790" />
            <rect x="1190" y="-20" width="52" height="790" />
            <rect x="1360" y="-20" width="84" height="790" />
          </g>
          {/* Tiges et triangles suspendus */}
          <HangingTriangles
            items={[
              { x: 30, len: 120, size: 34, bend: 20 },
              { x: 170, len: 70, size: 26, bend: -10 },
              { x: 300, len: 150, size: 30, bend: 24 },
              { x: 420, len: 60, size: 22 },
              { x: 1120, len: 90, size: 26, bend: -18 },
              { x: 1280, len: 140, size: 34, bend: 16 },
              { x: 1480, len: 70, size: 24 },
              { x: 1560, len: 160, size: 30, bend: -20 },
            ]}
          />
          {/* Monticule clair et grande pousse */}
          <path d={moundPath(820, 1600, 820, 600, 60)} fill="#d6e5da" filter="url(#wc-paint)" />
          <path d={moundPath(820, 1600, 820, 600, 60)} fill="url(#hatch)" opacity="0.5" />
          <g transform="translate(1250 612)" filter="url(#wc-paint)">
            <path d="M0 0 C-10 -60 -50 -110 -120 -120 C-100 -70 -60 -20 0 0Z" fill="#b9d3c2" />
            <path d="M0 0 C20 -50 70 -80 130 -70 C100 -30 50 -6 0 0Z" fill="#a7c7b3" />
            <path d="M0 0 C-30 -50 -70 -90 -116 -118 M0 0 C40 -36 80 -58 126 -70" stroke="#7aa08a" strokeWidth="2" fill="none" />
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.75}>
        <Frame>
          <g fill="#8f1f33" filter="url(#wc-paint)">
            <rect x="-30" y="-20" width="110" height="900" />
            <rect x="1520" y="-20" width="120" height="900" />
          </g>
          {/* Monticules sombres hachurés */}
          <path d={moundPath(-80, 760, 920, 700, -40)} fill="#4a2a35" filter="url(#wc-paint)" />
          <path d={moundPath(-80, 760, 920, 700, -40)} fill="url(#hatch)" />
          <path d={moundPath(600, 1680, 930, 760, 40)} fill="#5a3340" filter="url(#wc-paint)" />
          <path d={moundPath(600, 1680, 930, 760, 40)} fill="url(#hatch)" />
          {/* Champignons */}
          <g fill="#c4505d">
            <path d="M260 712 a22 14 0 0 1 44 0Z" />
            <rect x="279" y="712" width="6" height="18" fill="#e8c9c4" />
            <path d="M330 724 a14 9 0 0 1 28 0Z" />
            <rect x="342" y="724" width="4" height="12" fill="#e8c9c4" />
          </g>
          {/* Pétales */}
          <g fill="#d43a4f">
            {petals.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} />
            ))}
          </g>
        </Frame>
      </Layer>
    </>
  );
}
