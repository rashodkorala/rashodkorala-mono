import { Metadata } from "next";
import HomeHero from "@/src/components/home-hero";
import { getAboutContent } from "@/lib/supabase/about";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Rashod Korala — Software developer, entrepreneur, and photographer based in St. John's, Newfoundland.",
  openGraph: {
    title: "Rashod Korala",
    description:
      "Software developer, entrepreneur, and photographer based in St. John's, Newfoundland.",
  },
};

export default async function Index() {
  const about = await getAboutContent();

  return (
    <>
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <HomeHero
        imageSrc={about?.avatarUrl || "/about.jpg"}
        displayName={about?.displayName}
        bio={about?.bioMd}
        socials={about ? about.socialLinks : undefined}
      />
    </>
  );
}
