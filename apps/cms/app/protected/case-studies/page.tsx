import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkItems } from "@/lib/actions/work"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { IconPlus } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CaseStudyFilters } from "@/components/case-studies/case-study-filters"

export default async function ProtectedCaseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const statusFilter = params.status || "all"

  const workItems = await getWorkItems(statusFilter === "all" ? undefined : statusFilter)
  const allWorkItems = statusFilter === "all" ? workItems : await getWorkItems()

  const stats = {
    total: allWorkItems.length,
    published: allWorkItems.filter((item) => item.status === "published").length,
    draft: allWorkItems.filter((item) => item.status === "draft").length,
    views: 0,
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work</h1>
          <p className="text-muted-foreground">Manage your work items</p>
        </div>
        <Link href="/protected/work/new">
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            New Work Item
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
            <CardDescription>Total</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.published}</CardTitle>
            <CardDescription>Published</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.draft}</CardTitle>
            <CardDescription>Drafts</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">-</CardTitle>
            <CardDescription>Views (n/a)</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <CaseStudyFilters currentStatus={statusFilter} />

      {workItems.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">
              {statusFilter === "all" ? "No work items yet" : `No ${statusFilter} work items`}
            </h3>
            <p className="text-muted-foreground">
              {statusFilter === "all"
                ? "Get started by creating your first work item"
                : "Try a different filter or create a new work item"}
            </p>
            <Link href="/protected/work/new">
              <Button>
                <IconPlus className="h-4 w-4 mr-2" />
                Create Work Item
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.featured && <span className="text-yellow-500">*</span>}
                        <span className="truncate">{item.title}</span>
                      </div>
                      {item.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverImageUrl}
                          alt={`${item.title} cover`}
                          className="h-10 w-16 rounded-md object-cover border shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-16 rounded-md border bg-muted shrink-0" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.category || "Work"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.targetApp}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "published"
                          ? "default"
                          : item.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(item.updatedAt).toLocaleDateString()}
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
