import { toast } from "sonner"
import { getSatahanPreviewUrl } from "@/lib/portfolio-preview"

/**
 * Opens the saved version of an entry on the portfolio, in Draft Mode. The tab opens first,
 * inside the click, so popup blockers allow it; the signed link is filled in once it's ready.
 */
export async function openSatahanPreview(slug: string) {
  const tab = window.open("about:blank", "_blank")
  try {
    const url = await getSatahanPreviewUrl(slug)
    if (tab) tab.location.href = url
    else window.location.href = url
  } catch (error) {
    tab?.close()
    toast.error(error instanceof Error ? error.message : "Couldn't open the preview")
  }
}
