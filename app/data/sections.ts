import type { Section } from "../types";

/**
 * Les sections de l'accueil, dans l'ordre du scroll (même architecture que le portfolio principal :
 * identification, profil, convictions, aptitudes, parcours, projets, contact) ; les crédits ont leur propre page (/credits).
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
    intro: "Qui je suis, ce que j'apprends, et ce que je cherche pour la suite.",
    icon: "profil",
    stage: "rouge",
    sun: { x: 74, y: 14, size: 90 },
  },
  {
    id: "convictions",
    label: "Convictions",
    title: "Ce qui guide mon travail",
    intro: "Pas de recette, quelques partis pris : chacun s'est vérifié sur un projet.",
    icon: "methode",
    stage: "vert",
    sun: { x: 22, y: 20, size: 110 },
  },
  {
    id: "aptitudes",
    label: "Aptitudes",
    title: "Ce que je sais faire",
    intro: "Deux métiers qui se répondent : je fais le design des interfaces, puis je les construis.",
    icon: "aptitudes",
    stage: "bleu",
    sun: { x: 67, y: 6, size: 0 },
  },
  {
    id: "parcours",
    label: "Parcours",
    title: "Cinq années de route",
    intro: "Chaque choix a ouvert une branche. Sélectionnez une étape pour la découvrir.",
    icon: "parcours",
    stage: "jaune",
    sun: { x: 84, y: 10, size: 200 },
  },
  {
    id: "projets",
    label: "Projets",
    title: "Études de cas",
    intro: "Du problème de départ à ce que j'en ai retenu. Faites défiler la galerie pour tout parcourir.",
    icon: "projets",
    stage: "ciel",
    sun: { x: 74, y: 18, size: 120 },
  },
  {
    id: "contact",
    label: "Contact",
    title: "Écrivons la suite",
    intro: "Un premier poste, un projet ? Je réponds sous 48 h.",
    icon: "contact",
    stage: "lune",
    sun: { x: 72, y: 40, size: 340 },
  },
];
