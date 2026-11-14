import type { Book, Universe } from "../types";

/**
 * CHRONICLES OF ELYNDOR — design system v1.1 de l'application compagnon d'un RPG fictif (North Owl Studio),
 * repris du document de design system (PDF) et de la présentation d'audit (Figma).
 * La contrainte : la perception des couleurs. La couleur confirme, elle n'informe jamais seule.
 */
export const elyndorUniverse: Universe = {
  intro:
    "Une interface de RPG parle beaucoup en couleurs : la rareté d'un objet, une alerte, l'onglet actif. Environ un joueur sur douze les perçoit autrement. La v1.1 garde l'ambiance de la fantasy sombre, mais chaque information colorée passe aussi par une forme, une icône ou un mot.",
  logo: {
    src: "/projets/elyndor/titre.webp",
    alt: "Titre CHRONICLES of ELYNDOR en capitales d'inspiration médiévale, séparées par un filet orné",
    background: "#16181D",
    wide: true,
    glyphs: [
      { letter: "Couleur", meaning: "Elle confirme l'information : bleu pour l'interaction, or pour la récompense, une teinte par rareté." },
      { letter: "Forme ou icône", meaning: "Cercle, triangle, carré, losange, étoile, hexagone : la rareté se lit même en niveaux de gris." },
      { letter: "Texte", meaning: "Un libellé sur chaque badge, chaque alerte, chaque état : « Épique », « Équipé », « Niveau insuffisant »." },
    ],
    note: "La règle fondatrice : au moins deux canaux sur trois, toujours.",
  },
  palette: [
    { name: "Neutral 900", hex: "#16181D", role: "Fond de page, la nuit d'Elyndor" },
    { name: "Neutral 100", hex: "#F2F4F7", role: "Texte principal" },
    { name: "Blue 700", hex: "#3554BB", role: "Interaction : boutons Primary" },
    { name: "Blue 300", hex: "#91ACFF", role: "Liens, anneau de focus (7,16:1)" },
    { name: "Gold 500", hex: "#D9A441", role: "Récompense, XP, niveau. Jamais un état" },
    { name: "Error 700", hex: "#B3263A", role: "Danger, toujours avec son icône" },
  ],
  fonts: [
    {
      name: "Metamorphous",
      family: "'Metamorphous', serif",
      role: "Titres d'univers",
      use: "Capitales d'inspiration médiévale, réservées à la couverture, au logo et aux écrans de chargement. Jamais pour l'interface.",
    },
    {
      name: "Mukta",
      family: "'Mukta', sans-serif",
      role: "Interface",
      use: "Titres, textes et données, du H1 de 40 px aux libellés de 12 px : aucun texte sous 12 px (la v1 descendait à 10 px).",
    },
  ],
  motif: {
    label: "Raretés",
    src: "/projets/elyndor/raretes.webp",
    alt: "Les six badges de rareté, chacun avec sa forme et son libellé : commun (cercle), peu commun (triangle), rare (carré), épique (losange), légendaire (étoile), unique (hexagone)",
    text: "Une forme par rareté, du cercle à l'hexagone, et son nom dans le badge. Simulées en protanopie, deutéranopie, tritanopie puis sans couleur, les six restent distinctes : l'écart minimal passe de ΔE 9 à ΔE 24.",
  },
  photo: {
    label: "Maquette",
    src: "/projets/elyndor/maquette.webp",
    alt: "Maquette de l'écran Inventaire : fiche du personnage, équipement rapide et grille d'objets, chaque case marquée du symbole de sa rareté",
    text: "L'écran Inventaire, écran de référence de la v1.1 : le symbole de rareté dans chaque case, le niveau en or, l'onglet actif souligné d'une barre, les emplacements vides nommés.",
  },
};

const slide = (n: number, title: string, text: string) => {
  const id = String(n).padStart(2, "0");
  return { src: `/projets/elyndor/slides/${id}.webp`, mini: `/projets/elyndor/slides/mini/${id}.webp`, title, text };
};

/** La présentation de l'audit, slide par slide (texte repris des slides pour les lecteurs d'écran) */
export const elyndorSlides: Book = {
  title: "L'audit, slide par slide",
  unit: "slide",
  pdf: "/Chronicles%20of%20Elyndor.pdf",
  chapters: [
    { title: "Contrainte", page: 2 },
    { title: "Diagnostic", page: 4 },
    { title: "Règles", page: 9 },
    { title: "Évolutions", page: 10 },
    { title: "Application", page: 16 },
    { title: "Résultat", page: 18 },
  ],
  pages: [
    slide(1, "Couverture", "Chronicles of Elyndor, North Owl Studio : audit de la perception des couleurs et design system v1.1."),
    slide(2, "Lire l'interface sans toutes les couleurs", "Environ 8 % des hommes et 0,5 % des femmes, soit un joueur sur douze, sans compter le plein soleil et le mode nuit. Deutéranopie et protanopie confondent vert, rouge et brun ; la tritanopie rapproche le bleu et le vert ; l'achromatopsie ne laisse que la luminosité."),
    slide(3, "Trois questions par composant", "Qu'est-ce qui repose sur la couleur seule ? Les états restent-ils lisibles sans elle ? Raretés et alertes restent-elles identifiables ? Outils : simulateur de daltonisme, contraste (texte 4,5:1, graphique 3:1), écart ΔE (seuil 20), passage en niveaux de gris."),
    slide(4, "8 informations portées par la couleur seule", "Trois critiques (rareté dans la grille, dans l'équipement rapide et dans les badges), trois élevées (succès et erreur confondus, états du bouton Danger identiques, boutons Secondary à 2,52:1), deux moyennes (onglet actif, niveau du même bleu que Rare)."),
    slide(5, "6 raretés, 3 couleurs perçues", "En deutéranopie, Rare et Épique passent de ΔE 32 à 8 et deviennent deux bleus quasi identiques ; Peu commun et Unique, de ΔE 107 à 9, deviennent deux bruns. La v1.0 n'avait aucun token de rareté."),
    slide(6, "Des états qui ne changent que de teinte", "Succès et Erreur à ΔE 9 en deutéranopie, Warning proche de l'or. Le bouton Danger a trois états identiques, Secondary plafonne à 2,52:1 et le survol de Primary à 3,50:1."),
    slide(7, "Où suis-je ? Que vaut cet objet ?", "L'onglet actif n'est qu'un blanc sur gris, identique au survol ; la grille d'inventaire n'a qu'une bordure or ; l'équipement rapide repose sur la couleur seule ; le niveau emprunte le bleu de Rare."),
    slide(8, "Corriger d'abord ce qui guide le joueur", "Priorités selon l'impact sur le jeu, la fréquence et les composants touchés : P1 les raretés, P2 les alertes et les boutons (démonter un objet épique est irréversible), P3 la navigation et le niveau."),
    slide(9, "La couleur confirme, elle n'informe jamais seule", "Couleur + forme ou icône + texte : toujours deux canaux sur trois. Six règles : double codage, contraste, écart mesuré, un sens par couleur, états à deux signaux, vérification avant livraison."),
    slide(10, "Une couleur, un rôle", "Neutral pour les fonds et textes, Blue pour l'interaction uniquement, Gold pour la récompense, des couleurs d'état toujours accompagnées d'une icône, six tokens de rareté. Des variables à trois niveaux : primitives, rôles, composants."),
    slide(11, "Des contrastes qui passent le seuil AA", "Primary au survol de 3,50 à 4,56:1, Secondary et Ghost de 2,52 à 7,16:1, Danger de 3,79 à 5,86:1, texte sur or de 2,25 à 8,41:1, sur succès de 2,34 à 7,34:1, et un anneau de focus qui n'existait pas."),
    slide(12, "Une forme par rareté", "Commun cercle, peu commun triangle, rare carré, épique losange, légendaire étoile, unique hexagone. Forme et libellé dans le badge, symbole seul dans les cases. En deutéranopie : Rare / Épique de ΔE 9 à 25, Peu commun / Unique de 9 à 27."),
    slide(13, "Les mêmes raretés, vues autrement", "Les six badges simulés en protanopie, deutéranopie, tritanopie et niveaux de gris : l'écart minimal reste au-dessus du seuil (ΔE 31, 29, 25, 24) et, en gris, la forme et le libellé suffisent."),
    slide(14, "Chaque état envoie deux signaux", "Alertes avec icône et mot obligatoires ; bouton Danger à cinq états distincts et icône dédiée ; onglet actif marqué d'une barre et d'un fond teinté, sans or dans la navigation."),
    slide(15, "Des icônes à l'image de l'univers", "Avant : des icônes de bibliothèque, le même cœur pour Santé et Vitesse, deux icônes pour Filtrer. Après : des pictogrammes pleins dessinés pour l'univers sur une grille de 24 px, une icône par concept."),
    slide(16, "La rareté se lit avant même de cliquer", "L'écran Inventaire avant et après : bordure or partout et rareté en violet seul, puis symbole de rareté dans chaque case, niveau en or et emplacements nommés."),
    slide(17, "La maquette finale", "Rareté visible dans chaque case, objet sélectionné et son emplacement en surbrillance, niveau en or, onglet actif souligné, emplacements vides nommés, une icône par action."),
    slide(18, "Un design system v1.1 documenté", "24 pages en cinq parties : fondations, composants, patterns et templates, écrans, guidelines. Couleurs en variables, raretés lisibles sans la couleur, contrastes vérifiés, états distincts, base 4 px, texte de 12 px minimum."),
    slide(19, "Les mêmes tests, avant et après", "Les écarts entre raretés passent de ΔE 9 à 25 et 27, les contrastes des boutons franchissent tous le seuil AA, le bouton Danger a cinq états distincts sur cinq. Limites : succès et erreur restent proches, l'icône et le mot tranchent."),
    slide(20, "Un système lisible par tous les joueurs", "6 règles d'accessibilité, 24 pages de design system, 4 composants et 46 icônes, un écran de référence. Ensuite : les autres écrans, les dernières icônes et le test daltonisme dans chaque checklist."),
  ],
};
