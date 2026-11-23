// Version allégée de la photo du profil, pour les petits écrans :
//   public/portrait-360.webp   (la photo s'y affiche en ~150 px)
// Les décors, eux, sont peints et déclinés par scripts/decor/bake.mjs.
// Usage : node scripts/decor-variants.mjs
import path from "node:path";
import sharp from "sharp";

const pub = path.join(process.cwd(), "public");
await sharp(path.join(pub, "portrait.webp")).resize({ width: 360 }).webp({ quality: 82 }).toFile(path.join(pub, "portrait-360.webp"));
console.log("1 image générée");
