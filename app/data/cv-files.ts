// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "a9d46bb4cc",
  "/cv-baptiste-rouzic-impression.pdf": "92cf219fef",
  "/cv/cv-numerique.webp": "c64e60a4e3",
  "/cv/cv-impression.webp": "1a9e56fccf",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
