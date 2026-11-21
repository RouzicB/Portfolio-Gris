/*
 * Le portfolio lisible par les machines (moteurs de recherche, assistants IA, agents qui parcourent les portfolios) :
 * tout est tiré des mêmes données que les pages, rien n'est à maintenir en double.
 * - portfolioMarkdown : le contenu en texte (/llms.txt, /llms-full.txt), y compris ce que l'interface ne montre
 *   qu'au clic (chaque étape du parcours, chaque écran des études de cas) ;
 * - personJsonLd / projectJsonLd : données structurées schema.org, intégrées aux pages (invisibles).
 */
import fs from "node:fs";
import path from "node:path";
import { careerChapters, careerNodes } from "../data/career";
import { convictions } from "../data/convictions";
import { projects } from "../data/projects";
import { sections } from "../data/sections";
import { site, specs } from "../data/site";
import { bridge, profiles } from "../data/skills";
import type { Project } from "../types";
import { absolute } from "./site-url";

/** Réseaux renseignés pour de vrai (pas la simple page d'accueil du réseau) */
export const realSocials = site.socials.filter((s) => {
  try {
    return new URL(s.href).pathname.replace(/\/+$/, "") !== "";
  } catch {
    return false;
  }
});

/** Le CV n'est annoncé que s'il est bien déposé dans /public */
function cvUrl(): string | null {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", decodeURIComponent(site.cv))) ? absolute(site.cv) : null;
  } catch {
    return null;
  }
}

const projectUrl = (p: Project) => absolute(`/projets/${p.slug}`);
const sectionUrl = (id: string) => absolute(id === "accueil" ? "/" : `/#section-${id}`);

/** Étapes réellement suivies du parcours, dans l'ordre du temps */
const career = careerNodes
  .filter((n) => n.kind === "start" || n.kind === "step" || n.kind === "current")
  .sort((a, b) => a.col - b.col || a.row - b.row);

function projectMarkdown(p: Project, full: boolean): string {
  const out = [
    `### ${p.title} (${p.year})`,
    "",
    `- Étude de cas : ${projectUrl(p)}`,
    `- Contexte : ${p.context}`,
    `- Rôle : ${p.role}`,
    `- Durée : ${p.duration}`,
    `- Outils : ${p.tools.join(", ")}`,
    `- Compétences : ${p.tags.join(", ")}`,
  ];
  if (p.link) out.push(`- ${p.linkLabel ?? "Lien"} : ${p.link}`);
  if (p.book?.pdf) out.push(`- Document complet (PDF) : ${absolute(p.book.pdf)}`);
  out.push("", p.summary);
  if (!full) return out.join("\n");
  out.push("", `**Le problème.** ${p.problem}`, "", `**La réponse.** ${p.solution}`, "", "**Démarche :**");
  p.process.forEach((s, i) => out.push(`${i + 1}. ${s.title} : ${s.text}`));
  if (p.universe) {
    const u = p.universe;
    out.push("", `**Univers graphique.** ${u.intro}`);
    if (u.logo?.glyphs?.length) out.push(`- Logotype : ${u.logo.glyphs.map((g) => `${g.letter} = ${g.meaning}`).join(" ; ")}`);
    if (u.logo?.note) out.push(`- ${u.logo.note}`);
    if (u.palette.length) out.push(`- Couleurs : ${u.palette.map((c) => `${c.name} ${c.hex} (${c.role})`).join(" ; ")}`);
    if (u.fonts.length) out.push(`- Typographies : ${u.fonts.map((f) => `${f.name} (${f.role} : ${f.use})`).join(" ; ")}`);
    if (u.motif) out.push(`- Motif : ${u.motif.text}`);
    if (u.photo) out.push(`- Photographie : ${u.photo.text}`);
  }
  if (p.book?.pages.length) {
    out.push("", `**${p.book.title}** (${p.book.pages.length} × ${p.book.unit ?? "page"}) :`);
    p.book.pages.forEach((pg, i) => out.push(`${i + 1}. ${pg.title}${pg.text ? ` : ${pg.text}` : ""}`));
  }
  out.push("", `**Résultats :** ${p.outcomes.map((o) => `${o.value} ${o.label}`).join(" ; ")}`);
  out.push("", "**Ce que j'en retiens :**");
  p.learnings.forEach((l) => out.push(`- ${l}`));
  return out.join("\n");
}

/** Le portfolio en Markdown ; `full` ajoute le détail complet de chaque étude de cas */
export function portfolioMarkdown(full: boolean): string {
  const cv = cvUrl();
  const sec = (id: string) => sections.find((s) => s.id === id)!;
  const lines: string[] = [
    `# ${site.name} — ${site.role}`,
    "",
    `> ${site.description} ${site.status}.`,
    "",
    site.tagline,
    "",
    "## En bref",
    "",
    `- Nom : ${site.name}`,
    `- Rôle : ${site.role}`,
    `- Recherche : ${site.status}`,
    ...specs.map((s) => `- ${s.label} : ${s.value}`),
    `- E-mail : ${site.email}`,
    ...(cv ? [`- CV (PDF) : ${cv}`] : []),
    ...realSocials.map((s) => `- ${s.label} : ${s.href}`),
    `- Portfolio : ${absolute("/")}`,
    "",
    `## Profil (${sectionUrl("profil")})`,
    "",
    site.bio,
    "",
    `## Convictions : ${sec("convictions").title} (${sectionUrl("convictions")})`,
    "",
    sec("convictions").intro,
    "",
    ...convictions.map((c) => `- **${c.title}** : ${c.text} Vu dans : ${c.proof.title} (${absolute(`/projets/${c.proof.slug}`)}).`),
    "",
    `## Aptitudes : ${sec("aptitudes").title} (${sectionUrl("aptitudes")})`,
    "",
    sec("aptitudes").intro,
  ];
  profiles.forEach((pr) => {
    lines.push("", `### ${pr.side} : ${pr.name}`, "", pr.pitch, "");
    pr.skills.forEach((s) => lines.push(`- ${s.name} : ${s.detail}`));
    lines.push(`- Outils : ${pr.tools.map((t) => t.name).join(", ")}`);
  });
  lines.push("", `Entre les deux : ${bridge.join(", ")}.`);

  lines.push("", `## Parcours : ${sec("parcours").title} (${sectionUrl("parcours")})`, "");
  career.forEach((n) => {
    const chapter = careerChapters.find((c) => n.col >= c.cols[0] && n.col <= c.cols[1]);
    const head = [`**${n.title}**`, n.place, n.period].filter(Boolean).join(" — ");
    lines.push(
      `- ${head}${n.kind === "current" ? " (en cours)" : ""}${chapter ? ` [${chapter.title}]` : ""}`,
      `  ${n.text}${n.tags?.length ? ` Compétences : ${n.tags.join(", ")}.` : ""}`,
    );
  });
  const choices = careerNodes.filter((n) => n.kind === "choice");
  if (choices.length) {
    lines.push("", "Choix décisifs :");
    choices.forEach((n) => lines.push(`- ${n.title}${n.period ? ` (${n.period})` : ""} : ${n.text}`));
  }
  const notTaken = careerNodes.filter((n) => n.kind === "locked");
  if (notTaken.length) {
    lines.push("", "Chemins non empruntés :");
    notTaken.forEach((n) => lines.push(`- ${n.title} : ${n.text}`));
  }
  const next = careerNodes.find((n) => n.kind === "future");
  if (next) lines.push("", `La suite${next.period ? ` (${next.period})` : ""} : ${next.text}`);

  lines.push("", `## Projets : études de cas (${sectionUrl("projets")})`, "");
  projects.forEach((p) => lines.push(projectMarkdown(p, full), ""));
  if (!full)
    lines.push(
      `Détail complet de chaque étude de cas (démarche, univers graphique, écrans, résultats) : ${absolute("/llms-full.txt")}`,
      "",
    );

  lines.push(`## Contact (${sectionUrl("contact")})`, "", `${site.status}. Réponse sous 48 h.`, "", `- E-mail : ${site.email}`);
  if (cv) lines.push(`- CV : ${cv}`);
  realSocials.forEach((s) => lines.push(`- ${s.label} : ${s.href}`));
  lines.push("");
  return lines.join("\n");
}

/** Données structurées d'une étude de cas */
export function projectJsonLd(p: Project, withContext = true) {
  return {
    ...(withContext ? { "@context": "https://schema.org" } : {}),
    "@type": "CreativeWork",
    "@id": `${projectUrl(p)}#project`,
    url: projectUrl(p),
    name: p.title,
    headline: `${p.title} — ${p.context}`,
    abstract: p.summary,
    description: `${p.problem} ${p.solution}`,
    dateCreated: String(p.year),
    inLanguage: "fr-FR",
    genre: p.context,
    keywords: [...p.tags, ...p.tools].join(", "),
    image: p.cover ? absolute(p.cover) : undefined,
    creator: { "@type": "Person", "@id": absolute("/#person"), name: site.name },
    contributor: { "@type": "Role", roleName: p.role },
    sameAs: p.link ? [p.link] : undefined,
  };
}

/** Données structurées de la personne et du portfolio (schema.org), pour l'accueil */
export function personJsonLd() {
  const current = careerNodes.find((n) => n.kind === "current");
  // Écoles nommées seulement (pas « 3 semestres (S1 – S3) »)
  const schools = careerNodes.filter((n) => n.domain === "formation" && n.place && !/^[0-9]/.test(n.place));
  const cv = cvUrl();
  const person = {
    "@type": "Person",
    "@id": absolute("/#person"),
    name: site.name,
    givenName: site.seo.givenName,
    familyName: site.seo.familyName,
    alternateName: [`${site.seo.familyName} ${site.seo.givenName}`, `${site.name}, UX/UI designer`],
    jobTitle: ["UX/UI designer", "Développeur front-end", site.role],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.seo.locality,
      addressRegion: site.seo.region,
      addressCountry: "FR",
    },
    homeLocation: { "@type": "Place", name: `${site.seo.department}, ${site.seo.region}` },
    worksFor: { "@type": "Organization", name: site.seo.employer.name, url: site.seo.employer.url },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: site.seo.credential.name,
      credentialCategory: "Titre certifié (Mastère)",
      recognizedBy: { "@type": "EducationalOrganization", name: site.seo.credential.by },
    },
    description: `${site.bio} ${site.status}.`,
    email: `mailto:${site.email}`,
    url: absolute("/"),
    image: site.portrait ? absolute(site.portrait) : undefined,
    nationality: { "@type": "Country", name: "France" },
    knowsLanguage: ["fr", "en"],
    knowsAbout: [
      ...profiles.flatMap((p) => p.skills.map((s) => s.name)),
      ...bridge,
      ...profiles.flatMap((p) => p.tools.map((t) => t.name)),
    ],
    alumniOf: [
      ...site.seo.schools.map((s) => ({ "@type": "EducationalOrganization", name: s.name, url: s.url })),
      ...schools
        .filter((n) => !site.seo.schools.some((s) => s.name === n.place))
        .map((n) => ({ "@type": "EducationalOrganization", name: n.place })),
    ],
    hasOccupation: current
      ? { "@type": "Occupation", name: current.title, description: current.text, skills: current.tags?.join(", ") }
      : undefined,
    subjectOf: cv ? { "@type": "DigitalDocument", name: `CV de ${site.name}`, url: cv, encodingFormat: "application/pdf" } : undefined,
    sameAs: realSocials.length ? realSocials.map((s) => s.href) : undefined,
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": absolute("/#website"),
        url: absolute("/"),
        name: `${site.name} — Portfolio`,
        alternateName: ["Portfolio de Baptiste Rouzic", "baptiste-rouzic.fr"],
        inLanguage: "fr-FR",
        author: { "@id": absolute("/#person") },
      },
      {
        "@type": "ProfilePage",
        "@id": absolute("/#profile"),
        url: absolute("/"),
        name: `${site.name} — ${site.role}`,
        description: site.description,
        inLanguage: "fr-FR",
        mainEntity: { "@id": absolute("/#person") },
        hasPart: projects.map((p) => ({ "@id": `${projectUrl(p)}#project` })),
      },
      person,
      ...projects.map((p) => projectJsonLd(p, false)),
    ],
  };
}
