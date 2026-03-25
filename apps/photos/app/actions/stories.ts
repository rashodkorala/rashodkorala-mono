"use server"

import { createPublicClient } from "@/utils/supabase/server"
import type { Photo } from "@/app/actions/photos"

export interface PublishedStory {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  published: boolean
  created_at: string
}

export async function getPublishedStories(): Promise<PublishedStory[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("stories")
      .select("id, title, slug, description, cover_image_url, published, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("getPublishedStories", error)
      return []
    }
    return (data || []) as PublishedStory[]
  } catch (e) {
    console.error("getPublishedStories", e)
    return []
  }
}

export async function getPublishedStoryBySlug(
  slug: string
): Promise<PublishedStory | null> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("stories")
      .select("id, title, slug, description, cover_image_url, published, created_at")
      .eq("published", true)
      .eq("slug", slug)
      .maybeSingle()

    if (error) {
      console.error("getPublishedStoryBySlug", error)
      return null
    }
    return data as PublishedStory | null
  } catch (e) {
    console.error("getPublishedStoryBySlug", e)
    return null
  }
}

export async function getPhotosForStory(storyId: string): Promise<Photo[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("story_id", storyId)
      .order("date_taken", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("getPhotosForStory", error)
      return []
    }
    return (data || []) as Photo[]
  } catch (e) {
    console.error("getPhotosForStory", e)
    return []
  }
}
