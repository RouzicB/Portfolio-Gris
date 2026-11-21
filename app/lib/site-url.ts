/** Domaine du portfolio (acheté chez OVH, branché sur Vercel) : adresse des métadonnées, du sitemap et du CV */
export const SITE_DOMAIN = "baptiste-rouzic.fr";

/**
 * Adresse publique : le domaine en production, l'adresse de l'aperçu sur les déploiements de test, sinon locale.
 * Fixée explicitement plutôt que lue dans VERCEL_PROJECT_PRODUCTION_URL, qui peut désigner le « www » ou l'adresse
 * vercel.app selon les réglages de domaines.
 */
export const siteUrl =
  process.env.VERCEL_ENV === "production"
    ? `https://${SITE_DOMAIN}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

/** Adresse absolue d'un chemin du site */
export const absolute = (path: string) => new URL(path, siteUrl).toString();
