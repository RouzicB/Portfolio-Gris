import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCase from "../../components/project/ProjectCase";
import { adjacentProjects, projects, toCard } from "../../data/projects";
import JsonLd from "../../components/JsonLd";
import { projectJsonLd } from "../../lib/machine-readable";

/** Une page statique par étude de cas */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    keywords: [...project.tags, ...project.tools],
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: { type: "article", title: project.title, description: project.summary, images: project.cover ? [project.cover] : undefined },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const nav = adjacentProjects(slug);
  if (!nav) notFound();
  const project = projects.find((p) => p.slug === slug)!;
  return (
    <>
      <JsonLd data={projectJsonLd(project)} />
      {/* Le navigateur ne reçoit que ce projet et deux cartes : pas le contenu des autres études */}
      <ProjectCase
        project={project}
        nav={{
          index: nav.index,
          total: projects.length,
          prev: { ...toCard(nav.prev), index: projects.indexOf(nav.prev) },
          next: { ...toCard(nav.next), index: projects.indexOf(nav.next) },
        }}
      />
    </>
  );
}
