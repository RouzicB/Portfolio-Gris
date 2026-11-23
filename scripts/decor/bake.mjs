// Peint les décors du site en images (scènes dessinées dans scripts/decor/scenes/, outils dans paint.mjs).
// Chaque scène est rendue par le Chrome de la machine, sur fond transparent (le ciel et l'astre restent dessinés par la
// page, derrière), puis déclinée en AVIF et WebP à plusieurs largeurs :
//   public/decor/{empreinte}/{scène}-wide-{1600,2400,3200}.{avif,webp}     écrans plus larges que hauts (cadre entier 1600 × 900)
//   public/decor/{empreinte}/{scène}-portrait-{540,810,1080,1440}.{avif,webp}   écrans en hauteur (centre du cadre, 560 × 900)
//   public/decor/{empreinte}/mini/{scène}.webp                              pochette du lecteur de musique
// Les images sont gardées un an par les navigateurs (next.config.ts). Le dossier porte donc une empreinte du contenu :
// si une image change, le dossier est renommé et app/lib/decor-dir.ts réécrit, et les visiteurs reçoivent le nouveau décor.
//
// Usage : node scripts/decor/bake.mjs [scènes…]               images finales (toutes les scènes par défaut)
//         node scripts/decor/bake.mjs --preview <dossier> [scènes…]   aperçus sur leur ciel, pour juger le dessin
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import { svgDocument } from "./paint.mjs";
import { palettes, stageSuns } from "../../app/data/palettes.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
// Dossier actuel des décors (les scènes non repeintes y restent)
const DIR_FILE = resolve(root, "app/lib/decor-dir.ts");
const currentDir = readFileSync(DIR_FILE, "utf8").match(/DECOR_DIR = "([^"]+)"/)[1];
const OUT = resolve(root, "public" + currentDir);
const IDS = ["gris", "rouge", "vert", "bleu", "jaune", "ciel", "lune"];

const args = process.argv.slice(2);
const previewAt = args.indexOf("--preview");
const previewDir = previewAt >= 0 ? resolve(args[previewAt + 1]) : null;
const wanted = args.filter((a, i) => !a.startsWith("--") && (previewAt < 0 || i !== previewAt + 1));
const ids = wanted.length ? wanted : IDS;

const candidates = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
];
const chrome = candidates.find((p) => p && existsSync(p));
if (!chrome) throw new Error("Chrome introuvable : indiquez son chemin dans la variable CHROME.");

const work = mkdtempSync(join(tmpdir(), "decor-"));

/** Capture d'une page HTML par Chrome, à la taille exacte demandée (fond transparent) */
function shoot(html, width, height, png) {
  const file = join(work, `page-${width}x${height}.html`);
  writeFileSync(file, html);
  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--default-background-color=00000000",
      "--virtual-time-budget=8000",
      `--window-size=${width},${height}`,
      `--screenshot=${png}`,
      pathToFileURL(file).href,
    ],
    { stdio: ["ignore", "ignore", "ignore"], timeout: 180000 },
  );
}

const page = (inner, width, height, background = "transparent") =>
  `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:${background}}svg{display:block}</style>${inner}`;

async function render(id) {
  const { default: scene, SEED } = await import(pathToFileURL(join(here, "scenes", `${id}.mjs`)).href);
  return (viewBox, width, height) => {
    // Le cadrage portrait (téléphones) ne montre que le centre : une scène peut y replacer un élément coupé
    const { body, defs } = scene({ portrait: viewBox !== "0 0 1600 900" });
    return svgDocument({ body, defs, seed: SEED, viewBox, width, height });
  };
}

if (previewDir) {
  // Aperçu : la scène sur son ciel, avec l'astre et le grain du papier, comme sur le site (écran 1600 × 900)
  mkdirSync(previewDir, { recursive: true });
  for (const id of ids) {
    const draw = await render(id);
    const p = palettes[id];
    const sun = stageSuns[id];
    const W = 1600;
    const H = 900;
    const sunHtml = sun.size
      ? `<div style="position:absolute;left:${sun.x}%;top:${sun.y}%;width:${sun.size}px;height:${sun.size}px;transform:translate(-50%,-50%)">
          <div style="position:absolute;inset:-170px;border-radius:50%;background:radial-gradient(circle closest-side, color-mix(in srgb, ${p.sun} 45%, transparent) 25%, color-mix(in srgb, ${p.sun} 18%, transparent) 60%, transparent 100%)"></div>
          <div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle, ${p.sun} 0%, ${p.sun} 52%, transparent 71%)"></div></div>`
      : "";
    const html = page(
      `<div style="position:relative;width:${W}px;height:${H}px;background:linear-gradient(180deg, ${p.skyTop}, ${p.skyBottom})">${sunHtml}
        <div style="position:absolute;inset:0">${draw("0 0 1600 900", W, H)}</div></div>`,
      W,
      H,
      p.skyBottom,
    );
    const png = join(previewDir, `${id}.png`);
    shoot(html, W, H, png);
    // Cadrage téléphone : le centre du cadre
    const mob = join(previewDir, `${id}-mobile.png`);
    await sharp(png).extract({ left: 520, top: 0, width: 560, height: 900 }).toFile(mob);
    console.log(png);
  }
} else {
  mkdirSync(join(OUT, "mini"), { recursive: true });
  sharp.cache(false);
  for (const id of ids) {
    const draw = await render(id);
    // Cadre entier, rendu une fois en grand puis réduit (le grain du pigment reste fin)
    const wide = join(work, `${id}-wide.png`);
    shoot(page(draw("0 0 1600 900", 3200, 1800), 3200, 1800), 3200, 1800, wide);
    for (const w of [3200, 2400, 1600]) {
      await sharp(wide).resize({ width: w }).avif({ quality: 52, effort: 6 }).toFile(join(OUT, `${id}-wide-${w}.avif`));
      await sharp(wide).resize({ width: w }).webp({ quality: 80, alphaQuality: 90 }).toFile(join(OUT, `${id}-wide-${w}.webp`));
    }
    // Centre du cadre pour les écrans en hauteur (560 × 900 : la forme d'un téléphone, à peine plus large), rendu à 1440 px
    const portrait = join(work, `${id}-portrait.png`);
    const PW = 1440;
    const ph = Math.round((PW * 900) / 560);
    shoot(page(draw("520 0 560 900", PW, ph), PW, ph), PW, ph, portrait);
    for (const w of [1440, 1080, 810, 540]) {
      await sharp(portrait).resize({ width: w }).avif({ quality: 52, effort: 6 }).toFile(join(OUT, `${id}-portrait-${w}.avif`));
      await sharp(portrait).resize({ width: w }).webp({ quality: 80, alphaQuality: 90 }).toFile(join(OUT, `${id}-portrait-${w}.webp`));
    }
    // Pochette du lecteur : un carré pris à 70 % de la hauteur du cadrage portrait, posé sur le ciel de la scène
    const p = palettes[id];
    const top = Math.round((ph - PW) * 0.7);
    const square = await sharp(portrait).extract({ left: 0, top, width: PW, height: PW }).resize(144).png().toBuffer();
    const sky = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.skyTop}"/><stop offset="1" stop-color="${p.skyBottom}"/></linearGradient></defs><rect width="144" height="144" fill="url(#s)"/></svg>`,
    );
    await sharp(sky).composite([{ input: square }]).webp({ quality: 80 }).toFile(join(OUT, "mini", `${id}.webp`));
    console.log(`${id} : peint`);
  }
  // Empreinte de toutes les images : un nouveau nom de dossier dès que l'une d'elles change
  const files = [...readdirSync(OUT).filter((f) => f.includes(".")), ...readdirSync(join(OUT, "mini")).map((f) => `mini/${f}`)].sort();
  const hash = createHash("sha256");
  for (const f of files) hash.update(f).update(readFileSync(join(OUT, f)));
  const nextDir = `/decor/${hash.digest("hex").slice(0, 10)}`;
  if (nextDir !== currentDir) {
    renameSync(OUT, resolve(root, "public" + nextDir));
    writeFileSync(DIR_FILE, readFileSync(DIR_FILE, "utf8").replace(currentDir, nextDir));
    console.log(`décors rangés dans public${nextDir} (app/lib/decor-dir.ts mis à jour)`);
  }
}
rmSync(work, { recursive: true, force: true });
