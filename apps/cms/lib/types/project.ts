export type ProjectMediaType = "image" | "video"

export interface ProjectMediaItem {
  type: ProjectMediaType
  url: string
}

// Database schema (snake_case)
export interface ProjectDB {
  id: string
  user_id: string
  slug: string
  title: string
  subtitle: string | null
  logo: string | null
  short_description: string | null
  cover_image: string | null
  project_media: ProjectMediaItem[] | null
  role: string | null
  timeline: string | null
  tech_stack: string[] | null
  live_url: string | null
  github_url: string | null
  created_at: string
  updated_at: string
}

// Application type (camelCase)
export interface Project {
  id: string
  userId: string
  slug: string
  title: string
  subtitle: string | null
  logo: string | null
  shortDescription: string | null
  coverImage: string | null
  projectMedia: ProjectMediaItem[]
  role: string | null
  timeline: string | null
  techStack: string[]
  liveUrl: string | null
  githubUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectInsert {
  slug: string
  title: string
  subtitle?: string | null
  logo?: string | null
  shortDescription?: string | null
  coverImage?: string | null
  projectMedia?: ProjectMediaItem[] | null
  role?: string | null
  timeline?: string | null
  techStack?: string[] | null
  liveUrl?: string | null
  githubUrl?: string | null
}

export interface ProjectUpdate extends Partial<ProjectInsert> {
  id: string
}

export interface ProjectFormData {
  title: string
  slug: string
  subtitle: string
  logoFile?: File | null
  clearLogo?: boolean
  shortDescription: string
  role: string
  timeline: string
  techStack: string[]
  liveUrl: string
  githubUrl: string
  coverImageFile?: File | null
  clearCoverImage?: boolean
  existingProjectMedia?: ProjectMediaItem[]
  mediaFiles?: File[]
}
