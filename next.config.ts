import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // « standalone » sert à l'image Docker ; sur Vercel, la plateforme gère elle-même la sortie
  output: process.env.VERCEL ? undefined : "standalone",
  reactStrictMode: true,
  // Le coin bas-gauche est réservé au lien Crédits
  devIndicators: { position: "bottom-right" },
  // Feuille de style écrite directement dans le HTML : la page n'attend plus son téléchargement pour s'afficher
  // (PageSpeed : « requêtes de blocage du rendu »). Elle est petite (~16 Ko compressés).
  experimental: { inlineCss: true },
  // Images et documents de public/ : gardés par le navigateur au lieu d'être revérifiés un par un à chaque visite.
  // - Décors : un an. Ils ne changent presque jamais ; s'ils sont redessinés, leur donner un nouveau nom de fichier
  //   (sinon un visiteur déjà venu garderait l'ancienne version).
  // - Le reste (images des projets, CV…) : un mois, puis rafraîchi en arrière-plan.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=31536000" }];
    return [
      { source: "/projets/:path*", headers: cache },
      { source: "/:file(.*\\.(?:webp|avif|svg|pdf))", headers: cache },
      // En dernier : quand plusieurs règles s'appliquent, la dernière l'emporte
      { source: "/decor/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
