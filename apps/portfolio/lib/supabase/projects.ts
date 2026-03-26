import { supabase } from '../supabase';
import type { Project } from '../types';

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
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
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  if (!data) return null;

  const { data: caseStudies } = await supabase
    .from('case_studies')
    .select('id, slug, title, summary, cover_path, status')
    .eq('project_id', data.id)
    .eq('status', 'published');

  return { ...data, relatedCaseStudies: caseStudies || [] } as Project;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured projects:', error);
    throw error;
  }

  return (data || []) as Project[];
}
