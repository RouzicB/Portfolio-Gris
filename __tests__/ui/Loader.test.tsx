import { render, screen, waitFor } from "@testing-library/react";
import PageLoader from "@/app/components/ui/PageLoader";
import Template from "@/app/template";

// Le préchargement des autres pages passe par le routeur de Next
jest.mock("next/navigation", () => ({ useRouter: () => ({ prefetch: jest.fn() }) }));

describe("Écran de chargement", () => {
  it("annonce le chargement et dessine l'emblème", () => {
    const { container } = render(<PageLoader />);
    expect(screen.getByRole("status", { name: "Chargement" })).toHaveClass("page-loader");
    expect(container.querySelector(".emblem-draw")).not.toBeNull();
    expect(container.querySelector(".emblem-orbit")).not.toBeNull();
  });

  it("s'efface une fois la page prête", async () => {
    render(<PageLoader />);
    const loader = screen.getByRole("status", { name: "Chargement" });
    expect(loader).toHaveAttribute("aria-busy", "true");
    await waitFor(() => expect(loader).toHaveClass("is-done"), { timeout: 3000 });
    expect(loader).toHaveAttribute("aria-busy", "false");
  });

  it("est rejoué par le template de chaque page", () => {
    render(
      <Template>
        <p>contenu</p>
      </Template>,
    );
    expect(screen.getByText("contenu")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Chargement" })).toBeInTheDocument();
  });
});
