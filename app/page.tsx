import Journey from "./components/journey/Journey";
import Accueil from "./components/sections/Accueil";
import Profil from "./components/sections/Profil";
import Methode from "./components/sections/Methode";
import Aptitudes from "./components/sections/Aptitudes";
import Parcours from "./components/sections/Parcours";
import Projets from "./components/sections/Projets";
import Contact from "./components/sections/Contact";
import JsonLd from "./components/JsonLd";
import { projects, toCard } from "./data/projects";
import { personJsonLd } from "./lib/machine-readable";

/** Une seule page, sept sections (les crédits ont leur propre page) : le décor évolue au fil du scroll. */
export default function HomePage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <Journey>
        <Accueil />
        <Profil />
        <Methode />
        <Aptitudes />
        <Parcours />
        {/* Seulement les champs des cartes : le contenu des études de cas reste sur leurs pages */}
        <Projets cards={projects.map(toCard)} />
        <Contact />
      </Journey>
    </>
  );
}
