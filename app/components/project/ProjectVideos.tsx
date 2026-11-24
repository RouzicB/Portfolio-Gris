"use client";

import { m } from "framer-motion";
import type { ProjectVideo } from "../../types";
import { fadeUp } from "../journey/motion";

/**
 * Les démos vidéo d'une étude de cas : chacune dans un cadre de verre, avec son titre et ce qu'elle montre.
 * Rien n'est téléchargé avant le clic (preload="none") : l'affiche suffit à la page.
 */
export default function ProjectVideos({ videos }: { videos: ProjectVideo[] }) {
  return (
    <div>
      <ul className="grid gap-6 lg:grid-cols-2">
        {videos.map((v, i) => (
          <m.li
            key={v.src}
            variants={fadeUp}
            className={`veil panel p-1.5 sm:p-2 ${
              i % 2 ? "rounded-[0.6rem_1.5rem_0.6rem_1.5rem] sm:rounded-[0.75rem_2.5rem_0.75rem_2.5rem]" : "rounded-[1.5rem_0.6rem_1.5rem_0.6rem] sm:rounded-[2.5rem_0.75rem_2.5rem_0.75rem]"
            }`}
          >
            <figure>
              <div className="relative aspect-video overflow-hidden rounded-[1.125rem_0.3rem_1.125rem_0.3rem] bg-ink/10 sm:rounded-[2.1rem_0.5rem_2.1rem_0.5rem]">
                <video
                  className="absolute inset-0 size-full object-cover"
                  src={v.src}
                  poster={v.poster}
                  controls
                  muted
                  playsInline
                  preload="none"
                  aria-describedby={`video-${i}-texte`}
                />
                {/* Vidéos sans piste son : les légendes sont incrustées à l'image */}
              </div>
              <figcaption className="px-4 pb-3 pt-4 sm:px-5">
                <p className="flex items-baseline gap-3">
                  <span className="title-spaced text-base text-ink">{v.title}</span>
                  <span className="ml-auto text-sm tabular-nums text-ink-soft">{v.duration}</span>
                </p>
                <p id={`video-${i}-texte`} className="mt-1.5 text-pretty text-sm leading-relaxed text-ink">
                  {v.text}
                </p>
              </figcaption>
            </figure>
          </m.li>
        ))}
      </ul>
      <m.p variants={fadeUp} className="legible mt-5 text-center text-sm text-ink-soft">
        Application interne : la vraie interface, lancée en local avec des données fictives.
      </m.p>
    </div>
  );
}
