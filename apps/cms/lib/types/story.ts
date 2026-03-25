export interface StoryDB {
  id: string
  user_id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface Story {
  id: string
  user_id: string
  title: string
  slug: string
  description: string | null
  coverImageUrl: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface StoryInsert {
  title: string
  slug: string
  description?: string | null
  coverImageUrl?: string | null
  published?: boolean
}

export interface StoryUpdate extends Partial<StoryInsert> {
  id: string
}
