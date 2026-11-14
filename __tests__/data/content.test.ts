import { sections } from "@/app/data/sections";
import { palettes } from "@/app/data/palettes";
import { careerNodes } from "@/app/data/career";
import { projects } from "@/app/data/projects";
import { profiles } from "@/app/data/skills";
import { specs } from "@/app/data/site";
import { icons } from "@/app/components/icons/GrisIcons";
import { parseColor } from "@/app/lib/color";

describe("contenu", () => {
  it("suit l'architecture du portfolio principal", () => {
    expect(sections.map((s) => s.id)).toEqual([
      "accueil",
      "profil",
      "methode",
      "aptitudes",
      "parcours",
      "projets",
      "contact",
    ]);
  });

  it("part du gris et utilise des ambiances existantes", () => {
    expect(sections[0].stage).toBe("gris");
    sections.forEach((s) => expect(palettes[s.stage]).toBeDefined());
  });

  it("ne nomme jamais les couleurs dans les textes des sections", () => {
    const words = /\b(gris|rouge|vert|bleu|jaune|couleurs?)\b/i;
    sections.forEach((s) => {
      expect(s.title).not.toMatch(words);
      expect(s.intro).not.toMatch(words);
    });
  });

  it("déclare des couleurs lisibles", () => {
    Object.values(palettes).forEach((p) => Object.values(p).forEach((c) => expect(() => parseColor(c)).not.toThrow()));
  });

  it("référence uniquement des icônes existantes", () => {
    [...sections, ...specs, ...profiles].forEach((item) => expect(icons[item.icon]).toBeDefined());
  });

  it("a une seule étape en cours, des projets uniques et deux profils outillés", () => {
    expect(careerNodes.filter((n) => n.kind === "current")).toHaveLength(1);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(profiles.map((p) => p.id)).toEqual(["design", "dev"]);
    profiles.forEach((p) => {
      expect(p.skills.length).toBeGreaterThan(0);
      expect(new Set(p.tools.map((t) => t.brand)).size).toBe(p.tools.length);
    });
  });
});
