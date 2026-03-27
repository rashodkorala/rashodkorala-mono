import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import type { CaseStudy } from "@/lib/types";
import { cn } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

function plainTextExcerpt(md: string, max = 150): string {
  if (!md?.trim()) return "";
  const plain = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#+\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).trim()}…`;
}

function mediaUrl(path: string) {
  return `${baseUrl}/storage/v1/object/public/media/${path}`;
}

export default function ProjectRelatedCaseStudies({
  caseStudies,
  headingId,
}: {
  caseStudies: CaseStudy[];
  headingId: string;
}) {
  if (caseStudies.length === 0) return null;

  return (
    <ul className="space-y-4 md:space-y-5" aria-labelledby={headingId}>
      {caseStudies.map((cs) => {
        const thumb = cs.gallery?.[0];
        const excerpt = plainTextExcerpt(cs.content_md ?? "");
        const tags = (cs.tags ?? []).filter(Boolean).slice(0, 3);

        return (
          <li key={cs.id}>
            <Link
              href={`/work/${cs.slug}`}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-gradient-to-br from-ink/[0.02] to-transparent transition-all duration-300",
                "hover:border-ink/22 hover:shadow-[0_12px_40px_-12px_rgba(43,43,43,0.18)] dark:border-[#2f2c2a] dark:from-[#1c1a18]/80 dark:to-transparent",
                "dark:hover:border-[#45413d] dark:hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.55)]",
                "md:flex-row md:items-stretch"
              )}
            >
              <div
                className={cn(
                  "relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-ink/[0.04] dark:bg-background",
                  "md:w-[min(44%,260px)] md:aspect-auto md:min-h-[168px]"
                )}
              >
                {thumb ? (
                  <Image
                    src={mediaUrl(thumb)}
                    alt={cs.title}
                    fill
                    className="object-cover transition duration-500 ease-out group-hover:scale-[1.03] dark:brightness-[0.92]"
                    sizes="(max-width: 768px) 100vw, 260px"
                  />
                ) : (
                  <div className="flex h-full min-h-[140px] items-center justify-center md:min-h-0">
                    <div className="rounded-full border border-ink/10 bg-ink/[0.04] p-4 text-ink/25 dark:border-[#3d3935] dark:bg-[#1f1d1b] dark:text-[#6b6560]">
                      <BookOpen className="h-8 w-8" strokeWidth={1.25} />
                    </div>
                  </div>
                )}
                {cs.featured && (
                  <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/45 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/95 backdrop-blur-sm">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-5 md:p-6 md:pl-7">
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-[0.1em] text-ink/38 dark:text-[#8f8781]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-xl font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-ink dark:text-[#eee8e0] dark:group-hover:text-[#f5f0ea] md:text-[1.35rem]">
                    {cs.title}
                  </h3>
                  <span className="mt-1 shrink-0 text-ink/25 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink/50 dark:text-[#5c5650] dark:group-hover:text-[#b5ada6]">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                </div>
                {excerpt && (
                  <p className="line-clamp-2 text-[14px] leading-relaxed text-ink/55 dark:text-[#a39b94]">
                    {excerpt}
                  </p>
                )}
                <span className="text-[12px] font-medium text-ink/40 transition-colors group-hover:text-ink/65 dark:text-[#8b847f] dark:group-hover:text-[#c9c2bb]">
                  Read case study
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
