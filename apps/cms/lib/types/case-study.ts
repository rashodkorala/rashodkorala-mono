export type CaseStudyStatus = "draft" | "published" | "archived"
export type CaseStudyType = "problem-solving" | "descriptive"
export type CaseStudyCategory = "startup" | "client" | "personal" | "school"

export interface Link {
  label: string
  url: string
}

export interface Metric {
  label: string
  value: string
}

export interface Result {
  text: string
}

// Database schema (snake_case) — matches new case_studies table
export interface CaseStudyDB {
  id: string
  user_id: string
  project_id: string | null
  title: string
  slug: string
  lede: string | null
  summary: string | null
  content_md: string
  type: CaseStudyType
  status: CaseStudyStatus
  category: CaseStudyCategory | null
  featured: boolean
  sort_order: number
  role: string | null
  team_size: string | null
  timeline: string | null
  industry: string | null
  audience: string | null
  tags: string[]
  skills: string[]
  stack: string[]
  results: Result[]
  metrics: Metric[]
  links: Link[]
  cover_path: string | null
  gallery_paths: string[]
  seo_title: string | null
  seo_description: string | null
  views: number
  published_at: string | null
  created_at: string
  updated_at: string
}

// Application type (camelCase)
export interface CaseStudy {
  id: string
  userId: string
  projectId?: string | null
  title: string
  slug: string
  lede?: string | null
  summary?: string | null
  contentMd: string
  type: CaseStudyType
  status: CaseStudyStatus
  category?: CaseStudyCategory | null
  featured: boolean
  sortOrder: number
  role?: string | null
  teamSize?: string | null
  timeline?: string | null
  industry?: string | null
  audience?: string | null
  tags: string[]
  skills: string[]
  stack: string[]
  results: Result[]
  metrics: Metric[]
  links: Link[]
  coverPath?: string | null
  galleryPaths: string[]
  seoTitle?: string | null
  seoDescription?: string | null
  views: number
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface CaseStudyFormData {
  projectId?: string | null
  title: string
  slug: string
  lede: string
  summary: string
  contentMd: string
  type: CaseStudyType
  status: CaseStudyStatus
  category?: CaseStudyCategory | null
  featured: boolean
  sortOrder: number
  role: string
  teamSize: string
  timeline: string
  industry: string
  audience: string
  tags: string[]
  skills: string[]
  stack: string[]
  results: Result[]
  metrics: Metric[]
  links: Link[]
  coverFile?: File | null
  galleryFiles?: File[]
  seoTitle: string
  seoDescription: string
  publishedAt?: string | null
}
