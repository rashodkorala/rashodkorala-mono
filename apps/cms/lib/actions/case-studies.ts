"use server"

import { createClient } from "@/lib/supabase/server"
import { requestPortfolioRevalidation } from "@/lib/revalidate-portfolio"
import { revalidatePath } from "next/cache"
import type { CaseStudy, CaseStudyDB, CaseStudyFormData } from "@/lib/types/case-study"
import { getPublishIssues } from "@/lib/satahan-requirements"
import { syncWritingStatus } from "@/lib/notion/client"

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
    kind: cs.kind ?? 'case_study',
    entryNumber: cs.entry_number ?? null,
    inShort: cs.in_short ?? null,
    publishedAt: cs.published_at ?? null,
    notionPageId: cs.notion_page_id ?? null,
    notionLastEditedAt: cs.notion_last_edited_at ?? null,
    notionSyncedAt: cs.notion_synced_at ?? null,
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
  let existingEntryNumber: number | null = null
  let existingPublishedAt: string | null = null
  if (existingId) {
    const { data: existing } = await supabase
      .from("case_studies")
      .select("gallery, before_after, cover_path, entry_number, published_at")
      .eq("id", existingId)
      .eq("user_id", user.id)
      .single()
    if (existing) {
      existingGalleryPaths = existing.gallery || []
      existingBeforeAfter = existing.before_after || null
      existingCoverPath = existing.cover_path || null
      existingEntryNumber = existing.entry_number ?? null
      existingPublishedAt = existing.published_at ?? null
    }
  }

  // Checked before any upload so a rejected publish leaves no stray files behind.
  if (formData.status === "published") {
    const hasCover = !!formData.coverImageFile || (!formData.clearCoverImage && !!existingCoverPath)
    const issues = getPublishIssues(formData, { hasCover })
    if (issues.length > 0) {
      throw new Error(`Can't publish yet. Missing: ${issues.map((i) => i.message).join(", ")}`)
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

  // Satahan numbers are permanent: given on first publish, never reused or renumbered.
  let entryNumber = existingEntryNumber
  if (entryNumber == null && formData.status === "published") {
    const { data: last } = await supabase
      .from("case_studies")
      .select("entry_number")
      .eq("user_id", user.id)
      .not("entry_number", "is", null)
      .order("entry_number", { ascending: false })
      .limit(1)
      .maybeSingle()
    entryNumber = (last?.entry_number ?? 0) + 1
  }
  // The published date is likewise set once; later edits keep it.
  let publishedAt = existingPublishedAt
  if (publishedAt == null && formData.status === "published") {
    publishedAt = new Date().toISOString()
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
    kind: formData.kind ?? "case_study",
    in_short: formData.inShort?.trim() || null,
    entry_number: entryNumber,
    published_at: publishedAt,
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

  if (data.notion_page_id) {
    // Best effort: keep the Notion page's Status column in step, but never fail the save over it.
    try {
      const lastEdited = await syncWritingStatus(data.notion_page_id, data.status, data.notion_last_edited_at)
      if (lastEdited && lastEdited !== data.notion_last_edited_at) {
        await supabase.from("case_studies").update({ notion_last_edited_at: lastEdited }).eq("id", data.id).eq("user_id", user.id)
        data.notion_last_edited_at = lastEdited
      }
    } catch (notionError) {
      console.warn("[case-studies] couldn't update the Notion status:", notionError)
    }
  }

  revalidatePath("/protected/case-studies")
  revalidatePath("/protected/satahan")
  await requestPortfolioRevalidation()

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
  revalidatePath("/protected/satahan")
  await requestPortfolioRevalidation()
}
