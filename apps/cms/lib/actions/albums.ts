"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Album, AlbumDB, AlbumInsert, AlbumUpdate, AlbumWithPhotos, AlbumPhotoEntry } from "@/lib/types/album"
import type { Photo, PhotoDB } from "@/lib/types/photo"

function transformPhoto(photo: PhotoDB): Photo {
  return {
    id: photo.id,
    title: photo.title,
    description: photo.description,
    imageUrl: photo.image_url,
    altText: photo.alt_text,
    category: photo.category,
    location: photo.location,
    dateTaken: photo.date_taken,
    cameraSettings: photo.camera_settings,
    tags: photo.tags,
    featured: photo.featured,
    created_at: photo.created_at,
    updated_at: photo.updated_at,
    user_id: photo.user_id,
  }
}

function transformAlbum(a: AlbumDB): Album {
  return {
    id: a.id,
    userId: a.user_id,
    slug: a.slug,
    title: a.title,
    description: a.description ?? null,
    coverPath: a.cover_path ?? null,
    location: a.location ?? null,
    dateFrom: a.date_from ?? null,
    dateTo: a.date_to ?? null,
    tags: a.tags || [],
    featured: a.featured,
    status: a.status ?? "draft",
    order: a.order ?? 0,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
  }
}

export async function getAlbums(): Promise<Album[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("user_id", user.id)
    .order("order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch albums: ${error.message}`)

  return (data || []).map(transformAlbum)
}

export async function getAlbum(id: string): Promise<Album | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch album: ${error.message}`)
  }

  return data ? transformAlbum(data) : null
}

export async function getAlbumWithPhotos(id: string): Promise<AlbumWithPhotos | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: albumData, error: albumError } = await supabase
    .from("albums")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (albumError) {
    if (albumError.code === "PGRST116") return null
    throw new Error(`Failed to fetch album: ${albumError.message}`)
  }

  if (!albumData) return null

  const { data: photoEntries, error: entriesError } = await supabase
    .from("album_photos")
    .select("*, photos(*)")
    .eq("album_id", id)
    .order("position", { ascending: true })

  if (entriesError) throw new Error(`Failed to fetch album photos: ${entriesError.message}`)

  const photos: AlbumPhotoEntry[] = (photoEntries || []).map((entry: Record<string, unknown>) => ({
    id: entry.id as string,
    albumId: entry.album_id as string,
    photoId: entry.photo_id as string,
    position: entry.position as number,
    caption: (entry.caption as string | null) ?? null,
    createdAt: entry.created_at as string,
    photo: transformPhoto(entry.photos as Parameters<typeof transformPhoto>[0]),
  }))

  return {
    ...transformAlbum(albumData),
    photos,
  }
}

export async function createAlbum(data: AlbumInsert): Promise<Album> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  let coverPath: string | null = null
  if (data.coverImageFile) {
    const ext = data.coverImageFile.name.split(".").pop()
    const path = `albums/${data.slug}/cover/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, data.coverImageFile)
    if (uploadError) throw new Error(`Failed to upload cover: ${uploadError.message}`)
    coverPath = path
  }

  const payload = {
    user_id: user.id,
    slug: data.slug,
    title: data.title,
    description: data.description ?? null,
    cover_path: coverPath,
    location: data.location ?? null,
    date_from: data.dateFrom ?? null,
    date_to: data.dateTo ?? null,
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    status: data.status ?? "draft",
    order: data.order ?? 0,
  }

  const { data: result, error } = await supabase
    .from("albums")
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(`Failed to create album: ${error.message}`)

  revalidatePath("/protected/albums")

  return transformAlbum(result)
}

export async function updateAlbum(data: AlbumUpdate): Promise<Album> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: existing } = await supabase
    .from("albums")
    .select("cover_path, slug")
    .eq("id", data.id)
    .eq("user_id", user.id)
    .single()

  let coverPath: string | null = existing?.cover_path ?? null
  if (data.clearCoverImage) coverPath = null
  if (data.coverImageFile) {
    const ext = data.coverImageFile.name.split(".").pop()
    const slug = data.slug || existing?.slug || data.id
    const path = `albums/${slug}/cover/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(path, data.coverImageFile)
    if (uploadError) throw new Error(`Failed to upload cover: ${uploadError.message}`)
    coverPath = path
  }

  const payload: Record<string, unknown> = { cover_path: coverPath }
  if (data.title !== undefined) payload.title = data.title
  if (data.slug !== undefined) payload.slug = data.slug
  if (data.description !== undefined) payload.description = data.description
  if (data.location !== undefined) payload.location = data.location
  if (data.dateFrom !== undefined) payload.date_from = data.dateFrom
  if (data.dateTo !== undefined) payload.date_to = data.dateTo
  if (data.tags !== undefined) payload.tags = data.tags
  if (data.featured !== undefined) payload.featured = data.featured
  if (data.status !== undefined) payload.status = data.status
  if (data.order !== undefined) payload.order = data.order

  const { data: result, error } = await supabase
    .from("albums")
    .update(payload)
    .eq("id", data.id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update album: ${error.message}`)

  revalidatePath("/protected/albums")

  return transformAlbum(result)
}

export async function deleteAlbum(id: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const album = await getAlbum(id)
  if (album) {
    const { data: coverFiles } = await supabase.storage
      .from("media")
      .list(`albums/${album.slug}/cover`)
    if (coverFiles?.length) {
      await supabase.storage
        .from("media")
        .remove(coverFiles.map((f) => `albums/${album.slug}/cover/${f.name}`))
    }
  }

  const { error } = await supabase
    .from("albums")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error(`Failed to delete album: ${error.message}`)

  revalidatePath("/protected/albums")
}

export async function addPhotoToAlbum(
  albumId: string,
  photoId: string,
  caption?: string
): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { count } = await supabase
    .from("album_photos")
    .select("*", { count: "exact", head: true })
    .eq("album_id", albumId)

  const { error } = await supabase.from("album_photos").insert({
    album_id: albumId,
    photo_id: photoId,
    position: (count ?? 0),
    caption: caption ?? null,
  })

  if (error) throw new Error(`Failed to add photo to album: ${error.message}`)

  revalidatePath("/protected/albums")
}

export async function removePhotoFromAlbum(
  albumId: string,
  photoId: string
): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("album_photos")
    .delete()
    .eq("album_id", albumId)
    .eq("photo_id", photoId)

  if (error) throw new Error(`Failed to remove photo from album: ${error.message}`)

  revalidatePath("/protected/albums")
}

export async function reorderAlbumPhotos(
  albumId: string,
  orderedPhotoIds: string[]
): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  for (const [index, photoId] of orderedPhotoIds.entries()) {
    await supabase
      .from("album_photos")
      .update({ position: index })
      .eq("album_id", albumId)
      .eq("photo_id", photoId)
  }

  revalidatePath("/protected/albums")
}

export async function updatePhotoCaption(
  albumId: string,
  photoId: string,
  caption: string | null
): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("album_photos")
    .update({ caption })
    .eq("album_id", albumId)
    .eq("photo_id", photoId)

  if (error) throw new Error(`Failed to update caption: ${error.message}`)

  revalidatePath("/protected/albums")
}
