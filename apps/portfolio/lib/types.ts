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

export type CaseStudyCategory = 'startup' | 'client' | 'personal' | 'school';
export type CaseStudyStatus = 'draft' | 'published' | 'archived';

export interface CaseStudyLink {
  label: string;
  url: string;
  type?: string;
}

export interface CaseStudyResult {
  text?: string;
  title?: string;
  value?: string;
  description?: string;
}

export interface CaseStudyMetric {
  label?: string;
  value?: string;
}

/** Mirrors `case_studies` from Supabase (snake_case). */
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
  summary?: string | null;
  /** Legacy field; CMS uses `summary` */
  lede?: string | null;
  type?: string | null;
  role?: string | null;
  timeline?: string | null;
  subject_name?: string | null;
  industry?: string | null;
  audience?: string | null;
  category?: CaseStudyCategory | null;
  sort_order?: number | null;
  status: CaseStudyStatus;
  featured?: boolean | null;
  published_at?: string | null;
  tags?: string[] | null;
  skills?: string[] | null;
  stack?: string[] | null;
  cover_url?: string | null;
  gallery_urls?: string[] | null;
  gallery_video_urls?: string[] | null;
  links?: CaseStudyLink[] | null;
  /** CMS shape: `{ text: string }[]`; legacy: title/value/description */
  results?: CaseStudyResult[] | null;
  metrics?: CaseStudyMetric[] | null;
  mdx_path?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  views?: number | null;
  created_at: string;
  updated_at: string;
  relatedProjects?: Project[];
}
