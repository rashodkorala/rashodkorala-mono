import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageShell from "@/src/components/page-shell";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/i18n/routing";

const supportEmail = "inkbar@rashodkorala.com";

// Copy lives under InkBarSupport.faq.<key> in messages.
const faqKeys = ["scaling", "units", "dilution", "storage", "dashes"] as const;

const linkClass = "text-link underline decoration-link-underline underline-offset-4 hover:text-link-hover";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "InkBarSupport" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates("/apps/inkbar/support", locale),
  };
}

export default async function InkBarSupportPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("InkBarSupport");

  return (
    <PageShell>
      <main className="mx-auto max-w-[58rem] pb-fib-89 pt-fib-55">
        <Link
          href="/apps/inkbar"
          className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary hover:text-heading"
        >
          InkBar
        </Link>
        <h1 className="mt-fib-13 font-serif text-h1 font-medium leading-heading text-heading">{t("title")}</h1>
        <p className="mt-fib-21 max-w-reading font-sans text-lead leading-sub text-body-secondary">
          {t("intro")}
        </p>

        <section className="mt-fib-34 rounded-md border border-line-strong bg-surface-raised p-fib-34">
          <p className="mb-fib-8 font-sans text-sm leading-body text-body-secondary">
            {t.rich("contact", {
              email: supportEmail,
              mail: (chunks) => (
                <a className={linkClass} href={`mailto:${supportEmail}`}>
                  {chunks}
                </a>
              ),
            })}
          </p>
          <p className="mb-0 font-sans text-sm leading-body text-body-secondary">
            {t("responseTime")}
          </p>
        </section>

        <section className="mt-fib-55">
          <h2 className="font-serif text-h2 font-medium leading-heading text-heading">{t("faqTitle")}</h2>
          <div className="mt-fib-21 divide-y divide-line border-y border-line">
            {faqKeys.map((key) => (
              <article key={key} className="py-fib-21">
                <h3 className="font-sans text-base font-semibold leading-ui text-heading">{t(`faq.${key}.question`)}</h3>
                <p className="mb-0 mt-fib-8 font-sans text-sm leading-body text-body-secondary">{t(`faq.${key}.answer`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-fib-55">
          <h2 className="font-serif text-h2 font-medium leading-heading text-heading">{t("feedbackTitle")}</h2>
          <p className="mb-0 mt-fib-13 font-sans text-sm leading-body text-body-secondary">
            {t.rich("feedbackBody", {
              email: supportEmail,
              mail: (chunks) => (
                <a className={linkClass} href={`mailto:${supportEmail}`}>
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>
      </main>
    </PageShell>
  );
}
