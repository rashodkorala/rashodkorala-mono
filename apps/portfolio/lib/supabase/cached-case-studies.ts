import { unstable_cache } from "next/cache";
import { getAllCaseStudies, getCaseStudyBySlug } from "./case-studies";
import type { CaseStudy } from "@/lib/types";

const REVALIDATE = 3600;
const TAGS = ["case-studies"];

export async function getCachedCaseStudies(): Promise<CaseStudy[]> {
  return unstable_cache(
    () => getAllCaseStudies(),
    ["case-studies-list"],
    { revalidate: REVALIDATE, tags: TAGS }
  )();
}

export async function getCachedCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  return unstable_cache(
    () => getCaseStudyBySlug(slug),
    ["case-study-by-slug", slug],
    { revalidate: REVALIDATE, tags: [...TAGS, `case-study-${slug}`] }
  )();
}
