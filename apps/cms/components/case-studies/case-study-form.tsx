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
    existingGallery: caseStudy?.gallery || [],
    galleryFiles: [],
    clearBeforeImage: false,
    clearAfterImage: false,
    beforeImageFile: null,
    afterImageFile: null,
    order: caseStudy?.order ?? 0,
    status: caseStudy?.status ?? 'draft',
    summary: caseStudy?.summary ?? "",
    role: caseStudy?.role ?? "",
    timeline: caseStudy?.timeline ?? "",
    links: caseStudy?.links ?? [],
    stack: caseStudy?.stack ?? [],
    coverImageFile: null,
    clearCoverImage: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingInlineImage, setIsUploadingInlineImage] = useState(false)
  const markdownTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null)

  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [existingGallery, setExistingGallery] = useState<string[]>(caseStudy?.gallery || [])
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([])
  const [beforePreviewUrl, setBeforePreviewUrl] = useState<string | null>(
    caseStudy?.beforeAfter?.beforeImage
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${caseStudy.beforeAfter.beforeImage}`
      : null
  )
  const [afterPreviewUrl, setAfterPreviewUrl] = useState<string | null>(
    caseStudy?.beforeAfter?.afterImage
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${caseStudy.beforeAfter.afterImage}`
      : null
  )

  const [tagsCsv, setTagsCsv] = useState((caseStudy?.tags || []).join(", "))
  const [stackCsv, setStackCsv] = useState((caseStudy?.stack || []).join(", "))
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
    caseStudy?.coverPath
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${caseStudy.coverPath}`
      : null
  )

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

  const removeExistingGalleryImage = (index: number) => {
    setExistingGallery((prev) => prev.filter((_, i) => i !== index))
  }

  const syncTagsFromCsv = (value: string) => {
    setTagsCsv(value)
    const tags = value.split(",").map((t) => t.trim()).filter(Boolean)
    setFormData((prev) => ({ ...prev, tags }))
  }

  const syncStackFromCsv = (value: string) => {
    setStackCsv(value)
    const stack = value.split(",").map((t) => t.trim()).filter(Boolean)
    setFormData((prev) => ({ ...prev, stack }))
  }

  const addLink = () => {
    setFormData((prev) => ({ ...prev, links: [...prev.links, { label: "", url: "", type: "other" }] }))
  }

  const updateLink = (i: number, field: "label" | "url" | "type", value: string) => {
    setFormData((prev) => {
      const links = [...prev.links]
      links[i] = { ...links[i], [field]: value }
      return { ...prev, links }
    })
  }

  const removeLink = (i: number) => {
    setFormData((prev) => ({ ...prev, links: prev.links.filter((_, idx) => idx !== i) }))
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
      await createOrUpdateCaseStudy(
        { ...formData, existingGallery, galleryFiles },
        caseStudy?.id,
        linkedProjectIds
      )

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
        <h3 className="font-semibold">Metadata</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              className="w-full border rounded-md p-2 bg-background"
              value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as CaseStudyFormData["status"] }))}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={formData.role} onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))} placeholder="Lead Engineer & Designer" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea id="summary" rows={2} value={formData.summary} onChange={(e) => setFormData((p) => ({ ...p, summary: e.target.value }))} placeholder="Short subtitle shown on the portfolio page" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Input id="timeline" value={formData.timeline} onChange={(e) => setFormData((p) => ({ ...p, timeline: e.target.value }))} placeholder="6 months" />
          </div>
          <div className="space-y-2">
            <Label>Stack</Label>
            <Input value={stackCsv} onChange={(e) => syncStackFromCsv(e.target.value)} placeholder="React, Supabase, TypeScript" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Cover Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setFormData((p) => ({ ...p, coverImageFile: file, clearCoverImage: false }))
              if (file) {
                const reader = new FileReader()
                reader.onloadend = () => setCoverPreviewUrl(reader.result as string)
                reader.readAsDataURL(file)
              }
            }}
          />
          {coverPreviewUrl && (
            <div className="relative inline-block">
              <img src={coverPreviewUrl} alt="Cover preview" className="h-32 w-auto object-cover rounded" />
              <button
                type="button"
                onClick={() => {
                  setCoverPreviewUrl(null)
                  setFormData((p) => ({ ...p, coverImageFile: null, clearCoverImage: true }))
                }}
                className="absolute top-1 right-1 rounded bg-black/60 p-1"
              >
                <IconX className="h-3 w-3 text-white" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Links</Label>
            <Button type="button" variant="outline" size="sm" onClick={addLink}>Add link</Button>
          </div>
          {formData.links.map((link, i) => (
            <div key={i} className="flex gap-2 items-start">
              <Input
                placeholder="Label"
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                className="flex-[2]"
              />
              <select
                className="border rounded-md p-2 bg-background text-sm"
                value={link.type || "other"}
                onChange={(e) => updateLink(i, "type", e.target.value)}
              >
                <option value="live">Live</option>
                <option value="github">GitHub</option>
                <option value="other">Other</option>
              </select>
              <button type="button" onClick={() => removeLink(i)} className="rounded bg-muted p-2">
                <IconX className="h-4 w-4" />
              </button>
            </div>
          ))}
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
          {(existingGallery.length > 0 || galleryPreviewUrls.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {existingGallery.map((path, i) => (
                <div key={`existing-${path}-${i}`} className="relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button type="button" onClick={() => removeExistingGalleryImage(i)} className="absolute top-1 right-1 rounded bg-black/60 p-1">
                    <IconX className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {galleryPreviewUrls.map((url, i) => (
                <div key={`new-${i}`} className="relative">
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
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setFormData((p) => ({ ...p, beforeImageFile: file, clearBeforeImage: false }))
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => setBeforePreviewUrl(reader.result as string)
                  reader.readAsDataURL(file)
                }
              }}
            />
            {beforePreviewUrl && (
              <div className="relative inline-block">
                <img src={beforePreviewUrl} alt="Before preview" className="h-24 w-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setBeforePreviewUrl(null)
                    setFormData((p) => ({ ...p, beforeImageFile: null, clearBeforeImage: true }))
                  }}
                  className="absolute top-1 right-1 rounded bg-black/60 p-1"
                >
                  <IconX className="h-3 w-3 text-white" />
                </button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>After Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setFormData((p) => ({ ...p, afterImageFile: file, clearAfterImage: false }))
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => setAfterPreviewUrl(reader.result as string)
                  reader.readAsDataURL(file)
                }
              }}
            />
            {afterPreviewUrl && (
              <div className="relative inline-block">
                <img src={afterPreviewUrl} alt="After preview" className="h-24 w-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setAfterPreviewUrl(null)
                    setFormData((p) => ({ ...p, afterImageFile: null, clearAfterImage: true }))
                  }}
                  className="absolute top-1 right-1 rounded bg-black/60 p-1"
                >
                  <IconX className="h-3 w-3 text-white" />
                </button>
              </div>
            )}
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
