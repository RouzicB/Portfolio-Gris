import type { Project } from "../../types";
import { archPath, moundPath } from "../background/art/shared";


/**
 * Vignette peinte à partir des deux teintes du projet, dans le vocabulaire des décors :
 * ciel en dégradé, astre cerclé, un motif (arche brisée, pyramides, colonnes en ruine ou arbre-ombrelle),
 * monticule hachuré et pierres en suspens.
 */
export default function ProjectThumb({ project, index }: { project: Project; index: number }) {
  const [a, b] = project.hues;
  const id = `thumb-${project.slug}`;
  const flip = index % 2 === 1;
  const motif = index % 4;
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={b} />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#${id}-sky)`} />
      <g transform={flip ? "translate(320 0) scale(-1 1)" : undefined}>
        <circle cx="228" cy="62" r="30" fill="#ffffff" opacity="0.9" />
        <circle cx="228" cy="62" r="44" fill="none" stroke="#ffffff" strokeOpacity="0.5" />
        <circle cx="228" cy="62" r="58" fill="none" stroke="#ffffff" strokeOpacity="0.25" />
        <g filter="url(#wc-paint)">
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
          <rect x="250" y="120" width="12" height="12" fill={a} transform="rotate(20 256 126)" />
          <rect x="196" y="104" width="8" height="8" fill={a} transform="rotate(-15 200 108)" />
          <path d={moundPath(-30, 360, 215, 150, 40)} fill={a} />
        </g>
        <path d={moundPath(-30, 360, 215, 150, 40)} fill="url(#hatch)" />
      </g>
    </svg>
  );
}
