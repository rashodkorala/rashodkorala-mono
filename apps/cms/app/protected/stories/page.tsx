import Stories from "@/components/stories"
import { getStories } from "@/lib/actions/stories"

export default async function StoriesPage() {
  const stories = await getStories()
  return <Stories initialStories={stories} />
}
