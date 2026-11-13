import { render, screen } from "@testing-library/react";
import CreditsLink from "@/app/components/layouts/CreditsLink";
import CreditsPage from "@/app/components/credits/CreditsPage";
import { credits } from "@/app/data/site";

const mockPath = { value: "/" };
jest.mock("next/navigation", () => ({ usePathname: () => mockPath.value }));

describe("Crédits", () => {
  it("affiche un lien discret vers /credits", () => {
    mockPath.value = "/";
    render(<CreditsLink />);
    expect(screen.getByRole("link", { name: /Crédits/ })).toHaveAttribute("href", "/credits");
  });

  it("masque le lien sur la page des crédits", () => {
    mockPath.value = "/credits";
    const { container } = render(<CreditsLink />);
    expect(container).toBeEmptyDOMElement();
  });

  it("crédite la direction artistique sur sa page", () => {
    render(<CreditsPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Crédits" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: credits.game.title })).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(credits.game.studio)).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Revenir au voyage/ })).toHaveAttribute("href", "/");
  });
});
