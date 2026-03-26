"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { WorkInsert, WorkItem } from "@/lib/types/work"

function transformWorkItem(row: Record<string, unknown>): WorkItem {
  return {
    id: row.id as string,
    userId: (row.user_id as string | null) ?? null,
    slug: row.slug as string,
    title: row.title as string,
    subtitle: (row.subtitle as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    coverImageUrl: (row.cover_image_url as string | null) ?? null,
    liveUrl: (row.live_url as string | null) ?? null,
    githubUrl: (row.github_url as string | null) ?? null,
    caseStudyUrl: (row.case_study_url as string | null) ?? null,
    tech: (row.tech as string[] | null) || [],
    category: (row.category as string | null) ?? null,
    status: row.status as WorkItem["status"],
    targetApp: row.target_app as WorkItem["targetApp"],
    featured: Boolean(row.featured),
    sortOrder: (row.sort_order as number | null) ?? 0,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export async function createWorkItem(input: WorkInsert): Promise<WorkItem> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const payload = {
    user_id: user.id,
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle || null,
    description: input.description || null,
    cover_image_url: input.coverImageUrl || null,
    live_url: input.liveUrl || null,
    github_url: input.githubUrl || null,
    case_study_url: input.caseStudyUrl || null,
    tech: input.tech || [],
    category: input.category || null,
    status: input.status || "draft",
    target_app: input.targetApp || "portfolio",
    featured: input.featured ?? false,
    sort_order: input.sortOrder ?? 0,
  }

  const { data, error } = await supabase.from("work").insert(payload).select("*").single()
  if (error) throw new Error(`Failed to create work item: ${error.message}`)

  revalidatePath("/protected/work")
  return transformWorkItem(data as Record<string, unknown>)
}

export async function getWorkItems(status?: string): Promise<WorkItem[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  let query = supabase
    .from("work")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (status) query = query.eq("status", status)

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch work items: ${error.message}`)

  return (data || []).map((row) => transformWorkItem(row as Record<string, unknown>))
}
