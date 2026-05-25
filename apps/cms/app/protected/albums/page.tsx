import Albums from "@/components/albums"
import { getAlbums } from "@/lib/actions/albums"
import { getPhotos } from "@/lib/actions/photos"

export default async function AlbumsPage() {
  const [albums, photos] = await Promise.all([getAlbums(), getPhotos()])
  return <Albums initialAlbums={albums} allPhotos={photos} />
}
