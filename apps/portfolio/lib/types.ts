export type ProjectMediaType = 'image' | 'video';

export interface ProjectMediaItem {
  type: ProjectMediaType;
  url: string;
}

// Matches new `projects` table (renamed from projects_archived)
export interface Project {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  logo?: string | null;
  short_description?: string | null;
  cover_image?: string | null;
  project_media?: ProjectMediaItem[] | null;
  role?: string | null;
  timeline?: string | null;
  tech_stack?: string[] | null;
  live_url?: string;
  github_url?: string;
  created_at: string;
  updated_at: string;
  relatedCaseStudies?: CaseStudy[];
}

export type CaseStudyStatus = 'draft' | 'published' | 'archived';

export interface CaseStudyLink {
  label: string;
  url: string;
  type?: string;
}

/** Mirrors `case_studies` from Supabase (snake_case). */
export interface CaseStudy {
  id: string;
  user_id: string;
  project_id?: string | null;
  title: string;
  slug: string;
  content_md: string;
  featured?: boolean | null;
  order: number;
  tags?: string[] | null;
  gallery?: string[] | null;
  before_after?: { beforeImage?: string | null; afterImage?: string | null } | null;
  status?: CaseStudyStatus | null;
  summary?: string | null;
  cover_path?: string | null;
  role?: string | null;
  timeline?: string | null;
  links?: CaseStudyLink[] | null;
  stack?: string[] | null;
  created_at: string;
  updated_at: string;
  relatedProjects?: Project[];
}
