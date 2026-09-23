import { permanentRedirect } from "next/navigation"

// Projects used to live at /work/projects/{slug}; every piece of work is now at /work/{slug}.
export default async function LegacyProjectRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  permanentRedirect(`/work/${slug}`)
}
