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
    expect(screen.getAllByRole("button")).toHaveLength(7);
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
});
