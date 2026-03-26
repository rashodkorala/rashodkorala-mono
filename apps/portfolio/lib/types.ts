export type ProjectCategory = 'startup' | 'client' | 'personal' | 'school';
export type ProjectStatus = 'draft' | 'published' | 'archived';

// Matches new `projects` table (renamed from projects_archived)
export interface Project {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  subtitle?: string;
  problem?: string;
  solution?: string;
  roles?: string[];
  features?: string[];
  tech?: string[];
  live_url?: string;
  github_url?: string;
  cover_image_url?: string;
  gallery_image_urls?: string[];
  gallery_video_urls?: string[];
  category?: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type CaseStudyCategory = 'startup' | 'client' | 'personal' | 'school';
export type CaseStudyStatus = 'draft' | 'published' | 'archived';

// Matches new `case_studies` table
export interface CaseStudy {
  id: string;
  user_id: string;
  project_id?: string | null;
  title: string;
  slug: string;
  lede?: string | null;
  summary?: string | null;
  content_md: string;
  type: 'problem-solving' | 'descriptive';
  status: CaseStudyStatus;
  category?: CaseStudyCategory | null;
  featured: boolean;
  sort_order: number;
  role?: string | null;
  team_size?: string | null;
  timeline?: string | null;
  industry?: string | null;
  audience?: string | null;
  tags: string[];
  skills: string[];
  stack: string[];
  results: { text: string }[];
  metrics: { label: string; value: string }[];
  links: { label: string; url: string }[];
  cover_path?: string | null;
  gallery_paths: string[];
  seo_title?: string | null;
  seo_description?: string | null;
  views: number;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}
