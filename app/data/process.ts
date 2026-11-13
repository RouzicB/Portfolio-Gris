import type { ProcessStep } from "../types";

/** Méthode : comme une plante, chaque étape pousse sur la précédente */
export const process: ProcessStep[] = [
  {
    name: "Écouter",
    goal: "Comprendre les personnes, leur contexte et leurs frustrations avant toute solution.",
    methods: ["Entretiens", "Observation", "Benchmark"],
  },
  {
    name: "Définir",
    goal: "Transformer ce qu'on a entendu en un problème clair, partagé et mesurable.",
    methods: ["Personas", "Parcours", "How Might We"],
  },
  {
    name: "Structurer",
    goal: "Poser la hiérarchie : contenus, parcours et contrastes, avant tout habillage.",
    methods: ["Architecture", "Wireframes", "Tri de cartes"],
  },
  {
    name: "Habiller",
    goal: "Donner une émotion à l'interface : typographie, mouvement, design system.",
    methods: ["UI design", "Design tokens", "Motion"],
  },
  {
    name: "Tester",
    goal: "Confronter le prototype aux utilisateurs, mesurer, puis recommencer.",
    methods: ["Tests modérés", "Maze", "Itérations"],
  },
];
