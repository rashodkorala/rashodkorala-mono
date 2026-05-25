import { notFound } from "next/navigation";
import AlbumDetailPage from "@/components/Pages/AlbumDetail";
import { getAlbum, getAlbums } from "@/app/actions/albums";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbum(slug);
  if (!album) return { title: "Album Not Found" };

  return {
    title: album.title,
    description: album.description ?? `${album.title} — a photo album by Rashod Korala`,
    alternates: { canonical: `/albums/${slug}` },
    openGraph: {
      title: `${album.title} | Rashod Korala Photography`,
      description: album.description ?? `${album.title} — a photo album by Rashod Korala`,
      url: `https://photos.rashodkorala.com/albums/${slug}`,
      siteName: "Rashod Korala Photography",
      images: album.coverUrl
        ? [{ url: album.coverUrl, width: 1200, height: 630, alt: album.title }]
        : [],
      locale: "en_US",
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const albums = await getAlbums();
  return albums.map((a) => ({ slug: a.slug }));
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = await getAlbum(slug);
  if (!album) notFound();
  return <AlbumDetailPage album={album!} />;
}
