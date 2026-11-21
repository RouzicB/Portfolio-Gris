// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "88a85cef5e",
  "/cv-baptiste-rouzic-impression.pdf": "569df086d2",
  "/cv/cv-numerique.webp": "6b7c7841c1",
  "/cv/cv-impression.webp": "112597b6a3",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
