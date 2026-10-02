"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { requestPortfolioRevalidation } from "@/lib/revalidate-portfolio"
import type { AboutFormData, AboutProfile, AboutProfileDB, AboutSocialLink } from "@/lib/types/about"

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

function cleanLinks(links: AboutSocialLink[]): AboutSocialLink[] {
  return links
    .map((link) => ({ label: link.label.trim(), url: link.url.trim() }))
    .filter((link) => link.label && link.url)
}

async function uploadAvatar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg"
  const path = `about/avatar/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true })
  if (error) throw new Error(`Failed to upload photo: ${error.message}`)
  const { data } = supabase.storage.from("media").getPublicUrl(path)
  return data.publicUrl
}

export async function saveAboutProfile(data: AboutFormData): Promise<AboutProfile> {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) throw new Error("Unauthorized")

  const existing = await getAboutProfile()

  let avatarUrl = data.clearAvatar ? null : data.avatarUrl
  if (data.avatarFile) {
    avatarUrl = await uploadAvatar(supabase, data.avatarFile)
  }

  const payload = {
    display_name: data.displayName.trim() || null,
    bio_md: data.bioMd,
    avatar_url: avatarUrl,
    social_links: cleanLinks(data.socialLinks),
    updated_at: new Date().toISOString(),
  }

  const query = existing
    ? supabase.from("about_profiles").update(payload).eq("id", existing.id).eq("user_id", user.id)
    : supabase.from("about_profiles").insert({ ...payload, user_id: user.id })

  const { data: result, error } = await query.select("*").single()
  if (error) throw new Error(`Failed to save about profile: ${error.message}`)

  revalidatePath("/protected/about")
  await requestPortfolioRevalidation()
  return transform(result as AboutProfileDB)
}

