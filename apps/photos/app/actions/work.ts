"use server";

import { createPublicClient } from "@/utils/supabase/server";

export interface WorkProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  case_study_url: string | null;
  tech: string[] | null;
  created_at: string;
  sort_order: number | null;
  target_app: "portfolio" | "photos" | "both" | null;
}

export async function getPublishedWorkProjects(): Promise<WorkProject[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("work")
      .select(
        "id, slug, title, subtitle, description, cover_image_url, live_url, github_url, case_study_url, tech, created_at, sort_order, target_app"
      )
      .eq("status", "published")
      .in("target_app", ["photos", "both"])
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getPublishedWorkProjects", error);
      return [];
    }

    return (data || []) as WorkProject[];
  } catch (e) {
    console.error("getPublishedWorkProjects", e);
    return [];
  }
}
