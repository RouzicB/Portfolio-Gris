import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { motionValue } from "framer-motion";
import SectionNav from "@/app/components/journey/SectionNav";
import { JourneyControlsContext } from "@/app/components/journey/JourneyContext";

/** La navigation lit la section visée sur les commandes du voyage (connue dès le geste) */
const controls = (active: number, goTo: jest.Mock = jest.fn()) => ({
  progress: motionValue(active),
  goTo,
  getActive: () => active,
  onActivate: () => () => {},
});

describe("SectionNav", () => {
  it("marque la section courante", () => {
    render(
      <JourneyControlsContext.Provider value={controls(2)}>
        <SectionNav />
      </JourneyControlsContext.Provider>,
    );
    // 7 sections + flèches monter / descendre
    expect(screen.getAllByRole("button")).toHaveLength(9);
    expect(screen.getByRole("button", { name: "Méthode" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("button", { name: "Profil" })).not.toHaveAttribute("aria-current");
  });

  it("navigue vers la section demandée", async () => {
    const goTo = jest.fn();
    render(
      <JourneyControlsContext.Provider value={controls(0, goTo)}>
        <SectionNav />
      </JourneyControlsContext.Provider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Contact" }));
    expect(goTo).toHaveBeenCalledWith(6);
  });

  it("monte et descend d'une section avec les flèches, désactivées aux extrémités", async () => {
    const goTo = jest.fn();
    const { rerender } = render(
      <JourneyControlsContext.Provider value={controls(3, goTo)}>
        <SectionNav />
      </JourneyControlsContext.Provider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Section précédente" }));
    expect(goTo).toHaveBeenLastCalledWith(2);
    await userEvent.click(screen.getByRole("button", { name: "Section suivante" }));
    expect(goTo).toHaveBeenLastCalledWith(4);

    rerender(
      <JourneyControlsContext.Provider value={controls(0, goTo)}>
        <SectionNav />
      </JourneyControlsContext.Provider>,
    );
    expect(screen.getByRole("button", { name: "Section précédente" })).toBeDisabled();
    rerender(
      <JourneyControlsContext.Provider value={controls(6, goTo)}>
        <SectionNav />
      </JourneyControlsContext.Provider>,
    );
    expect(screen.getByRole("button", { name: "Section suivante" })).toBeDisabled();
  });
});
