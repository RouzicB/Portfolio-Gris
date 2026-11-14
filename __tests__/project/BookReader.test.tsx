import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookReader from "@/app/components/project/BookReader";
import { charteSlift } from "@/app/data/charte-slift";

describe("Liseuse de document", () => {
  it("décrit toutes les pages et des chapitres qui existent", () => {
    expect(charteSlift.pages).toHaveLength(35);
    charteSlift.chapters.forEach((c) => {
      expect(c.page).toBeGreaterThanOrEqual(1);
      expect(c.page).toBeLessThanOrEqual(charteSlift.pages.length);
    });
  });

  it("tourne les pages aux flèches, au clavier et par chapitre", async () => {
    render(<BookReader book={charteSlift} />);
    expect(screen.getByRole("img", { name: /Page 1 : Couverture/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page précédente" })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Page suivante" }));
    expect(await screen.findByText(/Page 2 sur 35 : Sommaire/)).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("region", { name: charteSlift.title }), { key: "End" });
    expect(await screen.findByText(/Page 35 sur 35/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page suivante" })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Couleurs" }));
    expect(await screen.findByText(/Page 17 sur 35 : Couleurs/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Couleurs" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("button", { name: "Page 17 : Couleurs" })).toHaveAttribute("aria-current", "page");
  });
});
