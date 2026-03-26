import type { Metadata } from "next";
import WorkPageContent from "@/src/components/work/WorkPageContent";
import PageShell from "@/src/components/page-shell";
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies and projects by Rashod Korala.",
};

export default async function WorkPage() {
  const [caseStudies, projects] = await Promise.all([
    getCachedCaseStudies(),
    getCachedAllProjects(),
  ]);
  return (
    <PageShell>
      <WorkPageContent caseStudies={caseStudies} projects={projects} />
    </PageShell>
  );
}
