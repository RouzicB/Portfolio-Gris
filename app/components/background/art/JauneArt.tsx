import { Layer } from "../Parallax";
import { Cloud, Frame, Moving, phases, seeded } from "./shared";

/** Tour à dôme : socle à colonnes, fenêtre en arche avec lanterne, dôme, flèche, lianes et fleurs */
function Tower({
  x,
  w,
  h,
  base,
  tone,
  light,
  seed,
  detail = true,
}: {
  x: number;
  w: number;
  h: number;
  base: number;
  tone: string;
  light: string;
  seed: number;
  /** false = simple silhouette (tours lointaines) */
  detail?: boolean;
}) {
  const rand = seeded(seed);
  const top = base - h;
  const cols = 5;
  const dw = w * 0.82;
  // Lianes symétriques de part et d'autre de la fenêtre (longueurs différentes, positions régulières)
  const vines = Array.from({ length: 6 }, (_, i) => ({ x: x + 10 + (i * (w - 20)) / 5, len: 50 + rand() * 80 }));
  return (
    <g>
      <g filter="url(#wc-paint)">
        <rect x={x} y={top} width={w} height={h} fill={tone} />
        <rect x={x - 8} y={top - 10} width={w + 16} height="12" fill={light} />
        {/* Dôme et flèche */}
        <path d={`M${x + (w - dw) / 2} ${top - 10} a${dw / 2} ${dw * 0.55} 0 0 1 ${dw} 0Z`} fill={light} />
        <path d={`M${x + w / 2} ${top - 10 - dw * 0.55} v-34`} stroke={light} strokeWidth="2.5" />
        <path d={`M${x + w / 2} ${top - 54 - dw * 0.55} c6 8 8 12 8 15 a8 8 0 0 1 -16 0 c0 -3 2 -7 8 -15z`} fill={light} />
      </g>
      {detail && (
        <>
          {/* Colonnes, du chapiteau jusqu'au sol */}
          <g stroke={light} strokeOpacity="0.5" strokeWidth="2">
            {Array.from({ length: cols }, (_, i) => (
              <path key={i} d={`M${x + ((i + 0.5) * w) / cols} ${top + 150} V${base}`} />
            ))}
          </g>
          {/* Fenêtre en arche, centrée, et sa lanterne */}
          <path d={`M${x + w / 2 - 18} ${top + 120} v-40 a18 18 0 0 1 36 0 v40z`} fill="#1c160a" />
          <circle cx={x + w / 2} cy={top + 102} r="4" fill="#fff1c2" />
          {/* Lianes qui tombent du chapiteau, et grappes de fleurs à leur départ */}
          <g stroke="#e3c26f" strokeWidth="1.6" fill="none" opacity="0.75">
            {vines.map((v, i) => (
              <path key={i} d={`M${v.x} ${top + 2} q4 ${v.len / 3} -2 ${(v.len * 2) / 3} q-4 ${v.len / 6} 2 ${v.len / 3}`} />
            ))}
          </g>
          <g fill="#f2d27a">
            {[vines[0], vines[2], vines[3], vines[5]].map((v, i) => (
              <g key={i}>
                <circle cx={v.x} cy={top + 6} r="7" />
                <circle cx={v.x + 6} cy={top + 13} r="5" />
                <circle cx={v.x - 5} cy={top + 14} r="4" />
              </g>
            ))}
          </g>
        </>
      )}
    </g>
  );
}

/** Centre des lanternes des deux grandes tours (x + w / 2, base - h + 102) */
const LANTERNS = [
  [145, 612],
  [1455, 592],
] as const;

/**
 * Parcours — nuit dorée, un seul ton décliné :
 * grande lune (le soleil du décor), nuages sombres, tours à dômes couvertes de lianes,
 * terrasse en gradins couronnée de petites coupoles.
 */
export default function JauneArt() {
  const rand = seeded(5);
  const stars = Array.from({ length: 80 }, () => ({ x: rand() * 1600, y: rand() * 560, r: 0.6 + rand() * 1.4, d: rand() * 4 }));
  return (
    <>
      <Layer depth={0.05}>
        {phases(stars, 3.6, 4).map((ph) => (
          <Moving key={ph.delay} className="animate-twinkle" delay={ph.delay}>
            <g fill="#fff1c2">
              {ph.items.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={s.r} />
              ))}
            </g>
          </Moving>
        ))}
        <Frame>
          <Cloud x={260} y={640} s={1.8} fill="#3a2d12" opacity={0.85} />
          <Cloud x={1360} y={620} s={1.9} fill="#3a2d12" opacity={0.85} />
          <Cloud x={820} y={700} s={2.2} fill="#33270f" opacity={0.8} />
        </Frame>
      </Layer>

      {/* Tours, terrasse et sol sur le même plan : tout reste posé, rien ne glisse */}
      <Layer depth={0.35}>
        <Frame>
          {/* Sol */}
          <path d="M-20 846 H1620 V920 H-20Z" fill="#241b09" />
          <path d="M-20 846 H1620 V920 H-20Z" fill="url(#hatch-light)" opacity="0.25" />
          {/* Tours lointaines : simples silhouettes */}
          <Tower x={300} w={74} h={200} base={850} tone="#5e471c" light="#765921" seed={2} detail={false} />
          <Tower x={1226} w={74} h={210} base={850} tone="#5e471c" light="#765921" seed={4} detail={false} />
          {/* Tours principales */}
          <Tower x={70} w={150} h={340} base={850} tone="#a9843a" light="#d9b45a" seed={1} />
          <Tower x={1380} w={150} h={360} base={850} tone="#a9843a" light="#d9b45a" seed={3} />
          {/* Terrasse en gradins */}
          <g filter="url(#wc-paint)">
            <path d="M420 920 L470 850 H1130 L1180 920Z" fill="#8a6a26" />
            <path d="M510 850 L548 812 H1052 L1090 850Z" fill="#a9843a" />
          </g>
          <g fill="#c9a24a">
            {Array.from({ length: 7 }, (_, i) => 568 + i * 78).map((x) => (
              <g key={x}>
                <path d={`M${x - 16} 812 a16 18 0 0 1 32 0Z`} />
                <path d={`M${x} 794 v-14`} stroke="#c9a24a" strokeWidth="2" />
              </g>
            ))}
          </g>
        </Frame>
        {/* Halo des lanternes, aux fenêtres des deux grandes tours (calque à part : il scintille sans redessiner les tours) */}
        <Moving className="animate-twinkle">
          {LANTERNS.map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r="14" fill="#fff1c2" opacity="0.5" filter="url(#wc-glow)" />
          ))}
        </Moving>
      </Layer>
    </>
  );
}
