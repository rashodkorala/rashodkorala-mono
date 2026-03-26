import { getProjectBySlug } from "@/lib/actions/projects"
import { ProjectForm } from "@/components/projects/project-form"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconChevronLeft } from "@tabler/icons-react"

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) redirect("/protected/work")

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/protected/work">
            <IconChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Project</h1>
          <p className="text-sm text-muted-foreground">{project.title}</p>
        </div>
      </div>
      <ProjectForm project={project} />
    </div>
  )
}
