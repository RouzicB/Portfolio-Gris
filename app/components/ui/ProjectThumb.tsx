import type { ProjectCard } from "../../types";
import { archPath, moundPath } from "./shapes";

/**
 * Vignette peinte à partir des deux teintes du projet, dans le vocabulaire des décors :
 * ciel en dégradé, astre cerclé, un motif (arche brisée, pyramides, colonnes en ruine ou arbre-ombrelle),
 * monticule hachuré et pierres en suspens.
 */
/** Centre horizontal de chaque motif, pour le recentrer dans une arche */
const MOTIF_CENTER = [85, 105, 93, 96];

export default function ProjectThumb({
  project,
  index,
  frame = "rect",
}: {
  project: ProjectCard;
  index: number;
  /** "arch" : composition centrée pour une fenêtre en arche (astre au sommet de la voûte, motif recentré) */
  frame?: "rect" | "arch";
}) {
  const arch = frame === "arch";
  const [a, b] = project.hues;
  // Projet réel : sa vignette (logo…) posée en entier sur sa teinte, ou à défaut son image de couverture.
  // Le logo tient dans une boîte fixe (object-contain) : qu'il soit large (Vibes) ou haut (Slift), son centre
  // tombe au même point. Dans l'arche, ce point est un peu sous le milieu, au centre visuel de la fenêtre.
  if (project.thumb) {
    return (
      <span className="absolute inset-0" style={{ background: a }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- fichiers statiques déjà optimisés (WebP) */}
        <img
          src={project.thumb}
          alt=""
          loading="lazy"
          decoding="async"
          className={`absolute object-contain ${arch ? "left-[22%] top-[30%] h-[52%] w-[56%]" : "left-[26%] top-[20%] h-[60%] w-[48%]"}`}
        />
      </span>
    );
  }
  if (project.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- fichiers statiques déjà optimisés (WebP)
      <img
        src={project.cover}
        alt=""
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover ${arch ? "object-[12%_50%]" : "object-left"}`}
      />
    );
  }
  const id = `thumb-${project.slug}`;
  const flip = !arch && index % 2 === 1;
  const motif = index % 4;
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
      <defs>
        {/* Bord d'aquarelle à peine irrégulier, et hachures pour l'ombre du monticule (propres à la vignette) */}
        <filter id={`${id}-paint`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="9" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id={`${id}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <path d="M0 3.5h7" stroke="#000" strokeOpacity="0.22" strokeWidth="1.1" />
        </pattern>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={b} />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#${id}-sky)`} />
      <g transform={flip ? "translate(320 0) scale(-1 1)" : undefined}>
        {arch ? (
          <>
            <circle cx="160" cy="60" r="22" fill="#ffffff" opacity="0.9" />
            <circle cx="160" cy="60" r="33" fill="none" stroke="#ffffff" strokeOpacity="0.5" />
            <circle cx="160" cy="60" r="44" fill="none" stroke="#ffffff" strokeOpacity="0.25" />
          </>
        ) : (
          <>
            <circle cx="228" cy="62" r="30" fill="#ffffff" opacity="0.9" />
            <circle cx="228" cy="62" r="44" fill="none" stroke="#ffffff" strokeOpacity="0.5" />
            <circle cx="228" cy="62" r="58" fill="none" stroke="#ffffff" strokeOpacity="0.25" />
          </>
        )}
        <g filter={`url(#${id}-paint)`}>
          <g transform={arch ? `translate(160 166) scale(0.78) translate(${-MOTIF_CENTER[motif]} -166)` : undefined}>
          {motif === 0 && <path fillRule="evenodd" d={archPath(40, 70, 90, 110, 46, 0.3)} fill={a} opacity="0.85" />}
          {motif === 1 && (
            <>
              <path d="M20 160 L78 74 L136 160Z" fill={a} opacity="0.55" />
              <path d="M78 74 L136 160 L96 160Z" fill={a} opacity="0.35" />
              <path d="M110 160 L150 102 L190 160Z" fill={a} opacity="0.8" />
            </>
          )}
          {motif === 2 && (
            <>
              <rect x="44" y="70" width="18" height="96" fill={a} opacity="0.85" />
              <rect x="38" y="62" width="30" height="8" fill={a} opacity="0.85" />
              <path d="M88 166V96l18-6v76Z" fill={a} opacity="0.6" />
              <rect x="128" y="120" width="16" height="46" fill={a} opacity="0.75" />
              <rect x="124" y="114" width="24" height="6" fill={a} opacity="0.75" transform="rotate(-8 136 117)" />
            </>
          )}
          {motif === 3 && (
            <>
              <path d="M96 166V92" stroke={a} strokeWidth="5" />
              {[-1, 1].map((s) => (
                <path key={s} d={`M96 92 Q${96 + s * 34} 54 ${96 + s * 70} 84`} fill="none" stroke={a} strokeWidth="4" />
              ))}
              {[-60, -40, -20, 20, 40, 60].map((dx) => (
                <path key={dx} d={`M${96 + dx} ${72 + Math.abs(dx) * 0.18}v${18 + (Math.abs(dx) % 3) * 6}`} stroke={a} strokeWidth="3" strokeLinecap="round" />
              ))}
            </>
          )}
          </g>
          {arch ? (
            <>
              <rect x="206" y="118" width="11" height="11" fill={a} transform="rotate(20 211 123)" />
              <rect x="104" y="104" width="7" height="7" fill={a} transform="rotate(-15 107 107)" />
            </>
          ) : (
            <>
              <rect x="250" y="120" width="12" height="12" fill={a} transform="rotate(20 256 126)" />
              <rect x="196" y="104" width="8" height="8" fill={a} transform="rotate(-15 200 108)" />
            </>
          )}
          <path d={moundPath(-30, 360, 215, 150, 40)} fill={a} />
        </g>
        <path d={moundPath(-30, 360, 215, 150, 40)} fill={`url(#${id}-hatch)`} />
      </g>
    </svg>
  );
}
