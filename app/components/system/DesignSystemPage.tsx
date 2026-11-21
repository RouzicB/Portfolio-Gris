"use client";

import { useState, type ReactNode } from "react";
import { m } from "framer-motion";
import type { Palette, StageId } from "../../types";
import { palettes, stageIds } from "../../data/palettes";
import { sections } from "../../data/sections";
import { ArrowRightIcon, CheckIcon, DownloadIcon, iconGallery } from "../icons/GrisIcons";
import { fadeIn, fadeUp, stagger } from "../journey/motion";
import PageScene from "../layouts/PageScene";
import { Chapter, Hairline } from "../ui/Chapter";
import Emblem from "../ui/Emblem";

/** Nom de chaque zone, tel qu'il apparaît dans le voyage */
const ZONE: Record<StageId, string> = Object.fromEntries(sections.map((s) => [s.stage, s.label])) as Record<StageId, string>;

const TOKENS: { key: keyof Palette; name: string; role: string }[] = [
  { key: "skyTop", name: "Ciel", role: "Fond, texte sur pierre" },
  { key: "skyBottom", name: "Horizon", role: "Bas du ciel" },
  { key: "ink", name: "Encre", role: "Texte, pierres, filets" },
  { key: "inkSoft", name: "Encre diluée", role: "Texte secondaire" },
  { key: "accent", name: "Pigment", role: "Losanges, pierre de clé, liens" },
  { key: "washNear", name: "Lavis proche", role: "Décor, fleur de pigment" },
  { key: "washFar", name: "Lavis lointain", role: "Teinte des surfaces" },
];

/** Bloc d'exemple : l'aperçu, son nom, et quand l'employer */
function Specimen({ name, use, children, className = "" }: { name: string; use: string; children: ReactNode; className?: string }) {
  return (
    <m.figure variants={fadeUp} className={`flex flex-col gap-4 ${className}`}>
      <div className="flex min-h-28 flex-wrap items-center justify-center gap-3">{children}</div>
      <figcaption className="legible text-center">
        <code className="label-spaced text-ink">{name}</code>
        <p className="mt-1 text-sm text-ink-soft">{use}</p>
      </figcaption>
    </m.figure>
  );
}

/**
 * Système « Lavis » : la référence vivante du design system du portfolio.
 * Tout ce qui est montré ici est fait avec les vraies classes du site ; le sélecteur de zone reteint la page
 * (décor compris) pour vérifier chaque composant dans les sept palettes.
 */
export default function DesignSystemPage() {
  const [stage, setStage] = useState<StageId>("gris");
  const p = palettes[stage];

  return (
    <PageScene stage={stage} back={{ href: "/", label: "Accueil" }}>
      <m.main className="relative mx-auto max-w-[1100px] px-4 pb-28 pt-20 sm:px-8 sm:pt-24" variants={stagger} initial="hidden" animate="show">
        <header className="flex flex-col items-center text-center">
          <div className="relative grid size-[min(15rem,66vw)] place-items-center" style={{ ["--emblem-bg" as string]: "var(--sky-top)" }}>
            <m.div variants={fadeIn} className="absolute inset-0 text-ink">
              <Emblem className="size-full" />
            </m.div>
            <m.h1 variants={fadeUp} className="title-spaced relative pl-[0.32em] text-xl text-ink sm:text-2xl">
              Lavis
            </m.h1>
          </div>
          <m.p variants={fadeUp} className="legible mt-6 max-w-2xl text-balance text-lg text-ink">
            Le design system du portfolio. Rien n&apos;y est en verre lisse : chaque surface est un lavis d&apos;aquarelle posé sur le papier,
            chaque bouton une pierre d&apos;encre, chaque cadre un filet tracé à la main.
          </m.p>

          {/* Choix de la zone : la page entière se reteint */}
          <m.div variants={fadeUp} role="radiogroup" aria-label="Zone affichée" className="veil mt-7 inline-flex flex-wrap justify-center gap-1 rounded-[1.5rem] p-1.5">
            {stageIds.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={stage === id}
                onClick={() => setStage(id)}
                className={`label-spaced inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition ${stage === id ? "stone" : "text-ink hover:bg-ink/10"}`}
              >
                <span aria-hidden className="size-2 rotate-45" style={{ background: palettes[id].accent }} />
                {ZONE[id]}
              </button>
            ))}
          </m.div>
        </header>

        {/* I — Couleurs */}
        <Chapter numeral="I" title="Couleurs" id="couleurs">
          <m.p variants={fadeUp} className="legible mx-auto max-w-2xl text-center text-ink">
            Sept palettes, une par zone du voyage. Les composants ne connaissent que des rôles (encre, pigment, lavis…) :
            en changeant de zone, tout se reteint sans exception.
          </m.p>
          <m.ul variants={fadeUp} className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {TOKENS.map((t) => (
              <li key={t.key} className="veil flex flex-col overflow-hidden rounded-b-2xl rounded-t-[999px] p-1.5 pb-3">
                <span className="block aspect-[3/4] rounded-b-xl rounded-t-[999px]" style={{ background: p[t.key] }} />
                <span className="label-spaced mt-3 text-center text-ink">{t.name}</span>
                <code className="mt-0.5 text-center text-xs text-ink-soft">{p[t.key]}</code>
                <span className="mt-1 px-2 text-center text-[0.7rem] leading-snug text-ink-soft">{t.role}</span>
              </li>
            ))}
          </m.ul>
        </Chapter>

        {/* II — Typographie */}
        <Chapter numeral="II" title="Typographie" id="typographie">
          <m.div variants={fadeUp} className="veil panel mx-auto grid max-w-4xl gap-8 rounded-[2.25rem_0.75rem_2.25rem_0.75rem] px-6 py-9 sm:px-12">
            <div>
              <p className="label-spaced text-ink-soft">title-spaced · Josefin Sans 300</p>
              <p className="title-spaced mt-2 text-3xl text-ink sm:text-5xl">Faire pousser</p>
            </div>
            <div>
              <p className="label-spaced text-ink-soft">font-display · Josefin Sans 300 – 400</p>
              <p className="mt-2 font-display text-2xl font-light text-ink">La structure avant l&apos;habillage</p>
            </div>
            <div>
              <p className="label-spaced text-ink-soft">label-spaced · Josefin Sans 500</p>
              <p className="label-spaced mt-2 text-ink">Chapitre II · Étape en cours</p>
            </div>
            <div>
              <p className="label-spaced text-ink-soft">texte · Quicksand 400 – 500</p>
              <p className="mt-2 max-w-xl text-pretty leading-relaxed text-ink">
                Le texte courant reste simple et aéré : la poésie vient du décor et des titres, la lecture doit rester calme.
              </p>
            </div>
          </m.div>
        </Chapter>

        {/* III — Surfaces */}
        <Chapter numeral="III" title="Surfaces" id="surfaces">
          <m.p variants={fadeUp} className="legible mx-auto max-w-2xl text-center text-ink">
            Trois matières aux contours lisses et nets. Le lavis porte le grain du papier, une fleur de pigment dans deux coins
            et un bord où le pigment s&apos;accumule en séchant.
          </m.p>
          <m.div variants={stagger} className="mt-10 grid gap-10 md:grid-cols-3">
            <Specimen name="veil" use="Surface de base : pastilles, boutons secondaires, cadres d'images, nœuds.">
              <div className="veil grid h-28 w-full place-items-center rounded-[1.75rem_0.6rem_1.75rem_0.6rem] text-sm text-ink">Lavis</div>
            </Specimen>
            <Specimen name="veil panel" use="Grand panneau de texte : filet d'encre intérieur et pierre de clé au sommet.">
              <div className="veil panel grid h-28 w-full place-items-center rounded-[1.75rem_0.6rem_1.75rem_0.6rem] text-sm text-ink">Panneau</div>
            </Specimen>
            <Specimen name="stone" use="Action principale : une pierre d'encre au grain clair. Une seule par écran.">
              <div className="stone grid h-28 w-full place-items-center rounded-[1.75rem_0.6rem_1.75rem_0.6rem] text-sm">Pierre</div>
            </Specimen>
          </m.div>
        </Chapter>

        {/* IV — Composants */}
        <Chapter numeral="IV" title="Composants" id="composants">
          <m.div variants={stagger} className="grid gap-12 md:grid-cols-2">
            <Specimen name="Bouton principal · stone" use="Commencer, télécharger, voir le projet.">
              <button type="button" className="stone inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition hover:-translate-y-0.5">
                Commencer le voyage
                <ArrowRightIcon size={16} />
              </button>
              <button type="button" className="stone inline-flex items-center gap-2 rounded-full pl-4 pr-5 py-2.5 text-sm transition hover:-translate-y-0.5">
                <DownloadIcon size={16} />
                Télécharger
              </button>
            </Specimen>
            <Specimen name="Bouton secondaire · veil" use="Me contacter, réseaux, retour.">
              <button type="button" className="veil inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-ink transition hover:-translate-y-0.5">
                Me contacter
              </button>
              <button type="button" aria-label="Valider" className="veil grid size-11 place-items-center rounded-full text-ink transition hover:-translate-y-0.5">
                <CheckIcon size={18} />
              </button>
            </Specimen>
            <Specimen name="Puces" use="Outils, mots-clés : un simple filet, jamais de fond.">
              {["Figma", "React", "Design system"].map((t) => (
                <span key={t} className="legible inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink">
                  {t}
                </span>
              ))}
            </Specimen>
            <Specimen name="Liste à losanges" use="Énumérations courtes : le losange remplace la puce ronde.">
              <ul className="legible space-y-2 text-sm text-ink">
                {["Recherche utilisateur", "Architecture & parcours", "UI design"].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span aria-hidden className="size-1.5 rotate-45 bg-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </Specimen>
            <Specimen name="Hairline" use="Séparateur : deux filets et un losange de pigment.">
              <Hairline className="my-0 w-full" />
            </Specimen>
            <Specimen name="Chapitre" use="Titre de partie des pages longues : numéro romain, filets, pastille de lavis.">
              <div className="flex w-full items-center justify-center gap-3">
                <span aria-hidden className="h-px max-w-16 flex-1 bg-ink/25" />
                <span className="veil flex items-center gap-3 rounded-full px-5 py-3 text-ink">
                  <span className="cap-box font-display text-3xl font-light leading-none text-accent">V</span>
                  <span className="cap-box label-spaced">Exemple</span>
                </span>
                <span aria-hidden className="h-px max-w-16 flex-1 bg-ink/25" />
              </div>
            </Specimen>
          </m.div>
        </Chapter>

        {/* V — Formes */}
        <Chapter numeral="V" title="Formes" id="formes">
          <m.p variants={fadeUp} className="legible mx-auto max-w-2xl text-center text-ink">
            Pas d&apos;arrondis uniformes : des formes empruntées au décor. La feuille (deux coins ronds, deux coins vifs),
            l&apos;arche (sommet en plein cintre), le cercle des emblèmes et le losange.
          </m.p>
          <m.div variants={stagger} className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            <Specimen name="Feuille" use="Panneaux, pochettes.">
              <span className="veil block size-24 rounded-[2rem_0.5rem_2rem_0.5rem]" />
            </Specimen>
            <Specimen name="Arche" use="Portraits, cartes de projet.">
              <span className="veil block h-28 w-20 rounded-b-xl rounded-t-[999px]" />
            </Specimen>
            <Specimen name="Cercle" use="Emblèmes, boutons d'icône.">
              <span className="veil block size-24 rounded-full" />
            </Specimen>
            <Specimen name="Losange" use="Repères, pierre de clé, puces.">
              <span className="block size-12 rotate-45 bg-accent" />
            </Specimen>
          </m.div>
        </Chapter>

        {/* VI — Icônes */}
        <Chapter numeral="VI" title="Icônes" id="icones">
          <m.ul variants={fadeUp} className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
            {iconGallery.map(({ name, Icon }) => (
              <li key={name} className="veil flex flex-col items-center gap-2 rounded-b-2xl rounded-t-[999px] px-1 pb-3 pt-6">
                <Icon size={28} className="text-ink" />
                <span className="label-spaced text-[0.6rem] text-ink-soft">{name}</span>
              </li>
            ))}
          </m.ul>
        </Chapter>
      </m.main>
    </PageScene>
  );
}
