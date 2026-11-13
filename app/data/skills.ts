import type { SkillGroup } from "../types";

// ⚠ Niveaux d'exemple (1 à 5) — à ajuster honnêtement.
export const skillGroups: SkillGroup[] = [
  {
    name: "Recherche",
    icon: "recherche",
    skills: [
      { name: "Entretiens utilisateurs", level: 5 },
      { name: "Tests d'utilisabilité", level: 4 },
      { name: "Ateliers de co-conception", level: 4 },
      { name: "Synthèse & insights", level: 3 },
    ],
  },
  {
    name: "Conception",
    icon: "conception",
    skills: [
      { name: "Architecture de l'information", level: 4 },
      { name: "Wireframes & parcours", level: 5 },
      { name: "Accessibilité (RGAA)", level: 4 },
      { name: "Stratégie produit", level: 3 },
    ],
  },
  {
    name: "Interface",
    icon: "interface",
    skills: [
      { name: "UI design", level: 5 },
      { name: "Design system", level: 4 },
      { name: "Motion design", level: 3 },
      { name: "HTML · CSS · React", level: 3 },
    ],
  },
];

export const tools = ["Figma", "FigJam", "ProtoPie", "Maze", "Notion", "After Effects", "Illustrator", "VS Code"] as const;
