"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { CaseStudy, CaseStudyDB, CaseStudyInsert, CaseStudyUpdate, CaseStudyFormData } from "@/lib/types/case-study"

function transformCaseStudy(caseStudy: CaseStudyDB): CaseStudy {
  return {
    id: caseStudy.id,
    userId: caseStudy.user_id,
    title: caseStudy.title,
    slug: caseStudy.slug,
    summary: caseStudy.summary,
    type: caseStudy.type,
    status: caseStudy.status,
    featured: caseStudy.featured,
    publishedAt: caseStudy.published_at,
    subjectName: caseStudy.subject_name,
    subjectType: caseStudy.subject_type,
    industry: caseStudy.industry,
    audience: caseStudy.audience,
    role: caseStudy.role,
    teamSize: caseStudy.team_size,
    timeline: caseStudy.timeline,
    tags: caseStudy.tags || [],
    skills: caseStudy.skills || [],
    stack: caseStudy.stack || [],
    coverUrl: caseStudy.cover_url,
    galleryUrls: caseStudy.gallery_urls || [],
    links: caseStudy.links || [],
    results: caseStudy.results || [],
    metrics: caseStudy.metrics || [],
    mdxPath: caseStudy.mdx_path,
    seoTitle: caseStudy.seo_title,
    seoDescription: caseStudy.seo_description,
    views: caseStudy.views,
    createdAt: caseStudy.created_at,
    updatedAt: caseStudy.updated_at,
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Upload MDX content to storage
export async function uploadMdxToStorage(slug: string, content: string): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const fileName = `${slug}.mdx`
  const filePath = `${user.id}/${fileName}`

  // Upload or update the file
  const { error } = await supabase.storage
    .from("case-studies-mdx")
    .upload(filePath, content, {
      contentType: "text/markdown",
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload MDX: ${error.message}`)
  }

  return filePath
}

// Fetch MDX content from storage
export async function fetchMdxFromStorage(mdxPath: string): Promise<string> {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from("case-studies-mdx")
    .download(mdxPath)

  if (error) {
    throw new Error(`Failed to fetch MDX: ${error.message}`)
  }

  return await data.text()
}

// Upload media to storage
export async function uploadMedia(file: File): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${user.id}/${fileName}`

  const { error } = await supabase.storage
    .from("case-studies-media")
    .upload(filePath, file)

  if (error) {
    throw new Error(`Failed to upload media: ${error.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("case-studies-media").getPublicUrl(filePath)

  return publicUrl
}

// Create or update case study
export async function createOrUpdateCaseStudy(
  formData: CaseStudyFormData,
  existingId?: string
): Promise<CaseStudy> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Upload MDX to storage
  const mdxPath = await uploadMdxToStorage(formData.slug, formData.mdxContent)

  const caseStudyData = {
    user_id: user.id,
    title: formData.title,
    slug: formData.slug,
    summary: formData.summary || null,
    type: formData.type,
    status: formData.status,
    featured: formData.featured,
    published_at: formData.status === "published" && !formData.publishedAt
      ? new Date().toISOString()
      : formData.publishedAt,
    subject_name: formData.subjectName || null,
    subject_type: formData.subjectType || null,
    industry: formData.industry || null,
    audience: formData.audience || null,
    role: formData.role || null,
    team_size: formData.teamSize || null,
    timeline: formData.timeline || null,
    tags: formData.tags || [],
    skills: formData.skills || [],
    stack: formData.stack || [],
    cover_url: formData.coverUrl || null,
    gallery_urls: formData.galleryUrls || [],
    links: formData.links || [],
    results: formData.results || [],
    metrics: formData.metrics || [],
    mdx_path: mdxPath,
    seo_title: formData.seoTitle || null,
    seo_description: formData.seoDescription || null,
  }

  let data
  let error

  if (existingId) {
    // Update existing
    const result = await supabase
      .from("case_studies")
      .update(caseStudyData)
      .eq("id", existingId)
      .eq("user_id", user.id)
      .select()
      .single()

    data = result.data
    error = result.error
  } else {
    // Create new
    const result = await supabase
      .from("case_studies")
      .insert({ ...caseStudyData, views: 0 })
      .select()
      .single()

    data = result.data
    error = result.error
  }

  if (error) {
    throw new Error(`Failed to save case study: ${error.message}`)
  }

  revalidatePath("/protected/case-studies")
  revalidatePath(`/protected/case-studies/${formData.slug}`)

  return transformCaseStudy(data)
}

// Get all case studies for admin
export async function getCaseStudies(status?: string): Promise<CaseStudy[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  let query = supabase
    .from("case_studies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch case studies: ${error.message}`)
  }

  return (data || []).map(transformCaseStudy)
}

// Get published case studies for public
export async function getPublishedCaseStudies(): Promise<CaseStudy[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch published case studies: ${error.message}`)
  }

  return (data || []).map(transformCaseStudy)
}

// Get single case study by ID (admin)
export async function getCaseStudy(id: string): Promise<CaseStudy | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(`Failed to fetch case study: ${error.message}`)
  }

  return data ? transformCaseStudy(data) : null
}

// Get single case study by slug (admin)
export async function getCaseStudyBySlugAdmin(slug: string): Promise<CaseStudy | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(`Failed to fetch case study: ${error.message}`)
  }

  return data ? transformCaseStudy(data) : null
}

// Get single published case study by slug (public)
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(`Failed to fetch case study: ${error.message}`)
  }

  return data ? transformCaseStudy(data) : null
}

// Delete case study
export async function deleteCaseStudy(id: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get the case study to find the mdx_path
  const caseStudy = await getCaseStudy(id)

  if (caseStudy) {
    // Delete MDX file from storage
    await supabase.storage
      .from("case-studies-mdx")
      .remove([caseStudy.mdxPath])
  }

  // Delete from database
  const { error } = await supabase
    .from("case_studies")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(`Failed to delete case study: ${error.message}`)
  }

  revalidatePath("/protected/case-studies")
}





