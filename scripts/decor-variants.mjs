// Versions allégées des images affichées sur téléphone (à relancer après avoir régénéré les décors ou le portrait) :
//   public/decor/{scène}-portrait-{540,810}.{avif,webp}   décors pré-rendus, choisis par le navigateur selon l'écran (srcset)
//   public/decor/mini/{scène}.webp                        pochette du lecteur de musique (48 px affichés)
//   public/portrait-360.webp                              photo du profil, pour les petits écrans
// Usage : node scripts/decor-variants.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const pub = path.join(process.cwd(), "public");
const decor = path.join(pub, "decor");
const mini = path.join(decor, "mini");
fs.mkdirSync(mini, { recursive: true });

let count = 0;
for (const f of fs.readdirSync(decor).filter((f) => /^[a-z]+-portrait\.webp$/.test(f))) {
  const id = f.replace("-portrait.webp", "");
  const src = path.join(decor, f);
  for (const w of [540, 810]) {
    // Mêmes réglages que les originaux : AVIF qualité 55 (le grain du pigment reste), WebP qualité 80
    await sharp(src).resize({ width: w }).avif({ quality: 55, effort: 6 }).toFile(path.join(decor, `${id}-portrait-${w}.avif`));
    await sharp(src).resize({ width: w }).webp({ quality: 80 }).toFile(path.join(decor, `${id}-portrait-${w}.webp`));
    count += 2;
  }
  // Pochette : le même cadrage que la pochette actuelle (carré placé à 70 % de la hauteur), 144 px pour les écrans haute densité
  const { width, height } = await sharp(src).metadata();
  await sharp(src)
    .extract({ left: 0, top: Math.round((height - width) * 0.7), width, height: width })
    .resize(144)
    .webp({ quality: 78 })
    .toFile(path.join(mini, `${id}.webp`));
  count += 1;
}
await sharp(path.join(pub, "portrait.webp")).resize({ width: 360 }).webp({ quality: 82 }).toFile(path.join(pub, "portrait-360.webp"));
console.log(`${count + 1} images générées`);
