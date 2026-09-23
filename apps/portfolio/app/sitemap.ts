import { MetadataRoute } from "next"
import { getCachedAllProjects } from "@/lib/supabase/cached-projects"
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies"
import { localizedPath, routing, SITE_URL } from "@/i18n/routing"

type Entry = MetadataRoute.Sitemap[number]
type RouteSpec = Pick<Entry, "lastModified" | "changeFrequency" | "priority"> & { path: string }

/** One sitemap entry per locale, each listing its hreflang siblings. */
function localizedEntries({ path, ...rest }: RouteSpec): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}${localizedPath(path, locale)}`])
  )
  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${localizedPath(path, locale)}`,
    alternates: { languages },
    ...rest,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: RouteSpec[] = [
    { path: "/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { path: "/work", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { path: "/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { path: "/cv", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { path: "/apps", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { path: "/apps/inkbar", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { path: "/apps/inkbar/support", lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { path: "/apps/inkbar/privacy", lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ]

  let projects: Awaited<ReturnType<typeof getCachedAllProjects>> = []
  let caseStudies: Awaited<ReturnType<typeof getCachedCaseStudies>> = []

  try {
    [projects, caseStudies] = await Promise.all([getCachedAllProjects(), getCachedCaseStudies()])
  } catch (error) {
    // Keep sitemap generation resilient in environments without DB/network access.
    console.error("Sitemap data fetch failed:", error)
    return staticRoutes.flatMap(localizedEntries)
  }

  const projectRoutes: RouteSpec[] = projects.map((project) => ({
    path: `/work/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const caseStudyRoutes: RouteSpec[] = caseStudies
    .filter((cs) => !projects.find((p) => p.slug === cs.slug))
    .map((cs) => ({
      path: `/work/${cs.slug}`,
      lastModified: new Date(cs.updated_at),
      changeFrequency: "monthly",
      priority: 0.8,
    }))

  return [...staticRoutes, ...projectRoutes, ...caseStudyRoutes].flatMap(localizedEntries)
}
