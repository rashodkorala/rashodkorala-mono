import type { Metadata } from "next";
import WorkPageContent from "@/src/components/work/WorkPageContent";
import PageShell from "@/src/components/page-shell";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies";
import { buildWorkItems } from "@/lib/work";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work",
  description: "Projects and case studies by Rashod Korala.",
};

export default async function WorkPage() {
  // Do not catch Supabase errors and fall back to []: ISR would cache that empty
  // response as a successful render, so /work could go blank after revalidation.
  const [projects, caseStudies] = await Promise.all([
    getCachedAllProjects(),
    getCachedCaseStudies(),
  ]);
  return (
    <PageShell>
      <WorkPageContent items={buildWorkItems(projects, caseStudies)} />
    </PageShell>
  );
}
