import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectForm } from "@/components/projects/project-form"
import { Button } from "@/components/ui/button"
import { IconChevronLeft } from "@tabler/icons-react"

export default async function NewProjectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  return (
    <div className="space-y-2">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 pt-4 md:px-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/protected/projects">
            <IconChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">New project</p>
      </div>
      <ProjectForm />
    </div>
  )
}
