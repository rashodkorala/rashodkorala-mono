import About from "@/components/Pages/About";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description: "Meet Rashod Korala, a professional photographer based in St. John's, working worldwide. Specializing in architecture, interior spaces, nature, street, and artistic photography. Learn about the journey, style, and approach to capturing unique moments through documentary honesty and cinematic mood.",
    keywords: [
        "Rashod Korala",
        "about photographer",
        "professional photographer biography",
        "photography style",
        "architecture photographer",
        "St. John's photographer",
        "documentary photography",
        "cinematic photography"
    ],
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: "About | Rashod Korala Photography | Professional Photographer",
        description: "Meet Rashod Korala, a professional photographer based in St. John's, working worldwide. Specializing in architecture, interior spaces, nature, street, and artistic photography.",
        url: "https://photos.rashodkorala.com/about",
        siteName: "Rashod Korala Photography",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Rashod Korala - Professional Photographer Specializing in Architecture and Artistic Photography",
                type: "image/jpeg",
            }
        ],
        locale: "en_US",
        type: "profile",
    },
    twitter: {
        card: "summary_large_image",
        title: "About | Rashod Korala Photography | Professional Photographer",
        description: "Meet Rashod Korala, a professional photographer based in St. John's, working worldwide. Specializing in architecture, interior spaces, nature, street, and artistic photography.",
        images: ["/og-image.jpg"],
        creator: "@rashodkorala",
    }
};

export default function AboutPage() {
    return <About />;
}