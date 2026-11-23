import type { Project, ProjectCard } from "../types";
import { afficheIaDetails, afficheIaUniverse } from "./affiche-ia";
import { bambouLivret, bambouUniverse } from "./bambou";
import { charteSlift } from "./charte-slift";
import { deltaSlides, deltaUniverse } from "./delta";
import { elyndorSlides, elyndorUniverse } from "./elyndor";
import { holographSlides, holographUniverse } from "./holograph";
import { pluiesEcrans, pluiesUniverse } from "./pluies-de-juillet";
import { sliftUniverse } from "./slift";
import { vibesEcrans, vibesUniverse } from "./vibes";

// Études de cas, dans n'importe quel ordre (triées par année ci-dessous).
const all: Project[] = [
  // ── Applications développées de bout en bout (alternance) ──
  // ⚠ À compléter : textes, démarche, résultats, ce que j'en retiens, outils, images (cover / thumb dans public/projets/{slug}/).
  // Les chapitres vides ne s'affichent pas sur la page du projet.
  {
    slug: "cartographie-cleon",
    title: "Cartographie de Cléon",
    category: "dev",
    context: "Alternance Renault Group · application web",
    year: 2026,
    role: "Développeur full-stack (solo)",
    duration: "",
    summary: "Une application de cartographie de l'usine Renault de Cléon, que j'ai développée de bout en bout.",
    problem: "",
    solution: "",
    process: [],
    learnings: [],
    outcomes: [],
    tags: [],
    tools: [],
    hues: ["#1f3b52", "#7fb6d6"],
    stage: "bleu",
  },
  {
    slug: "signature-campagnes",
    title: "Signature de campagnes",
    category: "dev",
    context: "Alternance Renault Group · application web",
    year: 2026,
    role: "Développeur full-stack (solo)",
    duration: "",
    summary: "Une application pour faire signer des campagnes, que j'ai développée de bout en bout.",
    problem: "",
    solution: "",
    process: [],
    learnings: [],
    outcomes: [],
    tags: [],
    tools: [],
    hues: ["#2a2f4a", "#9aa6e0"],
    stage: "bleu",
  },
  {
    slug: "vibes",
    title: "Vibes",
    category: "design",
    context: "Projet de fin de M1 · UX/UI & Webflow",
    year: 2026,
    role: "UX/UI designer & développeur Webflow (solo)",
    duration: "Projet de fin d'année",
    summary: "Une plateforme qui réunit billetterie de concerts et merch éco-responsable, dans l'esthétique de la nuit.",
    problem:
      "Billetterie d'un côté, boutiques de merch de l'autre : l'expérience des fans est éclatée et froide, l'écologie absente, et les salles prélèvent jusqu'à 25 % sur le merch des artistes. Les marques « vertes », elles, parlent une langue pastel qui n'a rien à voir avec la culture club.",
    solution:
      "VIBES réunit billets et merch imprimé à la demande dans un panier unifié, et donne à chaque artiste sa page à sa couleur. Son identité assume « l'éco-responsabilité version Dark Mode » : la nuit, des néons bleus et violets, des typographies de code pour dire la transparence.",
    process: [
      {
        title: "Recherche",
        text: "Marché du live, benchmark (Merchbar, Chez Simone, Twitch), deux personas (Chloé, fan ; Marcus, manager de label) et trois hypothèses.",
      },
      {
        title: "Identité",
        text: "Logotype dessiné lettre à lettre, palette nocturne, trois typos, motifs en W et M, direction photo, éco-conception graphique.",
      },
      {
        title: "Prototype",
        text: "Maquettes Figma en Atomic Design, thème par artiste, parcours d'achat aligné sur les 10 heuristiques de Nielsen.",
      },
      {
        title: "Tests",
        text: "5 testeurs en think aloud : 3 points de friction (taille oubliée, prix et CO₂ confondus, XP incomprise), corrigés dans la maquette.",
      },
      {
        title: "Intégration",
        text: "Webflow en composants, interactions natives sans JavaScript lourd, images WebP en lazy loading, sémantique et contrastes vérifiés.",
      },
    ],
    learnings: [
      "Une identité peut porter un engagement : ici, le noir dit l'écologie mieux que le vert.",
      "Cinq tests ont suffi à révéler trois frictions invisibles en maquette.",
      "Concevoir en composants dès Figma rend l'intégration Webflow presque naturelle.",
    ],
    outcomes: [
      { value: "5", label: "testeurs en think aloud" },
      { value: "3", label: "frictions corrigées" },
      { value: "1", label: "site en ligne sur Webflow" },
    ],
    tags: ["UX research", "UI design", "Identité de marque", "Webflow"],
    tools: ["Figma", "Webflow", "Notion"],
    hues: ["#121212", "#735AA2"],
    stage: "lune",
    // La nuit de VIBES : noir, violet de scène, lavande
    theme: {
      palette: {
        skyTop: "#121212",
        skyBottom: "#2c2145",
        accent: "#B3A6DA",
        ink: "#FEFEFE",
        inkSoft: "#DAD4EC",
        veil: "rgba(20, 17, 30, 0.72)",
        washNear: "#2a2140",
        washFar: "#735AA2",
        sun: "#E4DDF6",
      },
      tint: "#735AA2",
      tintOpacity: 0.6,
    },
    cover: "/projets/vibes/couverture.webp",
    thumb: "/projets/vibes/logo.svg",
    link: "https://vibes-c892c4.webflow.io/",
    linkLabel: "Voir le site en ligne",
    universe: vibesUniverse,
    book: vibesEcrans,
  },
  {
    slug: "slift",
    title: "Slift",
    category: "design",
    context: "Projet d'école · identité de marque",
    year: 2026,
    role: "Designer graphique (solo)",
    duration: "Projet de cours",
    summary: "Une charte graphique complète, de A à Z, pour une salle d'escalade tournée vers la performance.",
    problem:
      "Les salles d'escalade se ressemblent : codes ludiques, ton familial, couleurs vives. SLIFT vise un autre public (grimpeurs confirmés, coachs, fédérations, marques d'équipement) qui attend une image sérieuse et professionnelle.",
    solution:
      "Une identité bâtie sur la précision : un pictogramme montagneux et une typographie anguleuse inscrits dans un triangle asymétrique, une base neutre où le rouge ne dépasse jamais 10 à 15 % de la surface, deux typographies et un motif de triangles dérivé du logo.",
    process: [
      { title: "Plateforme de marque", text: "Mission, vision, valeurs (rigueur, sobriété, engagement), positionnement et public cible." },
      {
        title: "Logotype",
        text: "Logo principal, version horizontale, favicon, zones de protection, tailles minimales et usages interdits.",
      },
      {
        title: "Couleurs & typographies",
        text: "Trame noir, gris, blanc et un rouge d'accent rare ; Righteous pour les titres, Kumbh Sans pour le texte, hiérarchie complète.",
      },
      {
        title: "Iconographie & mockups",
        text: "Photo noir et blanc contrastée, motif de triangles, plan de salle, pictogrammes sur grille de 32 px, applications textiles.",
      },
    ],
    learnings: [
      "Une charte vaut autant par ses règles que par ses visuels : proportions, contrastes, interdits.",
      "La sobriété demande plus de décisions que l'abondance : le rouge ne fonctionne que parce qu'il est rare.",
    ],
    outcomes: [
      { value: "35", label: "pages de charte" },
      { value: "4", label: "déclinaisons du logo" },
      { value: "10–15 %", label: "de rouge, pas plus" },
    ],
    tags: ["Identité visuelle", "Charte graphique", "Création graphique"],
    tools: ["Figma", "Illustrator", "Photoshop"],
    hues: ["#c14443", "#dfdfdf"],
    stage: "rouge",
    // SLIFT : base neutre gris clair, un seul signal rouge
    theme: {
      palette: {
        skyTop: "#FDFDFD",
        skyBottom: "#E4E1E1",
        accent: "#C14443",
        ink: "#1E1E1E",
        inkSoft: "#454343",
        veil: "rgba(253, 253, 253, 0.8)",
        washNear: "#C14443",
        washFar: "#E6D3D2",
        sun: "#FFFFFF",
      },
      tint: "#C14443",
      tintOpacity: 0.35,
    },
    cover: "/projets/slift/mockups.webp",
    thumb: "/projets/slift/logo-blanc.webp",
    universe: sliftUniverse,
    book: charteSlift,
  },
  {
    slug: "chronicles-of-elyndor",
    title: "Elyndor",
    category: "design",
    context: "Projet d'école · design system",
    year: 2026,
    role: "UX/UI designer (projet à trois)",
    duration: "Projet de cours",
    summary: "Le design system d'un jeu de rôle, repensé pour les joueurs qui perçoivent les couleurs autrement.",
    problem:
      "L'application compagnon de Chronicles of Elyndor (inventaire, quêtes, personnage) disait presque tout en couleurs. La rareté d'un objet, l'onglet actif, une erreur : en deutéranopie, Rare et Épique devenaient deux bleus identiques, Peu commun et Unique deux bruns. Huit informations reposaient sur la couleur seule, et environ un joueur sur douze risquait d'équiper ou de démonter le mauvais objet.",
    solution:
      "Une v1.1 du design system bâtie sur une règle : la couleur confirme, elle n'informe jamais seule. Une forme par rareté (du cercle à l'hexagone) et un libellé sur chaque badge, des états à deux signaux (barre, coche, anneau), un sens par couleur (bleu pour l'interaction, or pour la récompense), des contrastes AA mesurés et des couleurs passées en variables.",
    process: [
      {
        title: "Audit",
        text: "Chaque composant passé au simulateur (protanopie, deutéranopie, tritanopie), en niveaux de gris, au contraste et à l'écart ΔE : 8 informations portées par la couleur seule.",
      },
      {
        title: "Priorités",
        text: "Classées par impact sur le jeu, fréquence et composants touchés : d'abord les raretés, puis les alertes et boutons, enfin la navigation et le niveau.",
      },
      {
        title: "Règles",
        text: "Six règles de système : double codage, contraste, écart mesuré, un sens par couleur, états à deux signaux, vérification avant livraison.",
      },
      {
        title: "Design system",
        text: "Variables à trois niveaux, badges de rareté, boutons à cinq états, navigation, grille d'inventaire et 46 icônes dessinées pour l'univers, dans un document de 24 pages.",
      },
      { title: "Vérification", text: "Les mêmes tests avant et après, et l'écran Inventaire refait comme écran de référence." },
    ],
    learnings: [
      "L'accessibilité ne retire rien à l'ambiance : la fantasy sombre est restée, seule l'information a changé de canal.",
      "Mesurer (ΔE, contrastes) transforme un ressenti en décision : on sait quand une paire de couleurs ne suffit plus.",
      "Une règle simple, deux canaux sur trois, se vérifie sur chaque composant et survit aux mises à jour.",
    ],
    outcomes: [
      { value: "ΔE 9 → 24", label: "écart minimal entre raretés" },
      { value: "6", label: "règles d'accessibilité" },
      { value: "46", label: "icônes dessinées pour l'univers" },
    ],
    tags: ["Design system", "Accessibilité", "Daltonisme", "UI design"],
    tools: ["Figma", "Color Blind"],
    hues: ["#16181D", "#D9A441"],
    stage: "bleu",
    // ELYNDOR : la nuit neutre de l'interface, l'or des récompenses
    theme: {
      palette: {
        skyTop: "#0F1114",
        skyBottom: "#2A303B",
        accent: "#D9A441",
        ink: "#F2F4F7",
        inkSoft: "#D5D8E1",
        veil: "rgba(22, 24, 29, 0.74)",
        washNear: "#1F232B",
        washFar: "#5A6070",
        sun: "#F3D18B",
      },
      tint: "#5A6070",
      tintOpacity: 0.75,
    },
    cover: "/projets/elyndor/couverture.webp",
    thumb: "/projets/elyndor/titre.webp",
    universe: elyndorUniverse,
    book: elyndorSlides,
  },
  {
    slug: "ia-robotique-industrielle",
    title: "IA & Robotique",
    category: "design",
    context: "Projet d'école · affiche",
    year: 2026,
    role: "Designer graphique",
    duration: "Projet de cours",
    summary: "Une affiche sur ce que l'IA apporte à la robotique et à l'industrie, construite comme un circuit imprimé.",
    problem:
      "Le sujet : représenter les avantages de l'IA dans la robotique et la production industrielle. Un thème technique, chargé de chiffres et de jargon (fabrication additive, maintenance prédictive, vision artificielle) qui, sur une affiche, risque de devenir un mur de texte que personne ne lit.",
    solution:
      "Une affiche pensée comme un circuit imprimé : des pistes bleues relient des blocs repérés comme des composants (A1, B1, C1…) et guident l'œil du titre aux chiffres clés, de l'impression 3D aux secteurs puis aux avantages. Les chiffres passent en grand, chaque explication tient sur une ligne, et un seul bleu hiérarchise tout sur un fond clair quadrillé.",
    process: [
      {
        title: "Recherche",
        text: "Les apports de l'IA dans l'industrie, rassemblés en chiffres : productivité, rebut, précision, défauts détectés, maintenance prédictive.",
      },
      {
        title: "Hiérarchie",
        text: "Six chiffres clés, trois volets d'impression 3D, quatre secteurs, trois avantages : chaque niveau d'information a son bloc.",
      },
      {
        title: "Grille",
        text: "Un fond quadrillé, des pistes coudées et des repères de composants (A1 à E1) : l'affiche se lit comme une carte électronique.",
      },
      {
        title: "Images",
        text: "Un bras robotisé en pleine soudure et une impression 3D métal, en teintes froides relevées par l'orange du métal chauffé.",
      },
      { title: "Impression", text: "Un fichier prêt pour l'imprimeur : fonds perdus, traits de coupe et gamme de contrôle des couleurs." },
    ],
    // ⚠ Propositions à ajuster : ce que tu en as retenu
    learnings: [
      "Sur une affiche, un chiffre bien placé remplace un paragraphe.",
      "Une métaphore graphique, ici le circuit, peut porter toute la structure de lecture.",
      "Une seule couleur d'accent suffit à hiérarchiser un contenu très dense.",
    ],
    outcomes: [
      { value: "6", label: "chiffres clés mis en avant" },
      { value: "4", label: "secteurs industriels" },
      { value: "1", label: "affiche prête à imprimer" },
    ],
    tags: ["Affiche", "Infographie", "Print", "Hiérarchie de l'information"],
    tools: ["Illustrator"],
    hues: ["#F7F8FA", "#2698D4"],
    stage: "gris",
    // IA & ROBOTIQUE : le blanc quadrillé de l'affiche, le bleu des pistes
    theme: {
      palette: {
        skyTop: "#F7F8FA",
        skyBottom: "#C9DFEE",
        accent: "#1F7DB0",
        ink: "#2C2E35",
        inkSoft: "#454852",
        veil: "rgba(250, 250, 250, 0.82)",
        washNear: "#2698D4",
        washFar: "#C2DCEC",
        sun: "#FFFFFF",
      },
      tint: "#2698D4",
      tintOpacity: 0.4,
    },
    cover: "/projets/affiche-ia/couverture.webp",
    thumb: "/projets/affiche-ia/vignette.webp",
    universe: afficheIaUniverse,
    book: afficheIaDetails,
  },
  {
    slug: "delta",
    title: "Delta",
    category: "design",
    context: "Projet d'école · éco-design",
    year: 2025,
    role: "Designer graphique",
    duration: "Projet de cours",
    summary: "L'identité d'un festival de musique marseillais, redessinée pour imprimer deux fois moins d'encre.",
    problem:
      "L'identité d'origine du festival (refonte d'école, non officielle) multiplie les couleurs, les dégradés et les illustrations : son affiche couvre 86 % de la feuille d'encre. Imprimée en grande série, distribuée puis jetée, chaque pièce de communication pèse sur l'empreinte d'un festival posé sur une plage.",
    solution:
      "Une refonte guidée par les règles de l'éco-design : deux tons seulement, le blanc du papier comme troisième couleur, la silhouette de Marseille en aplats plutôt qu'une profusion d'illustrations. L'affiche descend à 43 % d'encrage, le flyer à 14 %, sur papier ensemencé ; les goodies deviennent utiles et durables.",
    process: [
      {
        title: "Diagnostic",
        text: "Taux d'encrage mesuré sur l'affiche originale (86 %), trop de couleurs, trop d'éléments ; objectif fixé entre 30 et 40 %.",
      },
      {
        title: "Logo",
        text: "Le script d'origine gardé pour son geste, réduit à un contour ; les mains et le néon remplacés par un triangle, le delta.",
      },
      { title: "Affiche", text: "Notre-Dame-de-la-Garde, un soleil et des palmiers en bichromie ; impression offset et éco-encre." },
      {
        title: "Flyer",
        text: "La programmation au trait, sur papier ensemencé fabriqué à Marseille, chez un imprimeur certifié ISO 14001.",
      },
      { title: "Goodies", text: "Bouchons d'oreilles en plastique océanique et lunettes en coquillages, logo sérigraphié en une couleur." },
    ],
    learnings: [
      "En éco-design, la contrainte se mesure : un taux d'encrage tranche un débat d'esthétique.",
      "Le papier non imprimé est une couleur à part entière ; le laisser respirer allège autant l'affiche que l'empreinte.",
      "Un goodie éco-conçu commence par une question : servira-t-il encore après le festival ?",
    ],
    outcomes: [
      { value: "86 → 43 %", label: "d'encre sur l'affiche" },
      { value: "14 %", label: "d'encre sur le flyer" },
      { value: "2", label: "encres, en bichromie offset" },
    ],
    tags: ["Éco-design", "Identité visuelle", "Print", "Affiche"],
    tools: ["Illustrator", "Photoshop", "Canva"],
    hues: ["#F6EFE6", "#F3997B"],
    stage: "ciel",
    // DELTA : papier crème, saumon et rose, comme l'affiche
    theme: {
      palette: {
        skyTop: "#F6EFE6",
        skyBottom: "#F5C9B6",
        accent: "#D9475F",
        ink: "#43191F",
        inkSoft: "#6E2F3A",
        veil: "rgba(250, 244, 238, 0.8)",
        washNear: "#F3997B",
        washFar: "#F8D9CB",
        sun: "#FFF6EE",
      },
      tint: "#F3997B",
      tintOpacity: 0.55,
    },
    cover: "/projets/delta/couverture.webp",
    thumb: "/projets/delta/logo.svg",
    universe: deltaUniverse,
    book: deltaSlides,
  },
  {
    slug: "pluies-de-juillet",
    title: "Pluies de Juillet",
    category: "design",
    context: "Examen de M1 · UX/UI",
    year: 2025,
    role: "UX/UI designer",
    duration: "Examen",
    summary: "Le site d'un festival normand engagé, repensé pour s'y repérer et réserver sans effort.",
    problem:
      "Le site du festival (à l'époque de l'examen) agressait d'emblée : fond rouge et rose saturé, capitales noires très grasses, contrastes faibles. Les informations pratiques étaient éparpillées, la billetterie cachée dans un petit bouton, et les offres de groupe tout en bas de page.",
    solution:
      "Une interface posée sur un vert profond et des roses dessinées, une seule couleur vive réservée aux actions. La billetterie est visible partout et ses offres remontent dès l'accueil ; le jour et la nuit du festival sont présentés côte à côte ; l'achat suit quatre étapes claires, avec Apple Pay pour le mobile.",
    process: [
      { title: "Audit", text: "Le site d'origine passé au crible : contraste, lisibilité, navigation, accès à la billetterie." },
      { title: "Personas", text: "Marie, 42 ans, engagée et en famille ; Léo, 23 ans, étudiant, tout sur mobile." },
      { title: "Parcours", text: "Deux parcours utilisateurs, de l'arrivée sur le site au paiement, avec leurs points de frustration." },
      { title: "Moodboard", text: "Logo conservé, deux typographies, une palette verte et rose, des roses et des photos du festival." },
      { title: "Maquettes", text: "Accueil, billetterie et financement participatif, tunnel d'achat en quatre étapes." },
    ],
    learnings: [
      "Un problème de couleur est d'abord un problème de confort : avant d'être joli, un site doit se laisser lire.",
      "Les personas tranchent les débats : l'offre de groupe de Léo justifiait à elle seule de remonter la billetterie.",
      "Un tunnel d'achat rassure quand chaque étape est nommée et que le total ne disparaît jamais.",
    ],
    outcomes: [
      { value: "2", label: "personas et parcours" },
      { value: "4", label: "étapes d'achat, toujours visibles" },
      { value: "17", label: "écrans et planches" },
    ],
    tags: ["UX research", "UI design", "Refonte", "Billetterie"],
    tools: ["Figma"],
    hues: ["#4B6E5B", "#F9D0DE"],
    stage: "vert",
    // PLUIES DE JUILLET : menthe et vert profond, le magenta des actions
    theme: {
      palette: {
        skyTop: "#F4FAF6",
        skyBottom: "#B9DCC4",
        accent: "#B93278",
        ink: "#1E3328",
        inkSoft: "#34493E",
        veil: "rgba(251, 251, 251, 0.8)",
        washNear: "#4B6E5B",
        washFar: "#D3E9DA",
        sun: "#F9D0DE",
      },
      tint: "#4B6E5B",
      tintOpacity: 0.35,
    },
    cover: "/projets/pluies-de-juillet/couverture.webp",
    thumb: "/projets/pluies-de-juillet/logo.webp",
    universe: pluiesUniverse,
    book: pluiesEcrans,
  },
  {
    slug: "bambou",
    title: "Bambou",
    category: "design",
    context: "Projet d'école · documentation",
    year: 2025,
    role: "Designer graphique",
    duration: "Projet de cours",
    summary: "Un guide d'entretien en livret A5 pour prendre soin de son bambou, raconté en images plus qu'en mots.",
    problem:
      "Le sujet : créer la documentation d'un objet précis. Une petite plante d'intérieur se perd vite sans mode d'emploi (quel contenant, quelle eau, combien de lumière, quand tailler ?), et une notice dense ou technique décourage avant même la première étape.",
    solution:
      "Un livret A5 de 12 pages qui montre avant d'expliquer : la liste des essentiels, quatre étapes illustrées où le même bambou se construit page après page, un geste d'entretien et des photos de résultats. Chaque étape annonce ce qu'elle demande (1× billes d'argile, 1× eau…), et une frise de bambous indique où l'on en est.",
    process: [
      { title: "Contenu", text: "Ce qu'il faut savoir, réduit à l'essentiel : le matériel, quatre gestes, un entretien." },
      {
        title: "Identité",
        text: "Un logo en pastille, un titre en lettres rondes découpées dans des photos, un vert profond et un papier clair.",
      },
      {
        title: "Illustration",
        text: "Des pictogrammes au trait et un bambou en aplats qui grandit d'étape en étape, avec ses billes, son eau et sa lumière.",
      },
      {
        title: "Mise en page",
        text: "Des étapes numérotées en grand, des compteurs « 1× » pour le matériel et une frise de progression en pied de page.",
      },
      { title: "Livret", text: "Le format A5 pensé en doubles pages, puis exporté en imposition livret pour l'impression." },
    ],
    // ⚠ Propositions à ajuster : ce que tu en as retenu
    learnings: [
      "Une notice se lit d'abord en images : le texte ne vient qu'en appui.",
      "Répéter la même illustration d'étape en étape rend le progrès visible.",
      "Un livret se pense en doubles pages, pas en pages isolées.",
    ],
    outcomes: [
      { value: "12", label: "pages au format A5" },
      { value: "4", label: "étapes illustrées" },
      { value: "5", label: "essentiels listés" },
    ],
    tags: ["Documentation", "Print", "Illustration", "Mise en page"],
    tools: ["Illustrator"],
    hues: ["#112D23", "#F5F6F5"],
    stage: "vert",
    // BAMBOU : le papier clair du livret, le vert profond de la marque
    theme: {
      palette: {
        skyTop: "#F5F6F5",
        skyBottom: "#C9D9CE",
        accent: "#2F7A8F",
        ink: "#112D23",
        inkSoft: "#2C4A3F",
        veil: "rgba(245, 246, 245, 0.82)",
        washNear: "#112D23",
        washFar: "#A9C4B4",
        sun: "#F3DC8A",
      },
      tint: "#112D23",
      tintOpacity: 0.35,
    },
    cover: "/projets/bambou/couverture.webp",
    thumb: "/projets/bambou/logo.svg",
    universe: bambouUniverse,
    book: bambouLivret,
  },
  {
    slug: "holograph",
    title: "Holograph'",
    category: "design",
    context: "Projet de début de M1 · anti-design",
    year: 2025,
    role: "UX/UI designer",
    duration: "Projet de début d'année",
    summary: "Le site d'une marque de vêtements holographiques, pensé en anti-design pour provoquer un choc visuel.",
    problem:
      "Holograph' habille de vestes et de pantalons holographiques et métalliques celles et ceux qui veulent sortir des normes. Un site e-commerce sage, aligné sur les conventions, aurait trahi la marque : en ligne, le visiteur devait ressentir le même choc que face à quelqu'un habillé en Holograph'.",
    solution:
      "Un site pensé selon les principes de l'anti-design : typographies gothiques et condensées qui se chevauchent, mots posés à la verticale, formes chromées liquides, étoiles et nébuleuses, photos de mode cadrées en biais. La lisibilité cède là où l'impact compte ; la navigation (boutique, marque, contact, compte, panier) reste nette pour qu'on puisse acheter.",
    process: [
      { title: "Positionnement", text: "La marque, ses pièces et sa devise : « Ose briller. Sors des normes. Sois Holograph'. »" },
      {
        title: "Moodboard",
        text: "Mode holographique, néons de ville, nébuleuses, un astronaute : une palette de cinq teintes, du rose au pêche, sur fond noir.",
      },
      { title: "Typographies", text: "Une gothique pour la voix de la marque, une condensée pour le rythme, des titres qui se heurtent." },
      {
        title: "Maquette",
        text: "La page d'accueil sur Figma : l'accroche « Now / Future clothes », la marque, puis quatre collections (Quantum, Cybernetics, Hologram, Virtuality).",
      },
      { title: "Note d'intention", text: "Une présentation qui défend le parti pris : où et pourquoi le site enfreint les règles." },
    ],
    // ⚠ Propositions à ajuster : ce que tu en as retenu
    learnings: [
      "L'anti-design n'est pas l'absence de règles : chaque rupture doit servir l'identité de la marque.",
      "Garder la navigation et l'achat lisibles permet d'oser tout le reste.",
      "Un moodboard solide évite que le chaos visuel ne devienne du bruit.",
    ],
    outcomes: [
      { value: "4", label: "collections mises en scène" },
      { value: "5", label: "teintes au moodboard" },
      { value: "1", label: "maquette Figma de l'accueil" },
    ],
    tags: ["Anti-design", "UI design", "Direction artistique", "Moodboard"],
    tools: ["Figma"],
    hues: ["#161616", "#FFA9FF"],
    stage: "lune",
    // HOLOGRAPH' : le noir spatial, le rose holographique et le violet des nébuleuses
    theme: {
      palette: {
        skyTop: "#161616",
        skyBottom: "#2E1B3D",
        accent: "#FFA9FF",
        ink: "#F7F3FA",
        inkSoft: "#E3D6EC",
        veil: "rgba(22, 22, 22, 0.74)",
        washNear: "#3A214E",
        washFar: "#703383",
        sun: "#F2C3AA",
      },
      tint: "#703383",
      tintOpacity: 0.6,
    },
    cover: "/projets/holograph/couverture.webp",
    thumb: "/projets/holograph/logo.webp",
    universe: holographUniverse,
    book: holographSlides,
  },
];

/** Du plus récent au plus ancien (tri stable : l'ordre d'écriture départage une même année) */
export const projects: Project[] = [...all].sort((a, b) => b.year - a.year);

/** Les seuls champs d'une carte : c'est tout ce que la galerie envoie au navigateur */
export const toCard = ({ slug, title, category, context, year, summary, hues, thumb, cover }: Project): ProjectCard => ({
  slug,
  title,
  category,
  context,
  year,
  summary,
  hues,
  thumb,
  cover,
});

/** Les deux galeries de la section Projets, dans l'ordre d'affichage */
export const projectCategories: { id: Project["category"]; label: string }[] = [
  { id: "design", label: "Design & UX/UI" },
  { id: "dev", label: "Développement" },
];

/** Projet précédent et suivant (en boucle, dans la même galerie) pour la navigation entre études de cas */
export function adjacentProjects(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;
  const list = projects.filter((p) => p.category === project.category);
  const i = list.indexOf(project);
  const n = list.length;
  const prev = list[(i - 1 + n) % n];
  const next = list[(i + 1) % n];
  return { index: i, total: n, prev: { project: prev, index: list.indexOf(prev) }, next: { project: next, index: list.indexOf(next) } };
}
