"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { requestPortfolioRevalidation } from "@/lib/revalidate-portfolio"
import { getWritingPage, queryWritings, syncWritingStatus } from "@/lib/notion/client"
import { bodyFrom, entryFieldsFrom, hashBody, slugify, type NotionEntryFields } from "@/lib/notion/to-entry"

/**
 * - new: not in the CMS yet
 * - matches: an unlinked CMS entry has the same slug, so it can be linked instead of duplicated
 * - linked: up to date
 * - changed: edited in Notion since the last pull
 */
export type NotionWritingState = "new" | "matches" | "linked" | "changed"

export interface NotionWriting {
  pageId: string
  title: string
  url: string
  lastEditedAt: string
  state: NotionWritingState
  entry: { id: string; slug: string; title: string; status: string } | null
}

export interface NotionPullResult {
  conflict: boolean
  skipped: number
  id?: string
  slug?: string
}

interface LinkedRow {
  id: string
  slug: string
  title: string
  status: string
  content_md: string | null
  notion_page_id: string | null
  notion_last_edited_at: string | null
  notion_body_hash: string | null
}

const LINK_COLUMNS = "id, slug, title, status, content_md, notion_page_id, notion_last_edited_at, notion_body_hash"

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  return { supabase, user }
}

/** Only the columns Notion actually has values for, so a missing column never blanks a CMS field. */
function mappedColumns(fields: NotionEntryFields) {
  const columns: Record<string, unknown> = { title: fields.title }
  if (fields.kind) columns.kind = fields.kind
  if (fields.summary !== null) columns.summary = fields.summary
  if (fields.role !== null) columns.role = fields.role
  if (fields.timeline !== null) columns.timeline = fields.timeline
  if (fields.tags !== null) columns.tags = fields.tags
  if (fields.stack !== null) columns.stack = fields.stack
  return columns
}

function syncColumns(lastEditedAt: string, contentMd: string) {
  return {
    content_md: contentMd,
    notion_last_edited_at: lastEditedAt,
    notion_synced_at: new Date().toISOString(),
    notion_body_hash: hashBody(contentMd),
  }
}

/** Writes the CMS status onto the Notion page; best effort, like on save. */
async function mirrorStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  id: string,
  pageId: string,
  status: string,
  lastEditedAt: string
) {
  try {
    const next = await syncWritingStatus(pageId, status as "draft" | "published" | "archived", lastEditedAt)
    if (next && next !== lastEditedAt) await supabase.from("case_studies").update({ notion_last_edited_at: next }).eq("id", id)
  } catch (error) {
    console.warn("[notion] couldn't update the Notion status:", error)
  }
}

function refresh(status: string) {
  revalidatePath("/protected/satahan")
  if (status === "published") return requestPortfolioRevalidation()
}

export async function listNotionWritings(): Promise<NotionWriting[]> {
  const { supabase, user } = await requireUser()
  const [pages, { data: rows, error }] = await Promise.all([
    queryWritings(),
    supabase.from("case_studies").select(LINK_COLUMNS).eq("user_id", user.id),
  ])
  if (error) throw new Error(`Failed to load entries: ${error.message}`)

  const entries = (rows ?? []) as LinkedRow[]
  const byPage = new Map(entries.filter((e) => e.notion_page_id).map((e) => [e.notion_page_id as string, e]))
  const unlinkedBySlug = new Map(entries.filter((e) => !e.notion_page_id).map((e) => [e.slug, e]))

  return pages.map((page) => {
    const fields = entryFieldsFrom(page)
    const linked = byPage.get(page.id)
    const match = linked ? undefined : unlinkedBySlug.get(fields.slug ?? slugify(fields.title))
    const entry = linked ?? match
    let state: NotionWritingState = "new"
    if (linked) {
      const pulled = linked.notion_last_edited_at ? new Date(linked.notion_last_edited_at).getTime() : 0
      state = new Date(page.last_edited_time).getTime() > pulled ? "changed" : "linked"
    } else if (match) {
      state = "matches"
    }
    return {
      pageId: page.id,
      title: fields.title,
      url: page.url,
      lastEditedAt: page.last_edited_time,
      state,
      entry: entry ? { id: entry.id, slug: entry.slug, title: entry.title, status: entry.status } : null,
    }
  })
}

/**
 * Brings a Notion page into Satahan: as a new draft, or, with `linkTo`, by linking and filling an
 * existing entry (which keeps its slug, cover, project and status).
 */
export async function importNotionPage(pageId: string, options: { linkTo?: string } = {}): Promise<NotionPullResult> {
  const { supabase, user } = await requireUser()
  const page = await getWritingPage(pageId)
  const fields = entryFieldsFrom(page)

  const { data: alreadyLinked } = await supabase
    .from("case_studies")
    .select("slug")
    .eq("user_id", user.id)
    .eq("notion_page_id", page.id)
    .maybeSingle()
  if (alreadyLinked) throw new Error(`This Notion page is already linked to /${alreadyLinked.slug}`)

  if (options.linkTo) {
    const { data: existing, error } = await supabase
      .from("case_studies")
      .select(LINK_COLUMNS)
      .eq("id", options.linkTo)
      .eq("user_id", user.id)
      .single()
    if (error || !existing) throw new Error("Couldn't find the entry to link")
    const row = existing as LinkedRow
    const body = await bodyFrom(page.id, { slug: row.slug, supabase })
    const { error: updateError } = await supabase
      .from("case_studies")
      .update({ ...mappedColumns(fields), ...syncColumns(page.last_edited_time, body.contentMd), notion_page_id: page.id })
      .eq("id", row.id)
      .eq("user_id", user.id)
    if (updateError) throw new Error(`Failed to link entry: ${updateError.message}`)
    await mirrorStatus(supabase, row.id, page.id, row.status, page.last_edited_time)
    await refresh(row.status)
    return { conflict: false, skipped: body.skipped, id: row.id, slug: row.slug }
  }

  // New draft: take the Notion slug (or the title's), adding -2, -3… if it's already in use.
  const base = fields.slug ?? (slugify(fields.title) || "untitled")
  const { data: taken } = await supabase.from("case_studies").select("slug").like("slug", `${base}%`)
  const used = new Set((taken ?? []).map((r) => r.slug as string))
  let slug = base
  for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`

  const body = await bodyFrom(page.id, { slug, supabase })
  const { data: created, error } = await supabase
    .from("case_studies")
    .insert({
      user_id: user.id,
      slug,
      kind: "case_study",
      status: "draft",
      featured: false,
      order: 0,
      tags: [],
      stack: [],
      gallery: [],
      links: [],
      ...mappedColumns(fields),
      ...syncColumns(page.last_edited_time, body.contentMd),
      notion_page_id: page.id,
    })
    .select("id, slug")
    .single()
  if (error) throw new Error(`Failed to import: ${error.message}`)
  await mirrorStatus(supabase, created.id, page.id, "draft", page.last_edited_time)
  await refresh("draft")
  return { conflict: false, skipped: body.skipped, id: created.id, slug: created.slug }
}

/**
 * Replaces a linked entry's body and Notion-mapped fields with the page's current version.
 * Without `force`, it stops with `conflict` when the body was edited in the CMS since the last pull.
 */
export async function pullNotionPage(caseStudyId: string, options: { force?: boolean } = {}): Promise<NotionPullResult> {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from("case_studies")
    .select(LINK_COLUMNS)
    .eq("id", caseStudyId)
    .eq("user_id", user.id)
    .single()
  if (error || !data) throw new Error("Couldn't find that entry")
  const row = data as LinkedRow
  if (!row.notion_page_id) throw new Error("This entry isn't linked to a Notion page")

  const editedInCms = !!row.notion_body_hash && hashBody(row.content_md ?? "") !== row.notion_body_hash
  if (editedInCms && !options.force) return { conflict: true, skipped: 0 }

  const page = await getWritingPage(row.notion_page_id)
  const body = await bodyFrom(page.id, { slug: row.slug, supabase })
  const { error: updateError } = await supabase
    .from("case_studies")
    .update({ ...mappedColumns(entryFieldsFrom(page)), ...syncColumns(page.last_edited_time, body.contentMd) })
    .eq("id", row.id)
    .eq("user_id", user.id)
  if (updateError) throw new Error(`Failed to pull from Notion: ${updateError.message}`)
  await refresh(row.status)
  return { conflict: false, skipped: body.skipped, id: row.id, slug: row.slug }
}
