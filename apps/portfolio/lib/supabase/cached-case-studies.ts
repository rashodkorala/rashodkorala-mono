import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { CaseStudy } from "@/lib/types";

const REVALIDATE = 3600;
const TAGS = ["case-studies"];

export async function getCachedCaseStudies(): Promise<CaseStudy[]> {
  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching case studies:", error);
        return [];
      }
      return (data || []) as CaseStudy[];
    },
    ["case-studies-list"],
    { revalidate: REVALIDATE, tags: TAGS }
  )();
}

export async function getCachedCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) {
        console.error("Error fetching case study:", error);
        return null;
      }
      return data as CaseStudy;
    },
    ["case-study-by-slug", slug],
    { revalidate: REVALIDATE, tags: [...TAGS, `case-study-${slug}`] }
  )();
}
