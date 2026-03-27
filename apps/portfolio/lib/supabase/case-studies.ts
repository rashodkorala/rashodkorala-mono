import { supabase } from "../supabase";
import type { CaseStudy } from "../types";

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .order("order", { ascending: true })
    .order("created_at", { ascending: false });

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
    .single();

  if (error) {
    console.error("Error fetching case study:", error);
    return null;
  }

  if (!data) return null;

  const projects = data.project_id
    ? (
        await supabase
          .from('projects')
          .select('*')
          .eq('id', data.project_id)
      ).data || []
    : [];

  return { ...data, relatedProjects: projects } as CaseStudy;
}
