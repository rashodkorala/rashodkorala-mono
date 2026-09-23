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
    <div className="space-y-2">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 pt-4 md:px-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/protected/work">
            <IconChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Edit project</p>
        </div>
      </div>
      <ProjectForm project={project} />
    </div>
  )
}
