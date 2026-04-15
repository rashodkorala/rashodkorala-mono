import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    const filename = searchParams.get("filename")

    if (!slug || !filename) {
      return NextResponse.json({ error: "Missing slug or filename" }, { status: 400 })
    }

    const ext = filename.split(".").pop() || "bin"
    const path = `case-studies/${slug}/assets/${crypto.randomUUID()}.${ext}`

    const { data, error } = await supabase.storage.from("media").createSignedUploadUrl(path)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path)

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path,
      publicUrl: urlData.publicUrl,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create upload URL" },
      { status: 500 }
    )
  }
}
