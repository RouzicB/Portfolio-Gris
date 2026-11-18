import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { motionValue } from "framer-motion";
import Projets from "@/app/components/sections/Projets";
import { JourneyContext } from "@/app/components/journey/JourneyContext";
import { projects, toCard } from "@/app/data/projects";

const renderGallery = () =>
  render(
    <JourneyContext.Provider value={{ active: 5, progress: motionValue(5), goTo: jest.fn() }}>
      <Projets cards={projects.map(toCard)} />
    </JourneyContext.Provider>,
  );

describe("Projets (galerie d'arches)", () => {
  it("compte plus de quatre études de cas, triées de la plus récente à la plus ancienne", () => {
    expect(projects.length).toBeGreaterThan(4);
    const years = projects.map((p) => p.year);
    expect([...years].sort((a, b) => b - a)).toEqual(years);
  });

  it("n'affiche qu'une page de la galerie à la fois et la parcourt", async () => {
    renderGallery();
    // Trois arches visibles par défaut : les autres sont inertes et absentes de l'arbre d'accessibilité
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: new RegExp(projects[0].title) })).toHaveAttribute("href", `/projets/${projects[0].slug}`);
    expect(screen.getByRole("button", { name: "Projets précédents" })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Projets suivants" }));
    expect(screen.getByRole("link", { name: new RegExp(projects[3].title) })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: new RegExp(projects[0].title) })).toBeNull();
    expect(screen.getByRole("button", { name: /Page 2 sur/ })).toHaveAttribute("aria-current", "page");
  });
});
