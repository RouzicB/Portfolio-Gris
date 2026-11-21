"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { m, useAnimationControls, useTransform } from "framer-motion";
import { sections } from "../../data/sections";
import { palettes } from "../../data/palettes";
import { anchorId, contentOpacity, pad, paletteToVars, zoomScale } from "../../lib/journey";
import { icons } from "../icons/GrisIcons";
import { useJourney, useJourneyControls } from "../journey/JourneyContext";
import { fadeUp, stagger } from "../journey/motion";

/**
 * Palette propre à chaque section, posée sur la section elle-même : pendant un voyage, seul le ciel
 * (et la navigation) se mélange image par image. Le contenu garde ses couleurs : celui qu'on quitte s'efface
 * dans les siennes, celui qui arrive apparaît directement dans les siennes, et le navigateur n'a plus
 * à recalculer le style de chaque texte et de chaque carte à chaque image.
 */
const SECTION_VARS = sections.map((s) => paletteToVars(palettes[s.stage]) as CSSProperties);

/**
 * Gabarit d'une section : un écran plein, empilé avec les autres.
 * Son zoom et son opacité suivent la position du voyage : quand on avance, elle grossit et s'efface
 * (on entre dans la scène) pendant que la suivante arrive du fond. Seule la section active est interactive.
 * Si le contenu dépasse l'écran (mobile), la section défile à l'intérieur avant de passer à la suivante.
 */
export default function SectionShell({
  index,
  children,
  heading = true,
  className = "",
}: {
  index: number;
  children: ReactNode;
  /** Affiche l'en-tête standard (numéro, titre, introduction) */
  heading?: boolean;
  className?: string;
}) {
  const { progress, active } = useJourney();
  const section = sections[index];
  const titleId = `${anchorId(section.id)}-titre`;
  const Icon = icons[section.icon];
  const isActive = active === index;
  const { getActive, onActivate } = useJourneyControls();

  // Apparition pilotée au geste (pas au rendu React, qui est différé) : le contenu de la section visée
  // commence à apparaître dès le clic ou le glissé, celui qu'on quitte s'efface aussitôt.
  const reveal = useAnimationControls();
  useEffect(() => {
    let shown = getActive() === index;
    if (shown) reveal.start("show");
    return onActivate((target) => {
      if (target === index) {
        shown = true;
        reveal.start("show");
      } else if (shown) {
        shown = false;
        reveal.start("hidden");
      }
    });
  }, [index, getActive, onActivate, reveal]);

  const opacity = useTransform(progress, (f) => contentOpacity(f - index));
  // Sans animation demandée, le zoom est neutralisé en CSS (globals.css) : rendu identique côté serveur et client
  const scale = useTransform(progress, (f) => zoomScale(f - index, 0.35, 0.1));
  const visibility = useTransform(opacity, (o) => (o < 0.01 ? "hidden" : "visible"));
  // Section effacée : ses styles ne sont plus recalculés pendant les transitions de palette
  const contentVisibility = visibility;

  return (
    <m.section
      id={anchorId(section.id)}
      data-section-index={index}
      aria-labelledby={titleId}
      aria-hidden={!isActive}
      inert={!isActive}
      // La section d'arrivée reste à opacité 1 : un parent en fondu couperait le verre dépoli (backdrop-filter)
      // de ses cartes pendant tout le trajet. Son contenu apparaît carte par carte (fadeUp) ; seule la section
      // qu'on quitte s'efface en bloc.
      style={
        isActive
          ? { ...SECTION_VARS[index], opacity: 1, scale, visibility: "visible", contentVisibility: "visible" }
          : { ...SECTION_VARS[index], opacity, scale, visibility, contentVisibility }
      }
      className={`absolute inset-0 overflow-y-auto overscroll-contain will-change-transform ${className}`}
    >
      <div className="flex min-h-full items-center px-4 pb-28 pt-24 sm:px-8 md:pb-24 md:pr-24 md:pt-16 short:pt-20 short:md:pb-24 short:md:pt-10">
        <m.div
          className="mx-auto w-full max-w-[1200px] max-md:legible"
          variants={stagger}
          initial="hidden"
          animate={reveal}
        >
          {heading ? (
            // Au-dessus du contenu : un élément de décor dessiné dans la section (troncs des convictions) passe derrière le titre
            <m.header variants={fadeUp} className="legible max-md:mist relative z-10 mb-8 md:mb-12 short:md:mb-6">
              <p className="label-spaced flex items-center gap-2 text-ink">
                <Icon size={18} className="text-ink" />
                <span className="tabular-nums">{pad(index + 1)}</span>
                <span aria-hidden className="h-px w-6 bg-current opacity-50" />
                {section.label}
              </p>
              <h2 id={titleId} className="title-spaced mt-4 text-3xl leading-tight text-ink sm:text-5xl short:mt-3 short:sm:text-4xl">
                {section.title}
              </h2>
              {section.intro && <p className="mt-3 max-w-xl text-ink">{section.intro}</p>}
            </m.header>
          ) : (
            <h2 id={titleId} className="sr-only">
              {section.title}
            </h2>
          )}
          {children}
        </m.div>
      </div>
    </m.section>
  );
}
