import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCaseStudyBySlug } from "@/lib/actions/case-studies"
import { getProjectById } from "@/lib/actions/projects"
import { getCoverUrl } from "@/lib/utils/media"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconChevronLeft, IconEdit } from "@tabler/icons-react"
import { MarkdownPreview } from "@/components/ui/markdown-preview"

interface ViewWorkPageProps {
  params: Promise<{ slug: string }>
}

export default async function ViewWorkPage({ params }: ViewWorkPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)
  if (!caseStudy) redirect("/protected/work")
  const relatedProject = caseStudy.projectId ? await getProjectById(caseStudy.projectId) : null

  const galleryUrls = (caseStudy.gallery || []).map((p) => getCoverUrl(p))
  const beforeUrl = caseStudy.beforeAfter.beforeImage ? getCoverUrl(caseStudy.beforeAfter.beforeImage) : null
  const afterUrl = caseStudy.beforeAfter.afterImage ? getCoverUrl(caseStudy.beforeAfter.afterImage) : null

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
            <h1 className="text-2xl font-bold">{caseStudy.title}</h1>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/protected/work/${caseStudy.slug}`}>
            <IconEdit className="h-4 w-4 mr-1" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {typeof caseStudy.order === "number" && (
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Order</CardTitle>
            </CardHeader>
            <CardContent className="text-sm font-medium">{caseStudy.order}</CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Featured</CardTitle>
          </CardHeader>
          <CardContent className="text-sm font-medium">{caseStudy.featured ? "Yes" : "No"}</CardContent>
        </Card>
        {caseStudy.projectId && (
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Linked</CardTitle>
            </CardHeader>
            <CardContent className="text-sm font-medium">Project linked</CardContent>
          </Card>
        )}
      </div>

      {/* Related project */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Related Project</CardTitle>
        </CardHeader>
        <CardContent>
          {!relatedProject ? (
            <p className="text-sm text-muted-foreground">No project linked.</p>
          ) : (
            <Link
              href={`/protected/work/projects/view/${relatedProject.slug}`}
              className="block rounded border p-3 hover:bg-muted/40 transition-colors"
            >
              <p className="text-sm font-medium">{relatedProject.title}</p>
              <p className="text-xs text-muted-foreground">{relatedProject.slug}</p>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      {caseStudy.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {caseStudy.tags.map((t) => (
                <span key={t} className="rounded bg-secondary px-2 py-1 text-xs">{t}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery */}
      {galleryUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryUrls.map((url, i) => (
                <img key={i} src={url} alt={`Gallery ${i + 1}`} className="w-full h-40 object-cover rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Before/After */}
      {(beforeUrl || afterUrl) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Before / After</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beforeUrl && <img src={beforeUrl} alt="Before" className="w-full h-56 object-cover rounded-lg border" />}
              {afterUrl && <img src={afterUrl} alt="After" className="w-full h-56 object-cover rounded-lg border" />}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {caseStudy.contentMd && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownPreview content={caseStudy.contentMd} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
