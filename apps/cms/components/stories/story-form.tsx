"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Story, StoryInsert } from "@/lib/types/story"
import { createStory, updateStory } from "@/lib/actions/stories"

function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

interface StoryFormProps {
  story?: Story | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StoryForm({ story, open, onOpenChange }: StoryFormProps) {
  const router = useRouter()
  const isEditing = !!story

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [description, setDescription] = useState("")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [published, setPublished] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (story) {
      setTitle(story.title)
      setSlug(story.slug)
      setSlugTouched(true)
      setDescription(story.description || "")
      setCoverImageUrl(story.coverImageUrl || "")
      setPublished(story.published)
    } else {
      setTitle("")
      setSlug("")
      setSlugTouched(false)
      setDescription("")
      setCoverImageUrl("")
      setPublished(true)
    }
  }, [story, open])

  useEffect(() => {
    if (!isEditing && !slugTouched && title) {
      setSlug(slugify(title))
    }
  }, [title, isEditing, slugTouched])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const s = slug.trim() ? slugify(slug) : slugify(title)
    if (!title.trim() || !s) {
      toast.error("Title and slug are required")
      return
    }

    setIsLoading(true)
    try {
      const payload: StoryInsert = {
        title: title.trim(),
        slug: s,
        description: description.trim() || null,
        coverImageUrl: coverImageUrl.trim() || null,
        published,
      }

      if (isEditing && story) {
        await updateStory({
          id: story.id,
          ...payload,
        })
        toast.success("Story updated")
      } else {
        await createStory(payload)
        toast.success("Story created")
      }

      onOpenChange(false)
      setTimeout(() => router.refresh(), 100)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save story")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit story" : "New story"}</DialogTitle>
          <DialogDescription>
            Visual stories group photos on the Photos site (e.g. a place or trip).
          </DialogDescription>
        </DialogHeader>
        <form id="story-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="story-title">Title</Label>
            <Input
              id="story-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ella, Sri Lanka"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="story-slug">URL slug</Label>
            <Input
              id="story-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
              placeholder="ella-sri-lanka"
              required
            />
            <p className="text-xs text-muted-foreground">
              Shown as /stories/your-slug on the Photos site.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="story-desc">Description</Label>
            <Textarea
              id="story-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional intro text"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="story-cover">Cover image URL</Label>
            <Input
              id="story-cover"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="story-published"
              checked={published}
              onCheckedChange={(c) => setPublished(!!c)}
            />
            <Label htmlFor="story-published" className="cursor-pointer">
              Published (visible on Photos site)
            </Label>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="story-form" disabled={isLoading}>
            {isLoading ? "Saving…" : isEditing ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
