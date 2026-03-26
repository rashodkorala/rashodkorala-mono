import { MetadataRoute } from "next"
import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase"
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies"

const BASE_URL = "https://rashodkorala.com"

async function getViewPostSlugsUncached(): Promise<{ slug: string; updated_at: string | null }[]> {
  const { data, error } = await supabase
    .from("view_posts")
    .select("slug, updated_at")
    .eq("status", "published")
    .or("target_app.eq.portfolio,target_app.eq.both")

  if (error) {
    console.error("Error fetching view post slugs for sitemap:", error)
    return []
  }
  return data || []
}

const getCachedViewPostSlugs = unstable_cache(getViewPostSlugsUncached, ["sitemap-view-post-slugs"], {
  revalidate: 3600,
  tags: ["view-posts-portfolio"],
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/work`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/view`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ]

  const [caseStudies, viewPosts] = await Promise.all([getCachedCaseStudies(), getCachedViewPostSlugs()])

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
    url: `${BASE_URL}/work/${caseStudy.slug}`,
    lastModified: new Date(caseStudy.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const viewPostRoutes: MetadataRoute.Sitemap = viewPosts.map((post) => ({
    url: `${BASE_URL}/view/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...caseStudyRoutes, ...viewPostRoutes]
}
