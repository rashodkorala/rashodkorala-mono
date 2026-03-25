import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CaseStudy } from "@/lib/types";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asObjectArray<T extends Record<string, unknown>>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is T => typeof item === "object" && item !== null);
}

function parseSection(markdown: string, title: string): string {
  const rx = new RegExp(`##\\s+${title}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, "i");
  const match = markdown.match(rx);
  return match?.[1]?.trim() || "";
}

function parseBullets(section: string): string[] {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, "").trim());
}

function parseProcessSteps(section: string): Array<{ title: string; description: string }> {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+\*\*.+\*\*\s+—\s+.+$/.test(line))
    .map((line) => {
      const cleaned = line.replace(/^\d+\.\s+/, "");
      const [titlePart, descriptionPart] = cleaned.split("—");
      return {
        title: titlePart.replace(/\*\*/g, "").trim(),
        description: (descriptionPart || "").trim(),
      };
    });
}

export default function CaseStudyPage({
  caseStudy,
  mdxContent,
}: {
  caseStudy: CaseStudy;
  mdxContent: string;
}) {
  const tags = asStringArray(caseStudy.tags);
  const stack = asStringArray(caseStudy.stack);
  const gallery = asStringArray(caseStudy.gallery_urls);
  const links = asObjectArray<{ label?: string; url?: string; type?: string }>(caseStudy.links);
  const results = asObjectArray<{ title?: string; value?: string; description?: string }>(caseStudy.results);
  const metrics = asObjectArray<{ label?: string; value?: string }>(caseStudy.metrics);

  const challenge = parseSection(mdxContent, "Challenge");
  const approach = parseSection(mdxContent, "Approach");
  const process = parseSection(mdxContent, "Process");
  const learned = parseSection(mdxContent, "What I learned");
  const processSteps = parseProcessSteps(process);
  const learnings = parseBullets(learned);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
          Back to work
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] uppercase tracking-[0.08em] px-2 py-1 rounded-full border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50"
            >
              {tag}
            </span>
          ))}
          {caseStudy.category ? (
            <span className="text-[11px] uppercase tracking-[0.08em] px-2 py-1 rounded-full border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70">
              {caseStudy.category}
            </span>
          ) : null}
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl font-light tracking-tight">
          {caseStudy.title}
        </h1>
        {caseStudy.summary ? (
          <p className="mt-3 text-lg text-black/50 dark:text-white/50 font-light">{caseStudy.summary}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-black/50 dark:text-white/50 border-y border-black/10 dark:border-white/10 py-4">
          <span>Role: {caseStudy.role || "N/A"}</span>
          <span className="w-px h-4 bg-black/10 dark:bg-white/10" />
          <span>Timeline: {caseStudy.timeline || "N/A"}</span>
          <span className="w-px h-4 bg-black/10 dark:bg-white/10" />
          <span>Status: {caseStudy.status}</span>
          {links.map((link) =>
            link.url ? (
              <span key={`${link.label}-${link.url}`} className="flex items-center gap-2">
                <span className="w-px h-4 bg-black/10 dark:bg-white/10" />
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  {link.label || link.type || "Link"}
                </a>
              </span>
            ) : null
          )}
        </div>

        {caseStudy.cover_url ? (
          <div className="mt-8 relative w-full aspect-video rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
            <Image src={caseStudy.cover_url} alt={caseStudy.title} fill className="object-cover" priority />
          </div>
        ) : null}

        {caseStudy.lede ? (
          <p className="mt-8 text-[18px] leading-[1.8] text-black/60 dark:text-white/60 max-w-4xl">{caseStudy.lede}</p>
        ) : null}

        <section className="mt-14 space-y-10">
          {challenge ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40">Challenge</p>
              <p className="mt-3 leading-8">{challenge}</p>
            </div>
          ) : null}

          {approach ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40">Approach</p>
              <p className="mt-3 leading-8">{approach}</p>
            </div>
          ) : null}

          {processSteps.length > 0 ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40">Process</p>
              <ol className="mt-4 grid gap-3">
                {processSteps.map((step, idx) => (
                  <li
                    key={`${step.title}-${idx}`}
                    className="bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl p-4"
                  >
                    <p className="font-medium">
                      {idx + 1}. {step.title}
                    </p>
                    <p className="text-black/50 dark:text-white/50 mt-2">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {learnings.length > 0 ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40">
                What I learned
              </p>
              <ul className="mt-3 space-y-2">
                {learnings.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        {results.length > 0 ? (
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40">Outcome</p>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {results.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl p-5"
                >
                  <p className="text-lg">{item.title || item.value || "Outcome"}</p>
                  {item.description ? (
                    <p className="text-black/50 dark:text-white/50 mt-2">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {metrics.length > 0 ? (
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40">Metrics</p>
            <div className="mt-3 grid md:grid-cols-4 gap-4">
              {metrics.map((metric, idx) => (
                <div key={idx} className="border border-black/10 dark:border-white/10 rounded-xl p-4">
                  <p className="text-3xl">{metric.value || "-"}</p>
                  <p className="text-black/50 dark:text-white/50 text-sm mt-1">{metric.label || ""}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {gallery.length > 0 ? (
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40">Gallery</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden border border-black/10 dark:border-white/10"
                >
                  <Image
                    src={url}
                    alt={`${caseStudy.title} gallery ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <hr className="border-black/10 dark:border-white/10 my-12" />

        {stack.length > 0 ? (
          <div className="flex flex-wrap gap-2 pb-10">
            {stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs rounded-full border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
