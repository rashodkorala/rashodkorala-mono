import { MetadataRoute } from "next"
import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase"
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies"

const BASE_URL = "https://rashodkorala.com"

async function getBlogSlugsUncached(): Promise<{ slug: string; updated_at: string | null }[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select("slug, updated_at")
    .eq("status", "published")
    .or("target_app.eq.portfolio,target_app.eq.both")

  if (error) {
    console.error("Error fetching blog slugs for sitemap:", error)
    return []
  }
  return data || []
}

const getCachedBlogSlugs = unstable_cache(getBlogSlugsUncached, ["sitemap-blog-slugs"], {
  revalidate: 3600,
  tags: ["blogs-portfolio"],
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/work`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/view`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ]

  const [caseStudies, blogs] = await Promise.all([getCachedCaseStudies(), getCachedBlogSlugs()])

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
    url: `${BASE_URL}/work/${caseStudy.slug}`,
    lastModified: new Date(caseStudy.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/view/${blog.slug}`,
    lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...caseStudyRoutes, ...blogRoutes]
}
