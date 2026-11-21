// Génère le CV à partir de scripts/cv/cv.html, avec le Chrome installé sur la machine :
//   public/cv-baptiste-rouzic.pdf            version numérique (fond bleu), celle que le site propose d'abord
//   public/cv-baptiste-rouzic-impression.pdf version imprimable (papier clair)
//   public/cv/cv-numerique.webp, cv-impression.webp   aperçus affichés sur la page /cv
// Prépare aussi le QR code personnalisé (qr.svg) et les images du CV (décors en JPEG légers, portrait en PNG transparent).
// Usage : node scripts/cv/build.mjs   (chemin de Chrome : variable CHROME, sinon les emplacements habituels)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import QRCode from "qrcode";
import sharp from "sharp";

/** Adresse du portfolio, encodée dans le QR code */
const SITE = "https://baptiste-rouzic.fr";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const publicDir = resolve(root, "public");
const previews = resolve(publicDir, "cv");
mkdirSync(previews, { recursive: true });

// ─── Images du CV : JPEG légers, transparence aplatie sur la couleur du papier ───
sharp.cache(false);
const flat = (file, out, bg, resize, quality = 74) =>
  sharp(resolve(publicDir, file)).flatten({ background: bg }).resize(resize).jpeg({ quality, mozjpeg: true }).toFile(resolve(here, out));
await Promise.all([
  flat("decor/gris-wide.webp", "decor.jpg", "#f3f2f0", { width: 1600 }, 72),
  flat("decor/bleu-wide.webp", "decor-bleu.jpg", "#0b2236", { width: 1600 }, 72),
]);
// Portrait : carré pris sur toute la largeur de la photo, visage au centre (ni zoomé ni décalé vers le haut).
// Fond transparent (PNG) : le portrait se pose directement sur le papier ou sur la nuit de la version numérique.
await sharp(resolve(publicDir, "portrait.webp"))
  .extract({ left: 0, top: 110, width: 720, height: 720 })
  .resize(560)
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(resolve(here, "portrait.png"));

// ─── QR code immersif ───
// Le QR code est un astre du décor : un disque de lumière (le soleil des scènes, la lune sur la version bleue),
// cerclé des anneaux de l'emblème avec sa pierre de clé et sa pierre en orbite. Les modules sont des points d'encre,
// les repères d'angle des anneaux arrondis, et le centre porte un losange de pigment (correction H, 30 %).
// Imprimable : encre sur un disque clair. Numérique : code blanc sur fond transparent.
function qrSvg(text, { disc, glow, ink, ring, accent }) {
  const qr = QRCode.create(text, { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const dark = (x, y) => qr.modules.get(y, x);
  const finders = [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ];
  const inFinder = (x, y) => finders.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
  const c0 = Math.floor(n / 2) - 2;
  const inLogo = (x, y) => x >= c0 && x < c0 + 5 && y >= c0 && y < c0 + 5;
  const dots = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (dark(x, y) && !inFinder(x, y) && !inLogo(x, y)) dots.push(`<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.46"/>`);
  for (const [fx, fy] of finders) {
    dots.push(`<rect x="${fx + 0.5}" y="${fy + 0.5}" width="6" height="6" rx="2" fill="none" stroke="${ink}" stroke-width="1"/>`);
    dots.push(`<rect x="${fx + 2}" y="${fy + 2}" width="3" height="3" rx="1"/>`);
  }
  const m = n / 2; // centre
  const R = m * Math.SQRT2 + 1.6; // disque : contient les coins du code avec une marge
  const cx = c0 + 2.5;
  const art = [
    // Halo et disque de lumière
    ...(disc ? [`<circle cx="${m}" cy="${m}" r="${R + 3.2}" fill="url(#halo)"/>`, `<circle cx="${m}" cy="${m}" r="${R}" fill="${disc}"/>`] : []),
    // Anneaux de l'emblème, pierre de clé et pierre en orbite
    `<circle cx="${m}" cy="${m}" r="${R + 1.6}" fill="none" stroke="${ring}" stroke-width="0.32"/>`,
    `<circle cx="${m}" cy="${m}" r="${R + 3}" fill="none" stroke="${ring}" stroke-width="0.22" stroke-dasharray="0.25 0.9" stroke-linecap="round"/>`,
    `<path d="M${m} ${m - R - 2.9} l1.1 1.3 -1.1 1.3 -1.1 -1.3Z" fill="${accent}"/>`,
    `<circle cx="${m + (R + 1.6) * Math.cos(0.6)}" cy="${m + (R + 1.6) * Math.sin(0.6)}" r="0.9" fill="${disc || "none"}" stroke="${ring}" stroke-width="0.32"/>`,
    `<circle cx="${m + (R + 1.6) * Math.cos(0.6)}" cy="${m + (R + 1.6) * Math.sin(0.6)}" r="0.38" fill="${ring}"/>`,
  ];
  const logo = [
    `<circle cx="${cx}" cy="${cx}" r="1.95" fill="none" stroke="${ink}" stroke-width="0.32"/>`,
    `<path d="M${cx} ${cx - 1.05} L${cx + 1.05} ${cx} L${cx} ${cx + 1.05} L${cx - 1.05} ${cx}Z" fill="${accent}"/>`,
  ];
  const pad = R + 4.2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${m - pad} ${m - pad} ${pad * 2} ${pad * 2}"><defs><radialGradient id="halo"><stop offset="0.7" stop-color="${glow}" stop-opacity="0.55"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient></defs>${art.join("")}<g fill="${ink}">${dots.join("")}</g>${logo.join("")}</svg>`;
}
writeFileSync(resolve(here, "qr.svg"), qrSvg(SITE, { disc: "#fbfaf8", glow: "#ffffff", ink: "#2f2e2d", ring: "#2f2e2d", accent: "#8f2f3d" }));
// Version numérique : fond transparent, code blanc posé sur la nuit (code inversé, lu par les appareils photo récents)
writeFileSync(resolve(here, "qr-bleu.svg"), qrSvg(SITE, { disc: null, glow: "#92cde0", ink: "#ffffff", ring: "#bfe6f2", accent: "#9fd4e6" }));

// ─── Icônes : celles du site (app/components/icons/GrisIcons.tsx), rendues en SVG statique ───
// Le composant est transpilé à la volée puis rendu avec React : le CV reprend exactement le trait de pinceau,
// le lavis et le pigment des icônes du portfolio. Le pigment suit la couleur de chaque rubrique (var(--accent)).
{
  const ts = (await import("typescript")).default;
  const React = (await import("react")).default;
  const { renderToStaticMarkup } = await import("react-dom/server");
  // Les icônes dessinées (GrisIcons) et les logos des outils (BrandIcons), comme dans la section Aptitudes
  const load = async (file, tmpName) => {
    const source = readFileSync(resolve(root, file), "utf8");
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    const tmp = resolve(here, tmpName);
    writeFileSync(tmp, js);
    try {
      return await import(pathToFileURL(tmp).href);
    } finally {
      rmSync(tmp, { force: true });
    }
  };
  {
    const I = await load("app/components/icons/GrisIcons.tsx", ".icons.tmp.mjs");
    const Brand = (await load("app/components/icons/BrandIcons.tsx", ".brands.tmp.mjs")).default;
    const wanted = {
      mail: I.MailIcon,
      telephone: I.TelephoneIcon,
      lieu: I.LieuIcon,
      reseau: I.ReseauIcon,
      site: I.SiteIcon,
      contact: I.ContactIcon,
      aptitudes: I.AptitudesIcon,
      outils: I.OutilsIcon,
      langue: I.LangueIcon,
      travail: I.TravailIcon,
      formation: I.FormationIcon,
      projets: I.ProjetsIcon,
      statut: I.StatutIcon,
      conception: I.ConceptionIcon,
      interface: I.InterfaceIcon,
    };
    const svgs = Object.fromEntries(Object.entries(wanted).map(([k, C]) => [k, renderToStaticMarkup(React.createElement(C, { size: 24 }))]));
    for (const name of ["figma", "illustrator", "photoshop", "indesign", "aftereffects", "premiere", "vscode", "tailwind", "node", "jest"])
      svgs[`outil-${name}`] = renderToStaticMarkup(React.createElement(Brand, { name, size: 24 }));
    writeFileSync(resolve(here, "icons.js"), `// Généré par build.mjs depuis GrisIcons.tsx et BrandIcons.tsx : ne pas modifier à la main.\nwindow.ICONS = ${JSON.stringify(svgs, null, 1)};\n`);
  }
}

// ─── Chrome : PDF et aperçus ───
const candidates = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) throw new Error("Chrome introuvable : indiquez son chemin dans la variable CHROME.");
const base = ["--headless=new", "--disable-gpu", "--allow-file-access-from-files", "--virtual-time-budget=4000", "--hide-scrollbars"];
const run = (args) => execFileSync(chrome, [...base, ...args], { stdio: ["ignore", "ignore", "ignore"] });

const versions = [
  { id: "numerique", query: "?v=numerique", pdf: "cv-baptiste-rouzic.pdf" },
  { id: "impression", query: "", pdf: "cv-baptiste-rouzic-impression.pdf" },
];
for (const v of versions) {
  const url = pathToFileURL(resolve(here, "cv.html")).href + v.query;
  run(["--no-pdf-header-footer", `--print-to-pdf=${resolve(publicDir, v.pdf)}`, url]);
  // Aperçu : la page A4 à 96 ppp (794 × 1123 px), rendue en double densité
  const png = resolve(here, `apercu-${v.id}.png`);
  run(["--window-size=794,1123", "--force-device-scale-factor=2", `--screenshot=${png}`, url]);
  await sharp(png).webp({ quality: 82 }).toFile(resolve(previews, `cv-${v.id}.webp`));
  rmSync(png);
  console.log(`CV ${v.id} : public/${v.pdf} · public/cv/cv-${v.id}.webp`);
}

// ─── Empreintes : ajoutées aux adresses des aperçus et des PDF sur le site (?v=…), pour qu'un CV régénéré
// ne soit jamais remplacé par l'ancien gardé en cache par le navigateur ───
const { createHash } = await import("node:crypto");

const hash = (file) => createHash("sha256").update(readFileSync(resolve(publicDir, file))).digest("hex").slice(0, 10);
const files = ["cv-baptiste-rouzic.pdf", "cv-baptiste-rouzic-impression.pdf", "cv/cv-numerique.webp", "cv/cv-impression.webp"];
writeFileSync(
  resolve(root, "app/data/cv-files.ts"),
  `// Généré par scripts/cv/build.mjs : ne pas modifier à la main.\n/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */\nexport const cvHashes: Record<string, string> = {\n${files
    .map((f) => `  "/${f}": "${hash(f)}",`)
    .join("\n")}\n};\n\n/** Adresse d'un fichier du CV, suivie de son empreinte */\nexport const cvUrl = (path: string) => (cvHashes[path] ? \`\${path}?v=\${cvHashes[path]}\` : path);\n`,
);
console.log("Empreintes : app/data/cv-files.ts");
