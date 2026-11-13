import type { Section } from "../types";

/**
 * Les sections de l'accueil, dans l'ordre du scroll (même architecture que le portfolio principal :
 * identification, profil, méthode, aptitudes, parcours, projets, contact) ; les crédits ont leur propre page (/credits).
 * `stage` choisit l'ambiance du décor ; le scroll fond une ambiance dans la suivante.
 */
export const sections: Section[] = [
  {
    id: "accueil",
    label: "Accueil",
    title: "Accueil",
    intro: "",
    icon: "accueil",
    stage: "gris",
    sun: { x: 50, y: 30, size: 150 },
  },
  {
    id: "profil",
    label: "Profil",
    title: "Faire connaissance",
    intro: "Qui je suis, ce qui me fait avancer, et ce que je cherche pour la suite.",
    icon: "profil",
    stage: "rouge",
    sun: { x: 70, y: 18, size: 110 },
  },
  {
    id: "methode",
    label: "Méthode",
    title: "Faire pousser une idée",
    intro: "Cinq étapes, chacune pousse sur la précédente.",
    icon: "methode",
    stage: "vert",
    sun: { x: 22, y: 20, size: 110 },
  },
  {
    id: "aptitudes",
    label: "Aptitudes",
    title: "Ce que je sais faire",
    intro: "Un état des lieux honnête, après cinq ans d'études et de terrain.",
    icon: "aptitudes",
    stage: "bleu",
    sun: { x: 50, y: 4, size: 220 },
  },
  {
    id: "parcours",
    label: "Parcours",
    title: "Cinq années de route",
    intro: "Une étape après l'autre, chacune un peu plus haut que la précédente.",
    icon: "parcours",
    stage: "jaune",
    sun: { x: 78, y: 26, size: 120 },
  },
  {
    id: "projets",
    label: "Projets",
    title: "Études de cas",
    intro: "Quatre projets, du problème de départ à ce que j'en ai retenu.",
    icon: "projets",
    stage: "ciel",
    sun: { x: 74, y: 18, size: 120 },
  },
  {
    id: "contact",
    label: "Contact",
    title: "Écrivons la suite",
    intro: "Une alternance, un premier poste, un projet ? Je réponds sous 48 h.",
    icon: "contact",
    stage: "lune",
    sun: { x: 72, y: 40, size: 340 },
  },
];
