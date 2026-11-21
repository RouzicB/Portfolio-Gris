// Généré par scripts/cv/build.mjs : ne pas modifier à la main.
/** Empreinte du contenu de chaque fichier du CV (dans public/), pour contourner le cache du navigateur */
export const cvHashes: Record<string, string> = {
  "/cv-baptiste-rouzic.pdf": "4af0d94b01",
  "/cv-baptiste-rouzic-impression.pdf": "fb44b7bbf9",
  "/cv/cv-numerique.webp": "92dfde9b08",
  "/cv/cv-impression.webp": "ff797928a5",
};

/** Adresse d'un fichier du CV, suivie de son empreinte */
export const cvUrl = (path: string) => (cvHashes[path] ? `${path}?v=${cvHashes[path]}` : path);
