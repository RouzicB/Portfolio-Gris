// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "44daeb2752",
  "/cv-baptiste-rouzic-impression.pdf": "b4486650c5",
  "/cv/cv-numerique.webp": "507d8fd89c",
  "/cv/cv-impression.webp": "76700af3ac",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
