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
