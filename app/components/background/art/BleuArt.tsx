import { Layer } from "../Parallax";
import { Frame, seeded } from "./shared";

/**
 * Aptitudes — grotte bleue, un seul ton décliné :
 * rais de lumière, arbre lumineux dont les branches montent à la verticale et portent des cadres translucides,
 * socle en gradins, eau qui reflète, parois sombres et stalactites.
 */
export default function BleuArt() {
  const rand = seeded(23);
  const motes = Array.from({ length: 16 }, () => ({
    left: 20 + rand() * 60,
    size: 2 + rand() * 4,
    delay: rand() * 14,
    duration: 12 + rand() * 10,
  }));
  // Branches : chacune part du tronc, s'écarte puis monte tout droit
  const branches = [
    { y0: 440, x: 670, w: 7 },
    { y0: 410, x: 712, w: 9 },
    { y0: 380, x: 758, w: 12 },
    { y0: 380, x: 842, w: 12 },
    { y0: 410, x: 890, w: 9 },
    { y0: 450, x: 942, w: 7 },
    { y0: 490, x: 1000, w: 6 },
    { y0: 540, x: 1058, w: 5 },
  ];
  // Plafond de la grotte, en stalactites
  let ceiling = "M-20 -20 H1620 V30";
  for (let x = 1600; x >= -20; x -= 40) {
    const drop = 30 + rand() * (x < 300 || x > 1300 ? 90 : 26);
    ceiling += ` L${x + 20} ${drop} L${x} 30`;
  }
  ceiling += " Z";

  return (
    <>
      <Layer depth={0.04}>
        <Frame>
          {/* Rais de lumière obliques */}
          <g fill="#bfe9f6">
            <path d="M1100 -20 H1260 L700 920 H520Z" opacity="0.1" />
            <path d="M1320 -20 H1380 L980 920 H900Z" opacity="0.08" />
            <path d="M880 -20 H930 L320 920 H250Z" opacity="0.07" />
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.25}>
        <Frame>
          {/* L'arbre est décalé vers la droite pour laisser le titre lisible */}
          <g transform="translate(250 0)">
          {/* Lueur derrière l'arbre */}
          <ellipse cx="800" cy="520" rx="260" ry="380" fill="#7fd3ea" opacity="0.18" filter="url(#wc-cloud)" />
          {/* Cadres translucides, traversés par les branches (centrés sur elles) */}
          <g filter="url(#wc-paint)">
            <rect x="690" y="60" width="220" height="180" fill="#7fd3ea" opacity="0.14" />
            <rect x="925" y="180" width="150" height="130" fill="#7fd3ea" opacity="0.14" />
          </g>
          <g fill="none" stroke="#bfe9f6" strokeOpacity="0.45" strokeWidth="2">
            <rect x="690" y="60" width="220" height="180" />
            <rect x="925" y="180" width="150" height="130" />
          </g>
          {/* Tronc et branches lumineuses */}
          <g fill="none" stroke="#cdeef8" strokeLinecap="round" opacity="0.72">
            <path d="M770 790 C776 640 790 520 800 380 C810 520 824 640 830 790" fill="#cdeef8" strokeWidth="2" />
            {branches.map((b) => (
              <path key={b.x} d={`M800 ${b.y0} C800 ${b.y0 - 50} ${b.x} ${b.y0 - 70} ${b.x} ${b.y0 - 150} V-20`} strokeWidth={b.w} />
            ))}
            {/* Petit candélabre greffé sur la branche qui traverse le second cadre */}
            <path d="M980 286 v-40 M1020 286 v-40 M980 286 q20 18 40 0" strokeWidth="3" />
          </g>
          {/* Socle en gradins */}
          <g filter="url(#wc-paint)">
            <rect x="720" y="772" width="160" height="22" fill="#5fa9c6" />
            <rect x="680" y="794" width="240" height="20" fill="#4f93b3" />
            <rect x="640" y="814" width="320" height="22" fill="#3d7f9f" />
          </g>
          </g>
          {/* Eau et reflet — sur le même plan que l'arbre : le socle reste posé dessus */}
          <rect x="-40" y="832" width="1680" height="100" fill="#1f6688" opacity="0.9" />
          <ellipse cx="1050" cy="862" rx="190" ry="24" fill="#bfe9f6" opacity="0.22" filter="url(#wc-cloud)" />
          <rect x="1030" y="838" width="40" height="70" fill="#cdeef8" opacity="0.18" filter="url(#wc-cloud)" />
          <g stroke="#bfe9f6" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round">
            <path d="M900 852 H990 M1110 852 H1200 M940 874 H1010 M1090 874 H1160 M1000 894 H1100" />
          </g>
        </Frame>
      </Layer>

      <Layer depth={0.55}>
        <Frame>
          {/* Parois de la grotte */}
          <g fill="#06121d" filter="url(#wc-edge)">
            <path d={ceiling} />
            <path d="M-20 -20 H230 C200 70 260 140 220 220 C190 280 240 340 190 420 C160 470 130 520 150 600 C170 660 120 700 140 760 L260 790 C300 820 300 870 280 920 H-20Z" />
            <path d="M1620 -20 H1380 C1410 90 1350 170 1400 250 C1440 320 1390 400 1430 470 C1460 540 1420 600 1450 660 L1330 700 C1300 760 1310 840 1340 920 H1620Z" />
          </g>
        </Frame>
      </Layer>

      {/* Particules de lumière qui montent */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {motes.map((m, i) => (
          <span
            key={i}
            className="animate-rise absolute bottom-[-10px] rounded-full bg-[#cdeef8]/70"
            style={{
              left: `${m.left}%`,
              width: m.size,
              height: m.size,
              animationDelay: `${m.delay}s`,
              animationDuration: `${m.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
