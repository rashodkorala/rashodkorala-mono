import { supabase } from '../supabase';
import type { Project } from '../types';

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return (data || []) as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') console.error('Error fetching project:', error);
    return null;
  }

  if (!data) return null;

  const { data: caseStudies } = await supabase
    .from('case_studies')
    .select('id, slug, title, tags, gallery, cover_path, content_md, featured, order')
    .eq('project_id', data.id)
    .order('featured', { ascending: false })
    .order('order', { ascending: true });

  return { ...data, relatedCaseStudies: caseStudies || [] } as Project;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return getAllProjects();
}
