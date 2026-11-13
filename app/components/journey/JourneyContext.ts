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
