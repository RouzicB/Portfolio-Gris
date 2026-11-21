// Génère la bannière LinkedIn à partir de scripts/linkedin/banner.html, avec le Chrome installé sur la machine :
//   scripts/linkedin/banniere-linkedin.png   3168 × 792 (double du format LinkedIn 1584 × 396, net sur écran haute densité)
// Usage : node scripts/linkedin/build.mjs   (chemin de Chrome : variable CHROME, sinon les emplacements habituels)
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
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

const out = resolve(here, "banniere-linkedin.png");
execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--virtual-time-budget=4000",
    "--hide-scrollbars",
    "--window-size=1584,396",
    "--force-device-scale-factor=2",
    `--screenshot=${out}`,
    pathToFileURL(resolve(here, "banner.html")).href,
  ],
  { stdio: ["ignore", "ignore", "ignore"] },
);
console.log("Bannière : scripts/linkedin/banniere-linkedin.png");
