"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { IconX } from "@tabler/icons-react"
import type { CaseStudy, CaseStudyFormData } from "@/lib/types/case-study"
import { createOrUpdateCaseStudy } from "@/lib/actions/case-studies"

interface CaseStudyFormProps {
  caseStudy?: CaseStudy
  availableProjects?: { id: string; title: string; slug: string }[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function CaseStudyForm({ caseStudy, availableProjects }: CaseStudyFormProps) {
  const router = useRouter()
  const isEditing = !!caseStudy

  const [linkedProjectIds, setLinkedProjectIds] = useState<string[]>(
    caseStudy?.projectId ? [caseStudy.projectId] : []
  )

  const [formData, setFormData] = useState<CaseStudyFormData>({
    projectId: caseStudy?.projectId || null,
    title: caseStudy?.title || "",
    slug: caseStudy?.slug || "",
    contentMd: caseStudy?.contentMd || "",
    featured: caseStudy?.featured || false,
    tags: caseStudy?.tags || [],
    galleryFiles: [],
    beforeImageFile: null,
    afterImageFile: null,
    order: caseStudy?.order ?? 0,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingInlineImage, setIsUploadingInlineImage] = useState(false)
  const markdownTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null)

  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>(
    caseStudy?.gallery || []
  )

  const [tagsCsv, setTagsCsv] = useState((caseStudy?.tags || []).join(", "))

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : slugify(title),
    }))
  }

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setGalleryFiles(prev => [...prev, ...files])
    const previews = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
      )
    )
    setGalleryPreviewUrls(prev => [...prev, ...previews])
  }

  const removeGalleryImage = (index: number) => {
    setGalleryPreviewUrls(prev => prev.filter((_, i) => i !== index))
    setGalleryFiles(prev => prev.filter((_, i) => i !== index))
  }

  const syncTagsFromCsv = (value: string) => {
    setTagsCsv(value)
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, tags }))
  }

  const insertMarkdownAtCursor = (snippet: string) => {
    const textarea = markdownTextareaRef.current
    if (!textarea) {
      setFormData((prev) => ({ ...prev, contentMd: `${prev.contentMd}\n${snippet}`.trim() }))
      return
    }

    const start = textarea.selectionStart ?? formData.contentMd.length
    const end = textarea.selectionEnd ?? formData.contentMd.length
    const next =
      formData.contentMd.slice(0, start) +
      snippet +
      formData.contentMd.slice(end)
    setFormData((prev) => ({ ...prev, contentMd: next }))

    requestAnimationFrame(() => {
      textarea.focus()
      const cursor = start + snippet.length
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  const handleInlineImageAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!formData.slug.trim()) {
      toast.error("Add a slug before attaching inline images")
      return
    }

    setIsUploadingInlineImage(true)
    try {
      const body = new FormData()
      body.append("file", file)
      body.append("slug", formData.slug)
      const response = await fetch("/api/case-studies/upload-inline-image", {
        method: "POST",
        body,
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "Failed to upload inline image" }))
        throw new Error(payload.error || "Failed to upload inline image")
      }
      const payload = await response.json()
      const publicUrl: string = payload.publicUrl
      const alt = file.name.replace(/\.[^/.]+$/, "")
      insertMarkdownAtCursor(`\n![${alt}](${publicUrl})\n`)
      toast.success("Image uploaded and inserted into markdown")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to attach image")
    } finally {
      setIsUploadingInlineImage(false)
      if (inlineImageInputRef.current) inlineImageInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required")
      return
    }

    setIsLoading(true)

    try {
      await createOrUpdateCaseStudy({ ...formData, galleryFiles }, caseStudy?.id, linkedProjectIds)

      toast.success(isEditing ? "Case study updated" : "Case study created")
      router.push("/protected/work")
      router.refresh()
    } catch (error) {
      console.error("Error saving case study:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save case study")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">Case Study</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))} required />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Project</Label>
            <select
              className="w-full border rounded-md p-2 bg-background"
              value={linkedProjectIds[0] || ""}
              onChange={(e) => setLinkedProjectIds(e.target.value ? [e.target.value] : [])}
            >
              <option value="">No project linked</option>
              {(availableProjects || []).map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" value={formData.order} onChange={(e) => setFormData((p) => ({ ...p, order: parseInt(e.target.value, 10) || 0 }))} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={formData.featured} onCheckedChange={(c) => setFormData((p) => ({ ...p, featured: Boolean(c) }))} />
          <Label>Featured</Label>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">Content (Markdown)</h3>
          <div className="flex items-center gap-2">
            <input
              ref={inlineImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInlineImageAttach}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploadingInlineImage}
              onClick={() => inlineImageInputRef.current?.click()}
            >
              {isUploadingInlineImage ? "Uploading..." : "Attach image"}
            </Button>
          </div>
        </div>
        <Textarea
          ref={markdownTextareaRef}
          rows={16}
          value={formData.contentMd}
          onChange={(e) => setFormData((p) => ({ ...p, contentMd: e.target.value }))}
          placeholder="Write case study content in markdown. Use 'Attach image' to upload and insert image markdown."
          className="font-mono text-sm"
        />
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Media</h3>
        <div className="space-y-2">
          <Label>Gallery</Label>
          <Input type="file" accept="image/*" multiple onChange={handleGalleryImageUpload} />
          {galleryPreviewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryPreviewUrls.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-24 object-cover rounded" />
                  <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 rounded bg-black/60 p-1">
                    <IconX className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Before Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFormData((p) => ({ ...p, beforeImageFile: e.target.files?.[0] || null }))} />
          </div>
          <div className="space-y-2">
            <Label>After Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFormData((p) => ({ ...p, afterImageFile: e.target.files?.[0] || null }))} />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Tags</h3>
        <Input
          value={tagsCsv}
          onChange={(e) => syncTagsFromCsv(e.target.value)}
          placeholder="ui, conversion, redesign"
        />
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, i) => (
              <span key={`${tag}-${i}`} className="bg-secondary px-2 py-1 rounded text-sm">{tag}</span>
            ))}
          </div>
        )}
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.push("/protected/work")} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : isEditing ? "Update Case Study" : "Create Case Study"}</Button>
      </div>
    </form>
  )
}
