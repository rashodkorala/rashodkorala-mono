"use client"

import { useState, useEffect, useRef } from "react"
import { IconPlus, IconX, IconPhoto, IconGripVertical, IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Album, AlbumInsert, AlbumUpdate } from "@/lib/types/album"
import type { Photo } from "@/lib/types/photo"
import { createAlbum, updateAlbum, addPhotoToAlbum, removePhotoFromAlbum, reorderAlbumPhotos, updatePhotoCaption, getAlbumWithPhotos } from "@/lib/actions/albums"

interface AlbumFormProps {
  album?: Album | null
  allPhotos: Photo[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface SelectedPhoto {
  photoId: string
  caption: string
  position: number
  imageUrl: string
  title: string
}

export function AlbumForm({ album, allPhotos, open, onOpenChange }: AlbumFormProps) {
  const isEdit = !!album

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [clearCover, setClearCover] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<SelectedPhoto[]>([])
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)
  const [pickerSearch, setPickerSearch] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return

    if (album) {
      setTitle(album.title)
      setSlug(album.slug)
      setSlugManuallyEdited(true)
      setDescription(album.description ?? "")
      setLocation(album.location ?? "")
      setDateFrom(album.dateFrom ?? "")
      setDateTo(album.dateTo ?? "")
      setTags(album.tags ?? [])
      setFeatured(album.featured)
      setStatus(album.status)
      setCoverPreview(null)
      setCoverFile(null)
      setClearCover(false)

      setLoadingPhotos(true)
      getAlbumWithPhotos(album.id).then((full) => {
        if (full) {
          setSelectedPhotos(
            full.photos.map((e) => ({
              photoId: e.photoId,
              caption: e.caption ?? "",
              position: e.position,
              imageUrl: e.photo.imageUrl,
              title: e.photo.title,
            }))
          )
        }
        setLoadingPhotos(false)
      })
    } else {
      setTitle("")
      setSlug("")
      setSlugManuallyEdited(false)
      setDescription("")
      setLocation("")
      setDateFrom("")
      setDateTo("")
      setTags([])
      setTagInput("")
      setFeatured(false)
      setStatus("draft")
      setCoverFile(null)
      setCoverPreview(null)
      setClearCover(false)
      setSelectedPhotos([])
    }
  }, [open, album])

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (!slugManuallyEdited) setSlug(slugify(v))
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setClearCover(false)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleRemoveCover = () => {
    setCoverFile(null)
    setCoverPreview(null)
    setClearCover(true)
    if (coverInputRef.current) coverInputRef.current.value = ""
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput("")
  }

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t))

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const togglePhoto = (photo: Photo) => {
    const exists = selectedPhotos.find((p) => p.photoId === photo.id)
    if (exists) {
      setSelectedPhotos(selectedPhotos.filter((p) => p.photoId !== photo.id))
    } else {
      setSelectedPhotos([
        ...selectedPhotos,
        {
          photoId: photo.id,
          caption: "",
          position: selectedPhotos.length,
          imageUrl: photo.imageUrl,
          title: photo.title,
        },
      ])
    }
  }

  const movePhoto = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= selectedPhotos.length) return
    const updated = [...selectedPhotos]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    setSelectedPhotos(updated.map((p, i) => ({ ...p, position: i })))
  }

  const updateCaption = (photoId: string, caption: string) => {
    setSelectedPhotos(selectedPhotos.map((p) => (p.photoId === photoId ? { ...p, caption } : p)))
  }

  const removeSelected = (photoId: string) => {
    setSelectedPhotos(selectedPhotos.filter((p) => p.photoId !== photoId).map((p, i) => ({ ...p, position: i })))
  }

  const filteredPickerPhotos = allPhotos.filter((p) => {
    if (!pickerSearch) return true
    const q = pickerSearch.toLowerCase()
    return p.title.toLowerCase().includes(q) || (p.category?.toLowerCase().includes(q) ?? false)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required")
      return
    }
    setIsSubmitting(true)

    try {
      let savedAlbum: Album

      if (isEdit && album) {
        const updateData: AlbumUpdate = {
          id: album.id,
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          location: location.trim() || null,
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
          tags,
          featured,
          status,
          clearCoverImage: clearCover,
          coverImageFile: coverFile ?? undefined,
        }
        savedAlbum = await updateAlbum(updateData)

        // Sync photo selections
        const existingFull = await getAlbumWithPhotos(album.id)
        const existingPhotoIds = new Set(existingFull?.photos.map((p) => p.photoId) ?? [])
        const newPhotoIds = new Set(selectedPhotos.map((p) => p.photoId))

        // Add new photos
        for (const sp of selectedPhotos) {
          if (!existingPhotoIds.has(sp.photoId)) {
            await addPhotoToAlbum(savedAlbum.id, sp.photoId, sp.caption || undefined)
          } else {
            await updatePhotoCaption(savedAlbum.id, sp.photoId, sp.caption || null)
          }
        }
        // Remove deselected photos
        for (const photoId of existingPhotoIds) {
          if (!newPhotoIds.has(photoId)) {
            await removePhotoFromAlbum(savedAlbum.id, photoId)
          }
        }
        // Reorder
        if (selectedPhotos.length > 0) {
          await reorderAlbumPhotos(savedAlbum.id, selectedPhotos.map((p) => p.photoId))
        }
      } else {
        const insertData: AlbumInsert = {
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          location: location.trim() || null,
          dateFrom: dateFrom || null,
          dateTo: dateTo || null,
          tags,
          featured,
          status,
          coverImageFile: coverFile ?? undefined,
        }
        savedAlbum = await createAlbum(insertData)

        // Add photos to new album
        for (const sp of selectedPhotos) {
          await addPhotoToAlbum(savedAlbum.id, sp.photoId, sp.caption || undefined)
        }
        if (selectedPhotos.length > 0) {
          await reorderAlbumPhotos(savedAlbum.id, selectedPhotos.map((p) => p.photoId))
        }
      }

      toast.success(isEdit ? "Album updated" : "Album created")
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Album" : "New Album"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          {/* Core fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="album-title">Title *</Label>
              <Input
                id="album-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Pacific Road Trip"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="album-slug">Slug *</Label>
              <Input
                id="album-slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setSlugManuallyEdited(true)
                }}
                placeholder="pacific-road-trip"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Checkbox id="album-featured" checked={featured} onCheckedChange={(v) => setFeatured(!!v)} />
              <Label htmlFor="album-featured">Featured</Label>
            </div>
          </div>

          {/* Cover image */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            {(coverPreview || (album?.coverPath && !clearCover)) ? (
              <div className="relative w-full aspect-video overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreview ?? ""}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                >
                  <IconX className="size-4" />
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => coverInputRef.current?.click()}
              >
                <IconPhoto className="size-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload cover image</p>
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
            {!coverPreview && !album?.coverPath && (
              <Button type="button" variant="outline" size="sm" onClick={() => coverInputRef.current?.click()}>
                <IconPlus className="size-4 mr-1" /> Choose Image
              </Button>
            )}
          </div>

          {/* Collapsible details */}
          <div className="border border-border rounded-md">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span>Details (description, location, dates, tags)</span>
              {showDetails ? <IconChevronUp className="size-4" /> : <IconChevronDown className="size-4" />}
            </button>
            {showDetails && (
              <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="album-desc">Description</Label>
                  <Textarea
                    id="album-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A week driving the Pacific Coast Highway..."
                    rows={4}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="album-location">Location</Label>
                  <Input
                    id="album-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Pacific Coast Highway, California"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="album-from">Date From</Label>
                    <Input id="album-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="album-to">Date To</Label>
                    <Input id="album-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Add tag..."
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((t) => (
                        <Badge key={t} variant="secondary" className="gap-1">
                          {t}
                          <button type="button" onClick={() => removeTag(t)}>
                            <IconX className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Photo picker section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Photos ({selectedPhotos.length} selected)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPhotoPicker(!showPhotoPicker)}
              >
                <IconPlus className="size-4 mr-1" />
                Add Photos
              </Button>
            </div>

            {/* Photo picker grid */}
            {showPhotoPicker && (
              <div className="border border-border rounded-md p-3 space-y-3">
                <Input
                  placeholder="Search photos..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                />
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {filteredPickerPhotos.map((photo) => {
                    const isSelected = selectedPhotos.some((p) => p.photoId === photo.id)
                    return (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => togglePhoto(photo)}
                        className={`relative aspect-square overflow-hidden rounded border-2 transition-all ${
                          isSelected ? "border-primary" : "border-transparent"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary text-primary-foreground rounded-full p-0.5">
                              <IconX className="size-3 rotate-45" />
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
                <Button type="button" size="sm" onClick={() => setShowPhotoPicker(false)}>
                  Done
                </Button>
              </div>
            )}

            {/* Selected photos list with reorder + captions */}
            {loadingPhotos ? (
              <p className="text-sm text-muted-foreground">Loading existing photos...</p>
            ) : selectedPhotos.length > 0 ? (
              <div className="space-y-2">
                {selectedPhotos.map((sp, index) => (
                  <div key={sp.photoId} className="flex gap-2 items-start border border-border rounded-md p-2">
                    <div className="flex flex-col gap-0.5 pt-1">
                      <button
                        type="button"
                        onClick={() => movePhoto(index, -1)}
                        disabled={index === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <IconChevronUp className="size-3.5" />
                      </button>
                      <IconGripVertical className="size-3.5 text-muted-foreground mx-auto" />
                      <button
                        type="button"
                        onClick={() => movePhoto(index, 1)}
                        disabled={index === selectedPhotos.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <IconChevronDown className="size-3.5" />
                      </button>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sp.imageUrl}
                      alt={sp.title}
                      className="w-14 h-14 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-medium line-clamp-1">{sp.title}</p>
                      <Input
                        value={sp.caption}
                        onChange={(e) => updateCaption(sp.photoId, e.target.value)}
                        placeholder="Caption (optional)"
                        className="text-xs h-7"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSelected(sp.photoId)}
                      className="text-muted-foreground hover:text-destructive mt-1"
                    >
                      <IconX className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No photos selected yet.</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Update Album" : "Create Album"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
