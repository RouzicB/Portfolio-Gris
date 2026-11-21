import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import "@fontsource-variable/josefin-sans";
import "@fontsource-variable/quicksand";
import "./globals.css";
import Providers from "./components/Providers";
import CreditsLink from "./components/layouts/CreditsLink";
import MusicToggle from "./components/layouts/MusicToggle";
import SoundPrompt from "./components/layouts/SoundPrompt";
import { palettes } from "./data/palettes";
import { site } from "./data/site";
import { paletteToVars } from "./lib/journey";
import { siteUrl } from "./lib/site-url";
import { profiles } from "./data/skills";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: `${site.name} — Portfolio`,
  authors: [{ name: site.name, url: "/" }],
  creator: site.name,
  keywords: [
    site.name,
    "portfolio",
    "UX/UI designer",
    "UX designer",
    "UI designer",
    "alternance UX/UI",
    "développeur front-end",
    ...profiles.flatMap((p) => p.skills.map((s) => s.name)),
  ],
  alternates: {
    canonical: "/",
    // Le portfolio entier en texte, pour les assistants et agents IA
    types: { "text/markdown": [{ url: "/llms.txt", title: "Portfolio en texte (llms.txt)" }] },
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
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
          <MusicToggle />
          <SoundPrompt />
        </Providers>
      </body>
    </html>
  );
}
