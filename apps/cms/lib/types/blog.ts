export type BlogStatus = "draft" | "published" | "archived"
export type TargetApp = "portfolio" | "photos" | "both"

// Database schema (snake_case)
export interface BlogDB {
  id: string
  user_id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  status: BlogStatus
  target_app: TargetApp
  published_at: string | null
  author_name: string | null
  category: string | null
  tags: string[] | null
  seo_title: string | null
  seo_description: string | null
  featured: boolean
  views: number
  created_at: string
  updated_at: string
}

// Application type (camelCase)
export interface Blog {
  id: string
  userId: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImageUrl: string | null
  status: BlogStatus
  targetApp: TargetApp
  publishedAt: string | null
  authorName: string | null
  category: string | null
  tags: string[] | null
  seoTitle: string | null
  seoDescription: string | null
  featured: boolean
  views: number
  createdAt: string
  updatedAt: string
}

export interface BlogInsert {
  title: string
  slug?: string
  excerpt?: string | null
  content: string
  featuredImageUrl?: string | null
  status?: BlogStatus
  targetApp?: TargetApp
  publishedAt?: string | null
  authorName?: string | null
  category?: string | null
  tags?: string[] | null
  seoTitle?: string | null
  seoDescription?: string | null
  featured?: boolean
}

export interface BlogUpdate extends Partial<BlogInsert> {
  id: string
}
