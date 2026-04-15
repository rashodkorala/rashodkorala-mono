import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

const PROJECTS_TAG = "projects"
const CASE_STUDIES_TAG = "case-studies"

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
  revalidatePath("/")
  revalidatePath("/work")

  return NextResponse.json({ revalidated: true })
}
