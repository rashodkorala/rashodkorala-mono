"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { CaseStudy } from "@/lib/types";
import { firstImageSrcFromMarkdown } from "@/lib/first-image-from-markdown";
import { cn } from "@/lib/utils";
import { cormorantGaramond, jakartaSans } from "@/lib/font";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");

function firstGalleryPath(gallery: CaseStudy["gallery"]): string | null {
  if (!Array.isArray(gallery)) return null;
  for (const entry of gallery) {
    if (typeof entry === "string") {
      const t = entry.trim();
      if (t) return t;
    }
  }
  return null;
}

/** Public URL for a storage object path, or pass-through for absolute URLs. */
function mediaUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  const path = t.replace(/^\/+/, "");
  if (!supabaseUrl) return path;
  if (path.startsWith("storage/v1/")) return `${supabaseUrl}/${path}`;
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
}

/** Hero = cover/gallery (usually art-directed landscape). Inline = first md image (often portrait). */
type ListThumb =
  | { path: string; variant: "hero" }
  | { path: string; variant: "inline" };

function listThumb(item: CaseStudy): ListThumb | null {
  const cover = item.cover_path?.trim();
  if (cover) return { path: cover, variant: "hero" };
  const fromGallery = firstGalleryPath(item.gallery);
  if (fromGallery) return { path: fromGallery, variant: "hero" };
  const md = firstImageSrcFromMarkdown(item.content_md);
  if (md) return { path: md, variant: "inline" };
  return null;
}

interface CaseStudiesListProps {
  items: CaseStudy[];
}

export default function CaseStudiesList({ items }: CaseStudiesListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="w-full max-w-[min(100%,52rem)] min-[1920px]:max-w-full"
    >
      <ul
        className={cn(
          "list-none m-0 p-0 divide-y divide-line-subtle",
          "min-[1920px]:grid min-[1920px]:grid-cols-2 min-[1920px]:gap-x-fib-55 min-[1920px]:gap-y-fib-55",
          "min-[1920px]:divide-y-0",
        )}
      >
        {items.map((item, index) => {
          const year = new Date(item.created_at).getFullYear();
          const metaParts = [String(year)].filter(Boolean);
          const thumb = listThumb(item);

          return (
            <li key={item.id} className="min-[1920px]:min-w-0">
              <Link
                href={`/work/${item.slug}`}
                className="
                  group block rounded-lg
                  px-fib-13 -mx-fib-13 sm:px-fib-21 sm:-mx-fib-21
                  py-fib-34 sm:py-fib-55
                  transition-colors duration-200 ease-out
                  hover:bg-surface focus-visible:outline-none focus-visible:bg-surface
                  focus-visible:ring-2 focus-visible:ring-line-strong focus-visible:ring-offset-2 focus-visible:ring-offset-page
                "
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_minmax(132px,11.25rem)] gap-fib-34 md:gap-fib-34 md:items-start"
                >
                  <div className="min-w-0 flex flex-col gap-fib-21">
                    {metaParts.length > 0 && (
                      <p
                        className="m-0"
                        style={{
                          fontFamily: jakartaSans,
                          fontSize: "clamp(11px, 0.8vw, 12px)",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--color-body-tertiary)",
                          fontWeight: 500,
                        }}
                      >
                        {metaParts.join(" · ")}
                      </p>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-fib-8">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="
                              inline-flex items-center
                              text-[10px] sm:text-[11px] px-fib-13 py-[0.1875rem]
                              rounded-full
                              border border-line text-label
                              uppercase tracking-[0.07em]
                            "
                            style={{ fontFamily: jakartaSans, fontWeight: 500 }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-fib-13">
                      <h2
                        className="m-0 text-heading tracking-tight flex flex-wrap items-baseline gap-x-2 gap-y-1"
                        style={{
                          fontFamily: cormorantGaramond,
                          fontWeight: 500,
                          fontSize: "clamp(1.375rem, 2.4vw, 1.875rem)",
                          lineHeight: 1.2,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        <span>{item.title}</span>
                        <ArrowUpRight
                          className="inline-block shrink-0 w-[0.9em] h-[0.9em] text-icon opacity-70 group-hover:text-icon-hover group-hover:opacity-100 transition-all translate-y-[0.12em]"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                      </h2>

                      {item.summary && (
                        <p
                          className="m-0 text-body-secondary text-pretty"
                          style={{
                            fontFamily: jakartaSans,
                            fontSize: "clamp(0.9375rem, 1.05vw, 1.0625rem)",
                            fontWeight: 400,
                            lineHeight: "var(--leading-body)",
                            maxWidth: "min(var(--measure-reading), 100%)",
                          }}
                        >
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {thumb && (
                    <div
                      className={cn(
                        "relative w-full overflow-hidden rounded-[var(--radius)] border border-line-subtle bg-surface",
                        "shadow-[0_1px_0_rgba(43,43,43,0.06)] dark:shadow-none",
                        thumb.variant === "inline" ? "aspect-[3/4]" : "aspect-[4/3]",
                      )}
                    >
                      <Image
                        src={mediaUrl(thumb.path)}
                        alt=""
                        fill
                        className={cn(
                          "opacity-[0.88] group-hover:opacity-100 transition-[opacity,transform] duration-300 ease-out group-hover:scale-[1.02]",
                          thumb.variant === "inline"
                            ? "object-contain object-center"
                            : "object-cover",
                        )}
                        sizes="(max-width: 768px) 100vw, (max-width: 1919px) 180px, (max-width: 2400px) 35vw, 520px"
                      />
                    </div>
                  )}
                </motion.div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
