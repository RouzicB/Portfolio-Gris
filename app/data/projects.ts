import type { Project } from "../types";

// ⚠ Études de cas d'exemple — remplacez-les par vos projets (chiffres compris).
export const projects: Project[] = [
  {
    slug: "apres",
    title: "Après",
    context: "Projet de fin d'études",
    year: 2027,
    role: "UX/UI Designer (solo)",
    duration: "6 mois",
    summary: "Une app qui accompagne les proches dans les démarches après un décès.",
    problem:
      "Des dizaines de démarches administratives arrivent au pire moment. Les proches interrogés décrivent un sentiment d'être « noyés » sous les formulaires, sans savoir par où commencer.",
    solution:
      "Un parcours qui révèle les tâches une à une, une interface aux tons doux qui ne presse jamais, et un partage des tâches entre proches pour ne plus porter seul la charge.",
    process: [
      { title: "Entretiens", text: "14 entretiens avec des proches endeuillés, menés avec un protocole validé par une psychologue." },
      { title: "Cartographie", text: "Plus de 40 démarches classées par urgence, durée et charge émotionnelle." },
      { title: "Prototype", text: "Un parcours « une tâche à la fois », testé en trois itérations sur Figma." },
      { title: "Tests", text: "Tests modérés avec 8 participants, mesure du SUS et du temps perçu." },
    ],
    learnings: [
      "Concevoir pour une émotion forte demande de retirer, pas d'ajouter.",
      "Le ton des micro-textes compte autant que la structure des écrans.",
    ],
    outcomes: [
      { value: "14", label: "entretiens menés" },
      { value: "−40 %", label: "temps perçu des démarches" },
      { value: "SUS 84", label: "au dernier test" },
    ],
    tags: ["UX research", "Mobile", "Design émotionnel"],
    tools: ["Figma", "Maze", "FigJam"],
    hues: ["#9aa7c7", "#e9c7d3"],
    stage: "ciel",
  },
  {
    slug: "campus-go",
    title: "Campus Go",
    context: "Alternance — collectivité",
    year: 2026,
    role: "UX Designer",
    duration: "4 mois",
    summary: "Repenser l'info voyageur d'un réseau de bus étudiant.",
    problem: "62 % des étudiants consultaient trois applis différentes pour un seul trajet, et rataient les changements d'horaires.",
    solution: "Une seule vue « mon prochain départ », des alertes contextuelles et une carte simplifiée autour du campus.",
    process: [
      { title: "Observation", text: "Deux semaines aux arrêts de bus aux heures de pointe." },
      { title: "Tri de cartes", text: "24 étudiants : l'architecture prévue a été entièrement revue." },
      { title: "Prototype", text: "Prototype animé sur ProtoPie, centré sur le prochain départ." },
      { title: "Pilote", text: "Lancement auprès de 300 étudiants et suivi des usages." },
    ],
    learnings: [
      "Le tri de cartes a complètement changé l'architecture prévue.",
      "Les contraintes techniques se négocient tôt, pas au moment du handoff.",
    ],
    outcomes: [
      { value: "−55 %", label: "temps pour trouver un départ" },
      { value: "+31 %", label: "usage hebdomadaire" },
    ],
    tags: ["Service design", "Mobile", "Tests"],
    tools: ["Figma", "ProtoPie", "Notion"],
    hues: ["#4f8fbf", "#a6d6c4"],
    stage: "bleu",
  },
  {
    slug: "lumen-ds",
    title: "Lumen DS",
    context: "Stage — agence digitale",
    year: 2025,
    role: "UI Designer",
    duration: "4 mois",
    summary: "Un design system accessible pour trois produits d'une même agence.",
    problem: "Trois équipes, trois bibliothèques, 47 teintes presque identiques et aucun contraste vérifié.",
    solution: "Des tokens hiérarchisés, des composants documentés et un audit RGAA intégré à chaque revue de design.",
    process: [
      { title: "Inventaire", text: "Recensement de tous les composants et styles des trois produits." },
      { title: "Tokens", text: "Une base de tokens à trois niveaux : primitives, sémantique, composants." },
      { title: "Composants", text: "32 composants documentés avec états, variantes et règles d'accessibilité." },
      { title: "Adoption", text: "Ateliers avec les équipes et revue hebdomadaire des écarts." },
    ],
    learnings: [
      "Un design system est d'abord un outil de conversation.",
      "Partir de wireframes sobres a révélé les vrais niveaux de hiérarchie.",
    ],
    outcomes: [
      { value: "47 → 9", label: "teintes dans la palette" },
      { value: "AA", label: "contrastes conformes" },
    ],
    tags: ["Design system", "Accessibilité", "UI"],
    tools: ["Figma", "Tokens Studio", "Storybook"],
    hues: ["#c43b4a", "#efd2c9"],
    stage: "rouge",
  },
  {
    slug: "echo",
    title: "Écho",
    context: "Projet d'école — musée",
    year: 2024,
    role: "UX/UI Designer (équipe de 4)",
    duration: "8 semaines",
    summary: "Un audioguide qui réagit à la façon dont on regarde les œuvres.",
    problem: "Les visiteurs décrochaient au bout de 20 minutes d'audioguide linéaire.",
    solution: "Des récits courts déclenchés par la proximité, et un parcours qui s'adapte au rythme de chacun.",
    process: [
      { title: "Immersion", text: "Observation des visiteurs et entretiens à la sortie du musée." },
      { title: "Scénarios", text: "Récits de 40 secondes écrits avec les médiateurs." },
      { title: "Prototype physique", text: "Balises Arduino et prototype sonore testés en salle." },
      { title: "Restitution", text: "Présentation au musée et recommandations de déploiement." },
    ],
    learnings: ["Prototyper le son est aussi important que prototyper l'écran."],
    outcomes: [
      { value: "×2", label: "durée moyenne de visite" },
      { value: "4,6/5", label: "satisfaction visiteurs" },
    ],
    tags: ["Prototypage", "Expérience physique"],
    tools: ["Figma", "Arduino", "After Effects"],
    hues: ["#5e9970", "#e3eed8"],
    stage: "vert",
  },
];

/** Projet précédent et suivant (en boucle) pour la navigation entre études de cas */
export function adjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  const n = projects.length;
  return { index: i, prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}
