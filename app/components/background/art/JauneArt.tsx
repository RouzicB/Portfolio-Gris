import { Layer } from "../Parallax";
import { Frame, seeded } from "./shared";

/** Parcours — crépuscule doré : cinq pierres flottantes qui montent, comme cinq années, au-dessus des mesas */
export default function JauneArt() {
  const rand = seeded(5);
  const stars = Array.from({ length: 60 }, () => ({ x: rand() * 1600, y: rand() * 420, r: 0.8 + rand() * 1.6, d: rand() * 4 }));
  const fireflies = Array.from({ length: 9 }, () => ({ x: 80 + rand() * 1440, y: 600 + rand() * 200, d: rand() * 6 }));
  const stones = [
    { x: 90, y: 830, s: 54 },
    { x: 420, y: 815, s: 62 },
    { x: 760, y: 790, s: 70 },
    { x: 1110, y: 758, s: 80 },
    { x: 1450, y: 716, s: 92 },
  ];
  return (
    <>
      <Layer depth={0.06}>
        <Frame>
          <g fill="#fff3d6">
            {stars.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} className="animate-twinkle" style={{ animationDelay: `${s.d}s` }} />
            ))}
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.3}>
        <Frame>
          {/* Mesas plates, aplats successifs */}
          <g filter="url(#wc-paint)">
            <path d="M0 700 H180 L210 640 H420 L450 700 H900 L930 660 H1180 L1210 700 H1600 V900 H0Z" fill="#a9768a" />
            <path d="M0 760 H300 L330 720 H620 L650 760 H1250 L1280 730 H1500 L1530 760 H1600 V900 H0Z" fill="#7b5276" />
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.75}>
        <Frame>
          <path d="M0 820 C300 800 700 850 1000 820 S1450 800 1600 815 V900 H0Z" fill="#3b2a4c" filter="url(#wc-paint)" />
          <path d="M0 820 C300 800 700 850 1000 820 S1450 800 1600 815 V900 H0Z" fill="url(#hatch)" />
          {/* Fil lumineux entre les pierres */}
          <path
            d={`M${stones.map((s) => `${s.x + s.s / 2} ${s.y - s.s}`).join(" L")}`}
            stroke="#ffe3a1"
            strokeWidth="1.5"
            strokeDasharray="2 7"
            fill="none"
            opacity="0.7"
          />
          {stones.map((s, i) => (
            <g key={i} className="animate-float" style={{ animationDelay: `${i * 0.9}s` }} filter="url(#wc-paint)">
              <rect x={s.x} y={s.y - s.s} width={s.s} height={s.s} fill="#5b4372" />
              <rect x={s.x} y={s.y - s.s} width={s.s} height={s.s * 0.22} fill="#e9b97a" />
              {/* Petit arbre triangulaire sur la pierre */}
              <path d={`M${s.x + s.s * 0.68} ${s.y - s.s} v-14`} stroke="#3b2a4c" strokeWidth="2" />
              <path d={`M${s.x + s.s * 0.68 - 9} ${s.y - s.s - 12} h18 l-9 -22z`} fill="#f2c14e" />
            </g>
          ))}
          <g fill="#ffd970">
            {fireflies.map((f, i) => (
              <g key={i} className="animate-float" style={{ animationDelay: `${f.d}s` }}>
                <circle cx={f.x} cy={f.y} r="9" opacity="0.45" filter="url(#wc-glow)" />
                <circle cx={f.x} cy={f.y} r="2.2" />
              </g>
            ))}
          </g>
        </Frame>
      </Layer>
    </>
  );
}
