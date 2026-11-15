/** Adresse publique : fournie par Vercel en production (domaine principal), sinon locale */
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

/** Adresse absolue d'un chemin du site */
export const absolute = (path: string) => new URL(path, siteUrl).toString();
