"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Project, ProjectDB, ProjectFormData, ProjectMediaItem } from "@/lib/types/project"

function transformProject(p: ProjectDB): Project {
  return {
    id: p.id,
    userId: p.user_id,
    slug: p.slug,
    title: p.title,
    shortDescription: p.short_description,
    coverImage: p.cover_image,
    projectMedia: p.project_media || [],
    role: p.role,
    timeline: p.timeline,
    techStack: p.tech_stack || [],
    liveUrl: p.live_url,
    githubUrl: p.github_url,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }
}

async function uploadProjectMedia(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
): Promise<ProjectMediaItem> {
  const ext = file.name.split(".").pop()
  const uuid = crypto.randomUUID()
  const path = `projects/media/${uuid}.${ext}`

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { upsert: true })

  if (error) throw new Error(`Failed to upload project media: ${error.message}`)

  const { data } = supabase.storage.from("media").getPublicUrl(path)
  const mime = file.type.toLowerCase()
  const type: ProjectMediaItem["type"] = mime.startsWith("video/") ? "video" : "image"
  return { type, url: data.publicUrl }
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const query = supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch projects: ${error.message}`)

  return (data || []).map(transformProject)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch project: ${error.message}`)
  }

  if (!data) return null
  return transformProject(data)
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch project: ${error.message}`)
  }

  if (!data) return null
  return transformProject(data)
}

export async function createProject(data: ProjectFormData): Promise<Project> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  let coverImage: string | null = null
  if (data.coverImageFile) {
    const media = await uploadProjectMedia(supabase, data.coverImageFile)
    coverImage = media.url
  }

  const projectMedia: ProjectMediaItem[] = []
  for (const file of data.mediaFiles || []) {
    projectMedia.push(await uploadProjectMedia(supabase, file))
  }

  const payload = {
    user_id: user.id,
    slug: data.slug,
    title: data.title,
    short_description: data.shortDescription || null,
    cover_image: coverImage,
    project_media: projectMedia,
    role: data.role || null,
    timeline: data.timeline || null,
    tech_stack: data.techStack || [],
    live_url: data.liveUrl || null,
    github_url: data.githubUrl || null,
  }

  const { data: result, error } = await supabase
    .from("projects")
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(`Failed to create project: ${error.message}`)

  revalidatePath("/protected/work")
  return transformProject(result)
}

export async function updateProject(id: string, data: ProjectFormData): Promise<Project> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: existing } = await supabase
    .from("projects")
    .select("cover_image, project_media")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  let coverImage: string | null = existing?.cover_image ?? null
  if (data.coverImageFile) {
    const media = await uploadProjectMedia(supabase, data.coverImageFile)
    coverImage = media.url
  }

  const projectMedia: ProjectMediaItem[] =
    data.mediaFiles && data.mediaFiles.length > 0
      ? await Promise.all(data.mediaFiles.map((file) => uploadProjectMedia(supabase, file)))
      : existing?.project_media || []

  const payload = {
    slug: data.slug,
    title: data.title,
    short_description: data.shortDescription || null,
    cover_image: coverImage,
    project_media: projectMedia,
    role: data.role || null,
    timeline: data.timeline || null,
    tech_stack: data.techStack || [],
    live_url: data.liveUrl || null,
    github_url: data.githubUrl || null,
  }

  const { data: result, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update project: ${error.message}`)

  revalidatePath("/protected/work")
  return transformProject(result)
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error(`Failed to delete project: ${error.message}`)

  revalidatePath("/protected/work")
}
