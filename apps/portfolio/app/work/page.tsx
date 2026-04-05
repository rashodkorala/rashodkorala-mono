import type { Metadata } from "next";
import WorkPageContent from "@/src/components/work/WorkPageContent";
import PageShell from "@/src/components/page-shell";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies";
import type { Project, CaseStudy } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies and projects by Rashod Korala.",
};

export default async function WorkPage() {
  let projects: Project[] = [];
  let caseStudies: CaseStudy[] = [];
  try {
    [projects, caseStudies] = await Promise.all([
      getCachedAllProjects(),
      getCachedCaseStudies(),
    ]);
  } catch (error) {
    console.error("Failed to load work page data:", error);
  }
  return (
    <PageShell>
      <WorkPageContent projects={projects} caseStudies={caseStudies} />
    </PageShell>
  );
}
