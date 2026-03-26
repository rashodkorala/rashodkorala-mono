export type MediaType = "image" | "video" | "document" | "audio"

// Database schema (snake_case) — matches media_library table
export interface MediaLibraryDB {
  id: string
  user_id: string
  bucket: string
  path: string
  public_url: string
  media_type: MediaType
  width: number | null
  height: number | null
  bytes: number | null
  alt_text: string | null
  folder: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

// Application type (camelCase)
export interface MediaItem {
  id: string
  userId: string
  bucket: string
  path: string
  publicUrl: string
  mediaType: MediaType
  width: number | null
  height: number | null
  bytes: number | null
  altText: string | null
  folder: string | null
  tags: string[] | null
  createdAt: string
  updatedAt: string
}

export type Media = MediaItem

export interface MediaInsert {
  bucket?: string
  path: string
  publicUrl: string
  mediaType: MediaType
  width?: number | null
  height?: number | null
  bytes?: number | null
  altText?: string | null
  folder?: string | null
  tags?: string[] | null
}

export interface MediaUpdate extends Partial<Omit<MediaInsert, "path" | "bucket">> {
  id: string
  altText?: string | null
  folder?: string | null
  tags?: string[] | null
}
