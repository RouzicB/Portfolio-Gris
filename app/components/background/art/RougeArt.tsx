import { Layer } from "../Parallax";
import { Frame, seeded } from "./shared";

/**
 * Profil — désert rouge, un seul ton décliné :
 * grandes montagnes triangulaires pâles, collines en bandes, rochers à facettes,
 * et un arbre au tronc courbe dont la ramure retombe en peigne.
 */
export default function RougeArt() {
  const rand = seeded(17);
  // Ramure en ombrelle : des branches arquées d'où retombent des fils, certains reliés en boucle
  const arcs = [
    { p0: [1250, 196], c: [1170, 112], p2: [1070, 176] },
    { p0: [1250, 196], c: [1340, 106], p2: [1440, 170] },
    { p0: [1250, 240], c: [1200, 190], p2: [1140, 214] },
    { p0: [1250, 240], c: [1310, 186], p2: [1370, 210] },
  ];
  const drops = arcs.flatMap((a, k) =>
    Array.from({ length: k < 2 ? 9 : 5 }, (_, i) => {
      const t = 0.2 + (i / (k < 2 ? 8 : 4)) * 0.8;
      const u = 1 - t;
      const x = u * u * a.p0[0] + 2 * u * t * a.c[0] + t * t * a.p2[0];
      const y = u * u * a.p0[1] + 2 * u * t * a.c[1] + t * t * a.p2[1];
      return { x, y, len: (k < 2 ? 40 : 26) + rand() * (k < 2 ? 90 : 50), loop: i % 3 === 1 };
    }),
  );
  const debris = Array.from({ length: 14 }, () => ({ x: rand() * 1600, y: 560 + rand() * 260, s: 3 + rand() * 6, r: rand() * 90 }));

  return (
    <>
      <Layer depth={0.05}>
        <Frame>
          {/* Grande montagne triangulaire, deux faces */}
          <g filter="url(#wc-paint)">
            <path d="M960 120 L1640 780 H300Z" fill="#f2ddd7" />
            <path d="M960 120 L1640 780 H1040Z" fill="#ead0c9" />
            <path d="M380 420 L720 780 H60Z" fill="#efd6cf" />
            <path d="M380 420 L720 780 H430Z" fill="#e6c6be" />
            <path d="M1460 400 L1720 780 H1220Z" fill="#ecd1ca" />
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.22}>
        <Frame>
          {/* Collines en bandes successives */}
          <g filter="url(#wc-paint)">
            <path d="M0 690 L160 672 L330 688 L520 664 L760 690 L980 668 L1200 686 L1400 662 L1600 684 V900 H0Z" fill="#e2b0a9" />
            <path d="M0 740 L220 724 L470 744 L700 722 L960 742 L1220 720 L1460 740 L1600 728 V900 H0Z" fill="#d18a84" />
          </g>
          {/* Poteaux lointains */}
          <g stroke="#b9545c" strokeWidth="2" fill="none" opacity="0.7">
            <path d="M1530 728 V560 M1518 590 H1542 M1520 610 H1540" />
            <path d="M1568 726 V600 M1558 626 H1578" />
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.6}>
        <Frame>
          {/* Arbre au tronc courbe */}
          <g fill="none" stroke="#7d1a2a" strokeLinecap="round">
            {/* Tronc courbe */}
            <path d="M1276 660 C1262 560 1236 470 1250 380 C1262 300 1238 250 1250 196" strokeWidth="9" />
            {/* Branches arquées en ombrelle */}
            {arcs.map((a, i) => (
              <path key={i} d={`M${a.p0.join(" ")} Q${a.c.join(" ")} ${a.p2.join(" ")}`} strokeWidth={i < 2 ? 5 : 3.5} />
            ))}
            {/* Fils qui retombent, certains refermés en boucle */}
            <g strokeWidth="2.6">
              {drops.map((d, i) =>
                d.loop ? (
                  <path key={i} d={`M${d.x} ${d.y} v${d.len} a6 6 0 0 0 12 0 v${-d.len * 0.55}`} />
                ) : (
                  <path key={i} d={`M${d.x} ${d.y} v${d.len}`} />
                ),
              )}
            </g>
          </g>

          {/* Rochers à facettes */}
          <g filter="url(#wc-paint)">
            <path d="M1000 900 L1100 704 L1262 642 L1430 690 L1560 900Z" fill="#b32b3a" />
            <path d="M1100 704 L1262 642 L1300 770 L1150 812Z" fill="#c94452" />
            <path d="M1300 770 L1430 690 L1560 900 H1340Z" fill="#8f1f2d" />
            <path d="M-30 900 L30 770 L170 736 L290 800 L330 900Z" fill="#a8283a" />
            <path d="M30 770 L170 736 L190 820 L60 850Z" fill="#c23c4c" />
            <path d="M560 900 L620 830 L720 812 L790 900Z" fill="#9b2434" />
            <path d="M620 830 L720 812 L700 870Z" fill="#b8384a" />
          </g>
          {/* Fragment de rocher en suspens */}
          <path d="M70 540 L118 520 L140 560 L96 590Z" fill="#c94452" filter="url(#wc-paint)" className="animate-float" />
          <g fill="#8f1f2d">
            {debris.map((d, i) => (
              <rect key={i} x={d.x} y={d.y} width={d.s} height={d.s} transform={`rotate(${d.r} ${d.x} ${d.y})`} />
            ))}
          </g>
        </Frame>
      </Layer>
    </>
  );
}
