import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { motionValue } from "framer-motion";
import Parcours from "@/app/components/sections/Parcours";
import { JourneyContext } from "@/app/components/journey/JourneyContext";
import { careerChapters, careerEdges, careerNodes } from "@/app/data/career";
import { COL_W, canvasSize, edgePath, flowLayout, isTaken, nodeBox } from "@/app/lib/flowchart";

describe("Parcours (arborescence horizontale)", () => {
  it("relie uniquement des étapes existantes et avance de gauche à droite", () => {
    const ids = new Set(careerNodes.map((n) => n.id));
    careerEdges.forEach((e) => {
      expect(ids.has(e.from)).toBe(true);
      expect(ids.has(e.to)).toBe(true);
      const a = careerNodes.find((n) => n.id === e.from)!;
      const b = careerNodes.find((n) => n.id === e.to)!;
      expect(b.col).toBeGreaterThanOrEqual(a.col);
    });
  });

  it("suit l'ordre du parcours réel", () => {
    const order = ["bac", "but-tronc", "but-dev", "sesa", "chu", "mastere", "renault"];
    const cols = order.map((id) => careerNodes.find((n) => n.id === id)!.col);
    expect([...cols].sort((x, y) => x - y)).toEqual(cols);
    expect(careerNodes.find((n) => n.id === "renault")!.kind).toBe("current");
  });

  it("place les chapitres sur des colonnes existantes", () => {
    const maxCol = Math.max(...careerNodes.map((n) => n.col));
    careerChapters.forEach((c) => {
      expect(c.cols[0]).toBeLessThanOrEqual(c.cols[1]);
      expect(c.cols[1]).toBeLessThanOrEqual(maxCol);
    });
  });

  it("calcule la géométrie des liens", () => {
    const a = nodeBox({ col: 0, row: 0 });
    const b = nodeBox({ col: 1, row: 1 });
    expect(b.x).toBe(COL_W);
    expect(edgePath(a, b).startsWith(`M${a.x + a.w} `)).toBe(true);
    expect(edgePath(a, nodeBox({ col: 0, row: 1 }))).toMatch(/^M\d+ \d+ V\d+$/);
    expect(canvasSize(careerNodes).width).toBeLessThanOrEqual(1200);
    expect(isTaken("locked")).toBe(false);
    expect(isTaken("current")).toBe(true);
  });

  it("se pose à la verticale sur téléphone : le temps descend, sans chevauchement", () => {
    const v = flowLayout(careerNodes, careerChapters, "vertical");
    expect(v.size.width).toBeLessThanOrEqual(360);
    careerEdges.forEach((e) => {
      const a = v.nodeBox(careerNodes.find((n) => n.id === e.from)!);
      const b = v.nodeBox(careerNodes.find((n) => n.id === e.to)!);
      expect(b.y).toBeGreaterThanOrEqual(a.y);
    });
    const boxes = careerNodes.map((n) => v.nodeBox(n));
    boxes.forEach((p, i) =>
      boxes.slice(i + 1).forEach((q) => {
        const overlap = p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h;
        expect(overlap).toBe(false);
      }),
    );
  });

  it("affiche le détail de l'étape choisie", async () => {
    render(
      <JourneyContext.Provider value={{ active: 4, progress: motionValue(4), goTo: jest.fn() }}>
        <Parcours />
      </JourneyContext.Provider>,
    );
    // Par défaut : l'étape en cours
    expect(screen.getByRole("heading", { level: 3, name: /Dév full-stack/ })).toBeInTheDocument();
    expect(screen.getByText("Renault Group · applications")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Bac général/ }));
    expect(await screen.findByRole("heading", { level: 3, name: "Bac général" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Bac général/ })).toHaveAttribute("aria-pressed", "true");
  });
});
