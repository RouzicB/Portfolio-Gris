// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "4b3419defa",
  "/cv-baptiste-rouzic-impression.pdf": "3947ea7f20",
  "/cv/cv-numerique.webp": "15082d3eb1",
  "/cv/cv-impression.webp": "a944576cbb",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
