import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageShell from "@/src/components/page-shell";
import { localeAlternates } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

const linkClass =
  "text-link underline decoration-link-underline underline-offset-4 hover:text-link-hover";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates("/privacy", locale),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");

  return (
    <PageShell>
      <article className="mx-auto max-w-reading pb-fib-55">
        <h1
          className="mt-0 font-serif text-[clamp(2rem,5vw,3.25rem)] font-medium tracking-tight text-heading"
          style={{ fontFamily: "var(--font-serif-stack)" }}
        >
          {t("title")}
        </h1>
        <p className="mt-fib-21 font-sans text-sm leading-body text-body-secondary">
          {t("lastUpdated")}
        </p>

        <section className="mt-fib-34 space-y-fib-21 font-sans text-[length:clamp(15px,0.95vw,17px)] leading-body text-body">
          <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-body-secondary">
            {t("analyticsHeading")}
          </h2>
          <p>
            {t.rich("analyticsBody", {
              posthog: (chunks) => (
                <a href="https://posthog.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {chunks}
                </a>
              ),
            })}
          </p>

          <h2 className="pt-fib-13 text-xs font-medium uppercase tracking-[0.12em] text-body-secondary">
            {t("collectHeading")}
          </h2>
          <p>{t("collectBody")}</p>

          <h2 className="pt-fib-13 text-xs font-medium uppercase tracking-[0.12em] text-body-secondary">
            {t("retentionHeading")}
          </h2>
          <p>
            {t.rich("retentionBody", {
              docs: (chunks) => (
                <a
                  href="https://posthog.com/docs/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {chunks}
                </a>
              ),
            })}
          </p>

          <p className="pt-fib-13 text-body-secondary">
            {t.rich("questions", {
              mail: (chunks) => (
                <a href="mailto:hello@rashodkorala.com" className={linkClass}>
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>
      </article>
    </PageShell>
  );
}
