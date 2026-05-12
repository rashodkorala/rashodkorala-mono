import { unstable_cache } from "next/cache"
import { cache } from "react"
import { getAllProjects, getProjectBySlug } from "./projects"
import type { Project } from "@/lib/types"

const REVALIDATE = 3600
const TAGS = ["projects"]

export async function getCachedAllProjects(): Promise<Project[]> {
  return unstable_cache(
    () => getAllProjects(),
    ["projects-list"],
    { revalidate: REVALIDATE, tags: TAGS }
  )()
}

/**
 * Not cached with `unstable_cache`: that would store `null` for up to REVALIDATE when
 * the slug was missing once (e.g. visited before publish). `/work` uses a separate
 * cached `getCachedAllProjects()` key, so the grid could show a project while this
 * route kept serving a stale 404. CMS `revalidatePath` does not touch the portfolio app.
 *
 * `cache()` dedupes the two calls in `generateMetadata` + page for the same request.
 */
const getProjectBySlugForRequest = cache(async (slug: string) => getProjectBySlug(slug))

export async function getCachedProjectBySlug(slug: string): Promise<Project | null> {
  return getProjectBySlugForRequest(slug)
}
