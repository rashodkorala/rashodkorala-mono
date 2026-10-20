import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getPreviewCaseStudy, PREVIEW_TOKEN_COOKIE } from "@/lib/supabase/preview";

/** Entry point for CMS previews: checks the token, turns on Draft Mode, opens the entry. */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const entry = await getPreviewCaseStudy(token);
  if (!entry) {
    return NextResponse.json({ error: "This preview link is invalid or has expired. Open Preview from the CMS again." }, { status: 401 });
  }

  (await draftMode()).enable();
  (await cookies()).set(PREVIEW_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60, // matches the token's lifetime in the database
  });
  redirect(`/satahan/${encodeURIComponent(entry.slug)}`);
}
