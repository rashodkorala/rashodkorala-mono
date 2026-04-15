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
    contentMd: cs.content_md || "",
    beforeAfter: cs.before_after || { beforeImage: null, afterImage: null },
    featured: cs.featured,
    order: cs.order,
    tags: cs.tags || [],
    gallery: cs.gallery || [],
    status: cs.status ?? 'draft',
    summary: cs.summary ?? null,
    coverPath: cs.cover_path ?? null,
    role: cs.role ?? null,
    timeline: cs.timeline ?? null,
    links: cs.links ?? [],
    stack: cs.stack ?? [],
    createdAt: cs.created_at,
    updatedAt: cs.updated_at,
  }
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

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const query = supabase
    .from("case_studies")
    .select("*")
    .eq("user_id", user.id)
    .order("order", { ascending: true })
    .order("created_at", { ascending: false })

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch case studies: ${error.message}`)

  return (data || []).map(transformCaseStudy)
}

export async function getCaseStudiesByProjectId(projectId: string): Promise<CaseStudy[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .order("order", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch related case studies: ${error.message}`)
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

  if (!data) return null

  return transformCaseStudy(data)
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

  if (!data) return null

  return transformCaseStudy(data)
}

export async function createOrUpdateCaseStudy(
  formData: CaseStudyFormData,
  existingId?: string,
  linkedProjectIds?: string[]
): Promise<CaseStudy> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Fetch existing record to preserve paths when editing
  let existingGalleryPaths: string[] = []
  let existingBeforeAfter: { beforeImage?: string | null; afterImage?: string | null } | null = null
  let existingCoverPath: string | null = null
  if (existingId) {
    const { data: existing } = await supabase
      .from("case_studies")
      .select("gallery, before_after, cover_path")
      .eq("id", existingId)
      .eq("user_id", user.id)
      .single()
    if (existing) {
      existingGalleryPaths = existing.gallery || []
      existingBeforeAfter = existing.before_after || null
      existingCoverPath = existing.cover_path || null
    }
  }

  // Handle gallery uploads — preserve retained existing paths and append new uploads
  const galleryPaths: string[] = formData.existingGallery || existingGalleryPaths
  for (const file of formData.galleryFiles || []) {
    const ext = file.name.split(".").pop()
    const uuid = crypto.randomUUID()
    const path = `case-studies/${formData.slug}/assets/${uuid}.${ext}`
    // Remap video/quicktime (.mov) → video/mp4 since Supabase doesn't accept quicktime
    const mimeType = file.type === "video/quicktime" ? "video/mp4" : file.type
    const uploadBlob = mimeType !== file.type ? new Blob([file], { type: mimeType }) : file
    const { error: uploadError } = await supabase.storage.from("media").upload(path, uploadBlob, { contentType: mimeType })
    if (uploadError) throw new Error(`Failed to upload gallery file: ${uploadError.message}`)
    galleryPaths.push(path)
  }

  // Handle cover image
  let coverPath: string | null = existingCoverPath
  if (formData.clearCoverImage) coverPath = null
  if (formData.coverImageFile) {
    const ext = formData.coverImageFile.name.split(".").pop()
    const path = `case-studies/${formData.slug}/cover/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage.from("media").upload(path, formData.coverImageFile)
    if (uploadError) throw new Error(`Failed to upload cover image: ${uploadError.message}`)
    coverPath = path
  }

  let beforeImage = existingBeforeAfter?.beforeImage || null
  let afterImage = existingBeforeAfter?.afterImage || null
  if (formData.clearBeforeImage) beforeImage = null
  if (formData.clearAfterImage) afterImage = null

  if (formData.beforeImageFile) {
    const ext = formData.beforeImageFile.name.split(".").pop()
    const path = `case-studies/${formData.slug}/before-after/before-${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage.from("media").upload(path, formData.beforeImageFile)
    if (uploadError) throw new Error(`Failed to upload before image: ${uploadError.message}`)
    beforeImage = path
  }
  if (formData.afterImageFile) {
    const ext = formData.afterImageFile.name.split(".").pop()
    const path = `case-studies/${formData.slug}/before-after/after-${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage.from("media").upload(path, formData.afterImageFile)
    if (uploadError) throw new Error(`Failed to upload after image: ${uploadError.message}`)
    afterImage = path
  }

  const payload = {
    user_id: user.id,
    project_id: linkedProjectIds && linkedProjectIds.length > 0 ? linkedProjectIds[0] : formData.projectId || null,
    title: formData.title,
    slug: formData.slug,
    content_md: formData.contentMd || "",
    before_after: { beforeImage, afterImage },
    featured: formData.featured,
    order: formData.order,
    tags: formData.tags || [],
    gallery: galleryPaths,
    status: formData.status ?? 'draft',
    summary: formData.summary || null,
    cover_path: coverPath,
    role: formData.role || null,
    timeline: formData.timeline || null,
    links: formData.links ?? [],
    stack: formData.stack ?? [],
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
      .insert(payload)
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
