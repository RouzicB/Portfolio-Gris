import type { Variants } from "framer-motion";

/** Décélération longue, comme une goutte d'encre qui s'étale */
export const WASH: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Conteneur : les enfants apparaissent en cascade quand la section entre à l'écran */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

/**
 * Apparition : opacité et légère montée, sans filtre.
 * ⚠ Verre dépoli : un parent en cours de fondu (opacity < 1) ou filtré devient la « racine d'arrière-plan »
 * de ses descendants, et leur backdrop-filter ne voit plus le décor tant que l'animation dure.
 * On anime donc les cartes `veil` elles-mêmes (leur propre opacité ne gêne pas leur flou),
 * jamais un conteneur qui les englobe : pour un groupe, utiliser `group` puis `fadeUp` sur chaque carte.
 */
export const fadeUp: Variants = {
  // `transform` complet plutôt que `y` : framer-motion le confie alors au compositeur (Web Animations),
  // l'apparition reste fluide même quand le fil principal est occupé (téléphones, changement de section)
  hidden: { opacity: 0, transform: "translateY(22px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.7, ease: WASH } },
};

/** Groupe sans effet propre : transmet l'apparition en cascade à ses enfants (cartes en verre) */
export const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease: WASH } },
};
