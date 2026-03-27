import {
  BlogPostContent as SharedBlogPostContent,
  portfolioTheme,
  type BlogPost as ViewPost,
  type ThemeConfig,
} from "@rashodkorala/theView"

const viewDetailTheme: ThemeConfig = {
  ...portfolioTheme,
  container: {
    bg: "bg-transparent",
    text: "text-body",
  },
  navigation: {
    link: "text-caption hover:text-heading",
    linkHover: "transition-colors group",
  },
  header: {
    badge:
      "text-xs sm:text-sm px-2.5 py-1 border border-line rounded-full text-caption whitespace-nowrap",
    title:
      "font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-5 text-heading break-words",
    excerpt:
      "font-reading text-base sm:text-lg text-body-secondary font-light leading-relaxed max-w-3xl break-words",
    author:
      "font-reading text-base text-body-tertiary font-light mt-4",
  },
  heroImage: {
    border: "border-line",
    bg: "bg-surface",
  },
  tags: {
    bg: "bg-surface-raised",
    text: "text-body-secondary",
  },
  content: {
    prose:
      "prose prose-lg max-w-none prose-headings:font-normal prose-headings:tracking-tight prose-h1:font-display prose-h2:font-display prose-h3:font-display prose-h1:text-heading prose-h2:text-heading prose-h3:text-title prose-p:font-reading prose-p:text-body-secondary prose-p:leading-relaxed prose-a:text-link prose-strong:text-heading prose-code:text-body prose-code:bg-surface prose-pre:bg-surface prose-pre:border prose-pre:border-line prose-hr:border-line",
  },
  footer: {
    border: "border-line",
    text: "text-lg text-body-tertiary font-light mb-6",
    button:
      "inline-flex items-center gap-2 px-6 py-3 border border-line-strong rounded-full text-sm text-body-secondary hover:bg-surface-raised transition-colors",
    buttonHover: "",
  },
  markdown: {
    h1: "font-display text-4xl font-light tracking-tight mb-6 text-heading",
    h2: "font-display text-3xl font-light tracking-tight mt-12 mb-6 text-heading",
    h3: "font-display text-2xl font-light tracking-tight mt-8 mb-4 text-title",
    p: "font-reading text-body-secondary leading-relaxed mb-4",
    strong: "font-medium text-heading",
    em: "italic",
    code: "text-body bg-surface px-2 py-0.5 rounded text-sm font-mono",
    pre: "bg-surface border border-line rounded-lg p-4 overflow-x-auto my-6",
    a: "text-link underline decoration-link-underline hover:decoration-link-hover transition-colors",
    img: "w-full h-auto rounded-lg object-cover",
    imgBorder: "border-line",
  },
}

export default function ViewPostContent({
  post,
  backHref,
  backLabel,
}: {
  post: ViewPost
  backHref?: string
  backLabel?: string
}) {
  return <SharedBlogPostContent blog={post} theme={viewDetailTheme} backHref={backHref} backLabel={backLabel} />
}
