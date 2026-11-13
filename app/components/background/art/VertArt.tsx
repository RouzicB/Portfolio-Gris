import { Layer } from "../Parallax";
import { Frame, archPath, moundPath, seeded } from "./shared";

/** Grande feuille pointue, nervure centrale comprise (origine = pied de la feuille) */
function Leaf({ x, y, len, width, angle, fill, vein }: { x: number; y: number; len: number; width: number; angle: number; fill: string; vein: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path d={`M0 0C${width} ${-len * 0.25} ${width * 0.8} ${-len * 0.75} 0 ${-len}C${-width * 0.8} ${-len * 0.75} ${-width} ${-len * 0.25} 0 0Z`} fill={fill} />
      <path d={`M0 0L0 ${-len * 0.92}`} stroke={vein} strokeWidth="2" />
    </g>
  );
}

/** Méthode — un jardin : grandes feuilles, lianes en losanges, une arche envahie, une pousse */
export default function VertArt() {
  const rand = seeded(11);
  const blades = Array.from({ length: 34 }, (_, i) => ({ x: 40 + i * 46 + rand() * 20, h: 20 + rand() * 40, lean: (rand() - 0.5) * 30 }));
  return (
    <>
      <Layer depth={0.12}>
        <Frame>
          <path d={moundPath(-100, 900, 760, 600, 60)} fill="#dbe9cf" filter="url(#wc-paint)" />
          <path d={moundPath(600, 1700, 770, 580, -40)} fill="#d2e4c4" filter="url(#wc-paint)" />
          {/* Arche lointaine envahie */}
          <path fillRule="evenodd" d={archPath(1040, 360, 230, 400, 130, 0.25)} fill="#c3d9b6" filter="url(#wc-paint)" />
          <path d="M1060 360 C1080 420 1050 470 1075 540 M1250 360 C1236 430 1262 490 1240 560" stroke="#86b08e" strokeWidth="3" fill="none" />
        </Frame>
      </Layer>

      <Layer depth={0.4}>
        <Frame>
          <g filter="url(#wc-paint)">
            <Leaf x={40} y={900} len={520} width={120} angle={18} fill="#5e9970" vein="#3f7a54" />
            <Leaf x={150} y={900} len={380} width={90} angle={48} fill="#7fb488" vein="#5e9970" />
            <Leaf x={-20} y={880} len={300} width={80} angle={-8} fill="#4a8660" vein="#2f6f49" />
            <Leaf x={1560} y={900} len={540} width={120} angle={-20} fill="#5e9970" vein="#3f7a54" />
            <Leaf x={1440} y={900} len={360} width={86} angle={-50} fill="#7fb488" vein="#5e9970" />
          </g>
          {/* Lianes à losanges */}
          <g fill="#4a8660">
            {[420, 1170].map((x, k) => (
              <g key={x}>
                <path d={`M${x} -10 C${x + 20} 80 ${x - 16} 160 ${x + 6} ${230 + k * 40}`} stroke="#3f7a54" strokeWidth="2.5" fill="none" />
                {[50, 110, 170].map((y, i) => (
                  <path key={y} d={`M${x + (i % 2 ? -4 : 6)} ${y} l9 12 -9 12 -9 -12z`} />
                ))}
              </g>
            ))}
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.8}>
        <Frame>
          <path d={moundPath(-80, 1680, 940, 770, 0)} fill="#2f5a3d" filter="url(#wc-paint)" />
          <path d={moundPath(-80, 1680, 940, 770, 0)} fill="url(#hatch)" />
          {/* Herbes */}
          <g stroke="#2f5a3d" strokeWidth="2.4" strokeLinecap="round" fill="none">
            {blades.map((b, i) => (
              <path key={i} d={`M${b.x} ${805 - (Math.abs(800 - b.x) / 800) * 20} q${b.lean / 2} ${-b.h / 2} ${b.lean} ${-b.h}`} />
            ))}
          </g>
          {/* La pousse */}
          <g transform="translate(800 782)" filter="url(#wc-paint)">
            <path d="M0 0 C-4 -30 4 -60 0 -96" stroke="#24452f" strokeWidth="4" fill="none" />
            <path d="M0 -70 C-14 -96 -46 -104 -64 -96 C-50 -78 -24 -68 0 -70Z" fill="#a9d4a6" />
            <path d="M0 -90 C14 -116 44 -124 62 -116 C48 -98 22 -88 0 -90Z" fill="#8fc28f" />
          </g>
        </Frame>
      </Layer>
    </>
  );
}
