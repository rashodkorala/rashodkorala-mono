export interface BeforeAfter {
  beforeImage: string | null
  afterImage: string | null
}

// Database schema (snake_case) — matches new case_studies table
export interface CaseStudyDB {
  id: string
  user_id: string
  project_id: string | null
  title: string
  slug: string
  content_md: string | null
  before_after: BeforeAfter | null
  featured: boolean
  order: number
  tags: string[]
  gallery: string[]
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
  contentMd: string
  beforeAfter: BeforeAfter
  featured: boolean
  order: number
  tags: string[]
  gallery: string[]
  createdAt: string
  updatedAt: string
}

export interface CaseStudyFormData {
  projectId?: string | null
  title: string
  slug: string
  contentMd: string
  featured: boolean
  tags: string[]
  galleryFiles?: File[]
  beforeImageFile?: File | null
  afterImageFile?: File | null
  order: number
}
