import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageShell from "@/src/components/page-shell";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/i18n/routing";

const supportEmail = "inkbar@rashodkorala.com";

// Copy lives under InkBarPrivacy.sections.<key> in messages.
const sectionKeys = ["data", "network", "storage", "thirdParties", "children", "changes"] as const;

const linkClass = "text-link underline decoration-link-underline underline-offset-4 hover:text-link-hover";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "InkBarPrivacy" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates("/apps/inkbar/privacy", locale),
  };
}

export default async function InkBarPrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("InkBarPrivacy");

  return (
    <PageShell>
      <main className="mx-auto max-w-[58rem] pb-fib-89 pt-fib-55">
        <Link
          href="/apps/inkbar"
          className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary hover:text-heading"
        >
          InkBar
        </Link>
        <h1 className="mt-fib-13 font-serif text-h1 font-medium leading-heading text-heading">
          {t("title")}
        </h1>
        <p className="mt-fib-13 font-sans text-sm leading-body text-body-secondary">{t("lastUpdated")}</p>
        <p className="mt-fib-21 max-w-reading font-sans text-lead leading-sub text-body-secondary">
          {t("intro")}
        </p>

        <section className="mt-fib-34 divide-y divide-line border-y border-line">
          {sectionKeys.map((key) => (
            <article key={key} className="py-fib-21">
              <h2 className="font-sans text-base font-semibold leading-ui text-heading">{t(`sections.${key}.title`)}</h2>
              <p className="mb-0 mt-fib-8 font-sans text-sm leading-body text-body-secondary">{t(`sections.${key}.body`)}</p>
            </article>
          ))}
        </section>

        <section className="mt-fib-55 rounded-md border border-line-strong bg-surface-raised p-fib-34">
          <h2 className="font-serif text-h2 font-medium leading-heading text-heading">{t("contactTitle")}</h2>
          <p className="mb-0 mt-fib-13 font-sans text-sm leading-body text-body-secondary">
            {t.rich("contactBody", {
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
