import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Pages/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rashod Korala Photography | Professional Photographer | Architecture & Artistic Photography",
    template: "%s | Rashod Korala Photography"
  },
  description: "Professional photographer Rashod Korala specializes in architecture, interior spaces, nature, street, and artistic photography. Based in St. John's, working worldwide. Available for commercial and artistic projects. Explore stunning visual stories captured through light, shadow, and rhythm.",
  keywords: [
    "Rashod Korala",
    "photography",
    "professional photographer",
    "architecture photography",
    "interior photography",
    "nature photography",
    "street photography",
    "travel photography",
    "wildlife photography",
    "night photography",
    "abstract photography",
    "Sri Lanka photographer",
    "St. John's photographer",
    "commercial photography",
    "artistic photography",
    "documentary photography",
    "cinematic photography",
    "photography portfolio",
    "hire photographer",
    "photography services"
  ],
  authors: [{ name: "Rashod Korala", url: "https://photos.rashodkorala.com" }],
  creator: "Rashod Korala",
  publisher: "Rashod Korala",
  applicationName: "Rashod Korala Photography",
  category: "Photography Portfolio",
  classification: "Photography, Art, Portfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://photos.rashodkorala.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': 'https://photos.rashodkorala.com',
      'en': 'https://photos.rashodkorala.com',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://photos.rashodkorala.com",
    title: "Rashod Korala Photography | Professional Photographer | Architecture & Artistic Photography",
    description: "Professional photographer specializing in architecture, interior spaces, nature, street, and artistic photography. Based in St. John's, working worldwide. Available for commercial and artistic projects.",
    siteName: "Rashod Korala Photography",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rashod Korala Photography Portfolio - Professional Architecture and Artistic Photography",
        type: "image/jpeg",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rashod Korala Photography | Professional Photographer",
    description: "Professional photographer specializing in architecture, interior spaces, nature, street, and artistic photography. Based in St. John's, working worldwide.",
    images: ["/og-image.jpg"],
    creator: "@rashodkorala",
    site: "@rashodkorala",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    nocache: false,
    noarchive: false,
    nositelinkssearchbox: false,
  },
  verification: {
    google: "your-google-site-verification",
  },
  other: {
    'geo.region': 'CA-NL',
    'geo.placename': "St. John's",
    'geo.position': '47.5615;-52.7126',
    'ICBM': '47.5615, -52.7126',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rashod Korala',
    jobTitle: 'Professional Photographer',
    description: 'Professional photographer specializing in architecture, interior spaces, nature, street, and artistic photography',
    url: 'https://photos.rashodkorala.com',
    image: 'https://photos.rashodkorala.com/og-image.jpg',
    email: 'rashodkorala2002@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: "St. John's",
      addressRegion: 'NL',
      addressCountry: 'CA',
    },
    sameAs: [
      'https://www.rashodkorala.com',
    ],
    knowsAbout: [
      'Photography',
      'Architecture Photography',
      'Interior Photography',
      'Nature Photography',
      'Street Photography',
      'Artistic Photography',
    ],
    offers: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        serviceType: 'Photography Services',
        description: 'Professional photography services for commercial and artistic projects',
        areaServed: 'Worldwide',
      },
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rashod Korala Photography',
    url: 'https://photos.rashodkorala.com',
    description: 'Professional photography portfolio showcasing architecture, interior spaces, nature, street, and artistic photography',
    author: {
      '@type': 'Person',
      name: 'Rashod Korala',
    },
    publisher: {
      '@type': 'Person',
      name: 'Rashod Korala',
    },
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>
          <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
            <div className="lg:flex lg:min-h-screen">
              <Navigation />
              <div className="flex-1 flex flex-col min-h-screen">

                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
