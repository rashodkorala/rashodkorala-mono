"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Story } from "@/lib/types/story"
import { deleteStory } from "@/lib/actions/stories"
import { StoryForm } from "./story-form"

interface StoriesProps {
  initialStories: Story[]
}

export default function Stories({ initialStories }: StoriesProps) {
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Story | null>(null)

  useEffect(() => {
    setStories(initialStories)
  }, [initialStories])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this story? Photos in this story will be unassigned.")) {
      return
    }
    try {
      await deleteStory(id)
      setStories((prev) => prev.filter((s) => s.id !== id))
      toast.success("Story deleted")
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete")
    }
  }

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (s: Story) => {
    setEditing(s)
    setFormOpen(true)
  }

  return (
    <div className="flex flex-grow flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-semibold tabular-nums">Stories</h1>
              <p className="text-sm text-muted-foreground">
                Group photos into themed stories on the Photos site.
              </p>
            </div>
            <Button onClick={openNew}>
              <IconPlus className="size-4" />
              New story
            </Button>
          </div>

          {stories.length === 0 ? (
            <div className="mx-4 rounded-lg border border-dashed p-12 text-center lg:mx-6">
              <p className="text-muted-foreground mb-4">No stories yet.</p>
              <Button onClick={openNew} variant="outline">
                Create your first story
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-6">
              {stories.map((s) => (
                <Card key={s.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-2">{s.title}</CardTitle>
                      <Badge variant={s.published ? "default" : "secondary"}>
                        {s.published ? "Live" : "Draft"}
                      </Badge>
                    </div>
                    <CardDescription className="font-mono text-xs">
                      /stories/{s.slug}
                    </CardDescription>
                    {s.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {s.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardFooter className="gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                      <IconEdit className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(s.id)}
                    >
                      <IconTrash className="size-4" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <StoryForm
        story={editing}
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false)
            setEditing(null)
            router.refresh()
          } else {
            setFormOpen(true)
          }
        }}
      />
    </div>
  )
}
