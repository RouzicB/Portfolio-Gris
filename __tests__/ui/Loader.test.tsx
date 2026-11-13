import { render, screen } from "@testing-library/react";
import PageLoader from "@/app/components/ui/PageLoader";
import Template from "@/app/template";

describe("Écran de chargement", () => {
  it("annonce le chargement et dessine l'emblème", () => {
    const { container } = render(<PageLoader />);
    expect(screen.getByRole("status", { name: "Chargement" })).toHaveClass("page-loader");
    expect(container.querySelector(".emblem-draw")).not.toBeNull();
    expect(container.querySelector(".emblem-orbit")).not.toBeNull();
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
