import type { CareerStep } from "../types";

// ⚠ Parcours d'exemple — remplacez établissements, périodes et textes par les vôtres.
export const career: CareerStep[] = [
  {
    year: "01",
    period: "2022 – 2023",
    title: "Les fondamentaux",
    place: "Bachelor Design numérique",
    text: "Typographie, couleur, composition. J'apprends à regarder avant de dessiner.",
    tags: ["Graphisme", "Typographie", "Adobe CC"],
  },
  {
    year: "02",
    period: "2023 – 2024",
    title: "Le déclic UX",
    place: "Bachelor · stage de 2 mois",
    text: "Premier test utilisateur, premier choc : ce qui me semblait évident ne l'était pour personne.",
    tags: ["Ergonomie", "Wireframes", "Figma"],
  },
  {
    year: "03",
    period: "2024 – 2025",
    title: "Concevoir pour de vrai",
    place: "Bachelor · stage de 4 mois en agence",
    text: "Interfaces livrées, développeurs à convaincre, contraintes réelles. Le design devient un travail d'équipe.",
    tags: ["UI design", "Design system", "Handoff"],
  },
  {
    year: "04",
    period: "2025 – 2026",
    title: "La recherche",
    place: "Master UX/UI · alternance",
    text: "Entretiens, tests, ateliers : je mène la recherche et j'en tire des décisions de produit.",
    tags: ["UX research", "Ateliers", "Accessibilité"],
  },
  {
    year: "05",
    period: "2026 – 2027",
    title: "Prendre la direction",
    place: "Master UX/UI · projet de fin d'études",
    text: "Je pilote un produit de bout en bout et je cherche l'équipe avec qui écrire le chapitre suivant.",
    tags: ["Stratégie produit", "Mentorat", "Prototypage"],
  },
];
