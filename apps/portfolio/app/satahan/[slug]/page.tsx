import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getCachedCaseStudies, getCachedCaseStudyBySlug } from "@/lib/supabase/cached-case-studies";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";
import { buildPreviewItem, buildSatahanItems, caseStudyCover, formatEntryNumber, mediaUrl } from "@/lib/entries";
import { getPreviewCaseStudy } from "@/lib/supabase/preview";
import { renderSatahan } from "@/lib/satahan-markdown";
import type { CaseStudy } from "@/lib/types";
import SatahanEntry from "@/src/components/satahan/SatahanEntry";
import PageShell from "@/src/components/page-shell";
import PreviewBanner from "@/src/components/satahan/PreviewBanner";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

async function getEntry(slug: string): Promise<CaseStudy | null> {
  const entry = await getCachedCaseStudyBySlug(slug);
  if (!entry || (entry.status && entry.status !== "published")) return null;
  return entry;
}

/**
 * The entry plus its place in the notebook (number, previous and next). In Draft Mode (a CMS
 * preview) the entry is read fresh in any status and shown where it will land once published.
 */
async function getEntryInContext(slug: string) {
  const { isEnabled: preview } = await draftMode();
  const entry = preview ? await getPreviewCaseStudy(slug) : await getEntry(slug);
  if (!entry) return null;
  const [caseStudies, projects] = await Promise.all([getCachedCaseStudies(), getCachedAllProjects()]);
  const items = buildSatahanItems(caseStudies, projects); // newest number first
  const index = items.findIndex((i) => i.slug === entry.slug);

  if (preview) {
    // Published entries keep their slot; a draft sits in front of the newest one.
    const live = index !== -1 && entry.status === "published";
    const item = buildPreviewItem(entry, items, projects);
    if (live) item.number = items[index].number;
    return {
      entry,
      item,
      previous: live ? items[index + 1] ?? null : items[0] ?? null,
      next: live ? items[index - 1] ?? null : null,
      preview: true as const,
    };
  }

  if (index === -1) return null;
  return {
    entry,
    item: items[index],
    previous: items[index + 1] ?? null,
    next: items[index - 1] ?? null,
    preview: false as const,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await getEntryInContext(slug);
  if (!found) return { title: "Not found" };
  const { entry, item, preview } = found;

  const description = item.summary || undefined;
  const cover = caseStudyCover(entry);
  return {
    title: entry.title,
    description,
    alternates: { canonical: `/satahan/${entry.slug}` },
    ...(preview ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: `Satahan Nº ${formatEntryNumber(item.number)}: ${entry.title}`,
      description,
      type: "article",
      images: cover ? [{ url: cover.src }] : [],
    },
  };
}

export default async function SatahanEntryPage({ params }: Props) {
  const { slug } = await params;
  const found = await getEntryInContext(slug);
  if (!found) notFound();
  const { entry, item, previous, next, preview } = found;

  const images = (entry.gallery ?? [])
    .filter((g): g is string => typeof g === "string" && !!g.trim())
    .map(mediaUrl)
    .slice(0, 4);

  return (
    <PageShell>
      {preview && <PreviewBanner status={entry.status ?? "draft"} slug={entry.slug} />}
      <SatahanEntry
        item={item}
        html={renderSatahan(entry.content_md)}
        images={images}
        previous={previous}
        next={next}
      />
    </PageShell>
  );
}
