import type { ReactNode, SVGProps } from "react";
import type { IconName } from "../../types";

/**
 * Jeu d'icônes dessiné pour ce portfolio, dans le vocabulaire graphique de GRIS :
 * - un trait de pinceau effilé : chaque trait est peint en trois passes (fine sur toute la longueur,
 *   moyenne puis épaisse au centre), il s'affine donc aux extrémités comme un coup de pinceau ;
 * - des cercles ouverts, en ensō, comme les anneaux de l'emblème ;
 * - des formes géométriques (triangles, facettes, angles nets) plutôt que des arrondis génériques ;
 * - un lavis d'aquarelle en facettes et un point de pigment qui prennent la teinte du décor (var(--accent)).
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  size?: number;
  /** Texte alternatif ; sans titre, l'icône est décorative */
  title?: string;
}

export type Icon = (props: IconProps) => ReactNode;

const ACCENT = "var(--accent)";

interface Drawing {
  /** Traits de pinceau : un sous-chemin par trait (le pinceau se lève entre deux traits) */
  strokes: string[];
  /** Traits secondaires, plus clairs (reflets, échos) */
  faint?: string[];
  /** Lavis d'aquarelle translucide, en facettes */
  wash?: string[];
  /** Pigment plein (point, goutte, facette) */
  pigment?: ReactNode;
}

/**
 * Passes du pinceau : [épaisseur relative, début du trait en %]. Chaque passe couvre de `start` à 100 − `start`,
 * l'empilement donne un trait qui gonfle progressivement vers le centre et s'affine aux deux bouts.
 */
const PASSES: [number, number][] = [
  [0.36, 0],
  [0.55, 4],
  [0.72, 11],
  [0.87, 20],
  [1, 31],
];

/** Un coup de pinceau : fin aux deux bouts, plein au centre */
function Brush({ d, w }: { d: string; w: number }) {
  return (
    <>
      {PASSES.map(([k, start]) =>
        start === 0 ? (
          <path key={k} d={d} strokeWidth={w * k} />
        ) : (
          <path
            key={k}
            d={d}
            pathLength={100}
            strokeWidth={w * k}
            strokeDasharray={`${100 - 2 * start} 200`}
            strokeDashoffset={-start}
          />
        ),
      )}
    </>
  );
}

function make({ strokes, faint, wash, pigment }: Drawing): Icon {
  function GrisIcon({ size = 24, title, strokeWidth = 1.7, ...rest }: IconProps) {
    const w = Number(strokeWidth);
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="miter"
        strokeMiterlimit={6}
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        focusable="false"
        {...rest}
      >
        {title && <title>{title}</title>}
        {(wash || pigment) && (
          <g fill={ACCENT} stroke="none">
            {wash?.map((d) => <path key={d} d={d} opacity={0.32} />)}
            {pigment}
          </g>
        )}
        {faint && (
          <g opacity={0.5}>
            {faint.map((d) => <Brush key={d} d={d} w={w * 0.85} />)}
          </g>
        )}
        {strokes.map((d) => (
          <Brush key={d} d={d} w={w} />
        ))}
      </svg>
    );
  }
  return GrisIcon;
}

/* ─── Formes de base ───────────────────────────────────────────────── */

const pt = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${+(cx + r * Math.cos(a)).toFixed(2)} ${+(cy + r * Math.sin(a)).toFixed(2)}`;
};

/** Cercle ouvert à la manière d'un ensō : le pinceau ne referme pas tout à fait le tour */
const ring = (cx: number, cy: number, r: number, from = -110, sweep = 325) =>
  `M${pt(cx, cy, r, from)}A${r} ${r} 0 1 1 ${pt(cx, cy, r, from + sweep)}`;

/** Facette en losange (pigment) */
const diamond = (cx: number, cy: number, s = 1.2) => (
  <path d={`M${cx} ${cy - s}L${cx + s * 0.78} ${cy}L${cx} ${cy + s}L${cx - s * 0.78} ${cy}Z`} />
);

/* ─── Sections ─────────────────────────────────────────────────────── */

/** Soleil qui se lève sur l'horizon */
export const AccueilIcon = make({
  strokes: ["M2.5 17.5H21.5", "M6.5 17.5A5.5 5.5 0 0 1 17.5 17.5", "M12 4V6.8", "M5.2 7.7 7.1 9.6", "M18.8 7.7 16.9 9.6"],
  faint: ["M5 20.5H10", "M13.5 20.5H19"],
  wash: ["M8 17.5 12 12.6 16 17.5Z"],
  pigment: diamond(12, 15.4, 1.1),
});

/** Silhouette, et un éclat de pierre qui flotte près de l'épaule */
export const ProfilIcon = make({
  strokes: [ring(11, 8.3, 3.4), "M4.2 20.2C5.3 16.5 7.9 14.6 11 14.6S16.7 16.5 17.8 20.2"],
  wash: ["M15.6 3.4 20.8 6.4 16.6 9.6Z"],
  pigment: diamond(19.4, 12, 0.9),
});

/** Pousse : une tige, une feuille souple, une feuille en triangle */
export const MethodeIcon = make({
  strokes: ["M12 21V10", "M12 15C9.1 15 6.6 13 5.8 9.6 8.9 9.6 11.3 11.6 12 15", "M12 11.2 18.6 5 17.2 10.4Z"],
  faint: ["M7 21H17"],
  wash: ["M12 11.2 18.6 5 17.2 10.4Z"],
  pigment: diamond(19.8, 2.9, 0.8),
});

/** Étoile à quatre branches et sa petite sœur */
export const AptitudesIcon = make({
  strokes: ["M11 2.8C11.6 6.9 13.5 9.2 17.6 9.9 13.5 10.6 11.6 12.9 11 17 10.4 12.9 8.5 10.6 4.4 9.9 8.5 9.2 10.4 6.9 11 2.8Z"],
  wash: ["M11 2.8C11.6 6.9 13.5 9.2 17.6 9.9 13.5 10.6 11.6 12.9 11 17 10.4 12.9 8.5 10.6 4.4 9.9 8.5 9.2 10.4 6.9 11 2.8Z"],
  pigment: (
    <path d="M18.5 15.2C18.75 16.7 19.4 17.4 20.8 17.7 19.4 18 18.75 18.7 18.5 20.2 18.25 18.7 17.6 18 16.2 17.7 17.6 17.4 18.25 16.7 18.5 15.2Z" />
  ),
});

/** Chemin sinueux jusqu'à un fanion */
export const ParcoursIcon = make({
  strokes: ["M3.5 20.5C8 20.5 7 15 11.5 15S15.5 10 19 10", "M19 10V3.2", "M19 3.4 14.4 5.2 19 7"],
  wash: ["M19 3.4 14.4 5.2 19 7Z"],
  pigment: diamond(3.6, 20.4, 1.2),
});

/** Cadre : des montagnes en triangle sous un soleil */
export const ProjetsIcon = make({
  strokes: ["M3.8 5.2H20.2V18.8H3.8Z", "M4 16.8 8.8 11.4 12.3 15.2 14.8 12.6 20 17.6"],
  wash: ["M8.8 11.4 4.2 16.6V18.6H13.4Z"],
  pigment: <circle cx="16" cy="8.6" r="1.4" />,
});

/** Oiseau de papier qui s'envole */
export const ContactIcon = make({
  strokes: ["M3 11.4 21 4 15.1 20 11.6 13.4Z", "M11.6 13.4 21 4"],
  wash: ["M11.6 13.4 21 4 15.1 20Z"],
  pigment: diamond(5, 19.2, 1),
});

/** Pinceau chargé de pigment */
export const CreditsIcon = make({
  strokes: ["M20.5 3.5 12.6 11.4", "M14.8 9.2 12 8.8 10.3 10.4 13.6 13.7 15.2 12 14.8 9.2"],
  pigment: <path d="M10.2 10.2C8.2 9.8 6.3 10.8 5.8 13.2 5.4 15.2 4.5 16.2 2.8 16.7 5.6 18 9.2 17.7 10.5 15.1 11.2 13.7 10.8 11.8 10.2 10.2Z" />,
});

/* ─── Fiche, aptitudes ─────────────────────────────────────────────── */

export const LieuIcon = make({
  strokes: ["M12 21C8 16.6 6 13.4 6 10.5A6 6 0 0 1 18 10.5C18 13.4 16 16.6 12 21Z"],
  wash: ["M12 4.5A6 6 0 0 1 18 10.5C18 13.4 16 16.6 12 21Z"],
  pigment: diamond(12, 10.4, 1.6),
});

export const LangueIcon = make({
  strokes: ["M3 4.5H15.5V12.5H9L6 15.5V12.5H3Z", "M18 9H21V17H19V19.8L16 17H11V15"],
  wash: ["M18 9H21V17H19V19.8L16 17H11V15Z"],
  pigment: (
    <>
      <circle cx="6.6" cy="8.5" r="0.85" />
      <circle cx="9.25" cy="8.5" r="0.85" />
      <circle cx="11.9" cy="8.5" r="0.85" />
    </>
  ),
});

export const FormationIcon = make({
  strokes: ["M2.5 9.5 12 5 21.5 9.5 12 14Z", "M6.5 11.5V15.5C9.5 17.7 14.5 17.7 17.5 15.5V11.5", "M21.5 9.5V14"],
  wash: ["M12 5 21.5 9.5 12 14Z"],
  pigment: diamond(21.5, 16.3, 1.3),
});

export const StatutIcon = make({
  strokes: [ring(12, 12, 6.5)],
  faint: ["M3.5 12A8.5 8.5 0 0 1 12 3.5", "M20.5 12A8.5 8.5 0 0 1 12 20.5"],
  pigment: <circle cx="12" cy="12" r="3" />,
});

export const RechercheIcon = make({
  strokes: [ring(10.5, 10.5, 6, -40), "M15 15 20.5 20.5"],
  wash: ["M10.5 4.5A6 6 0 0 0 4.5 10.5H10.5Z"],
  pigment: diamond(8.4, 8.4, 1.2),
});

/** Plume de dessin */
export const ConceptionIcon = make({
  strokes: ["M12 3.5 17 10 12 20.5 7 10Z", "M12 3.5V10.6"],
  wash: ["M12 3.5 17 10 12 20.5Z"],
  pigment: <circle cx="12" cy="12.4" r="1.3" />,
});

export const InterfaceIcon = make({
  strokes: ["M3 4.5H21V19.5H3Z", "M3 8.5H21", "M6.5 12H12.5", "M6.5 15H10.5"],
  wash: ["M15 17.5 19.5 11.2V17.5Z"],
  pigment: (
    <>
      <circle cx="5.3" cy="6.5" r="0.6" />
      <circle cx="7.1" cy="6.5" r="0.6" />
      <circle cx="8.9" cy="6.5" r="0.6" />
    </>
  ),
});

export const OutilsIcon = make({
  strokes: ["M5 19 6 15 16 5 19 8 9 18Z", "M14 7 17 10"],
  wash: ["M16 5 19 8 9 18 6 15Z"],
  pigment: <path d="M5 19 6 15 9 18Z" />,
});

/* ─── Parcours ─────────────────────────────────────────────────────── */

/** Sacoche : expérience professionnelle */
export const TravailIcon = make({
  strokes: ["M3.5 7.5H20.5V19.5H3.5Z", "M9 7.5V4.5H15V7.5", "M3.5 12.5H20.5"],
  wash: ["M3.5 12.5H20.5V19.5Z"],
  pigment: diamond(12, 12.5, 1.5),
});

/** Chemin qui se sépare en deux : un choix */
export const ChoixIcon = make({
  strokes: ["M12 21V14", "M12 14 6.5 8.5V3.8", "M12 14 17.5 8.5V3.8", "M4.5 5.8 6.5 3.8 8.5 5.8", "M15.5 5.8 17.5 3.8 19.5 5.8"],
  wash: ["M12 14 6.5 8.5H17.5Z"],
  pigment: diamond(12, 14, 1.6),
});

/** Cadenas : chemin non emprunté */
export const VerrouIcon = make({
  strokes: ["M5 10.5H19V20.5H5Z", "M8 10.5V8A4 4 0 0 1 16 8V10.5"],
  wash: ["M5 10.5H19L5 20.5Z"],
  pigment: diamond(12, 15.5, 1.5),
});

/* ─── Interface ────────────────────────────────────────────────────── */

export const ChevronIcon = make({ strokes: ["M9 5.5 15.5 12 9 18.5"] });
export const ArrowRightIcon = make({ strokes: ["M4 12H19", "M13.5 6.5 19 12 13.5 17.5"] });
export const ArrowUpRightIcon = make({ strokes: ["M7 17 17 7", "M9 7H17V15"] });
export const CloseIcon = make({ strokes: ["M6 6 18 18", "M18 6 6 18"] });
export const CheckIcon = make({ strokes: ["M5 12.5 9.5 17 19 7.5"] });
export const CopyIcon = make({ strokes: ["M8.5 8.5H19.5V19.5H8.5Z", "M5 15.5V4.5H15.5"] });
export const MailIcon = make({ strokes: ["M3 5.5H21V18.5H3Z", "M3.5 7 12 13 20.5 7"] });
export const DownloadIcon = make({ strokes: ["M12 4V15", "M7.5 10.5 12 15 16.5 10.5", "M5 19.5H19"] });
export const ClockIcon = make({ strokes: [ring(12, 12, 8), "M12 7.5V12L15 14"] });

/** Molette : la goutte descend doucement */
export const ScrollIcon = make({
  strokes: ["M7 8A5 5 0 0 1 17 8V16A5 5 0 0 1 7 16Z"],
  pigment: <rect x="11.3" y="6.5" width="1.4" height="4" rx="0.7" className="animate-nudge" />,
});

/** Icônes nommées (utilisées depuis les données) */
export const icons: Record<IconName, Icon> = {
  accueil: AccueilIcon,
  profil: ProfilIcon,
  methode: MethodeIcon,
  aptitudes: AptitudesIcon,
  parcours: ParcoursIcon,
  projets: ProjetsIcon,
  contact: ContactIcon,
  credits: CreditsIcon,
  lieu: LieuIcon,
  langue: LangueIcon,
  formation: FormationIcon,
  statut: StatutIcon,
  recherche: RechercheIcon,
  conception: ConceptionIcon,
  interface: InterfaceIcon,
  outils: OutilsIcon,
};

/** Galerie affichée dans les crédits */
export const iconGallery: { name: string; Icon: Icon }[] = [
  ...Object.entries(icons).map(([name, Icon]) => ({ name, Icon })),
  { name: "travail", Icon: TravailIcon },
  { name: "choix", Icon: ChoixIcon },
  { name: "verrou", Icon: VerrouIcon },
  { name: "courrier", Icon: MailIcon },
  { name: "télécharger", Icon: DownloadIcon },
  { name: "copier", Icon: CopyIcon },
  { name: "durée", Icon: ClockIcon },
  { name: "lien", Icon: ArrowUpRightIcon },
  { name: "défiler", Icon: ScrollIcon },
];
