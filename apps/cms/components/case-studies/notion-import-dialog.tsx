"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconBrandNotion, IconExternalLink, IconLoader2, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  importNotionPage,
  listNotionWritings,
  pullNotionPage,
  type NotionPullResult,
  type NotionWriting,
} from "@/lib/actions/notion"
import { confirmReplaceBody } from "@/components/case-studies/notion-confirm"

const STATE_LABEL: Record<NotionWriting["state"], string> = {
  new: "New",
  matches: "Same slug in CMS",
  linked: "Up to date",
  changed: "Changed in Notion",
}

function skippedNote(result: NotionPullResult) {
  return result.skipped > 0 ? ` ${result.skipped} block${result.skipped === 1 ? "" : "s"} couldn't be brought across.` : ""
}

/** Lists the Notion Writings database and imports, links or pulls each page. */
export function NotionImportDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<NotionWriting[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      setRows(await listNotionWritings())
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't reach Notion")
    } finally {
      setLoading(false)
    }
  }

  const run = async (row: NotionWriting) => {
    setBusy(row.pageId)
    try {
      let result: NotionPullResult
      if (row.state === "new") {
        result = await importNotionPage(row.pageId)
        toast.success(`Imported “${row.title}” as a draft.${skippedNote(result)}`)
      } else if (row.state === "matches" && row.entry) {
        result = await importNotionPage(row.pageId, { linkTo: row.entry.id })
        toast.success(`Linked “${row.entry.title}” to Notion and pulled it.${skippedNote(result)}`)
      } else if (row.entry) {
        result = await pullNotionPage(row.entry.id)
        if (result.conflict) {
          if (!(await confirmReplaceBody(row.entry.title))) return
          result = await pullNotionPage(row.entry.id, { force: true })
        }
        toast.success(`Pulled “${row.entry.title}” from Notion.${skippedNote(result)}`)
      }
      await load()
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setBusy(null)
    }
  }

  const actionLabel = (row: NotionWriting) =>
    row.state === "new" ? "Import" : row.state === "matches" ? "Link" : "Pull"

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) void load()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <IconBrandNotion className="h-4 w-4 mr-2" />
          Import from Notion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import from Notion</DialogTitle>
          <DialogDescription>
            Pages in your Notion Writings database. Imports arrive as drafts; publish them here when they&apos;re ready.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => void load()} disabled={loading}>
            <IconRefresh className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {rows === null ? (
          <p className="py-10 text-center text-sm text-muted-foreground">{loading ? "Loading Notion pages…" : "Couldn't load Notion pages."}</p>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">The Writings database has no pages yet.</p>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Edited in Notion</TableHead>
                  <TableHead className="w-28 text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.pageId}>
                    <TableCell className="max-w-xs">
                      <a href={row.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium hover:underline">
                        <span className="truncate">{row.title}</span>
                        <IconExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      </a>
                      {row.entry && <p className="truncate text-xs text-muted-foreground">/{row.entry.slug}</p>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.state === "changed" || row.state === "new" ? "default" : "secondary"}>
                        {STATE_LABEL[row.state]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(row.lastEditedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={row.state === "linked" ? "ghost" : "default"}
                        onClick={() => void run(row)}
                        disabled={busy !== null}
                      >
                        {busy === row.pageId && <IconLoader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                        {actionLabel(row)}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
