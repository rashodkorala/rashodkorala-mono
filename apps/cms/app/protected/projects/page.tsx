import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
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
import { ProjectActions } from "@/components/projects/project-actions"
import { IconPlus, IconCode } from "@tabler/icons-react"

interface ProjectsPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  await searchParams

  const projects = await getProjects()

  const items = projects
    .map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle || p.shortDescription || null,
      status: p.status,
      updatedAt: p.updatedAt,
      data: p,
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const publishedCount = items.filter((i) => i.status === "published").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground">Things you have built. Case studies about them live in Satahan.</p>
        </div>
        <Button asChild>
          <Link href="/protected/projects/new">
            <IconPlus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
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
          <IconCode className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No projects yet</p>
          <p className="text-sm text-muted-foreground mb-4">Create your first project.</p>
          <Button asChild>
            <Link href="/protected/projects/new">
              <IconPlus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
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
                    <Badge
                      variant={item.status === "published" ? "default" : "secondary"}
                      className="text-xs capitalize"
                    >
                      {item.status === "published" ? "Published" : "Draft"}
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
                    <ProjectActions project={item.data} />
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
