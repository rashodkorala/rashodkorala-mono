import type { Metadata } from "next";
import SatahanPageContent from "@/src/components/satahan/SatahanPageContent";
import PageShell from "@/src/components/page-shell";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies";
import { buildSatahanItems } from "@/lib/entries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Satahan",
  description: "Case studies and writing by Rashod Korala.",
};

export default async function SatahanPage() {
  // Same as /projects: let Supabase errors throw so ISR never caches an empty list.
  const [projects, caseStudies] = await Promise.all([
    getCachedAllProjects(),
    getCachedCaseStudies(),
  ]);
  return (
    <PageShell>
      <SatahanPageContent items={buildSatahanItems(caseStudies, projects)} />
    </PageShell>
  );
}
