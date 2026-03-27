import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { ProjectDB } from "@/lib/types/project"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    const { slug } = await params

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        )
      }
      console.error("Error fetching project:", error)
      return NextResponse.json(
        { error: "Failed to fetch project" },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Transform to camelCase for API response
    const project: ProjectDB = data
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

    const response = {
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

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in GET /api/projects/[slug]:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


