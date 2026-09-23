import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import '@/styles/globals.css'

import { PostHogProvider } from '@rashodkorala/posthog-next'
import {
  Plus_Jakarta_Sans,
  Cormorant_Garamond,
  JetBrains_Mono,
  Noto_Sans_Sinhala,
  Noto_Serif_Sinhala,
} from 'next/font/google'
import SideNav from '@/src/components/side-nav'
import TopBar from '@/src/components/top-bar'
import { routing, SITE_URL } from '@/i18n/routing'

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
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

// Sinhala faces sit behind the Latin ones in every font stack, so the browser only
// downloads them (via unicode-range) when a page actually contains Sinhala text.
const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  variable: '--font-sinhala-sans',
  display: 'swap',
  preload: false,
})

const notoSerifSinhala = Noto_Serif_Sinhala({
  subsets: ['sinhala'],
  variable: '--font-sinhala-serif',
  display: 'swap',
  preload: false,
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('defaultTitle'),
      template: t('titleTemplate'),
    },
    description: t('description'),
    keywords: ['Software Developer', 'Next.js', 'React Native', 'AI', 'Web Development', 'Mobile Development', 'TypeScript', 'AWS'],
    authors: [{ name: 'Rashod Korala' }],
    creator: 'Rashod Korala',
    publisher: 'Rashod Korala',
    // No layout-level `alternates`: each page sets its own canonical + hreflang,
    // otherwise every child page would inherit a canonical pointing at "/".
    openGraph: {
      type: 'website',
      locale: locale === 'si' ? 'si_LK' : 'en_US',
      alternateLocale: locale === 'si' ? ['en_US'] : ['si_LK'],
      url: SITE_URL,
      title: t('defaultTitle'),
      description: t('description'),
      siteName: 'Rashod Korala',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('description'),
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      className="dark bg-page text-body"
      suppressHydrationWarning
    >
      <body
        className={`${jakartaSans.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable} ${notoSansSinhala.variable} ${notoSerifSinhala.variable}`}
      >
        <NextIntlClientProvider>
          <PostHogProvider app="portfolio">
            <TopBar />
            <SideNav />
            {children}
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
