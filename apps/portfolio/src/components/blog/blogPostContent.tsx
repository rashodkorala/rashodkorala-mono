import { BlogPostContent as SharedBlogPostContent, portfolioTheme } from "@rashodkorala/theView"
import type { BlogPost } from "@rashodkorala/theView"

export default function BlogPostContent({
  blog,
  backHref,
  backLabel,
}: {
  blog: BlogPost
  backHref?: string
  backLabel?: string
}) {
  return <SharedBlogPostContent blog={blog} theme={portfolioTheme} backHref={backHref} backLabel={backLabel} />
}