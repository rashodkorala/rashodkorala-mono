import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file")
    const slug = formData.get("slug")

    if (!(file instanceof File) || !slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Missing file or slug" }, { status: 400 })
    }

    const ext = file.name.split(".").pop() || "jpg"
    const path = `case-studies/${slug}/assets/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage.from("media").upload(path, file)
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path)
    return NextResponse.json({ path, publicUrl: data.publicUrl })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    )
  }
}
