// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "4da22626b2",
  "/cv-baptiste-rouzic-impression.pdf": "d0340d7ca9",
  "/cv/cv-numerique.webp": "dec4f869a1",
  "/cv/cv-impression.webp": "82b6ea526e",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
