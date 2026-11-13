import { Layer } from "../Parallax";
import { Frame, GeoTree, moundPath, seeded } from "./shared";

/** Contact & crédits — nuit prune : grande lune, arbres géométriques aux feuilles carrées, terrasse fleurie */
export default function LuneArt() {
  const rand = seeded(31);
  const stars = Array.from({ length: 70 }, () => ({ x: rand() * 1600, y: rand() * 600, r: 0.7 + rand() * 1.5, d: rand() * 4 }));
  const flowers = Array.from({ length: 46 }, () => ({ x: rand() * 1600, y: 800 + rand() * 60, r: 5 + rand() * 9 }));
  const petals = Array.from({ length: 10 }, () => ({ x: rand() * 1600, y: 200 + rand() * 500, d: rand() * 6 }));
  return (
    <>
      <Layer depth={0.06}>
        <Frame>
          <g fill="#fff4d6">
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} className="animate-twinkle" style={{ animationDelay: `${s.d}s` }} />
            ))}
          </g>
          <path d={moundPath(-100, 900, 800, 640, 40)} fill="#3a2140" filter="url(#wc-paint)" />
          <path d={moundPath(700, 1700, 800, 620, -60)} fill="#3a2140" filter="url(#wc-paint)" />
        </Frame>
      </Layer>

      <Layer depth={0.35}>
        <Frame>
          <g filter="url(#wc-paint)">
            {/* Deux arbres de part et d'autre de la lune, côté droit : la gauche reste libre pour le texte */}
            <GeoTree x={1020} y={820} height={380} depth={3} seed={3} leafSize={36} />
            <GeoTree x={1440} y={820} height={600} depth={3} seed={8} leafSize={46} leaves={["#c2416b", "#e0608a", "#8d2f5c"]} />
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.8}>
        <Frame>
          {/* Terrasse et fleurs */}
          <path d="M-20 820 H1620 V900 H-20Z" fill="#2a1630" filter="url(#wc-paint)" />
          <path d="M-20 820 H1620 V900 H-20Z" fill="url(#hatch-light)" opacity="0.4" />
          <g filter="url(#wc-paint)">
            {flowers.map((f, i) => (
              <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={i % 3 === 0 ? "#f06a8f" : i % 3 === 1 ? "#d9466f" : "#ff9ab3"} />
            ))}
          </g>
          <g fill="#6fb5a0">
            <path d="M560 820 C540 780 560 740 600 720 C600 760 590 790 560 820Z" />
            <path d="M1040 820 C1066 784 1100 770 1140 776 C1120 804 1084 820 1040 820Z" />
          </g>
          {/* Pétales qui flottent */}
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
