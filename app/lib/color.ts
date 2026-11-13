import type { Palette } from "../types";

export type RGBA = [number, number, number, number];

/** Lit « #rrggbb » ou « rgba(r, g, b, a) » */
export function parseColor(value: string): RGBA {
  const v = value.trim();
  if (v.startsWith("#") && v.length === 7) {
    return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16), 1];
  }
  const m = v.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const [r, g, b, a = "1"] = m[1].split(",").map((s) => s.trim());
    return [Number(r), Number(g), Number(b), Number(a)];
  }
  throw new Error(`Couleur illisible : ${value}`);
}

/** Mélange deux couleurs (t = 0 → a, t = 1 → b) */
export function mixColor(a: string, b: string, t: number): string {
  const ca = parseColor(a);
  const cb = parseColor(b);
  const k = Math.min(Math.max(t, 0), 1);
  const [r, g, bl] = [0, 1, 2].map((i) => Math.round(ca[i] + (cb[i] - ca[i]) * k));
  const al = Math.round((ca[3] + (cb[3] - ca[3]) * k) * 1000) / 1000;
  return `rgba(${r}, ${g}, ${bl}, ${al})`;
}

/** Mélange deux palettes clé par clé */
export function mixPalette(a: Palette, b: Palette, t: number): Palette {
  const out = {} as Palette;
  (Object.keys(a) as (keyof Palette)[]).forEach((key) => {
    out[key] = t <= 0 ? a[key] : t >= 1 ? b[key] : mixColor(a[key], b[key], t);
  });
  return out;
}
