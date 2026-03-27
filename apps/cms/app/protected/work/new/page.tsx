import { getProjects } from "@/lib/actions/projects"
import { NewWorkClient } from "./new-work-client"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NewWorkPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const projects = await getProjects()

  const availableProjects = projects.map(p => ({ id: p.id, title: p.title, slug: p.slug }))

  return <NewWorkClient availableProjects={availableProjects} />
}
