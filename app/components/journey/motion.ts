import type { Variants } from "framer-motion";

/** Décélération longue, comme une goutte d'encre qui s'étale */
export const WASH: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Conteneur : les enfants apparaissent en cascade quand la section entre à l'écran */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  // transitionEnd retire le filtre une fois l'apparition finie : un `filter` laissé en place
  // empêcherait le flou d'arrière-plan (backdrop-filter) des cartes contenues de fonctionner.
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: WASH }, transitionEnd: { filter: "none" } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease: WASH } },
};
