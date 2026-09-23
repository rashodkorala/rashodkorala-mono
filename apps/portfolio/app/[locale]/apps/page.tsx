import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Martini } from "lucide-react";
import PageShell from "@/src/components/page-shell";
import { Link } from "@/i18n/navigation";
import { localeAlternates, localizedPath, SITE_URL } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Apps" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates("/apps", locale),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${SITE_URL}${localizedPath("/apps", locale)}`,
    },
  };
}

export default async function AppsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Apps");

  return (
    <PageShell>
      <main className="pb-fib-89 pt-fib-55">
        <section className="max-w-[48rem]">
          <p className="mb-fib-13 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-[clamp(3.25rem,9vw,8rem)] font-medium leading-[0.95] tracking-[0em] text-heading">
            {t("title")}
          </h1>
          <p className="mt-fib-34 max-w-reading font-sans text-lead leading-sub text-body-secondary">
            {t("intro")}
          </p>
        </section>

        <section className="mt-fib-55 grid gap-fib-34 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
          <Link
            href="/apps/inkbar"
            className="group grid overflow-hidden rounded-md border border-line-strong bg-surface-raised transition hover:border-line-hover lg:grid-cols-[1fr_18rem]"
          >
            <div className="flex flex-col justify-between gap-fib-55 p-fib-34">
              <div>
                <div className="mb-fib-21 flex h-11 w-11 items-center justify-center rounded-md border border-line bg-page">
                  <Martini className="h-5 w-5 text-heading" aria-hidden="true" />
                </div>
                <p className="mb-fib-13 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary">
                  {t("platformIphone")}
                </p>
                <h2 className="font-serif text-h1 font-medium leading-heading text-heading">InkBar</h2>
                <p className="mb-0 mt-fib-13 max-w-reading font-sans text-sm leading-body text-body-secondary">
                  {t("inkbarBlurb")}
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 font-sans text-sm font-semibold leading-ui text-heading">
                {t("viewApp")}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>

            <div className="relative hidden min-h-[28rem] overflow-hidden border-l border-line bg-[#f7f2e8] lg:block">
              <Image
                src="/inkbar/scaler.png"
                alt={t("inkbarImageAlt")}
                width={1320}
                height={2868}
                className="absolute left-1/2 top-fib-34 w-[17rem] -translate-x-1/2 rounded-[2rem] border border-black/10 shadow-2xl shadow-black/20 transition duration-300 group-hover:-translate-y-2"
                sizes="18rem"
              />
            </div>
          </Link>
        </section>
      </main>
    </PageShell>
  );
}
