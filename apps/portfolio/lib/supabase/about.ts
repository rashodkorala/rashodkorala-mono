import { createClient } from "@supabase/supabase-js"

export interface AboutSocialLink {
  label: string
  url: string
}

export interface AboutContent {
  displayName: string | null
  bioMd: string
  avatarUrl: string | null
  socialLinks: AboutSocialLink[]
}

/**
 * Home / about copy. Read on every request — do not wrap this in unstable_cache
 * or a revalidate window.
 */
export async function getAboutContent(): Promise<AboutContent | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  })

  const { data, error } = await supabase
    .from("about_profiles")
    .select("display_name, bio_md, avatar_url, social_links")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) {
    if (error) console.error("Error fetching about profile:", error)
    return null
  }

  const links = Array.isArray(data.social_links) ? data.social_links : []

  return {
    displayName: data.display_name,
    bioMd: data.bio_md || "",
    avatarUrl: data.avatar_url,
    socialLinks: links.filter(
      (link): link is AboutSocialLink =>
        !!link &&
        typeof link === "object" &&
        typeof (link as AboutSocialLink).label === "string" &&
        typeof (link as AboutSocialLink).url === "string"
    ),
  }
}
