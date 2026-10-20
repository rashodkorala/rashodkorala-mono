"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * The portfolio's origin. PORTFOLIO_URL wins (set it to http://localhost:3002 to preview against
 * a local portfolio); otherwise it's taken from PORTFOLIO_REVALIDATE_URL.
 */
function portfolioOrigin(): string | null {
  const raw = process.env.PORTFOLIO_URL?.trim() || process.env.PORTFOLIO_REVALIDATE_URL?.trim()
  if (!raw) return null
  try {
    return new URL(raw).origin
  } catch {
    return null
  }
}

/**
 * A link that opens a Satahan entry on the portfolio in Draft Mode, exactly as the public page
 * would show it, in any status. It carries a fresh `preview_tokens` row (valid for an hour,
 * for this one entry), which the portfolio exchanges via `preview_case_study()` using only
 * the public key.
 */
export async function getSatahanPreviewUrl(slug: string): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Sign in to preview")

  const origin = portfolioOrigin()
  if (!origin) throw new Error("Preview isn't set up: add PORTFOLIO_URL to the CMS environment")
  if (!slug.trim()) throw new Error("Add a URL slug first")

  const { data: entry } = await supabase
    .from("case_studies")
    .select("id")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .maybeSingle()
  if (!entry) throw new Error("Save the entry before previewing it")

  // Tidy up as we go: there's no scheduler, so old tokens are cleared whenever a new one is made.
  await supabase.from("preview_tokens").delete().eq("user_id", user.id).lt("expires_at", new Date().toISOString())

  const { data: token, error } = await supabase
    .from("preview_tokens")
    .insert({ case_study_id: entry.id })
    .select("token")
    .single()
  if (error || !token) throw new Error(`Couldn't create a preview link${error ? `: ${error.message}` : ""}`)

  return `${origin}/api/preview?${new URLSearchParams({ token: token.token })}`
}
