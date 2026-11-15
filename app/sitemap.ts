import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { absolute } from "./lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absolute("/"), changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({ url: absolute(`/projets/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.8 })),
    { url: absolute("/credits"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
