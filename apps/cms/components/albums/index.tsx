"use client"

import { useState, useEffect } from "react"
import { IconDotsVertical, IconEdit, IconLayoutGrid, IconPlus, IconRefresh, IconStar, IconTrash, IconTrendingUp } from "@tabler/icons-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlbumForm } from "./album-form"
import type { Album } from "@/lib/types/album"
import type { Photo } from "@/lib/types/photo"
import { deleteAlbum } from "@/lib/actions/albums"
import { cn } from "@/lib/utils"

interface AlbumsProps {
  initialAlbums: Album[]
  allPhotos: Photo[]
}

const Albums = ({ initialAlbums, allPhotos }: AlbumsProps) => {
  const router = useRouter()
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setAlbums(initialAlbums)
  }, [initialAlbums])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this album?")) return
    try {
      await deleteAlbum(id)
      setAlbums(albums.filter((a) => a.id !== id))
      toast.success("Album deleted")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete album")
    }
  }

  const handleEdit = (album: Album) => {
    setEditingAlbum(album)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setEditingAlbum(null)
    setIsFormOpen(true)
  }

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open)
    if (!open) {
      setEditingAlbum(null)
      router.refresh()
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      router.refresh()
      await new Promise((r) => setTimeout(r, 500))
      toast.success("Data refreshed")
    } catch {
      toast.error("Failed to refresh")
    } finally {
      setIsRefreshing(false)
    }
  }

  const publishedCount = albums.filter((a) => a.status === "published").length
  const featuredCount = albums.filter((a) => a.featured).length
  const draftCount = albums.filter((a) => a.status === "draft").length

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  const getCoverUrl = (album: Album): string | null => {
    if (!album.coverPath || !supabaseUrl) return null
    return `${supabaseUrl}/storage/v1/object/public/media/${album.coverPath}`
  }

  const formatDateRange = (album: Album): string => {
    if (!album.dateFrom && !album.dateTo) return ""
    const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    if (album.dateFrom && album.dateTo) return `${fmt(album.dateFrom)} – ${fmt(album.dateTo)}`
    if (album.dateFrom) return fmt(album.dateFrom)
    return fmt(album.dateTo!)
  }

  return (
    <div className="flex flex-grow flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Stats Cards */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:px-6 @xl/main:grid-cols-4">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Albums</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {albums.length}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <IconTrendingUp />
                    All
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">Curated photo collections</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Published</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {publishedCount}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 dark:text-green-400">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">Visible on the photos site</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Featured</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {featuredCount}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400">
                    <IconStar className="size-3" />
                    Starred
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">Highlighted albums</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Drafts</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {draftCount}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-muted-foreground">
                    Unpublished
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">Albums in progress</div>
              </CardFooter>
            </Card>
          </div>

          {/* Albums Grid */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">All Albums</h2>
                <p className="text-sm text-muted-foreground">Manage your photo albums and stories</p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
                  <IconRefresh className={cn("size-4", isRefreshing && "animate-spin")} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button onClick={handleNew}>
                  <IconPlus className="size-4" />
                  New Album
                </Button>
              </div>
            </div>

            {albums.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <IconLayoutGrid className="size-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No albums yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first album to group photos into a visual story
                </p>
                <Button onClick={handleNew}>
                  <IconPlus className="size-4" />
                  Create Album
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {albums.map((album) => {
                  const coverUrl = getCoverUrl(album)
                  const dateRange = formatDateRange(album)

                  return (
                    <Card key={album.id} className="group overflow-hidden">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        {coverUrl ? (
                          <Image
                            src={coverUrl}
                            alt={album.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <IconLayoutGrid className="size-8 text-muted-foreground" />
                          </div>
                        )}
                        {album.featured && (
                          <div className="absolute top-2 left-2">
                            <IconStar className="size-4 text-yellow-500 fill-yellow-500" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={album.status === "published" ? "default" : "secondary"}
                            className="text-[10px]"
                          >
                            {album.status}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:text-white hover:bg-white/20"
                              >
                                <IconDotsVertical />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(album)}>
                                <IconEdit className="size-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(album.id)}
                              >
                                <IconTrash className="size-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium line-clamp-1">{album.title}</CardTitle>
                        {album.location && (
                          <CardDescription className="text-xs line-clamp-1">📍 {album.location}</CardDescription>
                        )}
                        {dateRange && (
                          <CardDescription className="text-xs">{dateRange}</CardDescription>
                        )}
                        {album.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {album.tags.slice(0, 3).map((t) => (
                              <span key={t} className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AlbumForm
        album={editingAlbum}
        allPhotos={allPhotos}
        open={isFormOpen}
        onOpenChange={handleFormClose}
      />
    </div>
  )
}

export default Albums
