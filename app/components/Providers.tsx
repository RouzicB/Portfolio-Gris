"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import ArchSizer from "./ui/ArchSizer";

export default function Providers({ children }: Readonly<{ children: ReactNode }>) {
  // LazyMotion + composants « m » : seules les animations utilisées (pas de layout ni de glisser-déposer) sont chargées ;
  // « strict » refuse tout composant motion.* complet qui annulerait le gain.
  // Fonctions chargées d'emblée et non à la demande : les sections lancent leur apparition dès le montage,
  // un appel arrivé avant elles serait perdu et laisserait leur contenu invisible.
  // MotionConfig "user" : coupe les animations de mouvement si le système demande moins d'animations.
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {children}
        <ArchSizer />
      </MotionConfig>
    </LazyMotion>
  );
}
