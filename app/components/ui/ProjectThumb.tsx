import type { Project } from "../../types";
import { archPath, moundPath } from "../background/art/shared";

/** Vignette peinte à partir des deux teintes du projet : ciel, soleil, arche, monticule hachuré, pierres en suspens */
export default function ProjectThumb({ project, index }: { project: Project; index: number }) {
  const [a, b] = project.hues;
  const id = `thumb-${project.slug}`;
  const flip = index % 2 === 1;
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
        <g filter="url(#wc-paint)">
          <path fillRule="evenodd" d={archPath(40, 70, 90, 110, 46, 0.3)} fill={a} opacity="0.85" />
          <rect x="250" y="120" width="12" height="12" fill={a} transform="rotate(20 256 126)" />
          <rect x="196" y="104" width="8" height="8" fill={a} transform="rotate(-15 200 108)" />
          <path d={moundPath(-30, 360, 215, 150, 40)} fill={a} />
        </g>
        <path d={moundPath(-30, 360, 215, 150, 40)} fill="url(#hatch)" />
      </g>
    </svg>
  );
}
