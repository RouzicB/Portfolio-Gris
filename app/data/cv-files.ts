// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "5a7a204eef",
  "/cv-baptiste-rouzic-impression.pdf": "bcfbd3dfcf",
  "/cv/cv-numerique.webp": "7f420e3583",
  "/cv/cv-impression.webp": "d5a7ec566b",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
