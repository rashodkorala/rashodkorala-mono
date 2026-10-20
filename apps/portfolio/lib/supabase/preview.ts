import { createClient } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import type { CaseStudy } from "../types";

/**
 * Reads an entry in any status for Draft Mode previews, bypassing the cache so edits show
 * straight away. Uses the service-role key when set, so previews keep working if public
 * reads are ever limited to published rows; otherwise falls back to the public client.
 */
function previewClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return supabase;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function getPreviewCaseStudy(slug: string): Promise<CaseStudy | null> {
  const { data, error } = await previewClient().from("case_studies").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("Error fetching preview entry:", error);
    return null;
  }
  return (data as CaseStudy | null) ?? null;
}
