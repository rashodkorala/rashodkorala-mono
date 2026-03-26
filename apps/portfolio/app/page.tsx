import { Metadata } from "next";
import SideNav from "@/src/components/side-nav";
import HomeHero from "@/src/components/home-hero";

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

export default function Index() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      <SideNav />
      <HomeHero />
    </div>
  );
}
