import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // « standalone » sert à l'image Docker ; sur Vercel, la plateforme gère elle-même la sortie
  output: process.env.VERCEL ? undefined : "standalone",
  reactStrictMode: true,
  // Le coin bas-gauche est réservé au lien Crédits
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
