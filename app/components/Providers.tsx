"use client";

import { useEffect, type ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import ArchSizer from "./ui/ArchSizer";
import { settlePalette } from "../lib/settle";
import { watchFrameRate } from "../lib/perf";

export default function Providers({ children }: Readonly<{ children: ReactNode }>) {
  // LazyMotion + composants « m » : seules les animations utilisées (pas de layout ni de glisser-déposer) sont chargées ;
  // « strict » refuse tout composant motion.* complet qui annulerait le gain.
  // Fonctions chargées d'emblée et non à la demande : les sections lancent leur apparition dès le montage,
  // un appel arrivé avant elles serait perdu et laisserait leur contenu invisible.
  // MotionConfig "user" : coupe les animations de mouvement si le système demande moins d'animations.
  // Premier affichage : <html> arrive avec les transitions coupées (palette-settling) ; elles reviennent une fois
  // la palette de la page posée par les composants enfants (leurs effets passent avant celui-ci)
  useEffect(() => settlePalette(250), []);
  // Ordinateur trop lent pour le verre dépoli et la parallaxe : bascule en mode léger (lib/perf.ts)
  useEffect(() => watchFrameRate(), []);
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
        <ArchSizer />
      </MotionConfig>
    </LazyMotion>
  );
}
