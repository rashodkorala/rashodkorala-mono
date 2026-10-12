import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedProjectBySlug } from "@/lib/supabase/cached-projects";
import { mediaUrl, projectCaseStudies } from "@/lib/entries";
import ProjectPage from "@/src/components/projects/ProjectPage";
import PageShell from "@/src/components/page-shell";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCachedProjectBySlug(slug);
  if (!project) return { title: "Not found" };

  const description = project.subtitle || project.short_description || `Explore ${project.title} by Rashod Korala.`;
  const image = project.cover_image ? mediaUrl(project.cover_image) : null;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} | Rashod Korala`,
      description,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      title: `${project.title} | Rashod Korala`,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getCachedProjectBySlug(slug);
  if (!project) notFound();

  return (
    <PageShell>
      <ProjectPage
        project={project}
        caseStudies={projectCaseStudies(project.id, project.relatedCaseStudies ?? [])}
      />
    </PageShell>
  );
}
