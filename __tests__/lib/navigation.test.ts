import { canScrollWithin, contentOpacity, gestureDirection, zoomScale } from "@/app/lib/journey";

describe("navigation section par section", () => {
  it("zoome dans la scène quittée et fait arriver la suivante du fond", () => {
    expect(zoomScale(0)).toBe(1);
    expect(zoomScale(1)).toBeCloseTo(1.45);
    expect(zoomScale(0.5)).toBeGreaterThan(1);
    expect(zoomScale(-0.5)).toBeLessThan(1);
    expect(zoomScale(-1)).toBeCloseTo(0.88);
    expect(zoomScale(3)).toBeCloseTo(1.45);
  });

  it("efface le contenu à mi-chemin", () => {
    expect(contentOpacity(0)).toBe(1);
    expect(contentOpacity(0.6)).toBe(0);
    expect(contentOpacity(-0.25)).toBeCloseTo(0.55);
  });

  it("traduit un geste en sens de navigation, au-delà d'un seuil", () => {
    expect(gestureDirection(10, 30)).toBe(0);
    expect(gestureDirection(45, 30)).toBe(1);
    expect(gestureDirection(-80, 30)).toBe(-1);
  });

  it("laisse défiler une section trop haute avant de changer de section", () => {
    const el = { scrollTop: 0, scrollHeight: 1400, clientHeight: 800 };
    expect(canScrollWithin(el, 1)).toBe(true);
    expect(canScrollWithin(el, -1)).toBe(false);
    expect(canScrollWithin({ ...el, scrollTop: 600 }, 1)).toBe(false);
    expect(canScrollWithin({ scrollTop: 0, scrollHeight: 800, clientHeight: 800 }, 1)).toBe(false);
  });
});
