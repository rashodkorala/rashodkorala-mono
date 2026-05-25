import type { Photo } from "./photo"

// Database schema (snake_case)
export interface AlbumDB {
  id: string
  user_id: string
  slug: string
  title: string
  description: string | null
  cover_path: string | null
  location: string | null
  date_from: string | null
  date_to: string | null
  tags: string[]
  featured: boolean
  status: "draft" | "published"
  order: number
  created_at: string
  updated_at: string
}

// Application type (camelCase)
export interface Album {
  id: string
  userId: string
  slug: string
  title: string
  description: string | null
  coverPath: string | null
  location: string | null
  dateFrom: string | null
  dateTo: string | null
  tags: string[]
  featured: boolean
  status: "draft" | "published"
  order: number
  createdAt: string
  updatedAt: string
}

export interface AlbumPhotoEntryDB {
  id: string
  album_id: string
  photo_id: string
  position: number
  caption: string | null
  created_at: string
}

export interface AlbumPhotoEntry {
  id: string
  albumId: string
  photoId: string
  position: number
  caption: string | null
  createdAt: string
  photo: Photo
}

export interface AlbumWithPhotos extends Album {
  photos: AlbumPhotoEntry[]
}

export interface AlbumInsert {
  title: string
  slug: string
  description?: string | null
  coverImageFile?: File | null
  clearCoverImage?: boolean
  location?: string | null
  dateFrom?: string | null
  dateTo?: string | null
  tags?: string[]
  featured?: boolean
  status?: "draft" | "published"
  order?: number
}

export interface AlbumUpdate extends Partial<AlbumInsert> {
  id: string
}
