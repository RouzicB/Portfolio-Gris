// Décors pré-rendus : une version AVIF (~60 % plus légère, grain conservé) à côté de chaque WebP de public/decor.
// À relancer après avoir régénéré les WebP des décors : node scripts/decor-avif.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = path.join(process.cwd(), "public", "decor");
let before = 0;
let after = 0;
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".webp"))) {
  const src = path.join(dir, f);
  const out = src.replace(/\.webp$/, ".avif");
  // Qualité 55 : en dessous, le grain du pigment commence à se lisser
  await sharp(src).avif({ quality: 55, effort: 6 }).toFile(out);
  before += fs.statSync(src).size;
  after += fs.statSync(out).size;
}
console.log(`décors : ${Math.round(before / 1024)} Ko en WebP → ${Math.round(after / 1024)} Ko en AVIF`);
