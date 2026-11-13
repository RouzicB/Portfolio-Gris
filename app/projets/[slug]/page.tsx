import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCase from "../../components/project/ProjectCase";
import { adjacentProjects, projects } from "../../data/projects";

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
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const nav = adjacentProjects(slug);
  if (!nav) notFound();
  return <ProjectCase slug={slug} />;
}
