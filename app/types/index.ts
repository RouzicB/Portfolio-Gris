import type { BrandName } from "../components/icons/BrandIcons";
/** Ambiance du décor : chaque section en emprunte une, le scroll les mélange */
export type StageId = "gris" | "rouge" | "vert" | "bleu" | "jaune" | "ciel" | "lune";

/** Soleil (ou lune) : position en % de l'écran, taille en px */
export interface Sun {
  x: number;
  y: number;
  size: number;
}

/** Identifiant de section (ancre #section-…) */
export type SectionId = "accueil" | "profil" | "methode" | "aptitudes" | "parcours" | "projets" | "contact";

/** Nom d'icône du jeu d'icônes maison (voir components/icons/GrisIcons.tsx) */
export type IconName =
  | "accueil"
  | "profil"
  | "methode"
  | "aptitudes"
  | "parcours"
  | "projets"
  | "contact"
  | "credits"
  | "lieu"
  | "langue"
  | "formation"
  | "statut"
  | "recherche"
  | "conception"
  | "interface"
  | "outils";

/** Palette appliquée à toute la page */
export interface Palette {
  skyTop: string;
  skyBottom: string;
  accent: string;
  ink: string;
  inkSoft: string;
  veil: string;
  washNear: string;
  washFar: string;
  sun: string;
}

export interface Section {
  id: SectionId;
  /** Libellé court (navigation) */
  label: string;
  /** Titre affiché */
  title: string;
  /** Phrase d'introduction */
  intro: string;
  icon: IconName;
  /** Ambiance du décor */
  stage: StageId;
  /** Soleil de la section */
  sun: Sun;
}

/**
 * Arborescence du parcours (même logique que le portfolio principal, posée à l'horizontale) :
 * start = point de départ, step = étape, choice = décision qui ouvre des branches,
 * current = étape en cours, locked = chemin non emprunté, future = prochain chapitre.
 */
export type FlowKind = "start" | "step" | "choice" | "current" | "locked" | "future";

export interface FlowNode {
  id: string;
  kind: FlowKind;
  title: string;
  /** Libellé court affiché sur la carte (le titre complet est dans le détail) */
  short?: string;
  /** Lieu / établissement / entreprise */
  place?: string;
  period?: string;
  text: string;
  /** Formation ou expérience professionnelle (icône, couloir) */
  domain?: "formation" | "work";
  tags?: string[];
  /** Colonne (le temps, de gauche à droite) et couloir (0 = formation, 1 = expériences, 2 = chemins non empruntés) */
  col: number;
  row: number;
}

export interface FlowEdge {
  from: string;
  to: string;
}

export interface FlowChapter {
  id: string;
  title: string;
  /** Colonnes couvertes [première, dernière] */
  cols: readonly [number, number];
}

export interface ProcessStep {
  name: string;
  goal: string;
  methods: string[];
}

export interface Project {
  slug: string;
  title: string;
  context: string;
  year: number;
  role: string;
  duration: string;
  summary: string;
  problem: string;
  solution: string;
  learnings: string[];
  outcomes: { value: string; label: string }[];
  tags: string[];
  tools: string[];
  /** Étapes de la démarche */
  process: { title: string; text: string }[];
  /** Deux teintes pour la vignette peinte */
  hues: [string, string];
  /** Ambiance du décor de la page projet */
  stage: StageId;
  link?: string;
}

/** Un des deux profils (designer, développeur web) : savoir-faire décrits par ce qu’on livre, sans niveau chiffré */
export interface SkillProfile {
  id: "design" | "dev";
  /** Petit libellé au-dessus du nom (« Côté dessin ») */
  side: string;
  name: string;
  icon: IconName;
  pitch: string;
  skills: { name: string; detail: string }[];
  tools: { name: string; brand: BrandName }[];
}
