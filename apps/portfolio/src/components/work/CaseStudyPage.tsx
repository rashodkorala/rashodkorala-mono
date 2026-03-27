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
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "\n")
    .replace(/<[^>\n]+\/>/g, "\n")
    .replace(/<\/?[A-Za-z][^>\n]*>/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

const caseStudyFont = "font-reading";

const caseStudyMarkdownConfig: MarkdownParserConfig = {
  h1: `${caseStudyFont} text-3xl md:text-4xl font-semibold tracking-tight mt-12 mb-5 text-heading`,
  h2: `${caseStudyFont} text-2xl md:text-3xl font-semibold tracking-tight mt-12 mb-5 text-heading`,
  h3: `${caseStudyFont} text-xl md:text-2xl font-medium tracking-tight mt-8 mb-4 text-title`,
  p: `${caseStudyFont} text-[17px] leading-[1.75] text-body-secondary mb-4`,
  strong: "font-semibold text-heading",
  em: "italic",
  code: "font-mono text-body bg-surface px-2 py-0.5 rounded text-sm",
  pre: "bg-surface border border-line rounded-lg p-4 overflow-x-auto my-6",
  a: "text-link underline decoration-link-underline hover:decoration-link-hover transition-colors",
  img: "w-full h-auto rounded-lg object-cover",
  imgBorder: "border-line",
  ul: "my-6 pl-6 list-disc space-y-2.5 marker:text-label [&_li]:pl-0.5",
  ol: "my-6 pl-6 list-decimal list-outside space-y-2.5 marker:text-label [&_li]:pl-0.5",
  li: `${caseStudyFont} text-[17px] leading-[1.72] text-body-secondary`,
  blockquote: `${caseStudyFont} my-8 border-l-[3px] border-line-strong pl-5 py-1 text-[17px] leading-[1.72] text-body-tertiary [&_br]:leading-relaxed`,
  hr: "my-12 border-0 border-t border-line",
  th: `${caseStudyFont} px-3 py-2.5 text-left font-semibold border-b border-line-strong text-heading`,
  td: `${caseStudyFont} px-3 py-2.5 align-top border-b border-line-subtle text-body-secondary`,
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
    "rounded-sm border border-line-strong bg-doc-bg px-6 py-10 shadow-[0_1px_2px_rgba(43,43,43,0.05),0_6px_24px_rgba(43,43,43,0.05)] md:px-10 md:py-12 dark:shadow-[0_10px_36px_rgba(0,0,0,0.32)]";

  const backBar =
    "fixed top-header z-30 flex h-12 items-center border-b border-line bg-surface-overlay-strong backdrop-blur-md left-0 right-0 px-page-px md:px-page-px-md lg:left-sidenav lg:right-0 lg:px-page-px-lg lg:top-header-lg";

  return (
    <>
      <div className={backBar} role="navigation" aria-label="Back to work">
        <div className="mx-auto flex w-full max-w-4xl">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-caption transition-colors hover:text-heading group"
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
          <span key={tag} className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border border-line text-caption">
            {tag}
          </span>
        ))}
      </div>

      <h1 className={`mt-5 ${caseStudyFont} text-3xl md:text-5xl font-semibold tracking-tight text-heading`}>{caseStudy.title}</h1>

      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-label border-y border-line py-4" />

      {relatedProjects.length > 0 && (
        <section className="mt-6">
          <p className="text-[11px] uppercase tracking-[0.15em] text-label">Project</p>
          <div className="mt-3">
            {relatedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/work/projects/${project.slug}`}
                className="inline-block rounded-lg border border-line-subtle px-4 py-2 text-sm text-body-secondary hover:text-heading hover:border-line-strong transition-colors"
              >
                {project.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {gallery[0] && (
        <div className="mt-8 relative w-full aspect-video rounded-2xl overflow-hidden border border-line">
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
          <p className="text-[11px] uppercase tracking-[0.15em] text-label">Gallery</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((url, idx) => (
              <div key={`${url}-${idx}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-line-subtle">
                <Image src={url} alt={`${caseStudy.title} gallery ${idx + 1}`} fill className="object-cover dark:brightness-[0.88]" />
              </div>
            ))}
          </div>
        </section>
      )}

      <hr className="border-line my-12" />

      {(beforeUrl || afterUrl) && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-label">Before / After</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {beforeUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-line-subtle">
                <Image src={beforeUrl} alt={`${caseStudy.title} before`} fill className="object-cover dark:brightness-[0.88]" />
              </div>
            )}
            {afterUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-line-subtle">
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
