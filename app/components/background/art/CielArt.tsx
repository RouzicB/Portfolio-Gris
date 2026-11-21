import { Layer } from "../Parallax";
import { Cloud, Frame, Moving, archPath, phases, seeded } from "./shared";

/**
 * Projets — le ciel : au-dessus d'une mer de nuages, des ruines flottent.
 * Un temple à colonnade sur une île lointaine, un escalier suspendu qui y monte, une grande arche brisée,
 * un aqueduc rosé, un rocher à facettes portant un arbre-ombrelle, des oiseaux et des pierres en suspens.
 * Une seule gamme : cyan pâle et rose poudré. Le centre reste calme pour la galerie.
 */
export default function CielArt() {
  const rand = seeded(23);
  const motes = Array.from({ length: 16 }, () => ({
    x: rand() * 1600,
    y: 140 + rand() * 520,
    s: 5 + rand() * 9,
    r: rand() * 90,
    d: rand() * 6,
    pink: rand() > 0.5,
  }));
  const birds = [
    { x: 1300, y: 96, s: 1 },
    { x: 1336, y: 80, s: 0.8 },
    { x: 1368, y: 104, s: 0.7 },
    { x: 1420, y: 140, s: 0.6 },
  ];
  // Escalier suspendu : il sort de la mer de nuages et monte jusqu'au bord de l'île du temple
  const steps = Array.from({ length: 8 }, (_, i) => ({ x: 940 + i * 24, y: 760 - i * 20 }));

  return (
    <>
      {/* Ciel lointain : bandes de lumière, rai rosé, bancs de nuages */}
      <Layer depth={0.04}>
        <Frame>
          <g fill="#ffffff" opacity="0.14">
            {[110, 190, 260, 340].map((y, i) => (
              <rect key={y} x="-20" y={y} width="1640" height={22 - i * 4} />
            ))}
          </g>
          <path d="M1250 -40 L1600 -40 L700 940 L380 940Z" fill="#f3b9cf" opacity="0.24" />
          <path d="M1380 -40 L1480 -40 L640 940 L560 940Z" fill="#ffffff" opacity="0.16" />
        </Frame>
        <Moving className="animate-drift">
          <Cloud x={260} y={190} s={0.7} fill="#ffffff" opacity={0.5} />
          <Cloud x={880} y={260} s={0.55} fill="#fbeef3" opacity={0.45} />
          <Cloud x={1420} y={330} s={0.9} fill="#ffffff" opacity={0.55} />
        </Moving>
      </Layer>

      {/* Île lointaine et son temple à colonnade, aqueduc rosé à gauche */}
      <Layer depth={0.12}>
        <Frame>
          <g filter="url(#wc-paint)" transform="translate(-70 0)">
            {/* Île : dessus plat, dessous en pointe à facettes */}
            <path d="M1170 604 H1530 L1470 640 L1400 712 L1336 668 L1262 694 L1214 640Z" fill="#a9d2dc" />
            <path d="M1336 668 L1400 712 L1470 640 H1360Z" fill="#8fc0cd" />
            {/* Temple : soubassement, colonnes (une brisée), entablement, fronton */}
            <rect x="1186" y="590" width="328" height="16" fill="#cfe7ec" />
            {[0, 1, 2, 3, 4, 5].map((i) =>
              i === 4 ? (
                <path key={i} d={`M${1210 + i * 52} 590 V530 L${1226 + i * 52} 520 V590Z`} fill="#cfe7ec" />
              ) : (
                <rect key={i} x={1210 + i * 52} y="470" width="16" height="120" fill="#d8edf1" />
              ),
            )}
            <path d="M1196 470 H1430 L1424 456 H1196Z" fill="#d8edf1" />
            <path d="M1196 456 L1312 414 L1420 456Z" fill="#e4f2f5" />
            <path d="M1312 414 L1420 456 H1340Z" fill="#cfe7ec" />
            {/* Bloc tombé du fronton, en suspens */}
            <rect x="1460" y="436" width="34" height="14" fill="#d8edf1" transform="rotate(-14 1477 443)" />
          </g>
          {/* Aqueduc rosé, très lointain */}
          <g filter="url(#wc-paint)" fill="#ecc6d4" opacity="0.75">
            <rect x="-20" y="610" width="560" height="14" />
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} fillRule="evenodd" d={archPath(-20 + i * 112, 624, 112, 110, 70, 0.2)} />
            ))}
          </g>
        </Frame>
      </Layer>

      {/* Grande arche brisée, escalier suspendu, pierres */}
      <Layer depth={0.3}>
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

          {/* Escalier suspendu : chaque marche porte son éclat de roche */}
          <g filter="url(#wc-paint)">
            {steps.map((s, i) => (
              <g key={i}>
                <rect x={s.x} y={s.y} width="58" height="12" fill="#b6dce4" />
                <path d={`M${s.x + 4} ${s.y + 12} H${s.x + 54} L${s.x + 30} ${s.y + 30 + (i % 3) * 6}Z`} fill="#7fb2c4" />
              </g>
            ))}
          </g>

          <g fill="#8fc3cf" filter="url(#wc-paint)">
            <rect x="430" y="300" width="30" height="30" transform="rotate(18 445 315)" />
            <rect x="500" y="230" width="18" height="18" transform="rotate(-12 509 239)" />
            <rect x="1560" y="520" width="26" height="26" transform="rotate(32 1573 533)" />
          </g>
        </Frame>
      </Layer>

      {/* Rocher flottant et son arbre-ombrelle, oiseaux, éclats */}
      <Layer depth={0.55}>
        <Moving className="animate-float" duration={9}>
          <g>
            <g filter="url(#wc-paint)">
              <path d="M1500 770 H1660 L1630 800 L1590 860 L1540 812 L1516 820Z" fill="#7fb2c4" />
              <path d="M1590 860 L1630 800 L1660 770 H1590Z" fill="#5f9fb4" />
            </g>
            <g fill="none" stroke="#b23f6a" strokeLinecap="round" opacity="0.85">
              <path d="M1572 770 C1566 730 1580 700 1572 668" strokeWidth="4" />
              <path d="M1572 668 Q1540 640 1510 664 M1572 668 Q1606 638 1636 660" strokeWidth="3" />
              <path d="M1522 658 v22 M1534 650 v30 M1548 646 v18 M1596 646 v24 M1610 650 v30 M1624 656 v18" strokeWidth="2" />
            </g>
          </g>
        </Moving>
        <Moving className="animate-drift-slow">
          <g fill="none" stroke="#56607a" strokeWidth="2" strokeLinecap="round" opacity="0.7">
            {birds.map((b, i) => (
              <path key={i} d={`M${b.x - 10 * b.s} ${b.y} q${5 * b.s} ${-6 * b.s} ${10 * b.s} 0 q${5 * b.s} ${-6 * b.s} ${10 * b.s} 0`} />
            ))}
          </g>
        </Moving>
        {/* Éclats en suspens : trois groupes qui flottent à contretemps */}
        {phases(motes, 6).map((ph) => (
          <Moving key={ph.delay} className="animate-float" delay={ph.delay}>
            {ph.items.map((m, i) => (
              <rect
                key={i}
                x={m.x}
                y={m.y}
                width={m.s}
                height={m.s}
                fill={m.pink ? "#e8a6bf" : "#8fc3cf"}
                opacity="0.7"
                transform={`rotate(${m.r} ${m.x + m.s / 2} ${m.y + m.s / 2})`}
              />
            ))}
          </Moving>
        ))}
      </Layer>

      {/* Mer de nuages, deux rangs */}
      <Layer depth={0.8}>
        <Moving className="animate-drift">
          <Cloud x={360} y={810} s={1.6} fill="#f6e4ec" opacity={0.85} />
          <Cloud x={980} y={800} s={1.7} fill="#eef7f9" opacity={0.85} />
          <Cloud x={1500} y={800} s={1.5} fill="#f6e4ec" opacity={0.85} />
        </Moving>
        <Moving className="animate-drift-slow">
          <Cloud x={120} y={870} s={2.1} fill="#ffffff" opacity={0.97} />
          <Cloud x={640} y={905} s={2.4} fill="#fbeef3" opacity={0.95} />
          <Cloud x={1150} y={870} s={2.2} fill="#ffffff" opacity={0.97} />
          <Cloud x={1580} y={895} s={1.9} fill="#fbeef3" opacity={0.95} />
        </Moving>
      </Layer>
    </>
  );
}
