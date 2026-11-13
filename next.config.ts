import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Le coin bas-gauche est réservé au lien Crédits
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
