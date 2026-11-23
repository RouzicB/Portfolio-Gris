// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "fc4eb08bea",
  "/cv-baptiste-rouzic-impression.pdf": "0b5ce18194",
  "/cv/cv-numerique.webp": "b8efd4ced6",
  "/cv/cv-impression.webp": "565371436a",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
