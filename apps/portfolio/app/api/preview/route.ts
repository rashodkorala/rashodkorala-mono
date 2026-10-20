import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { isValidPreviewRequest } from "@/lib/preview-token";

/** Entry point for CMS previews: checks the signed link, turns on Draft Mode, opens the entry. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const expires = Number(searchParams.get("expires"));
  const signature = searchParams.get("sig") ?? "";

  if (!isValidPreviewRequest(slug, expires, signature)) {
    return NextResponse.json({ error: "Invalid or expired preview link" }, { status: 401 });
  }

  (await draftMode()).enable();
  redirect(`/satahan/${encodeURIComponent(slug)}`);
}
