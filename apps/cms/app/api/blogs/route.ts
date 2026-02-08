import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role for public API - no auth required for reading published blogs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetApp = searchParams.get("app") // portfolio, photos, or null for all
    const slug = searchParams.get("slug")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const category = searchParams.get("category")

    // If slug is provided, fetch single blog
    if (slug) {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json({ error: "Blog not found" }, { status: 404 })
        }
        throw error
      }

      // Fetch markdown content from storage if mdx_path exists
      let markdownContent = ""
      if (data.mdx_path) {
        try {
          const { data: markdownData, error: markdownError } = await supabase.storage
            .from("blogs-mdx")
            .download(data.mdx_path)

          if (!markdownError && markdownData) {
            markdownContent = await markdownData.text()
          }
        } catch (err) {
          console.error("Error fetching markdown from storage:", err)
          // Fallback to empty content if fetch fails
        }
      }

      // Transform to camelCase
      const blog = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: markdownContent,
        featuredImageUrl: data.featured_image_url,
        status: data.status,
        targetApp: data.target_app,
        publishedAt: data.published_at,
        authorName: data.author_name,
        category: data.category,
        tags: data.tags,
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        featured: data.featured,
        views: data.views,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      return NextResponse.json(blog)
    }

    // Fetch list of blogs
    let query = supabase
      .from("blogs")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })

    // Filter by target app
    if (targetApp && targetApp !== "all") {
      query = query.or(`target_app.eq.${targetApp},target_app.eq.both`)
    }

    // Filter by featured
    if (featured === "true") {
      query = query.eq("featured", true)
    }

    // Filter by category
    if (category) {
      query = query.eq("category", category)
    }

    // Limit results
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    // Transform to camelCase (note: for list view, we don't fetch markdown content)
    const blogs = (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: "", // Content not included in list view
      featuredImageUrl: item.featured_image_url,
      status: item.status,
      targetApp: item.target_app,
      publishedAt: item.published_at,
      authorName: item.author_name,
      category: item.category,
      tags: item.tags,
      seoTitle: item.seo_title,
      seoDescription: item.seo_description,
      featured: item.featured,
      views: item.views,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }))

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
}
