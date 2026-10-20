import { supabase } from "../supabase";
import type { CaseStudy } from "../types";

/** Cookie holding the CMS preview token while Draft Mode is on. */
export const PREVIEW_TOKEN_COOKIE = "satahan_preview";

/** Tokens are 24 random bytes in hex; anything else is rejected before touching the database. */
export function isPreviewTokenShape(token: string | undefined | null): token is string {
  return !!token && /^[0-9a-f]{48}$/.test(token);
}

/**
 * The entry a CMS preview token opens, in any status, read fresh (no cache). Goes through the
 * `preview_case_study()` database function with the public key, so the portfolio needs no
 * service-role key: an expired or unknown token simply returns nothing.
 */
export async function getPreviewCaseStudy(token: string): Promise<CaseStudy | null> {
  if (!isPreviewTokenShape(token)) return null;
  const { data, error } = await supabase.rpc("preview_case_study", { preview_token: token }).maybeSingle();
  if (error) {
    console.error("Error fetching preview entry:", error);
    return null;
  }
  return (data as CaseStudy | null) ?? null;
}
