import { getAboutProfile } from "@/lib/actions/about"

export default async function AboutPage() {
  const profile = await getAboutProfile()

  return (
    <div className="space-y-6 px-4">
      <div>
        <h1 className="text-3xl font-bold">About</h1>
        <p className="text-muted-foreground">Profile content used by portfolio About section.</p>
      </div>
      <div className="rounded-md border p-4">
        <p className="text-sm text-muted-foreground">Display name</p>
        <p className="font-medium">{profile?.displayName || "-"}</p>
      </div>
      <div className="rounded-md border p-4">
        <p className="text-sm text-muted-foreground">Headline</p>
        <p className="font-medium">{profile?.headline || "-"}</p>
      </div>
    </div>
  )
}

