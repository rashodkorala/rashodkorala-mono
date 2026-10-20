import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_TOKEN_COOKIE } from "@/lib/supabase/preview";

export async function GET(request: Request) {
  (await draftMode()).disable();
  (await cookies()).delete(PREVIEW_TOKEN_COOKIE);
  const back = new URL(request.url).searchParams.get("to");
  // Only same-site paths, so this can't be used as an open redirect.
  redirect(back?.startsWith("/") && !back.startsWith("//") ? back : "/satahan");
}
