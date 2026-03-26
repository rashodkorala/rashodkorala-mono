import { supabase } from "../supabase";
import type { CaseStudy } from "../types";

function resolveCoverPath(cs: any): string | null {
  if (!cs.cover_path) return null;
  const { data } = supabase.storage.from("media").getPublicUrl(cs.cover_path);
  return data.publicUrl;
}

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

  return (data || []).map((row: any) => ({
    ...row,
    cover_path: resolveCoverPath(row),
  })) as CaseStudy[];
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

  if (!data) return null;
  return {
    ...data,
    cover_path: resolveCoverPath(data),
  } as CaseStudy;
}
