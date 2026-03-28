import { Metadata } from "next";
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
  return <HomeHero imageSrc="/about.jpg" />;
}
