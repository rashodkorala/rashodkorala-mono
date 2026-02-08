export type CaseStudyStatus = "draft" | "published" | "archived"
export type CaseStudyType = "problem-solving" | "descriptive"

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

// Database schema (snake_case)
export interface CaseStudyDB {
  id: string
  user_id: string
  title: string
  slug: string
  summary: string | null
  type: CaseStudyType
  status: CaseStudyStatus
  featured: boolean
  published_at: string | null
  subject_name: string | null
  subject_type: string | null
  industry: string | null
  audience: string | null
  role: string | null
  team_size: string | null
  timeline: string | null
  tags: string[]
  skills: string[]
  stack: string[]
  cover_url: string | null
  gallery_urls: string[]
  links: Link[]
  results: Result[]
  metrics: Metric[]
  mdx_path: string
  seo_title: string | null
  seo_description: string | null
  views: number
  created_at: string
  updated_at: string
}

// Application type (camelCase)
export interface CaseStudy {
  id: string
  userId: string
  title: string
  slug: string
  summary: string | null
  type: CaseStudyType
  status: CaseStudyStatus
  featured: boolean
  publishedAt: string | null
  subjectName: string | null
  subjectType: string | null
  industry: string | null
  audience: string | null
  role: string | null
  teamSize: string | null
  timeline: string | null
  tags: string[]
  skills: string[]
  stack: string[]
  coverUrl: string | null
  galleryUrls: string[]
  links: Link[]
  results: Result[]
  metrics: Metric[]
  mdxPath: string
  seoTitle: string | null
  seoDescription: string | null
  views: number
  createdAt: string
  updatedAt: string
}

export interface CaseStudyFormData {
  title: string
  slug: string
  summary: string
  type: CaseStudyType
  status: CaseStudyStatus
  featured: boolean
  publishedAt: string | null
  subjectName: string
  subjectType: string
  industry: string
  audience: string
  role: string
  teamSize: string
  timeline: string
  tags: string[]
  skills: string[]
  stack: string[]
  coverUrl: string | null
  galleryUrls: string[]
  links: Link[]
  results: Result[]
  metrics: Metric[]
  mdxContent: string
  seoTitle: string
  seoDescription: string
}





