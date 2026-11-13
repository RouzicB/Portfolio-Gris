import { Layer } from "../Parallax";
import { Cloud, Frame, archPath } from "./shared";

/** Projets — ciel pastel : une grande arche brisée, des pierres en suspens, un rai rosé, une mer de nuages */
export default function CielArt() {
  return (
    <>
      <Layer depth={0.08}>
        <Frame>
          {/* Rai de lumière rosé, en diagonale */}
          <path d="M1250 -40 L1600 -40 L700 940 L380 940Z" fill="#f3b9cf" opacity="0.28" />
          <path d="M1380 -40 L1480 -40 L640 940 L560 940Z" fill="#ffffff" opacity="0.18" />
          {/* Tour lointaine */}
          <g fill="#cfe4ea" filter="url(#wc-paint)">
            <rect x="1180" y="420" width="46" height="300" />
            <rect x="1170" y="406" width="66" height="16" />
            <rect x="1196" y="380" width="14" height="28" />
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.35}>
        <Frame>
          <defs>
            <linearGradient id="ciel-stone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#9fd0dc" />
              <stop offset="1" stopColor="#5f9fb4" />
            </linearGradient>
            <clipPath id="ciel-break">
              <path d="M-40 940 L-40 520 L330 250 L470 940Z" />
            </clipPath>
          </defs>
          {/* Grande arche brisée en pointe */}
          <g clipPath="url(#ciel-break)" filter="url(#wc-paint)">
            <path fillRule="evenodd" fill="url(#ciel-stone)" d={archPath(-30, 260, 420, 640, 190, 0.42)} />
            <g stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2">
              <path d="M-30 520 H390 M-30 600 H390 M-30 680 H390" />
            </g>
          </g>
          {/* Petites plantes sur la ruine */}
          <g stroke="#3f7f78" strokeWidth="2" fill="none">
            <path d="M200 372 q-6 -24 4 -40 M226 352 q8 -20 2 -36" />
          </g>
          <g fill="#3f7f78">
            <circle cx="204" cy="330" r="5" />
            <circle cx="228" cy="314" r="4" />
          </g>
          {/* Pierres en suspens */}
          <g fill="#8fc3cf" filter="url(#wc-paint)">
            <rect x="430" y="300" width="30" height="30" transform="rotate(18 445 315)" />
            <rect x="500" y="230" width="18" height="18" transform="rotate(-12 509 239)" />
            <rect x="1360" y="560" width="26" height="26" transform="rotate(32 1373 573)" />
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.8}>
        <Frame>
          <g className="animate-drift-slow">
            <Cloud x={120} y={860} s={2.1} fill="#ffffff" opacity={0.97} />
            <Cloud x={640} y={900} s={2.4} fill="#fbeef3" opacity={0.95} />
            <Cloud x={1150} y={860} s={2.2} fill="#ffffff" opacity={0.97} />
            <Cloud x={1580} y={890} s={1.9} fill="#fbeef3" opacity={0.95} />
          </g>
        </Frame>
      </Layer>
    </>
  );
}
