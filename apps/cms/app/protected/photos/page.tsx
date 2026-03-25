import Photos from "@/components/photos";
import { getPhotos } from "@/lib/actions/photos";
import { getStories } from "@/lib/actions/stories";

export default async function PhotosPage() {
  const [photos, stories] = await Promise.all([getPhotos(), getStories()]);
  return <Photos initialPhotos={photos} stories={stories} />;
}

