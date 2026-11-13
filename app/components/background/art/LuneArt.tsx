import { Layer } from "../Parallax";
import { Frame, GeoTree, archPath, moundPath, seeded } from "./shared";

/**
 * Contact & crédits — le jardin de nuit, en prune et rose :
 * étoiles et constellations, sommets triangulaires à deux faces, un lac qui scintille,
 * une porte en arche drapée de lianes entre deux arbres géométriques,
 * et au premier plan une terrasse à balustres couverte de fleurs.
 */
export default function LuneArt() {
  const rand = seeded(31);
  const stars = Array.from({ length: 80 }, () => ({ x: rand() * 1600, y: rand() * 560, r: 0.7 + rand() * 1.5, d: rand() * 4 }));
  // Constellations : quelques étoiles reliées par un trait fin
  const constellations = [
    [
      [140, 120],
      [210, 90],
      [290, 130],
      [350, 96],
      [420, 150],
    ],
    [
      [760, 70],
      [820, 120],
      [900, 104],
      [930, 170],
    ],
  ];
  const shimmer = Array.from({ length: 28 }, () => ({ x: 120 + rand() * 1400, y: 742 + rand() * 46, w: 14 + rand() * 40, d: rand() * 4 }));
  const flowers = Array.from({ length: 54 }, () => ({ x: rand() * 1600, y: 812 + rand() * 30, r: 5 + rand() * 9 }));
  const petals = Array.from({ length: 14 }, () => ({ x: rand() * 1600, y: 180 + rand() * 520, d: rand() * 6 }));
  const vines = Array.from({ length: 9 }, (_, i) => ({ x: 1166 + i * 21, len: 40 + rand() * 90 }));
  const balusters = Array.from({ length: 41 }, (_, i) => -10 + i * 40);

  return (
    <>
      {/* Ciel : étoiles, constellations */}
      <Layer depth={0.04}>
        <Frame>
          <g fill="#fff4d6">
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} className="animate-twinkle" style={{ animationDelay: `${s.d}s` }} />
            ))}
          </g>
          <g stroke="#fff4d6" strokeOpacity="0.3" strokeWidth="1" fill="none">
            {constellations.map((c, i) => (
              <path key={i} d={`M${c.map((p) => p.join(" ")).join(" L")}`} />
            ))}
          </g>
          <g fill="#fff4d6">
            {constellations.flat().map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2.4" />
            ))}
          </g>
        </Frame>
      </Layer>

      {/* Sommets lointains à deux faces, collines */}
      <Layer depth={0.1}>
        <Frame>
          <g filter="url(#wc-paint)">
            <path d="M260 360 L620 760 H-100Z" fill="#33203f" />
            <path d="M260 360 L620 760 H330Z" fill="#2a1834" />
            <path d="M860 470 L1120 760 H600Z" fill="#3b2246" />
            <path d="M860 470 L1120 760 H900Z" fill="#311c3c" />
            <path d="M1480 330 L1820 760 H1160Z" fill="#36203f" />
            <path d="M1480 330 L1820 760 H1530Z" fill="#2c1935" />
          </g>
          <path d={moundPath(-100, 900, 780, 660, 40)} fill="#3a2140" filter="url(#wc-paint)" />
          <path d={moundPath(700, 1700, 780, 640, -60)} fill="#3a2140" filter="url(#wc-paint)" />
        </Frame>
      </Layer>

      {/* Lac qui scintille */}
      <Layer depth={0.2}>
        <Frame>
          <rect x="-20" y="736" width="1640" height="70" fill="#24122c" opacity="0.85" />
          <rect x="-20" y="736" width="1640" height="70" fill="url(#hatch-light)" opacity="0.25" />
          <g fill="#ffd9e4">
            {shimmer.map((s, i) => (
              <rect key={i} x={s.x} y={s.y} width={s.w} height="1.6" className="animate-twinkle" style={{ animationDelay: `${s.d}s` }} />
            ))}
          </g>
        </Frame>
      </Layer>

      {/* Porte en arche drapée de lianes, entre deux arbres géométriques */}
      <Layer depth={0.35}>
        <Frame>
          <defs>
            <linearGradient id="lune-stone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6a3160" />
              <stop offset="1" stopColor="#3b1c42" />
            </linearGradient>
          </defs>
          <g filter="url(#wc-paint)">
            <path fillRule="evenodd" fill="url(#lune-stone)" d={archPath(1150, 520, 200, 300, 110, 0.32)} />
            <rect x="1138" y="506" width="224" height="16" fill="#7a3a6c" />
            <path d="M1138 506 L1250 470 L1362 506Z" fill="#8a4479" />
            <GeoTree x={1020} y={820} height={380} depth={3} seed={3} leafSize={36} />
            <GeoTree x={1460} y={820} height={600} depth={3} seed={8} leafSize={46} leaves={["#c2416b", "#e0608a", "#8d2f5c"]} />
          </g>
          {/* Lianes et feuilles carrées qui retombent de l'arche */}
          <g stroke="#6fb5a0" strokeWidth="2" fill="none" opacity="0.9">
            {vines.map((v, i) => (
              <path key={i} d={`M${v.x} 522 v${v.len}`} />
            ))}
          </g>
          <g fill="#f06a8f">
            {vines.map((v, i) =>
              i % 2 === 0 ? <rect key={i} x={v.x - 5} y={522 + v.len} width="10" height="10" transform={`rotate(45 ${v.x} ${527 + v.len})`} /> : null,
            )}
          </g>
        </Frame>
      </Layer>

      {/* Terrasse à balustres et fleurs, pétales en suspens */}
      <Layer depth={0.8}>
        <Frame>
          <g filter="url(#wc-paint)">
            <rect x="-20" y="796" width="1640" height="12" fill="#3f2346" />
            <g fill="#33193a">
              {balusters.map((x) => (
                <path key={x} d={`M${x} 808 h14 l-3 10 q5 6 0 12 l3 10 h-14 l3 -10 q-5 -6 0 -12Z`} />
              ))}
            </g>
            <rect x="-20" y="848" width="1640" height="60" fill="#2a1630" />
          </g>
          <rect x="-20" y="848" width="1640" height="60" fill="url(#hatch-light)" opacity="0.35" />
          <g filter="url(#wc-paint)">
            {flowers.map((f, i) => (
              <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={i % 3 === 0 ? "#f06a8f" : i % 3 === 1 ? "#d9466f" : "#ff9ab3"} />
            ))}
          </g>
          <g fill="#6fb5a0">
            <path d="M560 812 C540 772 560 732 600 712 C600 752 590 782 560 812Z" />
            <path d="M1040 812 C1066 776 1100 762 1140 768 C1120 796 1084 812 1040 812Z" />
            <path d="M120 812 C104 784 112 756 140 740 C144 770 138 792 120 812Z" />
          </g>
          <g fill="#ff9ab3">
            {petals.map((p, i) => (
              <g key={i} className="animate-float" style={{ animationDelay: `${p.d}s` }}>
                <rect x={p.x} y={p.y} width="7" height="7" transform={`rotate(45 ${p.x + 3.5} ${p.y + 3.5})`} />
              </g>
            ))}
          </g>
        </Frame>
      </Layer>
    </>
  );
}
