import {
  anchorId,
  blendCurve,
  clampIndex,
  continuousIndex,
  cssVarName,
  paletteToVars,
  segment,
  stageWeights,
} from "@/app/lib/journey";
import { palettes } from "@/app/data/palettes";

describe("lib/journey", () => {
  it("borne l'index de section", () => {
    expect(clampIndex(-2, 8)).toBe(0);
    expect(clampIndex(3.4, 8)).toBe(3);
    expect(clampIndex(12, 8)).toBe(7);
    expect(clampIndex(2, 0)).toBe(0);
  });

  it("calcule une position continue entre les centres des sections", () => {
    const centers = [500, 1500, 2500];
    expect(continuousIndex(centers, 100)).toBe(0);
    expect(continuousIndex(centers, 1000)).toBeCloseTo(0.5);
    expect(continuousIndex(centers, 2000)).toBeCloseTo(1.5);
    expect(continuousIndex(centers, 9000)).toBe(2);
    expect(continuousIndex([], 10)).toBe(0);
  });

  it("garde la couleur posée près d'une section et fond sans à-coup entre deux", () => {
    expect(blendCurve(0.05)).toBe(0);
    expect(blendCurve(0.95)).toBe(1);
    expect(blendCurve(0.5)).toBeCloseTo(0.5);
    expect(blendCurve(0.4)).toBeLessThan(blendCurve(0.6));
  });

  it("découpe la position en segment", () => {
    expect(segment(2, 8)).toEqual({ from: 2, to: 3, t: 0 });
    expect(segment(7, 8)).toEqual({ from: 7, to: 7, t: 0 });
    expect(segment(2.5, 8).t).toBeCloseTo(0.5);
  });

  it("répartit le décor entre deux ambiances (somme = 1)", () => {
    const w = stageWeights(0.5, ["gris", "rouge", "rouge"]);
    expect((w.gris ?? 0) + (w.rouge ?? 0)).toBeCloseTo(1);
    expect(stageWeights(1.5, ["gris", "rouge", "rouge"]).rouge).toBeCloseTo(1);
  });

  it("convertit les clés de palette en variables CSS", () => {
    expect(cssVarName("skyTop")).toBe("--sky-top");
    const vars = paletteToVars(palettes.rouge);
    expect(vars["--accent"]).toBe(palettes.rouge.accent);
    expect(Object.keys(vars)).toHaveLength(Object.keys(palettes.rouge).length);
  });

  it("produit des ancres stables", () => {
    expect(anchorId("profil")).toBe("section-profil");
  });
});
