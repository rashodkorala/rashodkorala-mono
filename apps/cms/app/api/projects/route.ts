import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { ProjectDB } from "@/lib/types/project"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    // Get query parameters
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")

    // Build query - only published projects
    let query = supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false })

    if (featured === "true") {
      query = query.eq("featured", true)
    }

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: 500 }
      )
    }

    // Transform to camelCase for API response
    const projects = (data || []).map((project: ProjectDB) => {
      const legacyProject = project as ProjectDB & {
        problem?: string | null
        solution?: string | null
        roles?: string[] | null
        features?: string[] | null
        tech?: string[] | null
        cover_image_url?: string | null
        gallery_image_urls?: string[] | null
        gallery_video_urls?: string[] | null
        category?: string | null
        status?: string | null
        featured?: boolean | null
        sort_order?: number | null
      }

      return {
        id: project.id,
        userId: project.user_id,
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle,
        shortDescription: project.short_description,
        problem: legacyProject.problem ?? null,
        solution: legacyProject.solution ?? null,
        roles: legacyProject.roles ?? (project.role ? [project.role] : []),
        features: legacyProject.features ?? [],
        tech: legacyProject.tech ?? project.tech_stack ?? [],
        role: project.role,
        timeline: project.timeline,
        liveUrl: project.live_url,
        githubUrl: project.github_url,
        logo: project.logo,
        coverImage: project.cover_image,
        coverImageUrl: legacyProject.cover_image_url ?? project.cover_image,
        projectMedia: project.project_media ?? [],
        galleryImageUrls:
          legacyProject.gallery_image_urls ??
          (project.project_media ?? [])
            .filter((item) => item.type === "image")
            .map((item) => item.url),
        galleryVideoUrls:
          legacyProject.gallery_video_urls ??
          (project.project_media ?? [])
            .filter((item) => item.type === "video")
            .map((item) => item.url),
        category: legacyProject.category ?? null,
        status: legacyProject.status ?? null,
        featured: legacyProject.featured ?? null,
        sortOrder: legacyProject.sort_order ?? null,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error in GET /api/projects:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}




