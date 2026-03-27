"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { MediaItem, MediaLibraryDB, MediaInsert, MediaUpdate } from "@/lib/types/media"

function transformMedia(m: MediaLibraryDB): MediaItem {
  return {
    id: m.id,
    userId: m.user_id,
    bucket: m.bucket,
    path: m.path,
    publicUrl: m.public_url,
    mediaType: m.media_type,
    width: m.width,
    height: m.height,
    bytes: m.bytes,
    altText: m.alt_text,
    folder: m.folder,
    tags: m.tags,
    createdAt: m.created_at,
    updatedAt: m.updated_at,
  }
}

export async function getMedia(folder?: string): Promise<MediaItem[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  let query = supabase
    .from("media_library")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (folder) {
    query = query.eq("folder", folder)
  }

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch media: ${error.message}`)

  return (data || []).map(transformMedia)
}

export async function getMediaByType(mediaType: string): Promise<MediaItem[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("media_library")
    .select("*")
    .eq("user_id", user.id)
    .eq("media_type", mediaType)
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch media: ${error.message}`)

  return (data || []).map(transformMedia)
}

export async function getMediaItem(id: string): Promise<MediaItem | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("media_library")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch media: ${error.message}`)
  }

  return data ? transformMedia(data) : null
}

export async function createMedia(media: MediaInsert): Promise<MediaItem> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("media_library")
    .insert({
      user_id: user.id,
      bucket: media.bucket || "media",
      path: media.path,
      public_url: media.publicUrl,
      media_type: media.mediaType,
      width: media.width || null,
      height: media.height || null,
      bytes: media.bytes || null,
      alt_text: media.altText || null,
      folder: media.folder || null,
      tags: media.tags || [],
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create media: ${error.message}`)

  revalidatePath("/protected/media")
  return transformMedia(data)
}

export async function updateMedia(media: MediaUpdate): Promise<MediaItem> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("media_library")
    .update({
      alt_text: media.altText,
      folder: media.folder,
      tags: media.tags,
    })
    .eq("id", media.id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update media: ${error.message}`)

  revalidatePath("/protected/media")
  return transformMedia(data)
}

export async function deleteMedia(id: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("media_library")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error(`Failed to delete media: ${error.message}`)

  revalidatePath("/protected/media")
}
