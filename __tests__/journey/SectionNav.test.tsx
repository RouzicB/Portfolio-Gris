import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { motionValue } from "framer-motion";
import SectionNav from "@/app/components/journey/SectionNav";
import { JourneyContext } from "@/app/components/journey/JourneyContext";

describe("SectionNav", () => {
  it("marque la section courante", () => {
    render(
      <JourneyContext.Provider value={{ active: 2, progress: motionValue(2), goTo: jest.fn() }}>
        <SectionNav />
      </JourneyContext.Provider>,
    );
    // 7 sections + flèches monter / descendre
    expect(screen.getAllByRole("button")).toHaveLength(9);
    expect(screen.getByRole("button", { name: "Méthode" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("button", { name: "Profil" })).not.toHaveAttribute("aria-current");
  });

  it("navigue vers la section demandée", async () => {
    const goTo = jest.fn();
    render(
      <JourneyContext.Provider value={{ active: 0, progress: motionValue(0), goTo }}>
        <SectionNav />
      </JourneyContext.Provider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Contact" }));
    expect(goTo).toHaveBeenCalledWith(6);
  });

  it("monte et descend d'une section avec les flèches, désactivées aux extrémités", async () => {
    const goTo = jest.fn();
    const { rerender } = render(
      <JourneyContext.Provider value={{ active: 3, progress: motionValue(3), goTo }}>
        <SectionNav />
      </JourneyContext.Provider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Section précédente" }));
    expect(goTo).toHaveBeenLastCalledWith(2);
    await userEvent.click(screen.getByRole("button", { name: "Section suivante" }));
    expect(goTo).toHaveBeenLastCalledWith(4);

    rerender(
      <JourneyContext.Provider value={{ active: 0, progress: motionValue(0), goTo }}>
        <SectionNav />
      </JourneyContext.Provider>,
    );
    expect(screen.getByRole("button", { name: "Section précédente" })).toBeDisabled();
    rerender(
      <JourneyContext.Provider value={{ active: 6, progress: motionValue(6), goTo }}>
        <SectionNav />
      </JourneyContext.Provider>,
    );
    expect(screen.getByRole("button", { name: "Section suivante" })).toBeDisabled();
  });
});
