"use server"

import { createClient } from "@/lib/supabase/server"
import type { AboutProfile, AboutProfileDB } from "@/lib/types/about"

function transform(row: AboutProfileDB): AboutProfile {
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    headline: row.headline,
    bioMd: row.bio_md,
    location: row.location,
    emailPublic: row.email_public,
    avatarUrl: row.avatar_url,
    socialLinks: row.social_links || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getAboutProfile(): Promise<AboutProfile | null> {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("about_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()
  if (error) throw new Error(`Failed to fetch about profile: ${error.message}`)
  return data ? transform(data as AboutProfileDB) : null
}

