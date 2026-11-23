import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { motionValue } from "framer-motion";
import Projets from "@/app/components/sections/Projets";
import { JourneyContext } from "@/app/components/journey/JourneyContext";
import { projects, toCard } from "@/app/data/projects";

const design = projects.filter((p) => p.category === "design");
const dev = projects.filter((p) => p.category === "dev");

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

  it("ouvre sur le chapitre design et parcourt la galerie une page à la fois", async () => {
    renderGallery();
    // Trois arches visibles : l'ouverture du chapitre I (sans lien) et les deux premières études de design
    expect(screen.getByText("Chapitre I")).toBeInTheDocument();
    expect(screen.getAllByRole("link").map((l) => l.getAttribute("href"))).toEqual(design.slice(0, 2).map((p) => `/projets/${p.slug}`));
    expect(screen.getByRole("button", { name: "Projets précédents" })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Projets suivants" }));
    expect(screen.getAllByRole("link").map((l) => l.getAttribute("href"))).toEqual(design.slice(2, 5).map((p) => `/projets/${p.slug}`));
    expect(screen.getByRole("button", { name: /Page 2 sur/ })).toHaveAttribute("aria-current", "page");
  });

  it("montre les deux familles dans la frise, et mène au chapitre développement", async () => {
    expect(design.length).toBeGreaterThan(0);
    expect(dev.length).toBe(2);
    renderGallery();
    expect(screen.queryByRole("tab")).toBeNull();
    const frise = within(screen.getByRole("list", { name: "Chapitres et pages" }));
    expect(frise.getByRole("button", { name: "Design & UX/UI" })).toHaveAttribute("aria-current", "true");
    await userEvent.click(frise.getByRole("button", { name: "Développement" }));
    expect(screen.getByText("Chapitre II")).toBeInTheDocument();
    expect(screen.getAllByRole("link").map((l) => l.getAttribute("href"))).toEqual(dev.map((p) => `/projets/${p.slug}`));
    expect(frise.getByRole("button", { name: "Développement" })).toHaveAttribute("aria-current", "true");
  });
});
