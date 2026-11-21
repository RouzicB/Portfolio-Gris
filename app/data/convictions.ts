import type { Conviction } from "../types";

/**
 * Convictions : pas une recette en étapes, mais quelques partis pris, sans ordre.
 * Chacun renvoie au projet où il s'est vérifié (titre recopié ici pour ne pas embarquer tous les projets côté client).
 */
export const convictions: Conviction[] = [
  {
    title: "La structure avant l'habillage",
    text: "Je pose les contenus, les parcours et la hiérarchie avant de choisir une typographie ou une ambiance. Une belle interface où l'on se perd reste ratée.",
    proof: { slug: "pluies-de-juillet", title: "Pluies de Juillet" },
  },
  {
    title: "Penser à ceux qu'on oublie",
    text: "Une interface n'est réussie que si elle marche pour tout le monde, y compris pour celles et ceux qui voient, lisent ou naviguent autrement.",
    proof: { slug: "chronicles-of-elyndor", title: "Elyndor" },
  },
  {
    title: "Dire l'essentiel",
    text: "Moins d'éléments, moins de mots, moins d'encre : ce qui reste doit compter.",
    proof: { slug: "delta", title: "Delta" },
  },
  {
    title: "Casser les règles, en connaissance de cause",
    text: "Connaître les conventions, c'est savoir quand les enfreindre, et pouvoir défendre pourquoi.",
    proof: { slug: "holograph", title: "Holograph'" },
  },
  {
    title: "Développer mes propres designs",
    text: "Je développe mes propres maquettes : elles arrivent en ligne telles que je les ai pensées, et je sais dès le design ce qui est faisable.",
    proof: { slug: "vibes", title: "Vibes" },
  },
];
