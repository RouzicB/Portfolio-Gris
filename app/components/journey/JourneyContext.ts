"use client";

import { createContext, useContext } from "react";
import { motionValue, type MotionValue } from "framer-motion";

export interface JourneyState {
  /** Section la plus proche du centre de l'écran */
  active: number;
  /** Position continue dans le voyage (0 = accueil, 1 = profil…), mise à jour à chaque frame de scroll */
  progress: MotionValue<number>;
  /** Fait défiler jusqu'à la section demandée */
  goTo: (index: number) => void;
}

export const JourneyContext = createContext<JourneyState>({
  active: 0,
  progress: motionValue(0),
  goTo: () => {},
});

export const useJourney = () => useContext(JourneyContext);
