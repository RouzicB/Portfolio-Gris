// Génère, avec le Chrome installé sur la machine :
//   scripts/linkedin/banniere-linkedin.png   bannière LinkedIn (banner.html), 3168 × 792 : double du format 1584 × 396
//   app/opengraph-image.png, app/twitter-image.png   image de partage du site (og.html), 1200 × 630
// Usage : node scripts/linkedin/build.mjs   (chemin de Chrome : variable CHROME, sinon les emplacements habituels)
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const chrome = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
]
  .filter(Boolean)
  .find((p) => existsSync(p));
if (!chrome) throw new Error("Chrome introuvable : indiquez son chemin dans la variable CHROME.");

// Dossier actuel des décors peints : son nom change à chaque nouveau dessin (scripts/decor/bake.mjs)
const decorDir = readFileSync(resolve(here, "../../app/lib/decor-dir.ts"), "utf8").match(/DECOR_DIR = "([^"]+)"/)[1];

// La page est copiée à côté de l'originale (mêmes chemins relatifs), le dossier des décors renseigné, puis effacée
const shoot = (page, out, [w, h], scale) => {
  const tmp = resolve(here, `.rendu-${page}`);
  writeFileSync(tmp, readFileSync(resolve(here, page), "utf8").replaceAll("{{DECOR}}", decorDir));
  try {
    execFileSync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--allow-file-access-from-files",
        "--virtual-time-budget=4000",
        "--hide-scrollbars",
        `--window-size=${w},${h}`,
        `--force-device-scale-factor=${scale}`,
        `--screenshot=${out}`,
        pathToFileURL(tmp).href,
      ],
      { stdio: ["ignore", "ignore", "ignore"] },
    );
  } finally {
    rmSync(tmp, { force: true });
  }
};

shoot("banner.html", resolve(here, "banniere-linkedin.png"), [1584, 396], 2);
console.log("Bannière : scripts/linkedin/banniere-linkedin.png");
const og = resolve(here, "../../app/opengraph-image.png");
shoot("og.html", og, [1200, 630], 1);
copyFileSync(og, resolve(here, "../../app/twitter-image.png"));
console.log("Image de partage : app/opengraph-image.png, app/twitter-image.png");
