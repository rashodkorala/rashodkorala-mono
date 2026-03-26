import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedCaseStudyBySlug } from "@/lib/supabase/cached-case-studies";
import { supabase } from "@/lib/supabase";
import CaseStudyPage from "@/src/components/work/CaseStudyPage";
import PageShell from "@/src/components/page-shell";

export const revalidate = 3600;

async function getCaseStudyMdx(mdxPath: string | null | undefined): Promise<string> {
  if (!mdxPath) return "";
  const normalizedPath = mdxPath.startsWith("case-studies/") ? mdxPath : `case-studies/${mdxPath}`;
  const { data, error } = await supabase.storage.from("content").download(normalizedPath);
  if (error || !data) return "";
  return data.text();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCachedCaseStudyBySlug(slug);
  if (!caseStudy) return { title: "Case study not found" };

  return {
    title: caseStudy.title,
    description: caseStudy.summary || caseStudy.lede || undefined,
    openGraph: {
      title: `${caseStudy.title} | Work`,
      description: caseStudy.summary || caseStudy.lede || undefined,
      images: caseStudy.cover_url ? [caseStudy.cover_url] : undefined,
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

  const mdxContent = await getCaseStudyMdx(caseStudy.mdx_path);
  return <PageShell><CaseStudyPage caseStudy={caseStudy} mdxContent={mdxContent} /></PageShell>;
}
