// ⚠ Les textes marqués « à compléter » sont des exemples : remplacez-les par vos informations.
import type { IconName } from "../types";

export const site = {
  name: "Baptiste Rouzic",
  /** Logo de la barre haute, lettres espacées */
  logo: "ROUZIC",
  role: "Étudiant UX/UI Designer · 5e année",
  tagline: "Je conçois des interfaces calmes et lisibles : la structure d'abord, l'émotion ensuite.",
  // à compléter
  bio: "En 5e année de Mastère UX/UI, spécialité création graphique, je relie la recherche utilisateur, l'architecture de l'information et l'interface.",
  /** Description des moteurs de recherche (environ 155 caractères : au-delà, Google la coupe) */
  description:
    "Baptiste Rouzic, UX/UI designer et développeur front en Normandie : Mastère UX/UI à la Normandie Web School, alternance chez Renault Group. Projets, CV, contact.",
  /** Repères pour le référencement et les données structurées (schema.org) */
  seo: {
    givenName: "Baptiste",
    familyName: "Rouzic",
    locality: "Courcelles-sur-Seine",
    region: "Normandie",
    department: "Eure",
    credential: { name: "Expert en design d'expérience utilisateur", by: "Normandie Web School" },
    employer: { name: "Renault Group", url: "https://www.renaultgroup.com/", role: "Développeur full-stack et UX/UI designer (alternance)" },
    schools: [
      { name: "Normandie Web School", url: "https://normandiewebschool.fr/" },
      { name: "IUT de Rouen", url: "https://iutrouen.univ-rouen.fr/" },
    ],
  },
  status: "Recherche un poste UX/UI ou développeur front",
  // à compléter
  email: "rouzicb.pro@gmail.com",
  /** CV, deux versions générées par scripts/cv/build.mjs : numérique (fond bleu, proposée d'abord) et imprimable */
  cv: "/cv-baptiste-rouzic.pdf",
  cvPrint: "/cv-baptiste-rouzic-impression.pdf",
  /** Portrait (chemin dans /public) ; null = monogramme peint */
  portrait: "/portrait.webp" as string | null,
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/baptiste-rouzic/" },
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
    { name: "Décors et icônes", detail: "Dessinés et peints à l'aquarelle numérique pour ce portfolio" },
    { name: "Logos des outils", detail: "Simple Icons (CC0) ; les marques appartiennent à leurs détenteurs" },
    { name: "Mockups du projet Delta", detail: "Affiche et flyer mis en scène sur des mockups Vecteezy (vecteezy.com)" },
    { name: "Site d'origine des Pluies de Juillet", detail: "Capture d'archive (Internet Archive, Wayback Machine), présentée pour comparaison" },
  ],
} as const;
