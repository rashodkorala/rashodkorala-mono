import { MetadataRoute } from "next"
import { getCachedAllProjects } from "@/lib/supabase/cached-projects"
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies"
import { buildSatahanItems, buildProjectItems } from "@/lib/entries"

const BASE_URL = "https://rashodkorala.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/satahan`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/apps`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/apps/inkbar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/apps/inkbar/support`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/apps/inkbar/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
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

  const projectRoutes: MetadataRoute.Sitemap = buildProjectItems(projects, caseStudies).map((item) => ({
    url: `${BASE_URL}/projects/${item.slug}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const satahanRoutes: MetadataRoute.Sitemap = buildSatahanItems(caseStudies, projects).map((item) => ({
    url: `${BASE_URL}/satahan/${item.slug}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...projectRoutes, ...satahanRoutes]
}
