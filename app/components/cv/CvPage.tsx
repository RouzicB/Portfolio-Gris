"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { careerNodes } from "../../data/career";
import { site, specs } from "../../data/site";
import { cvUrl } from "../../data/cv-files";
import { profiles } from "../../data/skills";
import { ArrowUpRightIcon, ChevronIcon, DownloadIcon, MoonIcon, SunIcon } from "../icons/GrisIcons";
import { fadeIn, fadeUp, stagger } from "../journey/motion";
import PageScene from "../layouts/PageScene";

/** Les deux versions du CV (générées par scripts/cv/build.mjs), adresses suivies de leur empreinte (cache) */
const VERSIONS = [
  {
    id: "numerique",
    label: "Numérique",
    title: "Version numérique",
    note: "Fond bleu nuit, pour l'écran et l'envoi par e-mail.",
    pdf: cvUrl(site.cv),
    file: site.cv.split("/").pop(),
    preview: cvUrl("/cv/cv-numerique.webp"),
  },
  {
    id: "impression",
    label: "Imprimable",
    title: "Version imprimable",
    note: "Papier clair : moins d'encre, mêmes informations.",
    pdf: cvUrl(site.cvPrint),
    file: site.cvPrint.split("/").pop(),
    preview: cvUrl("/cv/cv-impression.webp"),
  },
] as const;
type VersionId = (typeof VERSIONS)[number]["id"];

/** Étapes du parcours, de la plus récente à la plus ancienne */
const steps = careerNodes
  .filter((n) => n.kind === "start" || n.kind === "step" || n.kind === "current")
  .sort((a, b) => b.col - a.col);
const work = steps.filter((n) => n.domain === "work");
const school = steps.filter((n) => n.domain === "formation");
const languages = specs.find((s) => s.icon === "langue")?.value;

/**
 * Largeur de l'aperçu sur grand écran : celle d'une page A4 (rapport 1588 / 2246) haute de tout l'écran
 * (moins les marges et le cadre, au moins 32rem), sans déborder à côté de la colonne d'options.
 * La largeur seule est fixée et l'image garde sa hauteur naturelle : jamais déformée.
 */
const FIT = "lg:w-[min(calc(max(32rem,100svh_-_8.75rem)*0.707_+_1.25rem),calc(100vw_-_29rem))]";

/**
 * Page CV : le CV se lit dans le site, puis se télécharge.
 * Grand écran : une colonne (présentation, options, version texte) collée à gauche de l'aperçu, qui prend
 * toute la hauteur de l'écran ; l'ensemble est centré. Une version à la fois (numérique sombre ou imprimable claire).
 * Tout le texte repose sur des panneaux (jamais directement sur le décor), et une version texte du CV
 * (dépliable) donne le même contenu aux lecteurs d'écran et à qui préfère lire sans image.
 */
export default function CvPage() {
  const [current, setCurrent] = useState<VersionId>("numerique");
  const version = VERSIONS.find((x) => x.id === current) ?? VERSIONS[0];

  return (
    <PageScene stage="bleu" back={{ href: "/#section-contact", label: "Contact" }}>
      <m.main
        className="relative mx-auto flex w-full flex-col items-center gap-6 px-4 pb-40 pt-24 sm:px-8 md:pb-28 lg:flex-row lg:items-start lg:justify-center lg:gap-8 lg:px-10 lg:pb-10 lg:pt-20"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Présentation et options, collées à l'aperçu */}
        <div className="w-full max-w-[44rem] lg:sticky lg:top-20 lg:w-[22rem] lg:flex-none">
          {/* Grand écran : colonne fixe à l'écran ; si la version texte dépliée la rend plus haute que l'écran, elle défile à l'intérieur */}
          <div className="-mx-1.5 flex flex-col gap-4 px-1.5 pt-2 lg:max-h-[calc(100svh-11rem)] lg:overflow-y-auto lg:overscroll-contain lg:pb-2">
            <m.header variants={fadeUp} className="veil panel rounded-3xl px-6 pb-6 pt-8">
              <p className="label-spaced text-ink-soft">Curriculum vitæ</p>
              <h1 className="title-spaced mt-3 text-2xl leading-snug text-ink sm:text-3xl">{site.name}</h1>
              <p className="mt-2 text-sm font-medium text-ink">{site.role}</p>
              <p className="mt-4 text-pretty leading-relaxed text-ink">
                Mon parcours sur une page : expériences, formation, aptitudes et projets choisis. Lisez-le ici, puis téléchargez la version qui
                vous convient.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                Le QR code en haut à droite du CV ramène à ce portfolio : pratique sur une version imprimée.
              </p>
            </m.header>

            {/* Options : la version (comme un mode clair / sombre), ouvrir, télécharger */}
            <m.div variants={fadeUp} className="veil rounded-2xl p-3">
              <h2 id="cv-version" className="sr-only">
                {version.title}
              </h2>
              <div className="flex flex-col gap-3">
                {/* Bascule entre les deux versions, comme un mode clair / sombre */}
                <div role="group" aria-label="Version du CV" className="grid grid-cols-2 gap-1 rounded-full bg-ink/10 p-1">
                  {VERSIONS.map((x) => {
                    const Icon = x.id === "numerique" ? MoonIcon : SunIcon;
                    return (
                      <button
                        key={x.id}
                        type="button"
                        aria-pressed={current === x.id}
                        onClick={() => setCurrent(x.id)}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition ${
                          current === x.id ? "stone [text-shadow:none]" : "text-ink hover:bg-ink/10"
                        }`}
                      >
                        <Icon size={16} />
                        {x.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={version.pdf}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Ouvrir la ${version.title.toLowerCase()} dans un nouvel onglet`}
                    className="grid size-11 place-items-center rounded-full border border-ink/20 text-ink transition hover:bg-ink/10"
                  >
                    <ArrowUpRightIcon size={16} />
                  </a>
                  <a
                    href={version.pdf}
                    download={version.file}
                    className="stone inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm transition [text-shadow:none] hover:-translate-y-0.5"
                  >
                    <DownloadIcon size={16} />
                    Télécharger
                    <span className="sr-only">la {version.title.toLowerCase()} (PDF)</span>
                  </a>
                </div>
              </div>
              <p className="mt-3 px-1 text-sm text-ink-soft" aria-live="polite">
                {version.title} · {version.note}
              </p>
            </m.div>


            {/* Version texte : le même contenu, lisible sans l'image */}
            <m.details variants={fadeUp} className="veil group rounded-2xl px-5 py-4 text-ink">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium [&::-webkit-details-marker]:hidden">
                Lire le CV en texte
                <ChevronIcon size={16} className="transition group-open:rotate-90" />
              </summary>
              <div className="mt-4 space-y-5 text-sm leading-relaxed">
                <section>
                  <h2 className="label-spaced text-ink-soft">Expériences</h2>
                  <ul className="mt-2 space-y-3">
                    {work.map((n) => (
                      <li key={n.id}>
                        <p className="font-semibold">{n.title}</p>
                        <p className="text-ink-soft">
                          {n.place} · {n.period}
                        </p>
                        <p>{n.text}</p>
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h2 className="label-spaced text-ink-soft">Formation</h2>
                  <ul className="mt-2 space-y-3">
                    {school.map((n) => (
                      <li key={n.id}>
                        <p className="font-semibold">{n.title}</p>
                        <p className="text-ink-soft">
                          {n.place} · {n.period}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
                {profiles.map((p) => (
                  <section key={p.id}>
                    <h2 className="label-spaced text-ink-soft">
                      {p.side} : {p.name}
                    </h2>
                    <p className="mt-2">{p.skills.map((s) => s.name).join(" · ")}</p>
                    <p className="mt-1 text-ink-soft">Outils : {p.tools.map((t) => t.name).join(", ")}</p>
                  </section>
                ))}
                <section>
                  <h2 className="label-spaced text-ink-soft">Langues et contact</h2>
                  <p className="mt-2">{languages}</p>
                  <p className="mt-1">
                    <a href={`mailto:${site.email}`} className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                      {site.email}
                    </a>
                  </p>
                  <p className="mt-1 text-ink-soft">{site.status}</p>
                </section>
              </div>
            </m.details>
          </div>
        </div>

        {/* L'aperçu de la version choisie, sur toute la hauteur de l'écran */}
        <m.section variants={fadeIn} aria-labelledby="cv-version" className="w-full max-w-[44rem] lg:w-auto lg:max-w-none lg:flex-none">

          {/* Les deux aperçus empilés : on passe de l'un à l'autre en fondu, sans attendre le chargement */}
          <a
            href={version.pdf}
            target="_blank"
            rel="noreferrer"
            className={`veil grid w-full rounded-2xl p-2 transition hover:-translate-y-1 lg:p-2.5 ${FIT}`}
          >
            {VERSIONS.map((x) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={x.id}
                src={x.preview}
                width={1588}
                height={2246}
                alt={x.id === current ? `Aperçu du CV, ${x.title.toLowerCase()} (ouvre le PDF dans un nouvel onglet)` : ""}
                aria-hidden={x.id !== current}
                className={`col-start-1 row-start-1 block aspect-[1588/2246] h-auto w-full rounded-lg transition-opacity duration-500 ${
                  x.id === current ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </a>
        </m.section>
      </m.main>
    </PageScene>
  );
}
