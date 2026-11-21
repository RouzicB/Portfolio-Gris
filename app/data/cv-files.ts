// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "9757e8c9d5",
  "/cv-baptiste-rouzic-impression.pdf": "3f1e4545aa",
  "/cv/cv-numerique.webp": "37fefb61e3",
  "/cv/cv-impression.webp": "17dbcad272",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
