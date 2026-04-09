import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getProjectBySlug } from "@/lib/actions/projects"
import { getCaseStudiesByProjectId } from "@/lib/actions/case-studies"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconChevronLeft, IconEdit, IconExternalLink } from "@tabler/icons-react"

export default async function ViewProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) redirect("/protected/work")
  const relatedCaseStudies = await getCaseStudiesByProjectId(project.id)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/protected/work">
              <IconChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            {project.logo && (
              <img src={project.logo} alt={`${project.title} logo`} className="mt-2 h-10 w-10 rounded object-contain border bg-background p-1" />
            )}
            {project.subtitle && (
              <p className="text-sm text-muted-foreground">{project.subtitle}</p>
            )}
            {project.shortDescription && (
              <p className="text-muted-foreground">{project.shortDescription}</p>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/protected/work/projects/${project.slug}`}>
            <IconEdit className="h-4 w-4 mr-1" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Cover image */}
      {project.coverImage && (
        <div className="rounded-lg overflow-hidden border">
          <img src={project.coverImage} alt={project.title} className="w-full h-64 object-cover" />
        </div>
      )}

      {/* Meta */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {project.timeline && (
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="text-sm font-medium">{project.timeline}</CardContent>
          </Card>
        )}
        {project.liveUrl && (
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Live</CardTitle>
            </CardHeader>
            <CardContent>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-primary underline flex items-center gap-1">
                <IconExternalLink className="h-3 w-3" /> Visit
              </a>
            </CardContent>
          </Card>
        )}
        {project.githubUrl && (
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">GitHub</CardTitle>
            </CardHeader>
            <CardContent>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm font-medium text-primary underline flex items-center gap-1">
                <IconExternalLink className="h-3 w-3" /> Repo
              </a>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tech stack */}
      {(project.techStack?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <span key={t} className="rounded bg-secondary px-2 py-1 text-xs">{t}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Media */}
      {(project.projectMedia?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.projectMedia.map((item, i) => (
                item.type === "video" ? (
                  <video key={i} src={item.url} controls className="w-full h-48 rounded-lg object-cover" />
                ) : (
                  <img key={i} src={item.url} alt={`Media ${i + 1}`} className="w-full h-48 object-cover rounded-lg" />
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related case studies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Related Case Studies</CardTitle>
        </CardHeader>
        <CardContent>
          {relatedCaseStudies.length === 0 ? (
            <p className="text-sm text-muted-foreground">No case studies linked to this project yet.</p>
          ) : (
            <div className="space-y-2">
              {relatedCaseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/protected/work/view/${cs.slug}`}
                  className="block rounded border p-3 hover:bg-muted/40 transition-colors"
                >
                  <p className="text-sm font-medium">{cs.title}</p>
                  <p className="text-xs text-muted-foreground">{cs.slug}</p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
