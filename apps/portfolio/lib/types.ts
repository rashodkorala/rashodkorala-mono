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

// Matches new `case_studies` table
export interface CaseStudy {
  id: string;
  user_id: string;
  project_id?: string | null;
  title: string;
  slug: string;
  content_md: string;
  featured: boolean;
  order: number;
  tags: string[];
  gallery: string[];
  before_after?: { beforeImage?: string | null; afterImage?: string | null } | null;
  created_at: string;
  updated_at: string;
  relatedProjects?: Project[];
}
