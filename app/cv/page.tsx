import type { Metadata } from "next";
import CvPage from "../components/cv/CvPage";

export const metadata: Metadata = {
  title: "CV",
  description: "Le CV de Baptiste Rouzic, UX/UI designer et développeur web : à lire en ligne, ou à télécharger en version numérique ou imprimable.",
  alternates: { canonical: "/cv" },
};

export default function Page() {
  return <CvPage />;
}
