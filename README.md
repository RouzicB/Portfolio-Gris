# Portfolio Gris — Baptiste Rouzic

Portfolio d'un étudiant UX/UI en 5e année, raconté comme un voyage dans l'esthétique de GRIS.
Une page d'accueil (une section par écran, même architecture que le portfolio principal) et une page par étude de cas.
Le décor part du gris et se teinte au fil du scroll ; aucun texte ne l'annonce, la couleur fait partie du paysage.

| # | Section | Contenu | Décor |
| --- | --- | --- | --- |
| 01 | Accueil | Nom, rôle, accroche | Monde blanc et gris : grande arche brisée à facettes, colonne effondrée, éclats, nuages lourds |
| 02 | Profil | Présentation, valeurs, fiche | Désert rouge : montagnes triangulaires, rochers à facettes, arbre en ombrelle |
| 03 | Méthode | Cinq étapes | Forêt verte : troncs-colonnes, triangles suspendus, tronc en arche |
| 04 | Aptitudes | Trois modules, niveaux en gouttes, outils | Grotte bleue : arbre lumineux, cadres translucides, eau |
| 05 | Parcours | Arborescence horizontale : formation, expériences, choix, chemins non empruntés | Nuit dorée : grande lune, tours à dômes, terrasse en gradins |
| 06 | Projets | Galerie d'arches (1 à 3 visibles, flèches, losanges, glissement) vers les études de cas | Ciel pastel : temple sur une île flottante, escalier suspendu, arche brisée, aqueduc, rocher et arbre-ombrelle, oiseaux, mer de nuages |
| 07 | Contact | E-mail, réseaux, CV | Nuit prune : constellations, sommets à deux faces, lac scintillant, porte en arche et lianes, arbres géométriques, terrasse à balustres fleurie |

**Crédits** (`/credits`) : direction artistique, mentions, ressources et galerie d'icônes, sur une page à part,
accessible par un lien discret fixé en bas à gauche de l'écran.

**Écran de chargement** : entre deux pages, le monde redevient gris un instant et l'emblème en constellation se trace
et tourne (`app/template.tsx`, `PageLoader`, `Emblem`). La disparition est en CSS pur : il ne peut pas rester bloqué.

**Pages projet** (`/projets/[slug]`, générées statiquement) : en-tête et fiche, vignette peinte, problème et réponse,
démarche, résultats, enseignements, projet précédent / suivant. Chaque projet a sa propre ambiance de décor.

**Langage visuel** : aplats géométriques nets (arches, troncs, triangles, carrés), dégradés doux, grain de pigment
dans les formes (`wc-paint`), hachures dans les ombres, mers de nuages. Les compositions sont originales :
aucune illustration, aucun personnage ni décor du jeu n'est reproduit.

## Stack

Reprise de l'autre portfolio, en plus simple :

- **Next.js 16** (App Router, Turbopack, sortie `standalone`) · **React 19** · **TypeScript** strict
- **Tailwind CSS v4** (tokens dans `app/globals.css`) · **framer-motion**
- Polices **Josefin Sans** (titres espacés) et **Quicksand** (texte) via Fontsource
- **Jest 30** + Testing Library · **ESLint 9** · **Docker** multi-stage

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm test
npm run lint
```

## Comment le décor évolue

1. L'accueil ne défile pas : un geste (molette, glissé tactile, ↑/↓, Page↑/↓, Espace, Début/Fin) amène à la
   section voisine. Les rafales de molette et l'inertie du pavé tactile ne comptent que pour un pas.
   Une section plus haute que l'écran (mobile) se parcourt d'abord, puis le geste suivant change de section.
2. `Journey.tsx` anime alors une position continue (`progress`) d'une section à l'autre, en zoom :
   la scène quittée grossit et s'efface (on entre dedans), la suivante arrive du fond.
3. Les palettes des deux sections voisines (`app/data/palettes.ts`) sont mélangées et écrites en variables CSS
   sur `<html>` au rythme de cette animation ; `Landscape.tsx` fond les scènes, les zoome et fait glisser le soleil.
4. L'URL suit la section (`#section-projets`…) : on peut y revenir directement, depuis une page projet par exemple.

## Icônes

`app/components/icons/GrisIcons.tsx` : jeu d'icônes dessiné pour le site, dans le vocabulaire de GRIS.
Chaque trait est peint en cinq passes superposées (de plus en plus épaisses vers le centre) : il s'affine aux
extrémités comme un coup de pinceau. Cercles ouverts en ensō, triangles et facettes, lavis d'aquarelle translucide
et point de pigment à la teinte du décor. Navigation, fiche, aptitudes, études de cas, contact, favicon
(`app/icon.svg`) ; la galerie complète est affichée sur la page Crédits.

## Accessibilité

- Contraste WCAG AA vérifié sur le rendu réel (texte comparé aux pixels du décor derrière lui), section par section,
  de 320×568 à 2560×1440 : 4,5:1 minimum pour le texte courant, 3:1 pour les grands titres.
- Le texte posé à même le décor porte un halo de la teinte du voile (utilitaire `legible`) ; sur écran étroit,
  le soleil ou la lune se range dans un coin du ciel pour ne jamais passer derrière un titre.
- Navigation complète au clavier (flèches, Page, Espace, Début/Fin), focus visible, sections inactives `inert`,
  zones tactiles d'au moins 40 px sur mobile, `prefers-reduced-motion` respecté (fondu simple, sans zoom).
- Responsive : aucune barre de défilement horizontale ; sur mobile, une section plus haute que l'écran se lit
  en entier avant de passer à la suivante ; le canevas du parcours se réduit légèrement puis défile à l'horizontale.

## Structure

```
app/
├── layout.tsx            # <html> naît avec la palette grise (rendu serveur)
├── page.tsx              # Les sept sections dans <Journey>
├── template.tsx          # Rejoue l'écran de chargement à chaque changement de page
├── projets/[slug]/       # Page statique de chaque étude de cas
├── credits/              # Page des crédits
├── not-found.tsx
├── globals.css           # @property des couleurs, utilitaires title-spaced / label-spaced / veil, animations
├── icon.svg              # Favicon (icône Accueil)
├── components/
│   ├── journey/          # Journey (moteur), JourneyContext, SectionNav, motion
│   ├── background/       # Landscape (ciel, soleil, scènes), Parallax (souris)
│   │   └── art/          # Une scène aquarelle SVG par ambiance + filtres partagés
│   ├── icons/            # GrisIcons : le jeu d'icônes maison
│   ├── sections/         # SectionShell + Accueil, Profil, Methode, Aptitudes, Parcours, Projets, Contact
│   ├── project/          # ProjectCase : la page d'une étude de cas
│   ├── credits/          # CreditsPage
│   ├── layouts/          # PageScene (gabarit des pages hors accueil), CreditsLink
│   └── ui/               # ProjectThumb (vignette peinte), Emblem, PageLoader
├── lib/flowchart.ts      # Géométrie de l'arborescence du parcours (nœuds, liens)
├── data/                 # sections, palettes, site (profil, fiche, crédits), career, process, projects, skills
├── lib/                  # journey (position continue, fondu), color (mélange de couleurs)
└── types/
__tests__/                # lib, data, journey, ui
public/                   # CV, favicon, images
```

## Personnaliser

1. `app/data/site.ts` : nom, rôle, e-mail, réseaux, chemin du CV (déposer le PDF dans `public/`).
2. `app/data/career.ts`, `process.ts`, `projects.ts`, `skills.ts` : contenu (⚠ exemples à remplacer).
3. `app/data/sections.ts` : titre, introduction, icône, ambiance et soleil de chaque section ;
   `app/data/palettes.ts` : les ambiances du décor.

## Crédits

Direction artistique inspirée de l'esthétique aquarelle de **GRIS** (Nomada Studio, 2018), où le monde
retrouve ses couleurs au fil du récit. Projet personnel sans lien avec Nomada Studio ni Devolver Digital :
aucun personnage, logo ni visuel du jeu n'est reproduit, tous les décors sont dessinés en SVG pour ce site.

## Docker

```bash
docker build -t portfolio-gris .
docker run -p 3000:3000 portfolio-gris
```
