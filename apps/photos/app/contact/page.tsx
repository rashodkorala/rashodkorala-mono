import Contact from "@/components/Pages/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Rashod Korala for photography services, commissions, collaborations, print requests, or to discuss your project. Based in St. John's, working worldwide. Currently booking 2025. Email for bookings, print requests, or to talk about the work.",
    keywords: [
        "contact photographer",
        "hire photographer",
        "photography services",
        "photography booking",
        "photography commission",
        "print requests",
        "Rashod Korala contact",
        "photography inquiry"
    ],
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: "Contact | Rashod Korala Photography | Book Your Session",
        description: "Get in touch with Rashod Korala for photography services, commissions, collaborations, print requests, or to discuss your project. Based in St. John's, working worldwide. Currently booking 2025.",
        url: "https://photos.rashodkorala.com/contact",
        siteName: "Rashod Korala Photography",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Contact Rashod Korala Photography - Book Your Photography Session",
                type: "image/jpeg",
            }
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact | Rashod Korala Photography | Book Your Session",
        description: "Get in touch with Rashod Korala for photography services, commissions, collaborations, print requests, or to discuss your project. Based in St. John's, working worldwide.",
        images: ["/og-image.jpg"],
        creator: "@rashodkorala",
    }
};

export default function ContactPage() {
    return <Contact />;
}