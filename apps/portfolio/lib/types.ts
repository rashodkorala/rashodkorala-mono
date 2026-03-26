export type ProjectCategory = 'startup' | 'client' | 'personal' | 'school';
export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface Project {
  id: string; // UUID
  user_id: string; // UUID
  slug: string; // URL-friendly slug (e.g., "getfit", "small-business-website")
  title: string;
  subtitle?: string;
  problem?: string;
  solution?: string;
  roles?: string[]; // Array of roles
  features?: string[]; // Array of features
  tech?: string[]; // Array of technologies
  live_url?: string;
  github_url?: string;
  case_study_url?: string;
  cover_image_url?: string;
  gallery_image_urls?: string[]; // Array of gallery image URLs
  gallery_video_urls?: string[]; // Array of gallery video URLs
  category?: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type CaseStudyCategory = 'startup' | 'client' | 'personal' | 'school';
export type CaseStudyStatus = 'draft' | 'published' | 'archived';

export interface CaseStudyLink {
  label: string;
  url: string;
  type?: string;
}

export interface CaseStudyResult {
  title?: string;
  value?: string;
  description?: string;
}

export interface CaseStudyMetric {
  label?: string;
  value?: string;
}

export interface CaseStudy {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  summary?: string | null;
  lede?: string | null;
  role?: string | null;
  subject_type?: string | null;
  subject_name?: string | null;
  timeline?: string | null;
  category?: CaseStudyCategory | null;
  sort_order?: number | null;
  status: CaseStudyStatus;
  featured?: boolean | null;
  published_at?: string | null;
  tags?: string[] | null;
  stack?: string[] | null;
  cover_url?: string | null;
  gallery_urls?: string[] | null;
  links?: CaseStudyLink[] | null;
  results?: CaseStudyResult[] | null;
  metrics?: CaseStudyMetric[] | null;
  mdx_path?: string | null;
  updated_at: string;
  created_at: string;
}

