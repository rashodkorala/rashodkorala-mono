import { MetadataRoute } from "next"
import { getCachedAllProjects } from "@/lib/supabase/cached-projects"
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies"

const BASE_URL = "https://rashodkorala.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/work`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]

  let projects: Awaited<ReturnType<typeof getCachedAllProjects>> = []
  let caseStudies: Awaited<ReturnType<typeof getCachedCaseStudies>> = []

  try {
    [projects, caseStudies] = await Promise.all([getCachedAllProjects(), getCachedCaseStudies()])
  } catch (error) {
    // Keep sitemap generation resilient in environments without DB/network access.
    console.error("Sitemap data fetch failed:", error)
    return staticRoutes
  }

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies
    .filter((cs) => !projects.find((p) => p.slug === cs.slug))
    .map((cs) => ({
      url: `${BASE_URL}/work/${cs.slug}`,
      lastModified: new Date(cs.updated_at),
      changeFrequency: "monthly",
      priority: 0.8,
    }))

  return [...staticRoutes, ...projectRoutes, ...caseStudyRoutes]
}
