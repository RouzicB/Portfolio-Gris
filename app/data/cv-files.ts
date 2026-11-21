// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "946a2f9cc9",
  "/cv-baptiste-rouzic-impression.pdf": "ae5d0dab9c",
  "/cv/cv-numerique.webp": "f51082491a",
  "/cv/cv-impression.webp": "a3667cbf63",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
