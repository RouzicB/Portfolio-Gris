"use client";

import { createContext, useContext } from "react";
import { motionValue, type MotionValue } from "framer-motion";

export interface JourneyState {
  /** Section la plus proche du centre de l'écran */
  active: number;
  /** Position continue dans le voyage (0 = accueil, 1 = profil…), animée pendant chaque transition */
  progress: MotionValue<number>;
  /** Voyage (en zoom) jusqu'à la section demandée ; `instant` = sans animation */
  goTo: (index: number, instant?: boolean) => void;
}

export const JourneyContext = createContext<JourneyState>({
  active: 0,
  progress: motionValue(0),
  goTo: () => {},
});

export const useJourney = () => useContext(JourneyContext);

/** Commandes seules (stables) : un composant qui ne fait que naviguer ne se re-rend pas à chaque changement de section */
export interface JourneyControls {
  progress: MotionValue<number>;
  goTo: (index: number, instant?: boolean) => void;
  /** Section visée, connue dès le geste (avant que React n'ait re-rendu la page) */
  getActive: () => number;
  /**
   * Prévient immédiatement, au geste, quand la section visée change : l'apparition du contenu et la navigation
   * réagissent sans attendre le rendu React (différé, il peut prendre une seconde sur un téléphone en mode dev).
   */
  onActivate: (listener: (index: number) => void) => () => void;
}

export const JourneyControlsContext = createContext<JourneyControls>({
  progress: motionValue(0),
  goTo: () => {},
  getActive: () => 0,
  onActivate: () => () => {},
});

export const useJourneyControls = () => useContext(JourneyControlsContext);
