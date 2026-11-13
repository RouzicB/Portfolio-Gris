import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import "@fontsource-variable/josefin-sans";
import "@fontsource-variable/quicksand";
import "./globals.css";
import Providers from "./components/Providers";
import CreditsLink from "./components/layouts/CreditsLink";
import { palettes } from "./data/palettes";
import { site } from "./data/site";
import { paletteToVars } from "./lib/journey";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: palettes.gris.skyTop,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // La palette de l'accueil est posée dès le rendu serveur
  const initial = paletteToVars(palettes.gris) as CSSProperties;
  return (
    <html lang="fr" style={initial} suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
          <CreditsLink />
        </Providers>
      </body>
    </html>
  );
}
