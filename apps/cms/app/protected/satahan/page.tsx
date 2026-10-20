import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCaseStudies } from "@/lib/actions/case-studies"
import { getProjects } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CaseStudyActions } from "@/components/case-studies/case-study-actions"
import { NotionImportDialog } from "@/components/case-studies/notion-import-dialog"
import { IconPlus, IconNews } from "@tabler/icons-react"

interface SatahanPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function SatahanPage({ searchParams }: SatahanPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  await searchParams

  const [caseStudies, projects] = await Promise.all([
    getCaseStudies(),
    getProjects(),
  ])

  const projectTitles = new Map(projects.map((p) => [p.id, p.title]))

  const items = caseStudies
    .map((cs) => ({
      id: cs.id,
      title: cs.title,
      subtitle: cs.summary || (cs.contentMd?.trim() ? cs.contentMd.trim().slice(0, 140) : null),
      project: cs.projectId ? projectTitles.get(cs.projectId) ?? null : null,
      status: cs.status,
      updatedAt: cs.updatedAt,
      data: cs,
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  // The import button only appears once Notion is configured for the CMS.
  const notionEnabled = !!process.env.NOTION_API_KEY && !!process.env.NOTION_WRITINGS_DATABASE_ID

  const publishedCount = items.filter((i) => i.status === "published").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Satahan</h1>
          <p className="text-sm text-muted-foreground">Case studies and writing.</p>
        </div>
        <div className="flex items-center gap-2">
          {notionEnabled && <NotionImportDialog />}
          <Button asChild>
            <Link href="/protected/satahan/new">
              <IconPlus className="h-4 w-4 mr-2" />
              New Entry
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: items.length },
          { label: "Published", value: publishedCount },
          { label: "Drafts", value: items.length - publishedCount },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <IconNews className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No entries yet</p>
          <p className="text-sm text-muted-foreground mb-4">Write your first case study.</p>
          <Button asChild>
            <Link href="/protected/satahan/new">
              <IconPlus className="h-4 w-4 mr-2" />
              New Entry
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.project ? (
                      <Badge variant="outline" className="text-xs">{item.project}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.status === "published" ? "default" : "secondary"}
                      className="text-xs capitalize"
                    >
                      {item.status === "published" ? "Published" : item.status === "archived" ? "Archived" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(item.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <CaseStudyActions caseStudy={item.data} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
