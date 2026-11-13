import Journey from "./components/journey/Journey";
import Accueil from "./components/sections/Accueil";
import Profil from "./components/sections/Profil";
import Methode from "./components/sections/Methode";
import Aptitudes from "./components/sections/Aptitudes";
import Parcours from "./components/sections/Parcours";
import Projets from "./components/sections/Projets";
import Contact from "./components/sections/Contact";
import Credits from "./components/sections/Credits";

/** Une seule page, huit sections : le décor évolue au fil du scroll. */
export default function HomePage() {
  return (
    <Journey>
      <Accueil />
      <Profil />
      <Methode />
      <Aptitudes />
      <Parcours />
      <Projets />
      <Contact />
      <Credits />
    </Journey>
  );
}
