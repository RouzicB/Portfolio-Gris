// ⚠ Les textes marqués « à compléter » sont des exemples : remplacez-les par vos informations.
import type { IconName } from "../types";

export const site = {
  name: "Baptiste Rouzic",
  /** Logo de la barre haute, lettres espacées */
  logo: "ROUZIC",
  role: "Étudiant UX/UI Designer · 5e année",
  tagline: "Je conçois des interfaces calmes et lisibles : la structure d'abord, l'émotion ensuite.",
  // à compléter
  bio: "En 5e année de Mastère UX/UI, spécialité création graphique, je relie la recherche utilisateur, l'architecture de l'information et l'interface. J'aime les produits qui prennent soin de leurs utilisateurs, surtout dans les moments difficiles.",
  description:
    "Portfolio de Baptiste Rouzic, étudiant UX/UI en 5e année : profil, méthode, aptitudes, parcours, projets et contact.",
  status: "Recherche une alternance ou un premier poste UX/UI pour 2027",
  // à compléter
  email: "contact@example.com",
  /** Déposez le PDF dans /public */
  cv: "/cv-baptiste-rouzic.pdf",
  /** Portrait (chemin dans /public) ; null = monogramme peint */
  portrait: null as string | null,
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Behance", href: "https://www.behance.net/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
  ],
} as const;

/** Fiche du profil — à compléter */
export const specs: { icon: IconName; label: string; value: string }[] = [
  { icon: "lieu", label: "Localisation", value: "France · mobile" },
  { icon: "formation", label: "Formation", value: "Mastère UX/UI · 5e année" },
  { icon: "langue", label: "Langues", value: "Français · Anglais (C1)" },
  { icon: "conception", label: "Spécialité", value: "Création graphique · UX/UI" },
  { icon: "statut", label: "Statut", value: "Disponible à partir de 2027" },
];

/** Crédits de la direction artistique */
export const credits = {
  short: "Direction artistique inspirée de GRIS (Nomada Studio, 2018)",
  game: {
    title: "GRIS",
    studio: "Nomada Studio",
    publisher: "Devolver Digital",
    year: 2018,
    artDirector: "Conrad Roset",
    url: "https://nomada.studio/",
  },
  resources: [
    { name: "Josefin Sans", detail: "Santiago Orozco — SIL Open Font License", specimen: "display", role: "Titres" },
    { name: "Quicksand", detail: "Andrew Paglinawan — SIL Open Font License", specimen: "sans", role: "Texte" },
    { name: "Next.js, React, Tailwind CSS, Framer Motion", detail: "Licence MIT" },
    { name: "Décors et icônes", detail: "Dessinés en SVG pour ce portfolio" },
    { name: "Logos des outils", detail: "Simple Icons (CC0) ; les marques appartiennent à leurs détenteurs" },
  ],
} as const;
