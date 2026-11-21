import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { absolute } from "./lib/site-url";

/** Date de la mise en ligne (chaque déploiement régénère le sitemap) : indique aux moteurs que le contenu a changé */
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absolute("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({ url: absolute(`/projets/${p.slug}`), lastModified, changeFrequency: "yearly" as const, priority: 0.8 })),
    { url: absolute("/cv"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: absolute("/credits"), lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
