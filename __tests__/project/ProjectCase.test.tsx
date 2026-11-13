import { render, screen } from "@testing-library/react";
import ProjectCase from "@/app/components/project/ProjectCase";
import { adjacentProjects, projects } from "@/app/data/projects";
import { palettes } from "@/app/data/palettes";

describe("Pages projet", () => {
  it("relie chaque projet au précédent et au suivant, en boucle", () => {
    const first = adjacentProjects(projects[0].slug)!;
    expect(first.index).toBe(0);
    expect(first.prev.slug).toBe(projects[projects.length - 1].slug);
    expect(first.next.slug).toBe(projects[1].slug);
    expect(adjacentProjects("inconnu")).toBeNull();
  });

  it("donne à chaque projet une ambiance et une démarche", () => {
    projects.forEach((p) => {
      expect(palettes[p.stage]).toBeDefined();
      expect(p.process.length).toBeGreaterThan(0);
    });
  });

  it("affiche l'étude de cas complète et la navigation", () => {
    const p = projects[1];
    render(<ProjectCase slug={p.slug} />);
    expect(screen.getByRole("heading", { level: 1, name: p.title })).toBeInTheDocument();
    expect(screen.getByText(p.problem)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Démarche" })).toBeInTheDocument();
    p.process.forEach((s) => expect(screen.getByText(s.title)).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /Projets/ })).toHaveAttribute("href", "/#section-projets");
    expect(screen.getByRole("link", { name: /Projet suivant/ })).toHaveAttribute("href", `/projets/${projects[2].slug}`);
  });
});
