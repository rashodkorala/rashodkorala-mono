import { Metadata } from 'next'
import '@/styles/globals.css'

import { PostHogProvider } from '@rashodkorala/posthog-next'
import { Cormorant_Garamond, Geist_Mono, Geist, Plus_Jakarta_Sans } from 'next/font/google';
import SideNav from '@/src/components/side-nav';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
    adjustFontFallback: true,
    fallback: ['system-ui', 'arial'],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
    adjustFontFallback: true,
    fallback: ['ui-monospace', 'monospace'],
});

// Display / serif — Cormorant Garamond (weights match bold headings across Work, CV, etc.)
const cormorantGaramond = Cormorant_Garamond({
    variable: "--font-cormorant",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
});

// Body font — Plus Jakarta Sans
const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL('https://rashodkorala.com'),
    title: {
        default: 'Rashod Korala | Software Developer',
        template: '%s | Rashod Korala'
    },
    description: 'Software Developer specializing in Next.js, React Native, and AI solutions. Building innovative digital experiences with a focus on user-centric design.',
    keywords: ['Software Developer', 'Next.js', 'React Native', 'AI', 'Web Development', 'Mobile Development', 'TypeScript', 'AWS'],
    authors: [{ name: 'Rashod Korala' }],
    creator: 'Rashod Korala',
    publisher: 'Rashod Korala',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://rashodkorala.com',
        title: 'Rashod Korala | Software Developer',
        description: 'Software Developer specializing in Next.js, React Native, and AI solutions. Building innovative digital experiences with a focus on user-centric design.',
        siteName: 'Rashod Korala',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rashod Korala | Software Developer',
        description: 'Software Developer specializing in Next.js, React Native, and AI solutions. Building innovative digital experiences with a focus on user-centric design.',
        creator: '@rashodkorala',
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
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    verification: {
        google: 'your-google-site-verification',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="bg-page text-body" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${plusJakartaSans.variable}`}>
                <PostHogProvider app="portfolio">
                    <SideNav />
                    {children}
                </PostHogProvider>
            </body>
        </html>
    )
}
