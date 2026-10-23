"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { IconBrandNotion, IconCircleCheckFilled, IconCircleX, IconExternalLink, IconLoader2, IconX } from "@tabler/icons-react"
import type { CaseStudy, CaseStudyFormData } from "@/lib/types/case-study"
import { createOrUpdateCaseStudy } from "@/lib/actions/case-studies"
import { getPublishChecks, SUMMARY_MAX_LENGTH } from "@/lib/satahan-requirements"
import { cn } from "@/lib/utils"
import { MarkdownEditor } from "@/components/editor/markdown-editor"
import {
  AutoGrowTextarea,
  EditorLayout,
  SaveBar,
  SidebarSection,
  useEditorShortcuts,
} from "@/components/work-editor/editor-layout"
import { TagInput } from "@/components/work-editor/tag-input"
import { openSatahanPreview } from "@/components/case-studies/open-preview"
import { confirmReplaceBody } from "@/components/case-studies/notion-confirm"
import { pullNotionPage } from "@/lib/actions/notion"

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

const mediaUrl = (path: string) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`
const isVideoPath = (path: string) => /\.(mp4|webm|mov|ogg)$/i.test(path)

const selectClass = "h-9 w-full rounded-md border bg-background px-2 text-sm"

function Thumb({ src, video, alt, onRemove }: { src: string; video?: boolean; alt: string; onRemove: () => void }) {
  return (
    <div className="relative">
      {video ? (
        <video src={src} className="h-20 w-full rounded object-cover" muted playsInline />
      ) : (
        <img src={src} alt={alt} className="h-20 w-full rounded object-cover" />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${alt}`}
        className="absolute right-1 top-1 rounded bg-black/60 p-1"
      >
        <IconX className="h-3 w-3 text-white" />
      </button>
    </div>
  )
}

export function CaseStudyForm({ caseStudy, availableProjects }: CaseStudyFormProps) {
  const router = useRouter()
  const isEditing = !!caseStudy
  const formRef = useRef<HTMLFormElement>(null)

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
    status: caseStudy?.status ?? "draft",
    summary: caseStudy?.summary ?? "",
    role: caseStudy?.role ?? "",
    timeline: caseStudy?.timeline ?? "",
    links: caseStudy?.links ?? [],
    stack: caseStudy?.stack ?? [],
    kind: caseStudy?.kind ?? "case_study",
    // No longer edited here; carried through so saving keeps any existing value.
    inShort: caseStudy?.inShort ?? "",
    coverImageFile: null,
    clearCoverImage: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [existingGallery, setExistingGallery] = useState<string[]>(caseStudy?.gallery || [])
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([])
  const [beforePreviewUrl, setBeforePreviewUrl] = useState<string | null>(
    caseStudy?.beforeAfter?.beforeImage ? mediaUrl(caseStudy.beforeAfter.beforeImage) : null
  )
  const [afterPreviewUrl, setAfterPreviewUrl] = useState<string | null>(
    caseStudy?.beforeAfter?.afterImage ? mediaUrl(caseStudy.beforeAfter.afterImage) : null
  )
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
    caseStudy?.coverPath ? mediaUrl(caseStudy.coverPath) : null
  )
  const [editSlug, setEditSlug] = useState(false)

  const { dirty, markSaved } = useEditorShortcuts(
    formRef,
    [formData, linkedProjectIds, galleryFiles, existingGallery],
    isLoading
  )

  const update = <K extends keyof CaseStudyFormData>(key: K, value: CaseStudyFormData[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }))

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : slugify(title),
    }))
  }

  const readPreview = (file: File, set: (url: string) => void) => {
    const reader = new FileReader()
    reader.onloadend = () => set(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setGalleryFiles((prev) => [...prev, ...files])
    const previews = await Promise.all(
      files.map((file) =>
        file.type.startsWith("video/")
          ? Promise.resolve(URL.createObjectURL(file))
          : new Promise<string>((resolve) => readPreview(file, resolve))
      )
    )
    setGalleryPreviewUrls((prev) => [...prev, ...previews])
  }

  const removeGalleryImage = (index: number) => {
    setGalleryPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addLink = () => update("links", [...formData.links, { label: "", url: "", type: "other" }])

  const updateLink = (i: number, field: "label" | "url" | "type", value: string) => {
    const links = [...formData.links]
    links[i] = { ...links[i], [field]: value }
    update("links", links)
  }

  /** Uploads media pasted/dropped into the editor; returns its public URL. */
  const uploadInlineMedia = async (file: File): Promise<string> => {
    if (!formData.slug.trim()) throw new Error("Add a title first — media is stored under the case study's slug")

    // Signed upload URL from the server avoids Next.js body size limits.
    const urlRes = await fetch(
      `/api/case-studies/signed-upload-url?slug=${encodeURIComponent(formData.slug)}&filename=${encodeURIComponent(file.name)}`
    )
    if (!urlRes.ok) {
      const payload = await urlRes.json().catch(() => ({ error: "Failed to get upload URL" }))
      throw new Error(payload.error || "Failed to get upload URL")
    }
    const { signedUrl, publicUrl } = await urlRes.json()

    // Supabase signed upload expects multipart FormData (file under "" key).
    // Remap video/quicktime (.mov) → video/mp4 since Supabase doesn't accept quicktime.
    const mimeType = file.type === "video/quicktime" ? "video/mp4" : file.type
    const uploadBlob = mimeType !== file.type ? new Blob([file], { type: mimeType }) : file
    const uploadForm = new FormData()
    uploadForm.append("cacheControl", "3600")
    uploadForm.append("", uploadBlob, file.name)
    const uploadRes = await fetch(signedUrl, { method: "PUT", body: uploadForm })
    if (!uploadRes.ok) {
      const errText = await uploadRes.text().catch(() => "")
      throw new Error(`Upload failed (${uploadRes.status})${errText ? `: ${errText}` : ""}`)
    }
    return publicUrl as string
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required")
      return
    }

    if (formData.status === "published" && publishIssues.length > 0) {
      toast.error(`Can't publish yet. Missing: ${publishIssues.map((c) => c.message).join(", ")}`)
      return
    }

    setIsLoading(true)

    try {
      await createOrUpdateCaseStudy({ ...formData, existingGallery, galleryFiles }, caseStudy?.id, linkedProjectIds)

      markSaved()
      toast.success(isEditing ? "Case study updated" : "Case study created")
      router.push("/protected/satahan")
      router.refresh()
    } catch (error) {
      console.error("Error saving case study:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save case study")
    } finally {
      setIsLoading(false)
    }
  }

  const cancel = () => {
    if (dirty && !confirm("Discard unsaved changes?")) return
    router.push("/protected/satahan")
  }

  const [pulling, setPulling] = useState(false)

  // A pull rewrites the saved entry, then reloads the form with it.
  const pullFromNotion = async () => {
    if (!caseStudy?.id) return
    if (dirty) {
      toast.error("Save or discard your changes before pulling from Notion.")
      return
    }
    setPulling(true)
    try {
      let result = await pullNotionPage(caseStudy.id)
      if (result.conflict) {
        if (!(await confirmReplaceBody(caseStudy.title))) return
        result = await pullNotionPage(caseStudy.id, { force: true })
      }
      toast.success(
        result.skipped > 0
          ? `Pulled from Notion. ${result.skipped} block${result.skipped === 1 ? "" : "s"} couldn't be brought across.`
          : "Pulled from Notion."
      )
      window.location.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't pull from Notion")
    } finally {
      setPulling(false)
    }
  }

  // Preview reads what's saved, so unsaved edits won't show until the next save.
  const preview = () => {
    if (!caseStudy?.slug) return
    if (dirty) toast.info("Preview shows the last saved version. Save to include your latest edits.")
    void openSatahanPreview(caseStudy.slug)
  }

  const galleryCount = existingGallery.length + galleryFiles.length
  const publishChecks = getPublishChecks(formData, { hasCover: !!coverPreviewUrl })
  const publishIssues = publishChecks.filter((c) => !c.ok)
  const summaryLength = formData.summary.trim().length
  const detailsHint = [formData.role, formData.timeline].filter(Boolean).join(" · ")

  const main = (
    <div className="space-y-4">
      <AutoGrowTextarea
        aria-label="Title"
        value={formData.title}
        onChange={handleTitleChange}
        placeholder="Untitled entry"
        className="text-4xl font-bold leading-tight tracking-tight"
      />
      <div>
        <AutoGrowTextarea
          aria-label="Summary"
          value={formData.summary}
          onChange={(v) => update("summary", v)}
          placeholder="One-line summary shown on the index and under the title"
          className="text-lg text-muted-foreground"
        />
        <p
          className={cn(
            "mt-1 text-right text-xs tabular-nums text-muted-foreground",
            summaryLength > SUMMARY_MAX_LENGTH && "text-destructive"
          )}
        >
          {summaryLength} / {SUMMARY_MAX_LENGTH}
        </p>
      </div>
      <div className="border-t pt-6">
        <MarkdownEditor
          initialValue={formData.contentMd}
          onChange={(md) => update("contentMd", md)}
          uploadFile={uploadInlineMedia}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Margin note: start a quote with <code>[!margin]</code>, e.g. <code>&gt; [!margin] Spider charts were cut early.</code>
        </p>
      </div>
    </div>
  )

  const sidebar = (
    <>
      <SidebarSection
        title="Ready to publish"
        hint={publishIssues.length ? `${publishIssues.length} missing` : "Ready"}
        defaultOpen
      >
        <ul className="space-y-1.5">
          {publishChecks.map((check) => (
            <li key={check.field} className="flex items-center gap-2 text-sm">
              {check.ok ? (
                <IconCircleCheckFilled className="h-4 w-4 shrink-0 fill-green-500 dark:fill-green-400" />
              ) : (
                <IconCircleX className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className={check.ok ? undefined : "text-muted-foreground"}>{check.message}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          {formData.kind === "case_study"
            ? "Case studies also need a cover, role and timeline."
            : "Articles and notes need only the basics."}
        </p>
      </SidebarSection>

      {caseStudy?.notionPageId && (
        <SidebarSection title="Notion" hint="Linked" defaultOpen>
          <p className="text-sm text-muted-foreground">
            The body comes from Notion.{" "}
            {caseStudy.notionSyncedAt
              ? `Last pulled ${new Date(caseStudy.notionSyncedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}.`
              : null}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={pullFromNotion} disabled={pulling || isLoading}>
              {pulling ? <IconLoader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <IconBrandNotion className="mr-1.5 h-4 w-4" />}
              Pull from Notion
            </Button>
            <Button type="button" variant="ghost" size="sm" asChild>
              <a href={`https://www.notion.so/${caseStudy.notionPageId.replace(/-/g, "")}`} target="_blank" rel="noreferrer">
                <IconExternalLink className="mr-1.5 h-4 w-4" />
                Open in Notion
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Cover, project, status and slug stay as set here.</p>
        </SidebarSection>
      )}

      <SidebarSection title="Publishing" defaultOpen>
        <div className="space-y-2">
          <Label htmlFor="cs-kind">Kind</Label>
          <select
            id="cs-kind"
            className={selectClass}
            value={formData.kind}
            onChange={(e) => update("kind", e.target.value as CaseStudyFormData["kind"])}
          >
            <option value="case_study">Case study</option>
            <option value="article">Article (long-form writing)</option>
            <option value="note">Note (short, shown in full on the index)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cs-status">Status</Label>
          <select
            id="cs-status"
            className={selectClass}
            value={formData.status}
            onChange={(e) => update("status", e.target.value as CaseStudyFormData["status"])}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cs-project">Project</Label>
          <select
            id="cs-project"
            className={selectClass}
            value={linkedProjectIds[0] || ""}
            onChange={(e) => setLinkedProjectIds(e.target.value ? [e.target.value] : [])}
          >
            <option value="">No project linked</option>
            {(availableProjects || []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="cs-featured"
            checked={formData.featured}
            onCheckedChange={(c) => update("featured", Boolean(c))}
          />
          <Label htmlFor="cs-featured">Featured</Label>
        </div>
      </SidebarSection>

      <SidebarSection title="Cover image" hint={coverPreviewUrl ? "Set" : "None"} defaultOpen={!isEditing}>
        {coverPreviewUrl && (
          <Thumb
            src={coverPreviewUrl}
            alt="Cover"
            onRemove={() => {
              setCoverPreviewUrl(null)
              setFormData((p) => ({ ...p, coverImageFile: null, clearCoverImage: true }))
            }}
          />
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setFormData((p) => ({ ...p, coverImageFile: file, clearCoverImage: false }))
            if (file) readPreview(file, setCoverPreviewUrl)
          }}
        />
      </SidebarSection>

      <SidebarSection title="Details" hint={detailsHint || undefined}>
        <div className="space-y-2">
          <Label htmlFor="cs-role">Role</Label>
          <Input
            id="cs-role"
            value={formData.role}
            onChange={(e) => update("role", e.target.value)}
            placeholder="Lead Engineer & Designer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cs-timeline">Timeline</Label>
          <Input
            id="cs-timeline"
            value={formData.timeline}
            onChange={(e) => update("timeline", e.target.value)}
            placeholder="6 months"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cs-stack">Stack</Label>
          <TagInput id="cs-stack" value={formData.stack} onChange={(v) => update("stack", v)} placeholder="React, Supabase…" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cs-tags">Tags</Label>
          <TagInput id="cs-tags" value={formData.tags} onChange={(v) => update("tags", v)} placeholder="ui, redesign…" />
        </div>
      </SidebarSection>

      <SidebarSection title="Links" hint={formData.links.length ? `${formData.links.length}` : undefined}>
        {formData.links.map((link, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-2">
            <div className="flex gap-2">
              <Input placeholder="Label" value={link.label} onChange={(e) => updateLink(i, "label", e.target.value)} />
              <select
                className="h-9 rounded-md border bg-background px-2 text-sm"
                value={link.type || "other"}
                onChange={(e) => updateLink(i, "type", e.target.value)}
              >
                <option value="live">Live</option>
                <option value="github">GitHub</option>
                <option value="other">Other</option>
              </select>
              <button
                type="button"
                onClick={() => update("links", formData.links.filter((_, idx) => idx !== i))}
                aria-label="Remove link"
                className="rounded p-2 text-muted-foreground hover:bg-muted"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>
            <Input placeholder="https://…" value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addLink}>
          Add link
        </Button>
      </SidebarSection>

      <SidebarSection title="Gallery" hint={galleryCount ? `${galleryCount} item${galleryCount === 1 ? "" : "s"}` : undefined}>
        {galleryCount > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {existingGallery.map((path, i) => (
              <Thumb
                key={`existing-${path}-${i}`}
                src={mediaUrl(path)}
                video={isVideoPath(path)}
                alt={`Gallery ${i + 1}`}
                onRemove={() => setExistingGallery((prev) => prev.filter((_, idx) => idx !== i))}
              />
            ))}
            {galleryPreviewUrls.map((url, i) => (
              <Thumb
                key={`new-${i}`}
                src={url}
                video={galleryFiles[i]?.type.startsWith("video/")}
                alt={`New gallery item ${i + 1}`}
                onRemove={() => removeGalleryImage(i)}
              />
            ))}
          </div>
        )}
        <Input type="file" accept="image/*,video/*" multiple onChange={handleGalleryImageUpload} />
      </SidebarSection>

      <SidebarSection
        title="Before / After"
        hint={beforePreviewUrl || afterPreviewUrl ? "Set" : undefined}
      >
        {(
          [
            ["Before", beforePreviewUrl, setBeforePreviewUrl, "beforeImageFile", "clearBeforeImage"],
            ["After", afterPreviewUrl, setAfterPreviewUrl, "afterImageFile", "clearAfterImage"],
          ] as const
        ).map(([label, preview, setPreview, fileKey, clearKey]) => (
          <div key={label} className="space-y-2">
            <Label>{label}</Label>
            {preview && (
              <Thumb
                src={preview}
                alt={`${label} image`}
                onRemove={() => {
                  setPreview(null)
                  setFormData((p) => ({ ...p, [fileKey]: null, [clearKey]: true }))
                }}
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setFormData((p) => ({ ...p, [fileKey]: file, [clearKey]: false }))
                if (file) readPreview(file, setPreview)
              }}
            />
          </div>
        ))}
      </SidebarSection>

      <SidebarSection title="Advanced" hint={formData.slug ? `/${formData.slug}` : undefined}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cs-slug">URL slug</Label>
            {!editSlug && (
              <button type="button" className="text-xs text-muted-foreground underline" onClick={() => setEditSlug(true)}>
                Edit
              </button>
            )}
          </div>
          <Input
            id="cs-slug"
            value={formData.slug}
            readOnly={!editSlug}
            className={editSlug ? undefined : "text-muted-foreground"}
            onChange={(e) => update("slug", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {isEditing ? "Changing it breaks existing links to this case study." : "Generated from the title."}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cs-order">Order</Label>
          <Input
            id="cs-order"
            type="number"
            value={formData.order}
            onChange={(e) => update("order", parseInt(e.target.value, 10) || 0)}
          />
        </div>
      </SidebarSection>
    </>
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <EditorLayout main={main} sidebar={sidebar} />
      <SaveBar
        dirty={dirty}
        saving={isLoading}
        submitLabel={isEditing ? "Save changes" : "Create case study"}
        onCancel={cancel}
        extra={
          caseStudy?.slug ? (
            <Button type="button" variant="outline" onClick={preview} disabled={isLoading}>
              <IconExternalLink className="mr-1.5 h-4 w-4" />
              Preview
            </Button>
          ) : null
        }
      />
    </form>
  )
}
