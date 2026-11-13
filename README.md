# Portfolio Gris — Baptiste Rouzic

Portfolio d'un étudiant UX/UI en 5e année, raconté comme un voyage dans l'esthétique de GRIS.
Une page d'accueil (une section par écran, même architecture que le portfolio principal) et une page par étude de cas.
Le décor part du gris et se teinte au fil du scroll ; aucun texte ne l'annonce, la couleur fait partie du paysage.

| # | Section | Contenu | Décor |
| --- | --- | --- | --- |
| 01 | Accueil | Nom, rôle, accroche | Brume : aqueduc brisé, colonne, pierres en suspens, mer de nuages |
| 02 | Profil | Présentation, valeurs, fiche | Forêt de troncs rouges, triangles suspendus, monticules hachurés |
| 03 | Méthode | Cinq étapes | Jardin de grandes feuilles, lianes, arche envahie, une pousse |
| 04 | Aptitudes | Trois modules, niveaux en gouttes, outils | Sous la surface : rais de lumière, arche engloutie, méduses |
| 05 | Parcours | Cinq années | Crépuscule doré, cinq pierres flottantes au-dessus des mesas |
| 06 | Projets | Cartes vers les études de cas | Ciel pastel, grande arche brisée, rai rosé, mer de nuages |
| 07 | Contact | E-mail, réseaux, CV | Nuit prune, grande lune, arbres géométriques, terrasse fleurie |
| 08 | Crédits | Direction artistique, ressources, galerie d'icônes | Nuit prune |

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

1. `Journey.tsx` calcule à chaque frame de scroll une position continue entre les centres des sections.
2. Les palettes des deux sections voisines (`app/data/palettes.ts`) sont mélangées et écrites en variables CSS
   sur `<html>` : ciel, texte, voiles et accents suivent le geste, sans palier ni transition déclenchée.
   Une courbe douce (smoothstep) garde la teinte posée quand une section est centrée.
3. `Landscape.tsx` fond les scènes aquarelle l'une dans l'autre et fait glisser le soleil au même rythme.
4. L'aimantation du scroll est douce (`proximity`) : elle n'agit que près d'une section.

## Icônes

`app/components/icons/GrisIcons.tsx` : jeu d'icônes dessiné pour le site (trait fin et arrondi, et une goutte
d'aquarelle qui prend la teinte du décor). Navigation, fiche, aptitudes, études de cas, contact, favicon
(`app/icon.svg`) ; la galerie complète est affichée dans la section Crédits.

## Structure

```
app/
├── layout.tsx            # <html> naît avec la palette grise (rendu serveur)
├── page.tsx              # Les huit sections dans <Journey>
├── projets/[slug]/       # Page statique de chaque étude de cas
├── not-found.tsx
├── globals.css           # @property des couleurs, utilitaires title-spaced / label-spaced / veil, animations
├── icon.svg              # Favicon (icône Accueil)
├── components/
│   ├── journey/          # Journey (moteur), JourneyContext, TopBar, SectionNav, motion
│   ├── background/       # Landscape (ciel, soleil, scènes), Parallax (souris)
│   │   └── art/          # Une scène aquarelle SVG par ambiance + filtres partagés
│   ├── icons/            # GrisIcons : le jeu d'icônes maison
│   ├── sections/         # SectionShell + Accueil, Profil, Methode, Aptitudes, Parcours, Projets, Contact, Credits
│   ├── project/          # ProjectCase : la page d'une étude de cas
│   └── ui/               # ProjectThumb (vignette peinte)
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
