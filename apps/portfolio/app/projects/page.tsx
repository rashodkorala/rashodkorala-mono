import type { Metadata } from "next";
import ProjectsPageContent from "@/src/components/projects/ProjectsPageContent";
import PageShell from "@/src/components/page-shell";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies";
import { buildProjectItems } from "@/lib/entries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Rashod Korala.",
};

export default async function ProjectsPage() {
  // Do not catch Supabase errors and fall back to []: ISR would cache that empty
  // response as a successful render, so /projects could go blank after revalidation.
  const [projects, caseStudies] = await Promise.all([
    getCachedAllProjects(),
    getCachedCaseStudies(),
  ]);
  return (
    <PageShell>
      <ProjectsPageContent items={buildProjectItems(projects, caseStudies)} />
    </PageShell>
  );
}
