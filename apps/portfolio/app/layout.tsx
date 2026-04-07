import { Metadata } from 'next'
import '@/styles/globals.css'

import { PostHogProvider } from '@rashodkorala/posthog-next'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import { typographyConfig } from '@/config/typography';
import SideNav from '@/src/components/side-nav';

// GeistSans/GeistMono from the geist package pre-configure --font-geist-sans/--font-geist-mono

// Display / serif — Cormorant Garamond (weights match bold headings across Work, CV, etc.)
const cormorantGaramond = Cormorant_Garamond({
    variable: "--font-cormorant",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    display: "swap",
});

// Body font — Plus Jakarta Sans (available for 'classic' or 'custom' presets)
const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    weight: ["300", "400", "500"],
    display: "swap",
});

// Font var map — resolves preset choices to CSS variable references
const FONT_VAR: {
    body:    Record<'geist' | 'plus-jakarta', string>;
    display: Record<'geist' | 'cormorant',   string>;
} = {
    body:    { geist: 'var(--font-geist-sans)', 'plus-jakarta': 'var(--font-dm-sans)' },
    display: { geist: 'var(--font-geist-sans)', cormorant: 'var(--font-cormorant)' },
};

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
        <html
            lang="en"
            className="bg-page text-body"
            suppressHydrationWarning
            style={{
                '--font-active-sans':    FONT_VAR.body[typographyConfig.body],
                '--font-active-display': FONT_VAR.display[typographyConfig.display],
            } as React.CSSProperties}
        >
            <body className={`${GeistSans.variable} ${GeistMono.variable} ${cormorantGaramond.variable} ${plusJakartaSans.variable}`}>
                <PostHogProvider app="portfolio">
                    <SideNav />
                    {children}
                </PostHogProvider>
            </body>
        </html>
    )
}
