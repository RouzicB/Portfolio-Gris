import { Layer } from "../Parallax";
import { Cloud, Frame, seeded } from "./shared";

/** Anneaux autour d'un fût de colonne (bandes perpendiculaires à son axe) */
function Bands({ x1, y1, x2, y2, count, width }: { x1: number; y1: number; x2: number; y2: number; count: number; width: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  return (
    <g stroke="#7a7773" strokeWidth="4" strokeLinecap="round" opacity="0.85">
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count;
        const cx = x1 + dx * t;
        const cy = y1 + dy * t;
        return <path key={i} d={`M${cx - (nx * width) / 2} ${cy - (ny * width) / 2} L${cx + (nx * width) / 2} ${cy + (ny * width) / 2}`} />;
      })}
    </g>
  );
}

/**
 * Accueil — monde blanc et gris :
 * une grande arche brisée en pierre craquelée à facettes, aux pieds cerclés d'anneaux,
 * une colonne effondrée, des éclats au sol, de lourds nuages gris, un horizon tracé à traits fins.
 */
export default function GrisArt() {
  const rand = seeded(29);
  const shards = Array.from({ length: 16 }, () => {
    const x = rand() * 1600;
    const s = 8 + rand() * 18;
    return { x, y: 770 + rand() * 60, s, r: (rand() - 0.5) * 50 };
  });
  return (
    <>
      <Layer depth={0.05}>
        <Frame>
          {/* Lourds nuages gris */}
          <Cloud x={300} y={120} s={2.4} fill="#c9c8c6" opacity={0.85} />
          <Cloud x={980} y={220} s={2.8} fill="#d2d1cf" opacity={0.9} />
          <Cloud x={1500} y={140} s={2} fill="#c4c3c1" opacity={0.8} />
          <Cloud x={720} y={520} s={2.2} fill="#e7e6e4" opacity={0.9} />
          {/* Pyramides lointaines sur l'horizon */}
          <g filter="url(#wc-paint)">
            <path d="M1160 760 L1240 690 L1330 760Z" fill="#dedddb" />
            <path d="M1240 690 L1330 760 H1252Z" fill="#d2d1ce" />
            <path d="M1380 760 L1430 720 L1490 760Z" fill="#e2e1df" />
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.3}>
        <Frame>
          {/* Sol pâle et traits d'horizon */}
          <path d="M-20 760 H1620 V920 H-20Z" fill="#f5f4f2" />
          <g stroke="#c9c7c4" strokeWidth="1.4" fill="none">
            <path d="M-20 762 C300 758 700 766 1000 760 S1500 756 1620 762" />
            <path d="M-20 800 C400 796 800 806 1200 798 S1520 800 1620 802" opacity="0.7" />
            <path d="M-20 846 C380 842 900 852 1620 844" opacity="0.5" />
          </g>

          {/* Grande arche brisée, à facettes — décalée à gauche pour laisser le centre à l'emblème */}
          <g transform="translate(-200 40) scale(0.92)">
          <g filter="url(#wc-paint)">
            <path
              d="M150 790 L170 600 L235 470 L330 370 L410 318 L452 342 L492 300 L560 316 L660 392 L740 510 L790 650 L800 790 L700 790 L690 670 C676 540 590 452 470 452 C356 452 268 540 254 670 L246 790Z"
              fill="#e6e5e3"
            />
            {/* Faces dans l'ombre */}
            <path d="M170 600 L235 470 L330 370 L362 452 C300 470 262 540 254 670Z" fill="#cfcdca" />
            <path d="M660 392 L740 510 L790 650 L700 670 C690 560 650 500 606 470Z" fill="#d8d6d3" />
            {/* Crevasses sombres au sommet brisé */}
            <path d="M410 318 L452 342 L440 372 L404 352Z" fill="#7d7a76" />
            <path d="M492 300 L560 316 L534 344 L500 330Z" fill="#8a8783" />
            <path d="M330 370 L362 384 L346 404Z" fill="#8a8783" />
          </g>
          {/* Fissures */}
          <g stroke="#9c9995" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.75">
            <path d="M330 370 L380 452 M452 342 L470 452 M560 316 L540 452 M660 392 L606 470 M235 470 L300 520 M740 510 L690 560" />
            <path d="M380 410 L420 400 L460 420 M520 380 L580 392 M290 440 L320 470" opacity="0.7" />
            {/* Anneaux de pierre (voussoirs) sur l'intrados */}
            <path d="M254 670 L210 668 M276 590 L232 576 M318 520 L284 494 M380 474 L360 436 M560 474 L586 436 M626 522 L664 494 M666 592 L712 578 M690 670 L736 668" />
          </g>
          {/* Pieds de l'arche cerclés d'anneaux */}
          <Bands x1={214} y1={610} x2={198} y2={780} count={4} width={70} />
          <Bands x1={742} y1={680} x2={748} y2={780} count={3} width={84} />
          </g>

          {/* Colonne effondrée, à droite */}
          <g filter="url(#wc-paint)">
            <path d="M1250 800 L1318 640 L1376 664 L1310 820Z" fill="#dcdad7" />
            <path d="M1318 640 L1376 664 L1388 640 L1330 616Z" fill="#c4c2bf" />
          </g>
          <Bands x1={1347} y1={652} x2={1280} y2={810} count={4} width={60} />

          {/* Éclats au sol */}
          <g filter="url(#wc-paint)">
            {shards.map((s, i) => (
              <path
                key={i}
                d={`M${s.x} ${s.y} l${s.s * 0.5} ${-s.s} l${s.s * 0.6} ${s.s * 0.8} z`}
                transform={`rotate(${s.r} ${s.x} ${s.y})`}
                fill={i % 3 ? "#d6d4d1" : "#8f8c88"}
              />
            ))}
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.7}>
        <Frame>
          {/* Brume basse */}
          <g className="animate-drift">
            <Cloud x={120} y={900} s={1.8} fill="#ffffff" opacity={0.9} />
            <Cloud x={1480} y={890} s={1.8} fill="#ffffff" opacity={0.9} />
          </g>
        </Frame>
      </Layer>
    </>
  );
}
