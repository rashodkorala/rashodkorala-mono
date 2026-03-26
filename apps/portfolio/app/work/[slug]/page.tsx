import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedCaseStudyBySlug } from "@/lib/supabase/cached-case-studies";
import CaseStudyPage from "@/src/components/work/CaseStudyPage";
import PageShell from "@/src/components/page-shell";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCachedCaseStudyBySlug(slug);
  if (!caseStudy) return { title: "Case study not found" };

  return {
    title: caseStudy.seo_title || caseStudy.title,
    description: caseStudy.seo_description || caseStudy.summary || caseStudy.lede || undefined,
    openGraph: {
      title: `${caseStudy.title} | Work`,
      description: caseStudy.summary || caseStudy.lede || undefined,
      images: caseStudy.cover_path ? [caseStudy.cover_path] : undefined,
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCachedCaseStudyBySlug(slug);
  if (!caseStudy) notFound();

  return <PageShell><CaseStudyPage caseStudy={caseStudy} /></PageShell>;
}
