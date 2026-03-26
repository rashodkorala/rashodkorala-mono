import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedCaseStudyBySlug } from "@/lib/supabase/cached-case-studies";
import { getCachedProjectBySlug } from "@/lib/supabase/cached-projects";
import CaseStudyPage from "@/src/components/work/CaseStudyPage";
import ProjectPage from "@/src/components/work/ProjectPage";
import PageShell from "@/src/components/page-shell";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [caseStudy, project] = await Promise.all([
    getCachedCaseStudyBySlug(slug),
    getCachedProjectBySlug(slug),
  ]);

  const item = caseStudy ?? project;
  if (!item) return { title: "Not found" };

  const title = "seo_title" in item ? item.seo_title || item.title : item.title;
  const description =
    "seo_description" in item
      ? item.seo_description || ("summary" in item ? item.summary : undefined)
      : ("subtitle" in item ? item.subtitle : undefined);

  return {
    title,
    description: description ?? undefined,
    openGraph: {
      title: `${item.title} | Work`,
      description: description ?? undefined,
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [caseStudy, project] = await Promise.all([
    getCachedCaseStudyBySlug(slug),
    getCachedProjectBySlug(slug),
  ]);

  if (caseStudy) {
    return <PageShell><CaseStudyPage caseStudy={caseStudy} /></PageShell>;
  }

  if (project) {
    return <PageShell><ProjectPage project={project} /></PageShell>;
  }

  notFound();
}
