import { moundSurface } from "@/app/components/background/art/shared";

describe("moundSurface", () => {
  const surface = moundSurface(-80, 1680, 940, 770, 0);

  it("touche le sol aux extrémités et culmine au sommet", () => {
    expect(surface(-80)).toBeCloseTo(940, 0);
    expect(surface(1680)).toBeCloseTo(940, 0);
    expect(surface(800)).toBeCloseTo(770, 0);
  });

  it("descend vers les bords (l'herbe suit la courbe)", () => {
    expect(surface(100)).toBeGreaterThan(surface(400));
    expect(surface(1500)).toBeGreaterThan(surface(1200));
  });
});
