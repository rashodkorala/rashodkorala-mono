export type WorkStatus = "draft" | "published" | "archived"
export type WorkTargetApp = "portfolio" | "photos" | "both"

export interface WorkItem {
  id: string
  userId: string | null
  slug: string
  title: string
  subtitle: string | null
  description: string | null
  coverImageUrl: string | null
  liveUrl: string | null
  githubUrl: string | null
  caseStudyUrl: string | null
  tech: string[]
  category: string | null
  status: WorkStatus
  targetApp: WorkTargetApp
  featured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface WorkInsert {
  slug: string
  title: string
  subtitle?: string | null
  description?: string | null
  coverImageUrl?: string | null
  liveUrl?: string | null
  githubUrl?: string | null
  caseStudyUrl?: string | null
  tech?: string[]
  category?: string | null
  status?: WorkStatus
  targetApp?: WorkTargetApp
  featured?: boolean
  sortOrder?: number
}
