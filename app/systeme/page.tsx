import type { Metadata } from "next";
import DesignSystemPage from "../components/system/DesignSystemPage";

export const metadata: Metadata = {
  title: "Système Lavis",
  description: "Le design system du portfolio : couleurs, typographie, surfaces peintes et composants.",
  alternates: { canonical: "/systeme" },
  // Page de travail : accessible par son lien, absente des moteurs de recherche
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DesignSystemPage />;
}
