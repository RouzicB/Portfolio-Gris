import { careerNodes } from "@/app/data/career";
import { convictions } from "@/app/data/convictions";
import { projects } from "@/app/data/projects";
import { site } from "@/app/data/site";
import { personJsonLd, portfolioMarkdown, projectJsonLd } from "@/app/lib/machine-readable";

describe("Portfolio lisible par les IA", () => {
  it("donne tout le contenu en texte, y compris ce que l'interface ne montre qu'au clic", () => {
    const md = portfolioMarkdown(false);
    expect(md).toContain(site.name);
    expect(md).toContain(site.email);
    convictions.forEach((c) => expect(md).toContain(c.text));
    careerNodes.filter((n) => n.kind !== "future").forEach((n) => expect(md).toContain(n.text));
    projects.forEach((p) => expect(md).toContain(`/projets/${p.slug}`));
  });

  it("détaille chaque étude de cas dans la version complète", () => {
    const full = portfolioMarkdown(true);
    projects.forEach((p) => {
      expect(full).toContain(p.problem);
      p.learnings.forEach((l) => expect(full).toContain(l));
      p.book?.pages.forEach((pg) => expect(full).toContain(pg.title));
    });
  });

  it("produit des données structurées schema.org valides", () => {
    const home = JSON.parse(JSON.stringify(personJsonLd()));
    const person = home["@graph"].find((n: { "@type": string }) => n["@type"] === "Person");
    expect(person.name).toBe(site.name);
    expect(person.email).toBe(`mailto:${site.email}`);
    expect(home["@graph"].filter((n: { "@type": string }) => n["@type"] === "CreativeWork")).toHaveLength(projects.length);
    expect(projectJsonLd(projects[0])["@context"]).toBe("https://schema.org");
  });

  it("n'annonce pas les réseaux encore vides (simple page d'accueil du réseau)", () => {
    const md = portfolioMarkdown(false);
    expect(md).not.toMatch(/: https:\/\/www\.linkedin\.com\/\n/);
  });
});
