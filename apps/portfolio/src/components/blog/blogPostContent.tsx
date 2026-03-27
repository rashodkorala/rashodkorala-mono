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
    text: "text-ink dark:text-[#d7d2cc]",
  },
  navigation: {
    link: "text-ink/45 hover:text-ink dark:text-[#a8a29d] dark:hover:text-[#e0dbd5]",
    linkHover: "transition-colors group",
  },
  header: {
    badge:
      "text-xs sm:text-sm px-2.5 py-1 border border-ink/10 dark:border-[#33302d] rounded-full text-ink/45 dark:text-[#b5ada6] whitespace-nowrap",
    title:
      "font-['Times_New_Roman','Times',serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-5 text-ink dark:text-[#efe9e2] break-words",
    excerpt:
      "font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-base sm:text-lg text-muted_ink dark:text-[#b9b1aa] font-light leading-relaxed max-w-3xl break-words",
    author:
      "font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-base text-ink/55 dark:text-[#a9a19a] font-light mt-4",
  },
  heroImage: {
    border: "border-ink/10 dark:border-[#2f2c2a]",
    bg: "bg-ink/5 dark:bg-[#171514]",
  },
  tags: {
    bg: "bg-ink/10 dark:bg-[#1f1c1a]",
    text: "text-ink/70 dark:text-[#c1b9b2]",
  },
  content: {
    prose:
      "prose prose-lg max-w-none prose-headings:font-normal prose-headings:tracking-tight prose-h1:font-['Times_New_Roman','Times',serif] prose-h2:font-['Times_New_Roman','Times',serif] prose-h3:font-['Times_New_Roman','Times',serif] prose-h1:text-ink prose-h2:text-ink prose-h3:text-ink dark:prose-h1:text-[#efe9e2] dark:prose-h2:text-[#e6dfd8] dark:prose-h3:text-[#ddd6cf] prose-p:font-['Helvetica_Neue','Helvetica','Arial',sans-serif] prose-p:text-ink/75 dark:prose-p:text-[#c2bab3] prose-p:leading-relaxed prose-a:text-ink dark:prose-a:text-[#ece7df] prose-strong:text-ink dark:prose-strong:text-[#f0ebe4] prose-code:text-ink/85 dark:prose-code:text-[#d7cfc8] prose-code:bg-ink/5 dark:prose-code:bg-[#1a1817] prose-pre:bg-ink/[0.04] dark:prose-pre:bg-[#171514] prose-pre:border prose-pre:border-ink/10 dark:prose-pre:border-[#2f2c2a] prose-hr:border-ink/10 dark:prose-hr:border-[#2e2b29]",
  },
  footer: {
    border: "border-ink/10 dark:border-[#2e2b29]",
    text: "text-lg text-ink/55 dark:text-[#a9a19a] font-light mb-6",
    button:
      "inline-flex items-center gap-2 px-6 py-3 border border-ink/20 dark:border-[#3a3633] rounded-full text-sm text-ink/75 dark:text-[#cec7c0] hover:bg-ink/5 dark:hover:bg-[#1a1817] transition-colors",
    buttonHover: "",
  },
  markdown: {
    h1: "font-['Times_New_Roman','Times',serif] text-4xl font-light tracking-tight mb-6 text-ink dark:text-[#efe9e2]",
    h2: "font-['Times_New_Roman','Times',serif] text-3xl font-light tracking-tight mt-12 mb-6 text-ink dark:text-[#e6dfd8]",
    h3: "font-['Times_New_Roman','Times',serif] text-2xl font-light tracking-tight mt-8 mb-4 text-ink dark:text-[#ddd6cf]",
    p: "font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-ink/75 dark:text-[#c2bab3] leading-relaxed mb-4",
    strong: "font-medium text-ink dark:text-[#f0ebe4]",
    em: "italic",
    code: "text-ink/85 dark:text-[#d7cfc8] bg-ink/5 dark:bg-[#1a1817] px-2 py-0.5 rounded text-sm font-mono",
    pre: "bg-ink/[0.04] dark:bg-[#171514] border border-ink/10 dark:border-[#2f2c2a] rounded-lg p-4 overflow-x-auto my-6",
    a: "text-ink dark:text-[#ece7df] underline decoration-ink/20 dark:decoration-[#7a736d] hover:decoration-ink/60 dark:hover:decoration-[#b1aaa3] transition-colors",
    img: "w-full h-auto rounded-lg object-cover",
    imgBorder: "border-ink/10 dark:border-[#2f2c2a]",
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