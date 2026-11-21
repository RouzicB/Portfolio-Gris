import type { FlowChapter, FlowEdge, FlowNode } from "../types";

/*
 * Parcours de Baptiste Rouzic, en arborescence horizontale (le temps se lit de gauche à droite).
 * Couloirs : 0 = formation, 1 = expériences professionnelles, 2 = chemins non empruntés.
 * Le parcours commence au BUT (2022) ; années 4 et 5 d'études = 2025 – 2027.
 * ⚠ Les deux « chemins non empruntés » et les textes de détail sont des propositions : à ajuster.
 */

export const careerChapters: FlowChapter[] = [
  { id: "but", title: "BUT MMI", cols: [0, 3] },
  { id: "mastere", title: "Mastère", cols: [4, 5] },
  { id: "suite", title: "La suite", cols: [6, 6] },
];

export const careerNodes: FlowNode[] = [
  {
    id: "but-tronc",
    short: "BUT MMI · Tronc commun",
    kind: "start",
    domain: "formation",
    title: "BUT MMI · Tronc commun",
    place: "3 semestres (S1 – S3)",
    period: "2022 – 2024",
    text: "Métiers du multimédia et de l'internet : développement, design graphique, audiovisuel, communication. Une base large avant de choisir sa voie.",
    tags: ["Développement", "Design graphique", "Communication"],
    col: 0,
    row: 0,
  },
  {
    id: "choix-specialite",
    kind: "choice",
    title: "Quelle spécialité ?",
    period: "Fin 2023",
    text: "Premier choix décisif à la fin du tronc commun : se spécialiser dans le développement web, ou dans la création numérique.",
    col: 1,
    row: 0,
  },
  {
    id: "creation",
    short: "Création numérique",
    kind: "locked",
    title: "Parcours création numérique",
    text: "Chemin non emprunté… même si le design est revenu par une autre porte.",
    col: 2,
    row: 2,
  },
  {
    id: "but-dev",
    short: "BUT MMI · Spécialité Dév",
    kind: "step",
    domain: "formation",
    title: "BUT MMI · Spécialité Dév",
    place: "3 semestres (S4 – S6)",
    period: "2024 – 2025",
    text: "Développement web et dispositifs interactifs : front, back, intégration, et une attention constante à l'expérience de celles et ceux qui utilisent ce qu'on code.",
    tags: ["Front-end", "Back-end", "Intégration"],
    col: 2,
    row: 0,
  },
  {
    id: "sesa",
    short: "Stage · Sesa Systems",
    kind: "step",
    domain: "work",
    title: "Stage · Développeur web",
    place: "Sesa Systems",
    period: "2024 · 2e année (S4)",
    text: "Premier pied en entreprise : développement web au sein d'une équipe, contraintes réelles et livrables utilisés par de vrais clients.",
    tags: ["Développement web", "Travail en équipe"],
    col: 2,
    row: 1,
  },
  {
    id: "chu",
    short: "Alternance · CHU de Rouen",
    kind: "step",
    domain: "work",
    title: "Alternance · Chargé de communication & graphiste",
    place: "CHU de Rouen · Cardiologie",
    period: "2024 – 2025 · 3e année",
    text: "Communication et supports graphiques pour le service de cardiologie : rendre une information médicale claire, lisible et rassurante pour les patients et les équipes.",
    tags: ["Graphisme", "Communication", "Santé"],
    col: 3,
    row: 1,
  },
  {
    id: "choix-apres-but",
    kind: "choice",
    title: "Après le BUT ?",
    period: "2025",
    text: "Deuxième choix : rester sur le développement pur, ou relier le code et le design dans un mastère UX/UI.",
    col: 4,
    row: 0,
  },
  {
    id: "master-dev",
    short: "Master développement",
    kind: "locked",
    title: "Master 100 % développement",
    text: "Chemin non emprunté : le code reste un atout, mais c'est l'expérience utilisateur qui a gagné.",
    col: 5,
    row: 2,
  },
  {
    id: "mastere",
    short: "Mastère UX/UI",
    kind: "step",
    domain: "formation",
    title: "Mastère UX/UI · spécialité création graphique",
    place: "Normandie Web School",
    period: "2025 – 2027 · années 4 & 5",
    text: "Recherche utilisateur, architecture de l'information, UI design et design system, avec une spécialité en création graphique, en alternance.",
    tags: ["UX research", "UI design", "Création graphique"],
    col: 5,
    row: 0,
  },
  {
    id: "renault",
    short: "Alternance · Renault Group",
    kind: "current",
    domain: "work",
    title: "Alternance · Dév full-stack & UX/UI designer",
    place: "Renault Group · applications",
    period: "2025 – 2027",
    text: "Concevoir et développer des applications : de la recherche utilisateur et des maquettes jusqu'au code full-stack. Le lien entre design et développement, au quotidien.",
    tags: ["Full-stack", "UX/UI", "Design produit"],
    col: 5,
    row: 1,
  },
  {
    id: "suite",
    kind: "future",
    title: "?",
    period: "2027",
    text: "Ce chapitre n'est pas encore écrit. Votre équipe pourrait être la prochaine branche.",
    col: 6,
    row: 0.5,
  },
];

export const careerEdges: FlowEdge[] = [
  { from: "but-tronc", to: "choix-specialite" },
  { from: "choix-specialite", to: "but-dev" },
  { from: "choix-specialite", to: "creation" },
  { from: "but-dev", to: "sesa" },
  { from: "but-dev", to: "chu" },
  { from: "but-dev", to: "choix-apres-but" },
  { from: "choix-apres-but", to: "mastere" },
  { from: "choix-apres-but", to: "master-dev" },
  { from: "mastere", to: "renault" },
  { from: "mastere", to: "suite" },
  { from: "renault", to: "suite" },
];

/** Étape affichée par défaut dans le détail : l'étape en cours */
export const defaultNodeId = careerNodes.find((n) => n.kind === "current")?.id ?? careerNodes[0].id;
