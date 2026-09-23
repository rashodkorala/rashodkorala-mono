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
    // '*' (not a column list) so this keeps working whether or not the *_si
    // translation columns have been migrated yet.
    .select('*')
    .eq('project_id', data.id)
    .order('featured', { ascending: false })
    .order('order', { ascending: true });

  return { ...data, relatedCaseStudies: caseStudies || [] } as Project;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return getAllProjects();
}
