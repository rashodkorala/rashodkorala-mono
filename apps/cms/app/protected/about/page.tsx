import { AboutForm } from "@/components/about/about-form"
import { getAboutProfile } from "@/lib/actions/about"

export default async function AboutPage() {
  const profile = await getAboutProfile()
  return <AboutForm profile={profile} />
}
