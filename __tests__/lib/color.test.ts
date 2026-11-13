import { mixColor, mixPalette, parseColor } from "@/app/lib/color";
import { palettes } from "@/app/data/palettes";

describe("lib/color", () => {
  it("lit l'hexadécimal et le rgba", () => {
    expect(parseColor("#ff8000")).toEqual([255, 128, 0, 1]);
    expect(parseColor("rgba(10, 20, 30, 0.5)")).toEqual([10, 20, 30, 0.5]);
    expect(() => parseColor("bleu")).toThrow();
  });

  it("mélange deux couleurs", () => {
    expect(mixColor("#000000", "#ffffff", 0.5)).toBe("rgba(128, 128, 128, 1)");
    expect(mixColor("rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", 0.25)).toBe("rgba(0, 0, 0, 0.25)");
  });

  it("rend les palettes d'origine aux extrémités", () => {
    expect(mixPalette(palettes.gris, palettes.rouge, 0)).toEqual(palettes.gris);
    expect(mixPalette(palettes.gris, palettes.rouge, 1)).toEqual(palettes.rouge);
    expect(mixPalette(palettes.gris, palettes.rouge, 0.5).ink).toMatch(/^rgba\(/);
  });
});
