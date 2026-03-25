import type { Metadata } from "next";
import CaseStudiesList from "@/src/components/work/CaseStudiesList";
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work",
  description: "Narrative-first case studies: problem, process, and outcomes.",
};

export default async function WorkPage() {
  const items = await getCachedCaseStudies();
  return <CaseStudiesList items={items} />;
}
