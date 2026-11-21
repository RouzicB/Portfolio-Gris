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
import { PERF_SCRIPT } from "./lib/perf";
import { profiles } from "./data/skills";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    // L'onglet commence par « Portfolio » ; le nom reste dans le titre, premier critère pour apparaître sur une recherche de son nom
    default: `Portfolio · ${site.name}, UX/UI designer & développeur front`,
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
    "poste UX/UI",
    "Baptiste Rouzic UX/UI",
    "Baptiste Rouzic designer",
    "Rouzic Baptiste",
    "UX/UI designer Normandie",
    "UX/UI designer Rouen",
    "UX designer Eure",
    "développeur front Normandie",
    "Normandie Web School",
    "Mastère UX/UI",
    "Expert en design d'expérience utilisateur",
    "Renault Group alternance UX/UI",
    "BUT MMI Rouen",
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
    type: "profile",
    firstName: site.seo.givenName,
    lastName: site.seo.familyName,
    locale: "fr_FR",
    url: "/",
    siteName: `${site.name} · Portfolio`,
    title: `${site.name} — UX/UI designer & développeur front`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — UX/UI designer & développeur front`,
    description: site.description,
  },
  // Code de vérification Google Search Console (méthode « balise HTML »), si fourni dans les variables d'environnement Vercel
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  category: "portfolio",
};

export const viewport: Viewport = {
  themeColor: palettes.gris.skyTop,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // La palette de l'accueil est posée dès le rendu serveur
  const initial = paletteToVars(palettes.gris) as CSSProperties;
  return (
    <html lang="fr" style={initial} className="palette-settling" suppressHydrationWarning>
      <head>
        {/* Mode léger décidé avant le premier affichage (lib/perf.ts) : aucune scène lourde n'est dessinée pour rien */}
        <script dangerouslySetInnerHTML={{ __html: PERF_SCRIPT }} />
      </head>
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
