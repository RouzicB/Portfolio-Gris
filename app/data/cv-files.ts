// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "169179f3ac",
  "/cv-baptiste-rouzic-impression.pdf": "0b9b9ffac7",
  "/cv/cv-numerique.webp": "74303da42e",
  "/cv/cv-impression.webp": "6cb9f3d884",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
