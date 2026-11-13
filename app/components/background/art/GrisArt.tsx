import { Layer } from "../Parallax";
import { Cloud, Frame, archPath } from "./shared";

/** Accueil — brume grise : un aqueduc brisé, une colonne solitaire, des pierres qui flottent, une mer de nuages */
export default function GrisArt() {
  return (
    <>
      <Layer depth={0.12}>
        <Frame>
          <defs>
            <linearGradient id="gris-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e2e0dd" />
              <stop offset="1" stopColor="#d2d0cc" />
            </linearGradient>
          </defs>
          {/* Colonnade lointaine */}
          <g fill="url(#gris-far)" filter="url(#wc-paint)">
            {[520, 580, 640, 960, 1020, 1080].map((x, i) => (
              <rect key={x} x={x} y={470 + (i % 3) * 18} width="22" height="200" />
            ))}
            <rect x="505" y="455" width="160" height="16" />
            <rect x="945" y="470" width="160" height="14" />
          </g>
          <Cloud x={300} y={240} s={1.1} fill="#f7f6f4" opacity={0.6} />
          <Cloud x={1330} y={190} s={0.9} fill="#f7f6f4" opacity={0.55} />
        </Frame>
      </Layer>

      <Layer depth={0.4}>
        <Frame>
          <defs>
            <linearGradient id="gris-stone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c6c3bf" />
              <stop offset="1" stopColor="#a3a09b" />
            </linearGradient>
            <clipPath id="gris-break">
              <path d="M-80 330 L470 610 L470 900 L-80 900Z" />
            </clipPath>
          </defs>
          {/* Aqueduc brisé en diagonale */}
          <g clipPath="url(#gris-break)" filter="url(#wc-paint)">
            <path fillRule="evenodd" fill="url(#gris-stone)" d={archPath(-60, 380, 170, 420, 96)} />
            <path fillRule="evenodd" fill="url(#gris-stone)" d={archPath(110, 380, 170, 420, 96)} />
            <path fillRule="evenodd" fill="url(#gris-stone)" d={archPath(280, 380, 170, 420, 96)} />
            <rect x="-60" y="372" width="520" height="16" fill="#b9b6b1" />
          </g>
          {/* Colonne solitaire et son chapiteau */}
          <g filter="url(#wc-paint)">
            <rect x="1290" y="300" width="64" height="480" fill="url(#gris-stone)" />
            <rect x="1272" y="284" width="100" height="22" fill="#bcb9b4" />
            <path d="M1282 284 L1302 262 L1330 276 L1362 258 L1362 284Z" fill="#c9c6c1" />
          </g>
          {/* Pierres en suspens */}
          <g fill="#c4c1bc" filter="url(#wc-paint)">
            <rect x="1180" y="250" width="34" height="34" transform="rotate(14 1197 267)" />
            <rect x="1410" y="190" width="22" height="22" transform="rotate(-20 1421 201)" />
            <rect x="520" y="300" width="18" height="18" transform="rotate(30 529 309)" />
          </g>
          <circle cx="1322" cy="232" r="4" fill="#ffffff" filter="url(#wc-glow)" className="animate-twinkle" />
        </Frame>
      </Layer>

      <Layer depth={0.75}>
        <Frame>
          <g className="animate-drift">
            <Cloud x={160} y={880} s={2} fill="#f8f7f5" opacity={0.97} />
            <Cloud x={760} y={910} s={2.4} fill="#ffffff" opacity={0.95} />
            <Cloud x={1420} y={870} s={2} fill="#f8f7f5" opacity={0.97} />
          </g>
        </Frame>
      </Layer>
    </>
  );
}
