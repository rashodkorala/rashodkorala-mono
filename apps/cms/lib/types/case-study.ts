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
  status: 'draft' | 'published' | 'archived'
  summary: string | null
  cover_path: string | null
  role: string | null
  timeline: string | null
  links: { label: string; url: string; type?: string }[]
  stack: string[]
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
  status: 'draft' | 'published' | 'archived'
  summary: string | null
  coverPath: string | null
  role: string | null
  timeline: string | null
  links: { label: string; url: string; type?: string }[]
  stack: string[]
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
  existingGallery?: string[]
  galleryFiles?: File[]
  clearBeforeImage?: boolean
  clearAfterImage?: boolean
  beforeImageFile?: File | null
  afterImageFile?: File | null
  order: number
  status: 'draft' | 'published' | 'archived'
  summary: string
  role: string
  timeline: string
  links: { label: string; url: string; type?: string }[]
  stack: string[]
  coverImageFile?: File | null
  clearCoverImage?: boolean
}
