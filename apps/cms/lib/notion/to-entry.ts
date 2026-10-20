import { createHash } from "node:crypto"
import { NotionToMarkdown } from "notion-to-md"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { CaseStudyKind } from "@/lib/types/case-study"
import { notionConfig } from "./client"

type Property = PageObjectResponse["properties"][string]

/** CMS fields a Notion page can fill. Missing columns come back null and leave the CMS value alone. */
export interface NotionEntryFields {
  title: string
  slug: string | null
  kind: CaseStudyKind | null
  summary: string | null
  role: string | null
  timeline: string | null
  tags: string[] | null
  stack: string[] | null
}

export interface NotionBody {
  contentMd: string
  /** Blocks that couldn't be brought across (child databases, embeds…), for a heads-up in the UI. */
  skipped: number
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function hashBody(md: string): string {
  return createHash("sha256").update(md).digest("hex")
}

/** Columns are matched by name, ignoring case, so "summary" and "Summary" both work. */
function prop(page: PageObjectResponse, name: string): Property | undefined {
  const key = Object.keys(page.properties).find((k) => k.toLowerCase() === name.toLowerCase())
  return key ? page.properties[key] : undefined
}

function text(p: Property | undefined): string | null {
  if (!p) return null
  const parts = p.type === "title" ? p.title : p.type === "rich_text" ? p.rich_text : null
  const value = parts?.map((t) => t.plain_text).join("").trim()
  return value || null
}

function select(p: Property | undefined): string | null {
  return p?.type === "select" ? (p.select?.name ?? null) : null
}

/** Empty counts as unset, like empty text, so a pull never wipes tags added in the CMS. */
function multiSelect(p: Property | undefined): string[] | null {
  if (p?.type !== "multi_select" || p.multi_select.length === 0) return null
  return p.multi_select.map((o) => o.name)
}

function kindFrom(value: string | null): CaseStudyKind | null {
  if (!value) return null
  const v = value.toLowerCase()
  if (v.startsWith("note")) return "note"
  if (v.startsWith("case")) return "case_study"
  return null
}

export function pageTitle(page: PageObjectResponse): string {
  const titleProp = Object.values(page.properties).find((p) => p.type === "title")
  return text(titleProp) ?? "Untitled"
}

export function entryFieldsFrom(page: PageObjectResponse): NotionEntryFields {
  const slug = text(prop(page, "Slug"))
  return {
    title: pageTitle(page),
    slug: slug ? slugify(slug) : null,
    kind: kindFrom(select(prop(page, "Kind"))),
    summary: text(prop(page, "Summary")),
    role: text(prop(page, "Role")),
    timeline: text(prop(page, "Timeline")),
    tags: multiSelect(prop(page, "Tags")),
    stack: multiSelect(prop(page, "Stack")),
  }
}

const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
}

const SKIPPED_BLOCKS = ["child_database", "embed", "link_preview", "pdf", "file", "audio", "unsupported"] as const

/**
 * The page body as Satahan markdown. Uploaded images are copied into the media bucket (Notion's
 * own file URLs expire after an hour) at a path keyed by block id, so re-pulling overwrites them
 * instead of piling up copies. Callouts become margin notes.
 */
export async function bodyFrom(
  pageId: string,
  { slug, supabase }: { slug: string; supabase: SupabaseClient }
): Promise<NotionBody> {
  const { client } = notionConfig()
  const n2m = new NotionToMarkdown({ notionClient: client })
  let skipped = 0

  n2m.setCustomTransformer("image", async (block) => {
    if (!("image" in block)) return false
    const image = block.image
    const alt = image.caption.map((t) => t.plain_text).join("").replace(/[[\]]/g, "") || ""
    if (image.type === "external") return `![${alt}](${image.external.url})`

    const res = await fetch(image.file.url)
    if (!res.ok) throw new Error(`Couldn't download an image from Notion (${res.status})`)
    const type = res.headers.get("content-type")?.split(";")[0] ?? "image/png"
    const path = `case-studies/${slug}/assets/notion-${block.id}.${EXT_BY_TYPE[type] ?? "png"}`
    const { error } = await supabase.storage
      .from("media")
      .upload(path, await res.arrayBuffer(), { contentType: type, upsert: true })
    if (error) throw new Error(`Couldn't save an image from Notion: ${error.message}`)
    const { data } = supabase.storage.from("media").getPublicUrl(path)
    return `![${alt}](${data.publicUrl})`
  })

  n2m.setCustomTransformer("callout", async (block) => {
    if (!("callout" in block)) return false
    const note = block.callout.rich_text.map((t) => t.plain_text).join("").trim()
    return note ? `> [!margin] ${note}` : ""
  })

  for (const type of SKIPPED_BLOCKS) {
    n2m.setCustomTransformer(type, () => {
      skipped += 1
      return ""
    })
  }

  const blocks = await n2m.pageToMarkdown(pageId)
  const contentMd = n2m.toMarkdownString(blocks).parent?.trim() ?? ""
  return { contentMd, skipped }
}
