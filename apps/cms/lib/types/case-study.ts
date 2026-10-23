export interface BeforeAfter {
  beforeImage: string | null
  afterImage: string | null
}

/** Satahan entry kind: a case study of a project, a long-form article, or a short note. */
export type CaseStudyKind = 'case_study' | 'article' | 'note'

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
  kind: CaseStudyKind
  entry_number: number | null
  in_short: string | null
  published_at: string | null
  notion_page_id: string | null
  notion_last_edited_at: string | null
  notion_synced_at: string | null
  notion_body_hash: string | null
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
  kind: CaseStudyKind
  inShort: string | null
  publishedAt: string | null
  /** Linked page in the Notion Writings database, if the entry is pulled from Notion. */
  notionPageId: string | null
  notionLastEditedAt: string | null
  notionSyncedAt: string | null
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
  kind: CaseStudyKind
  inShort: string
  coverImageFile?: File | null
  clearCoverImage?: boolean
}
