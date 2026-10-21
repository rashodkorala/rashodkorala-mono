import { Client, isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"

/** Notion setup for pulling Satahan writings. Server-only: the token must never reach the browser. */
export function notionConfig() {
  const token = process.env.NOTION_API_KEY?.trim()
  const databaseId = process.env.NOTION_WRITINGS_DATABASE_ID?.trim()
  if (!token || !databaseId) {
    throw new Error("Notion isn't set up: add NOTION_API_KEY and NOTION_WRITINGS_DATABASE_ID to the CMS environment")
  }
  return { client: new Client({ auth: token }), databaseId }
}

/** Every page in the Writings database, newest edit first. */
export async function queryWritings(): Promise<PageObjectResponse[]> {
  const { client, databaseId } = notionConfig()
  const pages: PageObjectResponse[] = []
  let cursor: string | undefined
  do {
    const res = await client.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
    })
    pages.push(...res.results.filter(isFullPage))
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)
  return pages
}

export async function getWritingPage(pageId: string): Promise<PageObjectResponse> {
  const { client } = notionConfig()
  const page = await client.pages.retrieve({ page_id: pageId })
  if (!isFullPage(page)) throw new Error("Couldn't read that Notion page")
  return page
}

const STATUS_LABEL = { draft: "Draft", published: "Published", archived: "Archived" } as const

/**
 * Mirrors the CMS status onto the page's Status column (the CMS owns status; Notion only shows it).
 * Changing a property bumps Notion's edit time, so this returns the edit time to store as "last
 * pulled": the new one when Notion had no unpulled edits, otherwise the stored one unchanged, so
 * real Notion edits still show as changed. Returns null when nothing needed changing.
 */
export async function syncWritingStatus(
  pageId: string,
  status: keyof typeof STATUS_LABEL,
  storedLastEditedAt: string | null
): Promise<string | null> {
  const { client } = notionConfig()
  const page = await getWritingPage(pageId)
  // A page deleted in Notion sits in its trash and can't be edited; leave it alone.
  if (page.archived) return null
  const current = page.properties.Status
  const label = STATUS_LABEL[status]
  if (!current || current.type !== "select" || current.select?.name === label) return null

  const hadNotionEdits =
    !storedLastEditedAt || new Date(page.last_edited_time).getTime() > new Date(storedLastEditedAt).getTime()
  const updated = await client.pages.update({ page_id: pageId, properties: { Status: { select: { name: label } } } })
  if (hadNotionEdits || !isFullPage(updated)) return storedLastEditedAt
  return updated.last_edited_time
}
