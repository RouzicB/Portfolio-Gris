import type { Metadata } from "next";
import CreditsPage from "../components/credits/CreditsPage";

export const metadata: Metadata = {
  title: "Crédits",
  description: "Crédits de la direction artistique, ressources et icônes du portfolio.",
  alternates: { canonical: "/credits" },
};

export default function Page() {
  return <CreditsPage />;
}
