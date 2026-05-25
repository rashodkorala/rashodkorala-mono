import Albums from "@/components/Pages/Albums";
import { getAlbums } from "@/app/actions/albums";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Albums",
  description:
    "Curated photo collections by Rashod Korala — visual stories from trips, projects, and moments worth holding onto.",
  alternates: { canonical: "/albums" },
  openGraph: {
    title: "Albums | Rashod Korala Photography",
    description:
      "Curated photo collections — visual stories from trips, projects, and moments worth holding onto.",
    url: "https://photos.rashodkorala.com/albums",
    siteName: "Rashod Korala Photography",
    locale: "en_US",
    type: "website",
  },
};

export default async function AlbumsPage() {
  const albums = await getAlbums();
  return <Albums albums={albums} />;
}
