import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { getAllCaseStudies } from "@/lib/supabase/case-studies"
import { getAllProjects } from "@/lib/supabase/projects"

const PROJECTS_TAG = "projects"
const CASE_STUDIES_TAG = "case-studies"
const BLOGS_TAG = "blogs-portfolio"

const STATIC_PATHS = [
  "/",
  "/work",
  "/work/projects",
  "/contact",
  "/cv",
  "/privacy",
  "/apps",
  "/apps/inkbar",
  "/apps/inkbar/support",
  "/apps/inkbar/privacy",
  "/inkbar",
  "/inkbar/privacy",
  "/inkbar/support",
] as const

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function POST(request: Request) {
  const secret = process.env.PORTFOLIO_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: "Revalidation is not configured" },
      { status: 503 }
    )
  }

  const auth = request.headers.get("authorization")
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null
  if (!token || token !== secret) {
    return unauthorized()
  }

  revalidateTag(PROJECTS_TAG)
  revalidateTag(CASE_STUDIES_TAG)
  revalidateTag(BLOGS_TAG)

  const slugPaths: string[] = []
  try {
    const [projects, caseStudies] = await Promise.all([
      getAllProjects(),
      getAllCaseStudies(),
    ])
    const slugs = new Set<string>()
    for (const project of projects) {
      if (project.slug) slugs.add(project.slug)
    }
    for (const study of caseStudies) {
      if (study.slug) slugs.add(study.slug)
    }
    for (const slug of Array.from(slugs)) {
      revalidateTag(`case-study-${slug}`)
      revalidatePath(`/work/${slug}`)
      revalidatePath(`/work/projects/${slug}`)
      slugPaths.push(slug)
    }
  } catch (error) {
    console.error("[revalidate] failed to load slugs for path revalidation:", error)
  }

  revalidatePath("/", "layout")

  for (const path of STATIC_PATHS) {
    revalidatePath(path)
  }

  return NextResponse.json({
    revalidated: true,
    full: true,
    tags: [PROJECTS_TAG, CASE_STUDIES_TAG, BLOGS_TAG],
    staticPaths: STATIC_PATHS.length,
    dynamicSlugs: slugPaths.length,
  })
}
