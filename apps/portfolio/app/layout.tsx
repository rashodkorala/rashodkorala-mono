import { Metadata } from 'next'
import '@/styles/globals.css'

import { PostHogProvider } from '@rashodkorala/posthog-next'
import localFont from 'next/font/local'
import { Cormorant_Garamond, JetBrains_Mono, Noto_Serif_Sinhala, Poppins } from 'next/font/google'
import SideNav from '@/src/components/side-nav'
import TopBar from '@/src/components/top-bar'

const satoshi = localFont({
  src: [
    {
      path: '../assets/fonts/Satoshi-Variable.woff2',
      weight: '300 900',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Satoshi-VariableItalic.woff2',
      weight: '300 900',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  // 700 is only for the "R K." logo mark; headings stay at 400.
  weight: ['400', '500', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

// Sinhala script for the Satahan (සටහන්) wordmark.
const notoSerifSinhala = Noto_Serif_Sinhala({
  subsets: ['sinhala'],
  weight: ['300', '400'],
  variable: '--font-sinhala',
  display: 'swap',
})

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
            className="dark bg-page text-body"
            suppressHydrationWarning
        >
            <body
                className={`${satoshi.variable} ${poppins.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable} ${notoSerifSinhala.variable}`}
            >
                <PostHogProvider app="portfolio">
                    <TopBar />
                    <SideNav />
                    {children}
                </PostHogProvider>
            </body>
        </html>
    )
}
