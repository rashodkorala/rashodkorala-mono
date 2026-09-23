import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Martini, Ruler, ShieldCheck, WifiOff } from "lucide-react";
import PageShell from "@/src/components/page-shell";
import { Link } from "@/i18n/navigation";
import { localeAlternates, localizedPath, SITE_URL } from "@/i18n/routing";

const supportEmail = "inkbar@rashodkorala.com";

// Copy for each key lives under InkBar.features.* / InkBar.screens.* in messages.
const featureKeys = ["scale", "units", "dilution", "specs"] as const;

const screenshots = [
  { key: "scaler", src: "/inkbar/scaler.png" },
  { key: "specs", src: "/inkbar/specs.png" },
  { key: "create", src: "/inkbar/new-spec.png" },
  { key: "settings", src: "/inkbar/settings.png" },
  { key: "launch", src: "/inkbar/launch.png" },
] as const;

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "InkBar" });
  return {
    title: "InkBar",
    description: t("metaDescription"),
    alternates: localeAlternates("/apps/inkbar", locale),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${SITE_URL}${localizedPath("/apps/inkbar", locale)}`,
    },
  };
}

export default async function InkBarMarketingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("InkBar");

  return (
    <PageShell>
      <main className="pb-fib-89">
        <section className="grid min-h-[calc(100vh-5rem)] items-center gap-fib-55 py-fib-55 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,34rem)]">
          <div className="max-w-[46rem]">
            <p className="mb-fib-13 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary">
              {t("eyebrow")}
            </p>
            <h1 className="font-serif text-[clamp(3.25rem,10vw,8.75rem)] font-medium leading-[0.92] tracking-[0em] text-heading">
              {t("title")}
            </h1>
            <p className="mt-fib-34 max-w-[39rem] font-sans text-lead leading-sub text-body-secondary">
              {t("intro")}
            </p>
            <div className="mt-fib-34 flex flex-wrap gap-fib-13">
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-heading px-fib-21 py-fib-13 font-sans text-sm font-semibold leading-ui text-page transition hover:opacity-90"
              >
                {t("contactSupport")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href="/apps/inkbar/privacy"
                className="inline-flex items-center gap-2 rounded-md border border-line px-fib-21 py-fib-13 font-sans text-sm font-semibold leading-ui text-body transition hover:border-line-hover hover:text-heading"
              >
                {t("privacyPolicy")}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[25rem]">
            <div className="absolute inset-8 rounded-full bg-[#b57b31]/20 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-[2.75rem] border border-line-strong bg-[#080706] p-2 shadow-2xl shadow-black/35">
              <div className="overflow-hidden rounded-[2.25rem] bg-[#f7f2e8]">
                <Image
                  src="/inkbar/scaler.png"
                  alt={t("heroImageAlt")}
                  width={1320}
                  height={2868}
                  priority
                  className="h-auto w-full"
                  sizes="(min-width: 1024px) 25rem, 82vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-fib-21 border-y border-line py-fib-55 md:grid-cols-4">
          {featureKeys.map((key) => (
            <article key={key} className="rounded-md border border-line bg-surface-raised p-fib-21">
              <h2 className="font-sans text-base font-semibold leading-ui text-heading">{t(`features.${key}.title`)}</h2>
              <p className="mb-0 mt-fib-13 font-sans text-sm leading-body text-body-secondary">{t(`features.${key}.body`)}</p>
            </article>
          ))}
        </section>

        <section className="py-fib-55">
          <div className="mb-fib-34 flex flex-col gap-fib-13 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-fib-13 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary">
                {t("screensEyebrow")}
              </p>
              <h2 className="font-serif text-h1 font-medium leading-heading text-heading">
                {t("screensTitle")}
              </h2>
            </div>
            <p className="mb-0 max-w-[28rem] font-sans text-sm leading-body text-body-secondary">
              {t("screensBody")}
            </p>
          </div>

          <div className="grid gap-fib-21 sm:grid-cols-2 xl:grid-cols-5">
            {screenshots.map((screenshot, index) => (
              <figure
                key={screenshot.src}
                className={`group ${index === 0 ? "sm:col-span-2 xl:col-span-2" : ""}`}
              >
                <div className="overflow-hidden rounded-md border border-line bg-[#f7f2e8] shadow-xl shadow-black/10 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-black/20">
                  <Image
                    src={screenshot.src}
                    alt={t(`screens.${screenshot.key}.alt`)}
                    width={1320}
                    height={2868}
                    className="h-auto w-full"
                    sizes={index === 0 ? "(min-width: 1280px) 38vw, (min-width: 640px) 70vw, 86vw" : "(min-width: 1280px) 16vw, (min-width: 640px) 40vw, 86vw"}
                  />
                </div>
                <figcaption className="mt-fib-13 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-body-secondary">
                  {t(`screens.${screenshot.key}.title`)}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="grid gap-fib-34 py-fib-55 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-fib-13 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary">
              {t("privateEyebrow")}
            </p>
            <h2 className="font-serif text-h1 font-medium leading-heading text-heading">
              {t("privateTitle")}
            </h2>
          </div>
          <div className="grid gap-fib-13 sm:grid-cols-3">
            {[
              { Icon: ShieldCheck, label: t("noData") },
              { Icon: WifiOff, label: t("offline") },
              { Icon: Ruler, label: t("localSpecs") },
            ].map(({ Icon, label }) => (
              <div key={label} className="rounded-md border border-line bg-surface-raised p-fib-21">
                <Icon className="h-5 w-5 text-heading" aria-hidden="true" />
                <p className="mb-0 mt-fib-13 font-sans text-sm font-semibold leading-ui text-heading">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-line-strong bg-surface-raised p-fib-34">
          <div className="flex flex-col gap-fib-21 md:flex-row md:items-center md:justify-between">
            <div>
              <Martini className="mb-fib-13 h-6 w-6 text-heading" aria-hidden="true" />
              <h2 className="font-serif text-h2 font-medium leading-heading text-heading">{t("helpTitle")}</h2>
              <p className="mb-0 mt-fib-8 font-sans text-sm leading-body text-body-secondary">
                {t("helpBody")}
              </p>
            </div>
            <Link
              href="/apps/inkbar/support"
              className="inline-flex w-fit items-center gap-2 rounded-md border border-line-strong px-fib-21 py-fib-13 font-sans text-sm font-semibold leading-ui text-heading transition hover:border-line-hover"
            >
              {t("openSupport")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
