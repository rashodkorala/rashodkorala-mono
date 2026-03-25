"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Story, StoryDB, StoryInsert, StoryUpdate } from "@/lib/types/story"

function transformStory(row: StoryDB): Story {
  return {
    ...row,
    coverImageUrl: row.cover_image_url,
  }
}

export async function getStories(): Promise<Story[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch stories: ${error.message}`)
  }

  return (data || []).map((row) => transformStory(row as StoryDB))
}

export async function getStory(id: string): Promise<Story | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch story: ${error.message}`)
  }

  return data ? transformStory(data as StoryDB) : null
}

export async function createStory(input: StoryInsert): Promise<Story> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("stories")
    .insert({
      user_id: user.id,
      title: input.title.trim(),
      slug: input.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      description: input.description?.trim() || null,
      cover_image_url: input.coverImageUrl?.trim() || null,
      published: input.published ?? true,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create story: ${error.message}`)
  }

  revalidatePath("/protected/stories")
  return transformStory(data as StoryDB)
}

export async function updateStory(input: StoryUpdate): Promise<Story> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { id, ...updates } = input

  const patch: Record<string, unknown> = {}
  if (updates.title !== undefined) patch.title = updates.title.trim()
  if (updates.slug !== undefined) {
    patch.slug = updates.slug.trim().toLowerCase().replace(/\s+/g, "-")
  }
  if (updates.description !== undefined) {
    patch.description = updates.description?.trim() || null
  }
  if (updates.coverImageUrl !== undefined) {
    patch.cover_image_url = updates.coverImageUrl?.trim() || null
  }
  if (updates.published !== undefined) patch.published = updates.published

  const { data, error } = await supabase
    .from("stories")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update story: ${error.message}`)
  }

  revalidatePath("/protected/stories")
  return transformStory(data as StoryDB)
}

export async function deleteStory(id: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("stories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(`Failed to delete story: ${error.message}`)
  }

  revalidatePath("/protected/stories")
}
