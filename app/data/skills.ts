import type { SkillProfile } from "../types";

/**
 * Deux profils qui se répondent. Pas de niveau chiffré (toujours arbitraire) :
 * chaque savoir-faire est décrit par ce qu'il produit concrètement.
 */
export const profiles: SkillProfile[] = [
  {
    id: "design",
    side: "Côté design",
    name: "Designer",
    icon: "conception",
    pitch: "UX/UI et création graphique : comprendre les gens, puis designer des interfaces claires et une identité qui tient.",
    skills: [
      { name: "Recherche utilisateur", detail: "entretiens, tests, synthèse" },
      { name: "Architecture & parcours", detail: "arborescence, wireframes, flows" },
      { name: "UI design", detail: "maquettes, composants, prototypes" },
      { name: "Création graphique", detail: "identité, illustration, édition" },
      { name: "Motion & vidéo", detail: "micro-interactions, montage" },
    ],
    tools: [
      { name: "Figma", brand: "figma" },
      { name: "Illustrator", brand: "illustrator" },
      { name: "Photoshop", brand: "photoshop" },
      { name: "InDesign", brand: "indesign" },
      { name: "After Effects", brand: "aftereffects" },
      { name: "Premiere Pro", brand: "premiere" },
    ],
  },
  {
    id: "dev",
    side: "Côté code",
    name: "Développeur web",
    icon: "interface",
    pitch: "Front-end : développer mes propres designs, fidèles à la maquette, accessibles et rapides.",
    skills: [
      { name: "Interfaces React", detail: "composants, état, animation" },
      { name: "Sites Next.js", detail: "rendu statique, routage, SEO" },
      { name: "Qualité", detail: "TypeScript, tests, accessibilité" },
      { name: "Mise en ligne", detail: "Git, Docker, Vercel" },
    ],
    tools: [
      { name: "VS Code", brand: "vscode" },
      { name: "React", brand: "react" },
      { name: "Next.js", brand: "nextjs" },
      { name: "TypeScript", brand: "typescript" },
      { name: "Tailwind CSS", brand: "tailwind" },
      { name: "Node.js", brand: "node" },
      { name: "Jest", brand: "jest" },
      { name: "Git", brand: "git" },
      { name: "Docker", brand: "docker" },
      { name: "Vercel", brand: "vercel" },
    ],
  },
];

/** Ce qui relie les deux profils */
export const bridge = ["Design system", "Accessibilité", "Prototypage", "Motion"] as const;
