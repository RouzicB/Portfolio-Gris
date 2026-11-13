import { Layer } from "../Parallax";
import { Frame, archPath, moundPath, seeded } from "./shared";

/** Aptitudes — sous la surface : rais de lumière, arche engloutie, méduses, algues à losanges, bulles */
export default function BleuArt() {
  const rand = seeded(23);
  const bubbles = Array.from({ length: 14 }, () => ({
    left: rand() * 100,
    size: 4 + rand() * 10,
    delay: rand() * 14,
    duration: 10 + rand() * 10,
  }));
  return (
    <>
      <Layer depth={0.1}>
        <Frame>
          {/* Surface vue d'en dessous */}
          <g fill="none" stroke="#f4fbff" strokeLinecap="round" opacity="0.55" className="animate-drift">
            <path d="M-50 70 C150 50 300 95 500 70 S850 45 1050 70 S1400 95 1650 65" strokeWidth="3" />
            <path d="M-50 120 C200 100 380 140 600 118 S1000 95 1250 120 S1500 135 1650 115" strokeWidth="1.5" />
          </g>
          {/* Rais de lumière, nets et obliques */}
          <g fill="#f4fbff" opacity="0.16">
            <path d="M640 0 H760 L560 900 H360Z" />
            <path d="M880 0 H930 L1000 900 H880Z" />
            <path d="M330 0 H370 L120 900 H40Z" />
          </g>
          <path d="M0 650 C260 610 500 670 760 640 S1250 600 1600 650 V900 H0Z" fill="#a9cfe0" opacity="0.8" filter="url(#wc-paint)" />
        </Frame>
      </Layer>

      <Layer depth={0.4}>
        <Frame>
          {/* Arche engloutie, penchée */}
          <path
            fillRule="evenodd"
            d={archPath(60, 520, 220, 300, 120, 0.2)}
            transform="rotate(-8 170 820)"
            fill="#4f86ad"
            filter="url(#wc-paint)"
          />
          <path d={moundPath(-60, 520, 900, 760, 0)} fill="#2f6390" filter="url(#wc-paint)" />
          <path d={moundPath(-60, 520, 900, 760, 0)} fill="url(#hatch)" />
          <path d={moundPath(1080, 1700, 900, 720, -30)} fill="#2f6390" filter="url(#wc-paint)" />
          <path d={moundPath(1080, 1700, 900, 720, -30)} fill="url(#hatch)" />
          {/* Méduses */}
          <g className="animate-float">
            {[
              [1240, 260, 1],
              [1350, 340, 0.7],
            ].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity="0.85">
                <path d="M-36 0 A36 32 0 0 1 36 0 Q18 8 0 2 Q-18 8 -36 0Z" fill="#f2d4e2" />
                <path d="M-20 4 q-6 30 4 60 M0 4 q8 34 -2 70 M20 4 q6 28 -4 54" stroke="#f2d4e2" strokeWidth="2" fill="none" />
              </g>
            ))}
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.8}>
        <Frame>
          {/* Algues à losanges */}
          {[70, 130, 1480, 1540].map((x, i) => (
            <g key={x} className="animate-float" style={{ animationDelay: `${i * 1.3}s` }}>
              <path d={`M${x} 900 C${x - 24} 780 ${x + 24} 700 ${x} ${560 - i * 20}`} stroke="#1f4f75" strokeWidth="3" fill="none" />
              {[820, 760, 700, 640].map((y, k) => (
                <path key={y} d={`M${x + (k % 2 ? -6 : 6)} ${y - i * 4} l10 14 -10 14 -10 -14z`} fill={k % 2 ? "#2f6fa6" : "#4f8fbf"} />
              ))}
            </g>
          ))}
          <path d="M0 860 C400 830 900 900 1600 850 V900 H0Z" fill="#183f5e" filter="url(#wc-paint)" />
        </Frame>
      </Layer>

      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="animate-rise absolute bottom-[-20px] rounded-full border border-white/70 bg-white/10"
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
