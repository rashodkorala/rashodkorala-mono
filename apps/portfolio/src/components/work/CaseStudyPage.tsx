import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CaseStudy } from "@/lib/types";
import { renderMarkdown, type MarkdownParserConfig } from "@rashodkorala/theView";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function sanitizeMdForRender(content: string): string {
  if (!content) return "";

  return content
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "\n") // Remove JSX comments like {/* ... */}
    .replace(/<[^>\n]+\/>/g, "\n") // Remove self-closing JSX tags
    .replace(/<\/?[A-Za-z][^>\n]*>/g, "\n") // Remove remaining JSX/HTML tags
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** System UI stack first (SF Pro, Segoe UI), then Helvetica — optimized for long on-screen reading */
const caseStudyFont =
  "font-[ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Helvetica,Arial,sans-serif]";

const caseStudyMarkdownConfig: MarkdownParserConfig = {
  h1: `${caseStudyFont} text-3xl md:text-4xl font-semibold tracking-tight mt-12 mb-5 text-ink dark:text-[#efe9e2]`,
  h2: `${caseStudyFont} text-2xl md:text-3xl font-semibold tracking-tight mt-12 mb-5 text-ink dark:text-[#e6dfd8]`,
  h3: `${caseStudyFont} text-xl md:text-2xl font-medium tracking-tight mt-8 mb-4 text-ink dark:text-[#ddd6cf]`,
  p: `${caseStudyFont} text-[17px] leading-[1.75] text-ink/80 dark:text-[#c4bcb5] mb-4`,
  strong: "font-semibold text-ink dark:text-[#f0ebe4]",
  em: "italic",
  code: "font-mono text-ink/85 dark:text-[#d7cfc8] bg-ink/5 dark:bg-[#1a1817] px-2 py-0.5 rounded text-sm",
  pre: "bg-ink/[0.04] dark:bg-[#171514] border border-ink/10 dark:border-[#2f2c2a] rounded-lg p-4 overflow-x-auto my-6",
  a: "text-ink dark:text-[#ece7df] underline decoration-ink/20 dark:decoration-[#7a736d] hover:decoration-ink/60 dark:hover:decoration-[#b1aaa3] transition-colors",
  img: "w-full h-auto rounded-lg object-cover",
  imgBorder: "border-ink/10 dark:border-[#2f2c2a]",
  ul: "my-6 pl-6 list-disc space-y-2.5 marker:text-ink/35 dark:marker:text-[#7a736d] [&_li]:pl-0.5",
  ol: "my-6 pl-6 list-decimal list-outside space-y-2.5 marker:text-ink/35 dark:marker:text-[#7a736d] [&_li]:pl-0.5",
  li: `${caseStudyFont} text-[17px] leading-[1.72] text-ink/85 dark:text-[#c8c0b8]`,
  blockquote: `${caseStudyFont} my-8 border-l-[3px] border-ink/20 dark:border-[#4a4540] pl-5 py-1 text-[17px] leading-[1.72] text-ink/70 dark:text-[#a9a29b] [&_br]:leading-relaxed`,
  hr: "my-12 border-0 border-t border-ink/10 dark:border-[#2e2b29]",
  th: `${caseStudyFont} px-3 py-2.5 text-left font-semibold border-b border-ink/15 dark:border-[#3a3633] text-ink dark:text-[#e6dfd8]`,
  td: `${caseStudyFont} px-3 py-2.5 align-top border-b border-ink/8 dark:border-[#2f2c2a] text-ink/80 dark:text-[#c2bab3]`,
};

export default function CaseStudyPage({ caseStudy }: { caseStudy: CaseStudy }) {
  const tags = asStringArray(caseStudy.tags);
  const relatedProjects = caseStudy.relatedProjects ?? [];
  const gallery = asStringArray(caseStudy.gallery).map(
    (path) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`
  );
  const beforeUrl = caseStudy.before_after?.beforeImage
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${caseStudy.before_after.beforeImage}`
    : null;
  const afterUrl = caseStudy.before_after?.afterImage
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${caseStudy.before_after.afterImage}`
    : null;
  const mdHtml = caseStudy.content_md
    ? renderMarkdown(sanitizeMdForRender(caseStudy.content_md), caseStudyMarkdownConfig)
    : "";

  const documentSurface =
    "rounded-sm border border-ink/10 bg-[#e4e0d8] px-6 py-10 shadow-[0_1px_2px_rgba(43,43,43,0.05),0_6px_24px_rgba(43,43,43,0.05)] md:px-10 md:py-12 dark:border-[#3d3935] dark:bg-[#1c1a17] dark:shadow-[0_10px_36px_rgba(0,0,0,0.32)]";

  const backBar =
    "fixed top-16 z-30 flex h-12 items-center border-b border-ink/10 bg-cream/95 backdrop-blur-md dark:border-[#2a2725] dark:bg-[#151311]/95 left-0 right-0 px-6 md:px-12 lg:left-48 lg:right-0 lg:px-14 lg:top-20";

  return (
    <>
      <div className={backBar} role="navigation" aria-label="Back to work">
        <div className="mx-auto flex w-full max-w-4xl">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-ink/45 transition-colors hover:text-ink group dark:text-[#a8a29d] dark:hover:text-[#e0dbd5]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
            Back to work
          </Link>
        </div>
      </div>
      <div className={`mx-auto max-w-4xl pb-12 md:pb-16 pt-2 md:pt-4 ${caseStudyFont}`}>
        <div className="h-12 shrink-0" aria-hidden />
        <div className={`${documentSurface}`}>
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border border-ink/10 text-ink/45 dark:border-[#33302d] dark:text-[#b1aaa3]">
            {tag}
          </span>
        ))}
      </div>

      <h1 className={`mt-5 ${caseStudyFont} text-3xl md:text-5xl font-semibold tracking-tight text-ink dark:text-[#f0ebe4]`}>{caseStudy.title}</h1>

      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-ink/40 border-y border-ink/10 py-4 dark:text-[#a9a29b] dark:border-[#2e2b29]" />

      {relatedProjects.length > 0 && (
        <section className="mt-6">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f]">Project</p>
          <div className="mt-3">
            {relatedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/work/projects/${project.slug}`}
                className="inline-block rounded-lg border border-ink/8 px-4 py-2 text-sm text-ink/70 hover:text-ink hover:border-ink/20 transition-colors dark:border-[#2f2c2a] dark:text-[#b9b1ab] dark:hover:text-[#eee8e0]"
              >
                {project.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {gallery[0] && (
        <div className="mt-8 relative w-full aspect-video rounded-2xl overflow-hidden border border-ink/10 dark:border-[#2f2c2a]">
          <Image src={gallery[0]} alt={caseStudy.title} fill className="object-cover saturate-95 dark:brightness-[0.86] dark:saturate-90" priority />
        </div>
      )}

      {mdHtml && (
        <section
          className="mt-14 [&_a]:break-words [&_img]:max-w-full [&_table]:text-[15px] md:[&_table]:text-base"
          dangerouslySetInnerHTML={{ __html: mdHtml }}
        />
      )}

      {gallery.length > 0 && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f]">Gallery</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((url, idx) => (
              <div key={`${url}-${idx}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-ink/8 dark:border-[#2f2c2a]">
                <Image src={url} alt={`${caseStudy.title} gallery ${idx + 1}`} fill className="object-cover dark:brightness-[0.88]" />
              </div>
            ))}
          </div>
        </section>
      )}

      <hr className="border-ink/10 my-12 dark:border-[#2e2b29]" />

      {(beforeUrl || afterUrl) && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f]">Before / After</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {beforeUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-ink/8 dark:border-[#2f2c2a]">
                <Image src={beforeUrl} alt={`${caseStudy.title} before`} fill className="object-cover dark:brightness-[0.88]" />
              </div>
            )}
            {afterUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-ink/8 dark:border-[#2f2c2a]">
                <Image src={afterUrl} alt={`${caseStudy.title} after`} fill className="object-cover dark:brightness-[0.88]" />
              </div>
            )}
          </div>
        </section>
      )}
        </div>
      </div>
    </>
  );
}
