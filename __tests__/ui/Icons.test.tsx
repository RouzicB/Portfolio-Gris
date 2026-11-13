import { render, screen } from "@testing-library/react";
import { AccueilIcon, CloseIcon, iconGallery } from "@/app/components/icons/GrisIcons";

describe("GrisIcons", () => {
  it("est décorative par défaut", () => {
    const { container } = render(<CloseIcon />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("devient une image avec un titre", () => {
    render(<AccueilIcon title="Accueil" size={32} />);
    const img = screen.getByRole("img", { name: "Accueil" });
    expect(img).toHaveAttribute("width", "32");
  });

  it("porte la goutte d'aquarelle sur les icônes de section", () => {
    const { container } = render(<AccueilIcon />);
    expect(container.querySelector('g[fill="var(--accent)"]')).not.toBeNull();
  });

  it("expose une galerie sans doublon", () => {
    const names = iconGallery.map((i) => i.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
