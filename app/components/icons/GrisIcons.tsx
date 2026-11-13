import type { ReactNode, SVGProps } from "react";
import type { IconName } from "../../types";

/**
 * Jeu d'icônes dessiné pour ce portfolio.
 * Trait fin et arrondi comme un pinceau, formes douces, et sur chaque icône de section
 * une goutte (ou un point) d'aquarelle qui prend la teinte du décor (var(--accent)).
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  size?: number;
  /** Texte alternatif ; sans titre, l'icône est décorative */
  title?: string;
}

export type Icon = (props: IconProps) => ReactNode;

const ACCENT = "var(--accent)";

function make(paths: ReactNode, accent?: ReactNode): Icon {
  function GrisIcon({ size = 24, title, strokeWidth = 1.4, ...rest }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={title ? "img" : undefined}
        aria-hidden={title ? undefined : true}
        focusable="false"
        {...rest}
      >
        {title && <title>{title}</title>}
        {paths}
        {accent && (
          <g fill={ACCENT} stroke="none">
            {accent}
          </g>
        )}
      </svg>
    );
  }
  return GrisIcon;
}

/** Goutte d'aquarelle (pointe vers le haut) centrée en (x, y) */
const drop = (x: number, y: number, s = 1) => (
  <path
    d={`M${x} ${y - 2.4 * s} C${x + 1.3 * s} ${y - 0.8 * s} ${x + 1.7 * s} ${y} ${x + 1.7 * s} ${y + 0.7 * s} a${1.7 * s} ${1.7 * s} 0 0 1 ${-3.4 * s} 0 C${x - 1.7 * s} ${y} ${x - 1.3 * s} ${y - 0.8 * s} ${x} ${y - 2.4 * s}Z`}
  />
);

/* ─── Sections ─────────────────────────────────────────────────────── */

/** Soleil qui se lève sur l'horizon */
export const AccueilIcon = make(
  <>
    <path d="M3 17.5h18" />
    <path d="M7 17.5a5 5 0 0 1 10 0" />
    <path d="M12 6.5v2M6.3 9.6l1.3 1.3M17.7 9.6l-1.3 1.3M5 20.5h4M14 20.5h5" />
  </>,
  <circle cx="12" cy="15.2" r="1.3" />,
);

/** Silhouette, avec une goutte près de l'épaule */
export const ProfilIcon = make(
  <>
    <circle cx="11" cy="8.5" r="3.3" />
    <path d="M4.5 19.5c1-3.6 3.6-5.2 6.5-5.2s5.5 1.6 6.5 5.2" />
  </>,
  drop(18.5, 7, 0.9),
);

/** Pousse : une tige, deux feuilles */
export const MethodeIcon = make(
  <>
    <path d="M12 20.5V10" />
    <path d="M12 14c-3 0-5.4-2-6-5.2 3 0 5.4 1.8 6 5.2Z" />
    <path d="M12 11c.5-3 2.8-5.2 6-5.4-.3 3.1-2.6 5.2-6 5.4Z" />
    <path d="M7.5 20.5h9" />
  </>,
  <circle cx="18.6" cy="4.4" r="1.1" />,
);

/** Étoile à quatre branches et sa petite sœur */
export const AptitudesIcon = make(
  <path d="M11 3c.6 4 2.5 6.3 6.5 7-4 .7-5.9 3-6.5 7-.6-4-2.5-6.3-6.5-7 4-.7 5.9-3 6.5-7Z" />,
  <path d="M18.5 15.2c.25 1.5.9 2.2 2.3 2.5-1.4.3-2.05 1-2.3 2.5-.25-1.5-.9-2.2-2.3-2.5 1.4-.3 2.05-1 2.3-2.5Z" />,
);

/** Chemin sinueux jusqu'à un drapeau */
export const ParcoursIcon = make(
  <>
    <path d="M5 20c4 0 3-5 7-5s3-5 7-5" strokeDasharray="1.6 2.2" />
    <path d="M19 10V3.5l-4.2 1.7L19 7" />
  </>,
  <circle cx="5" cy="20" r="1.5" />,
);

/** Cadre paysage */
export const ProjetsIcon = make(
  <>
    <rect x="3.5" y="5" width="17" height="14" rx="2.2" />
    <path d="m3.8 16.5 5-5 4 4 2.5-2.5 5 5" />
  </>,
  <circle cx="16" cy="9.2" r="1.5" />,
);

/** Oiseau de papier qui s'envole */
export const ContactIcon = make(
  <>
    <path d="M3 11.5 21 4l-6 16-3.4-6.6L3 11.5Z" />
    <path d="M11.6 13.4 21 4" />
  </>,
  <circle cx="5.2" cy="19" r="1.2" />,
);

/** Pinceau chargé de pigment */
export const CreditsIcon = make(
  <>
    <path d="m20 3.5-7.6 7.6" />
    <path d="m14.6 9-2.8-.4-1.6 1.6 3.6 3.6 1.6-1.6L15 9.4" />
  </>,
  <path d="M10.2 10.2c-2-.4-3.9.6-4.4 3-.4 2-1.3 3-3 3.5 2.8 1.3 6.4 1 7.7-1.6.7-1.4.3-3.3-.3-4.9Z" />,
);

/* ─── Fiche, aptitudes ─────────────────────────────────────────────── */

export const LieuIcon = make(
  <path d="M12 21c-4-4.4-6-7.6-6-10.5a6 6 0 0 1 12 0c0 2.9-2 6.1-6 10.5Z" />,
  <circle cx="12" cy="10.4" r="2" />,
);

export const LangueIcon = make(
  <>
    <path d="M4.5 4.5H14a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5H9L6 15v-2.5H4.5A1.5 1.5 0 0 1 3 11V6a1.5 1.5 0 0 1 1.5-1.5Z" />
    <path d="M18 9h1.5A1.5 1.5 0 0 1 21 10.5v5a1.5 1.5 0 0 1-1.5 1.5H19v2.5L16 17h-3.5a1.5 1.5 0 0 1-1.5-1.5V15" />
  </>,
  <>
    <circle cx="6.8" cy="8.5" r="0.85" />
    <circle cx="9.25" cy="8.5" r="0.85" />
    <circle cx="11.7" cy="8.5" r="0.85" />
  </>,
);

export const FormationIcon = make(
  <>
    <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z" />
    <path d="M6.5 11.5v4c3 2.2 8 2.2 11 0v-4M21.5 9.5v4.5" />
  </>,
  drop(21.5, 17, 0.8),
);

export const StatutIcon = make(
  <>
    <circle cx="12" cy="12" r="6.5" />
    <path d="M3.5 12a8.5 8.5 0 0 1 8.5-8.5" opacity="0.5" />
    <path d="M20.5 12a8.5 8.5 0 0 1-8.5 8.5" opacity="0.5" />
  </>,
  <circle cx="12" cy="12" r="3" />,
);

export const RechercheIcon = make(
  <>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15 15 5.5 5.5" />
  </>,
  <circle cx="8.6" cy="8.6" r="1.4" />,
);

/** Plume de dessin */
export const ConceptionIcon = make(
  <>
    <path d="M12 3.5 17 10l-5 10.5L7 10l5-6.5Z" />
    <path d="M12 3.5V10.6" />
  </>,
  <circle cx="12" cy="12.4" r="1.4" />,
);

export const InterfaceIcon = make(
  <>
    <rect x="3" y="4.5" width="18" height="15" rx="2.2" />
    <path d="M3 8.5h18M6.5 12h6M6.5 15h4" />
  </>,
  <circle cx="16.5" cy="14" r="1.8" />,
);

export const OutilsIcon = make(
  <>
    <path d="m5 19 1-4 10-10 3 3-10 10-4 1Z" />
    <path d="m14 7 3 3" />
  </>,
  <path d="m5 19 1-4 3 3-4 1Z" />,
);

/* ─── Interface ────────────────────────────────────────────────────── */

export const ChevronIcon = make(<path d="m9 5.5 6.5 6.5L9 18.5" />);
export const ArrowRightIcon = make(<path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />);
export const ArrowUpRightIcon = make(<path d="M7 17 17 7M9 7h8v8" />);
export const CloseIcon = make(<path d="m6 6 12 12M18 6 6 18" />);
export const CheckIcon = make(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const CopyIcon = make(
  <>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M5 15.5V6a1.5 1.5 0 0 1 1.5-1.5H15" />
  </>,
);
export const MailIcon = make(
  <>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </>,
);
export const DownloadIcon = make(<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" />);
export const ClockIcon = make(
  <>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 7.5V12l3 2" />
  </>,
);
export const ScrollIcon = make(
  <rect x="7" y="3" width="10" height="18" rx="5" />,
  <rect x="11.3" y="6.5" width="1.4" height="4" rx="0.7" className="animate-nudge" />,
);

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
  { name: "courrier", Icon: MailIcon },
  { name: "télécharger", Icon: DownloadIcon },
  { name: "copier", Icon: CopyIcon },
  { name: "durée", Icon: ClockIcon },
  { name: "lien", Icon: ArrowUpRightIcon },
  { name: "défiler", Icon: ScrollIcon },
];
