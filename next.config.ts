import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // « standalone » sert à l'image Docker ; sur Vercel, la plateforme gère elle-même la sortie
  output: process.env.VERCEL ? undefined : "standalone",
  reactStrictMode: true,
  // Le coin bas-gauche est réservé au lien Crédits
  devIndicators: { position: "bottom-right" },
  // Images et documents de public/ : gardés une semaine par le navigateur (au lieu d'être revérifiés un par un à chaque visite),
  // puis rafraîchis en arrière-plan. Les noms ne changent pas d'une version à l'autre : une semaine reste un délai raisonnable.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return [
      { source: "/decor/:path*", headers: cache },
      { source: "/projets/:path*", headers: cache },
      { source: "/:file(.*\\.(?:webp|avif|svg|pdf))", headers: cache },
    ];
  },
};

export default nextConfig;
