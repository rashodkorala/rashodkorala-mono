import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase"
import type { Project } from "@/lib/types"

const REVALIDATE = 3600
const TAGS = ["projects"]

export async function getCachedAllProjects(): Promise<Project[]> {
  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
        return []
      }
      return (data || []) as Project[]
    },
    ["projects-list"],
    { revalidate: REVALIDATE, tags: TAGS }
  )()
}

export async function getCachedProjectBySlug(slug: string): Promise<Project | null> {
  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single()

      if (error) {
        console.error("Error fetching project:", error)
        return null
      }
      return data as Project
    },
    ["project-by-slug", slug],
    { revalidate: REVALIDATE, tags: [...TAGS, `project-${slug}`] }
  )()
}
