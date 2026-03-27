import { unstable_cache } from "next/cache"
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

export async function getCachedProjectBySlug(slug: string): Promise<Project | null> {
  return unstable_cache(
    () => getProjectBySlug(slug),
    ["project-by-slug", slug],
    { revalidate: REVALIDATE, tags: [...TAGS, `project-${slug}`] }
  )()
}
