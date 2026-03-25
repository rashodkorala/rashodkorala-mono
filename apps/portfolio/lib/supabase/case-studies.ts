import { supabase } from "../supabase";
import type { CaseStudy } from "../types";

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching case studies:", error);
    throw error;
  }

  return (data || []) as CaseStudy[];
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
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
}
