"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { CaseStudy, CaseStudyDB, CaseStudyFormData } from "@/lib/types/case-study"

function transformCaseStudy(cs: CaseStudyDB): CaseStudy {
  return {
    id: cs.id,
    userId: cs.user_id,
    projectId: cs.project_id,
    title: cs.title,
    slug: cs.slug,
    lede: cs.lede,
    summary: cs.summary,
    contentMd: cs.content_md,
    type: cs.type,
    status: cs.status,
    category: cs.category,
    featured: cs.featured,
    sortOrder: cs.sort_order,
    role: cs.role,
    teamSize: cs.team_size,
    timeline: cs.timeline,
    industry: cs.industry,
    audience: cs.audience,
    tags: cs.tags || [],
    skills: cs.skills || [],
    stack: cs.stack || [],
    results: cs.results || [],
    metrics: cs.metrics || [],
    links: cs.links || [],
    coverPath: cs.cover_path,
    galleryPaths: cs.gallery_paths || [],
    seoTitle: cs.seo_title,
    seoDescription: cs.seo_description,
    views: cs.views,
    publishedAt: cs.published_at,
    createdAt: cs.created_at,
    updatedAt: cs.updated_at,
  }
}

export function getCoverUrl(coverPath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${supabaseUrl}/storage/v1/object/public/media/${coverPath}`
}

export async function uploadCaseStudyMedia(file: File, slug: string): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const ext = file.name.split(".").pop()
  const uuid = crypto.randomUUID()
  const path = `case-studies/${slug}/assets/${uuid}.${ext}`

  const { error } = await supabase.storage.from("media").upload(path, file)
  if (error) throw new Error(`Failed to upload media: ${error.message}`)

  return path
}

export async function getCaseStudies(status?: string): Promise<CaseStudy[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  let query = supabase
    .from("case_studies")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch case studies: ${error.message}`)

  return (data || []).map(transformCaseStudy)
}

export async function getCaseStudyById(id: string): Promise<CaseStudy | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch case study: ${error.message}`)
  }

  return data ? transformCaseStudy(data) : null
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Failed to fetch case study: ${error.message}`)
  }

  return data ? transformCaseStudy(data) : null
}

export async function createOrUpdateCaseStudy(
  formData: CaseStudyFormData,
  existingId?: string
): Promise<CaseStudy> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Handle cover upload
  let coverPath: string | null = null
  if (formData.coverFile) {
    const ext = formData.coverFile.name.split(".").pop()
    const uuid = crypto.randomUUID()
    coverPath = `case-studies/${formData.slug}/cover/${uuid}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(coverPath, formData.coverFile, { upsert: true })
    if (uploadError) throw new Error(`Failed to upload cover: ${uploadError.message}`)
  }

  // Handle gallery uploads
  const galleryPaths: string[] = []
  for (const file of formData.galleryFiles || []) {
    const ext = file.name.split(".").pop()
    const uuid = crypto.randomUUID()
    const path = `case-studies/${formData.slug}/assets/${uuid}.${ext}`
    const { error: uploadError } = await supabase.storage.from("media").upload(path, file)
    if (uploadError) throw new Error(`Failed to upload gallery image: ${uploadError.message}`)
    galleryPaths.push(path)
  }

  const payload = {
    user_id: user.id,
    project_id: formData.projectId || null,
    title: formData.title,
    slug: formData.slug,
    lede: formData.lede || null,
    summary: formData.summary || null,
    content_md: formData.contentMd,
    type: formData.type,
    status: formData.status,
    category: formData.category || null,
    featured: formData.featured,
    sort_order: formData.sortOrder,
    role: formData.role || null,
    team_size: formData.teamSize || null,
    timeline: formData.timeline || null,
    industry: formData.industry || null,
    audience: formData.audience || null,
    tags: formData.tags || [],
    skills: formData.skills || [],
    stack: formData.stack || [],
    results: formData.results || [],
    metrics: formData.metrics || [],
    links: formData.links || [],
    cover_path: coverPath,
    gallery_paths: galleryPaths,
    seo_title: formData.seoTitle || null,
    seo_description: formData.seoDescription || null,
    published_at:
      formData.status === "published" && !formData.publishedAt
        ? new Date().toISOString()
        : formData.publishedAt || null,
  }

  let data
  let error

  if (existingId) {
    const result = await supabase
      .from("case_studies")
      .update(payload)
      .eq("id", existingId)
      .eq("user_id", user.id)
      .select()
      .single()
    data = result.data
    error = result.error
  } else {
    const result = await supabase
      .from("case_studies")
      .insert({ ...payload, views: 0 })
      .select()
      .single()
    data = result.data
    error = result.error
  }

  if (error) throw new Error(`Failed to save case study: ${error.message}`)

  revalidatePath("/protected/case-studies")
  revalidatePath("/protected/work")

  return transformCaseStudy(data)
}

export async function deleteCaseStudy(id: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Get slug to delete storage files
  const cs = await getCaseStudyById(id)
  if (cs) {
    const { data: coverFiles } = await supabase.storage
      .from("media")
      .list(`case-studies/${cs.slug}/cover`)
    if (coverFiles?.length) {
      await supabase.storage
        .from("media")
        .remove(coverFiles.map((f) => `case-studies/${cs.slug}/cover/${f.name}`))
    }

    const { data: assetFiles } = await supabase.storage
      .from("media")
      .list(`case-studies/${cs.slug}/assets`)
    if (assetFiles?.length) {
      await supabase.storage
        .from("media")
        .remove(assetFiles.map((f) => `case-studies/${cs.slug}/assets/${f.name}`))
    }
  }

  const { error } = await supabase
    .from("case_studies")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) throw new Error(`Failed to delete case study: ${error.message}`)

  revalidatePath("/protected/case-studies")
  revalidatePath("/protected/work")
}
