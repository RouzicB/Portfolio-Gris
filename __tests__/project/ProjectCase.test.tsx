import { render, screen } from "@testing-library/react";
import ProjectCase from "@/app/components/project/ProjectCase";
import { adjacentProjects, projects, toCard } from "@/app/data/projects";
import { palettes } from "@/app/data/palettes";

const design = projects.filter((p) => p.category === "design");
const navFor = (slug: string) => {
  const nav = adjacentProjects(slug)!;
  return { index: nav.index, total: nav.total, prev: { ...toCard(nav.prev.project), index: nav.prev.index }, next: { ...toCard(nav.next.project), index: nav.next.index } };
};

describe("Pages projet", () => {
  it("relie chaque projet au précédent et au suivant de sa galerie, en boucle", () => {
    const first = adjacentProjects(design[0].slug)!;
    expect(first.index).toBe(0);
    expect(first.total).toBe(design.length);
    expect(first.prev.project.slug).toBe(design[design.length - 1].slug);
    expect(first.next.project.slug).toBe(design[1].slug);
    projects.forEach((p) => {
      const nav = adjacentProjects(p.slug)!;
      expect(nav.prev.project.category).toBe(p.category);
      expect(nav.next.project.category).toBe(p.category);
    });
    expect(adjacentProjects("inconnu")).toBeNull();
  });

  it("donne à chaque projet une ambiance, et une démarche aux études de design", () => {
    projects.forEach((p) => expect(palettes[p.stage]).toBeDefined());
    design.forEach((p) => expect(p.process.length).toBeGreaterThan(0));
  });

  it("affiche l'étude de cas complète et la navigation", () => {
    const p = design[1];
    render(<ProjectCase project={p} nav={navFor(p.slug)} />);
    expect(screen.getByRole("heading", { level: 1, name: p.title })).toBeInTheDocument();
    expect(screen.getByText(p.problem)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Démarche/ })).toBeInTheDocument();
    // Un intitulé d'étape peut aussi nommer une partie de l'univers graphique (« Logotype »…)
    p.process.forEach((s) => expect(screen.getAllByText(s.title).length).toBeGreaterThan(0));
    expect(screen.getByRole("link", { name: /Projets/ })).toHaveAttribute("href", "/#section-projets");
    expect(screen.getByRole("link", { name: /Projet suivant/ })).toHaveAttribute("href", `/projets/${design[2].slug}`);
  });

  it("n'affiche pas les chapitres d'une étude encore vide", () => {
    const empty = { ...design[0], slug: "vide", problem: "", solution: "", process: [], outcomes: [], learnings: [], tags: [], tools: [], duration: "", universe: undefined, book: undefined };
    render(<ProjectCase project={empty} nav={navFor(design[0].slug)} />);
    expect(screen.getByRole("heading", { level: 1, name: empty.title })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Démarche/ })).toBeNull();
    expect(screen.queryByRole("heading", { name: /Sommaire/ })).toBeNull();
    expect(screen.queryByText("Durée")).toBeNull();
  });
});
