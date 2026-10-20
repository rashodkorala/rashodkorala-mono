"use server"

import { createHmac } from "node:crypto"
import { createClient } from "@/lib/supabase/server"

/** How long a preview link works after it's made. */
const PREVIEW_TTL_MS = 10 * 60 * 1000

/**
 * The portfolio's origin. PORTFOLIO_URL wins (set it to http://localhost:3002 to preview against
 * a local portfolio); otherwise it's taken from PORTFOLIO_REVALIDATE_URL.
 */
function portfolioOrigin(): string | null {
  const explicit = process.env.PORTFOLIO_URL?.trim()
  const fromRevalidate = process.env.PORTFOLIO_REVALIDATE_URL?.trim()
  const raw = explicit || fromRevalidate
  if (!raw) return null
  try {
    return new URL(raw).origin
  } catch {
    return null
  }
}

/**
 * A short-lived, signed link that opens a Satahan entry on the portfolio in Draft Mode,
 * so it shows exactly as the public page would, in any status. Signature scheme mirrors
 * `apps/portfolio/lib/preview-token.ts`.
 */
export async function getSatahanPreviewUrl(slug: string): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Sign in to preview")

  const origin = portfolioOrigin()
  const secret = process.env.PORTFOLIO_REVALIDATE_SECRET?.trim()
  if (!origin || !secret) throw new Error("Preview isn't set up: add PORTFOLIO_URL and PORTFOLIO_REVALIDATE_SECRET")
  if (!slug.trim()) throw new Error("Add a URL slug first")

  const expires = Date.now() + PREVIEW_TTL_MS
  const sig = createHmac("sha256", secret).update(`${slug}.${expires}`).digest("hex")
  const params = new URLSearchParams({ slug, expires: String(expires), sig })
  return `${origin}/api/preview?${params}`
}
