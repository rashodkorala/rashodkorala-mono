import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Martini, Ruler, ShieldCheck, WifiOff } from "lucide-react";
import PageShell from "@/src/components/page-shell";

const supportEmail = "inkbar@rashodkorala.com";

const features = [
  {
    title: "Scale every way a bar actually works",
    body: "Resize a cocktail by multiplier, target servings, or a finished batch volume.",
  },
  {
    title: "Move between units without friction",
    body: "Enter specs in oz, ml, cl, or parts, then read the batch back in the unit you pour with.",
  },
  {
    title: "Batch with dilution in mind",
    body: "Estimate water for stirred, shaken, and built drinks so a prepared batch lands closer to service strength.",
  },
  {
    title: "Keep house specs close",
    body: "Save your own recipes alongside bundled classics in a layout made to glance at across a busy bar.",
  },
];

const screenshots = [
  {
    src: "/inkbar/scaler.png",
    alt: "InkBar cocktail scaler showing a Negroni recipe with multiplier, serving, volume, and unit controls.",
    title: "Scale",
  },
  {
    src: "/inkbar/specs.png",
    alt: "InkBar specs library showing bundled classic cocktails.",
    title: "Specs",
  },
  {
    src: "/inkbar/new-spec.png",
    alt: "InkBar new recipe form with ingredient and drink detail fields.",
    title: "Create",
  },
  {
    src: "/inkbar/settings.png",
    alt: "InkBar settings screen showing unit and dilution preferences.",
    title: "Settings",
  },
  {
    src: "/inkbar/launch.png",
    alt: "InkBar launch screen with the app wordmark and cocktail glass icon.",
    title: "Launch",
  },
];

export const metadata: Metadata = {
  title: "InkBar",
  description:
    "InkBar scales, converts, and batches cocktails on iPhone with offline recipes, unit conversion, and dilution estimates.",
  alternates: {
    canonical: "/apps/inkbar",
  },
  openGraph: {
    title: "InkBar: Cocktail Scaler",
    description:
      "Scale any cocktail to any batch in seconds. Convert oz, ml, cl, and parts, estimate dilution, and keep house specs in one place.",
    url: "https://rashodkorala.com/apps/inkbar",
  },
};

export default function InkBarMarketingPage() {
  return (
    <PageShell>
      <main className="pb-fib-89">
        <section className="grid min-h-[calc(100vh-5rem)] items-center gap-fib-55 py-fib-55 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,34rem)]">
          <div className="max-w-[46rem]">
            <p className="mb-fib-13 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary">
              InkBar for iPhone
            </p>
            <h1 className="font-serif text-[clamp(3.25rem,10vw,8.75rem)] font-medium leading-[0.92] tracking-[0em] text-heading">
              Cocktail maths, settled.
            </h1>
            <p className="mt-fib-34 max-w-[39rem] font-sans text-lead leading-sub text-body-secondary">
              Scale any cocktail to any batch in seconds. Convert oz, ml, cl, and
              parts, estimate dilution for batching, and keep your house specs in
              one readable place.
            </p>
            <div className="mt-fib-34 flex flex-wrap gap-fib-13">
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-heading px-fib-21 py-fib-13 font-sans text-sm font-semibold leading-ui text-page transition hover:opacity-90"
              >
                Contact support
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                href="/apps/inkbar/privacy"
                className="inline-flex items-center gap-2 rounded-md border border-line px-fib-21 py-fib-13 font-sans text-sm font-semibold leading-ui text-body transition hover:border-line-hover hover:text-heading"
              >
                Privacy policy
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[25rem]">
            <div className="absolute inset-8 rounded-full bg-[#b57b31]/20 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-[2.75rem] border border-line-strong bg-[#080706] p-2 shadow-2xl shadow-black/35">
              <div className="overflow-hidden rounded-[2.25rem] bg-[#f7f2e8]">
                <Image
                  src="/inkbar/scaler.png"
                  alt="InkBar on iPhone showing a Negroni cocktail scaling screen."
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
          {features.map((feature) => (
            <article key={feature.title} className="rounded-md border border-line bg-surface-raised p-fib-21">
              <h2 className="font-sans text-base font-semibold leading-ui text-heading">{feature.title}</h2>
              <p className="mb-0 mt-fib-13 font-sans text-sm leading-body text-body-secondary">{feature.body}</p>
            </article>
          ))}
        </section>

        <section className="py-fib-55">
          <div className="mb-fib-34 flex flex-col gap-fib-13 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-fib-13 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary">
                Product screens
              </p>
              <h2 className="font-serif text-h1 font-medium leading-heading text-heading">
                Built to be read mid-service.
              </h2>
            </div>
            <p className="mb-0 max-w-[28rem] font-sans text-sm leading-body text-body-secondary">
              Large controls, restrained contrast, and simple recipe views make InkBar easy to scan
              while scaling one drink or a full batch.
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
                    alt={screenshot.alt}
                    width={1320}
                    height={2868}
                    className="h-auto w-full"
                    sizes={index === 0 ? "(min-width: 1280px) 38vw, (min-width: 640px) 70vw, 86vw" : "(min-width: 1280px) 16vw, (min-width: 640px) 40vw, 86vw"}
                  />
                </div>
                <figcaption className="mt-fib-13 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-body-secondary">
                  {screenshot.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="grid gap-fib-34 py-fib-55 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-fib-13 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary">
              Private by design
            </p>
            <h2 className="font-serif text-h1 font-medium leading-heading text-heading">
              No account. No tracking. No network connection.
            </h2>
          </div>
          <div className="grid gap-fib-13 sm:grid-cols-3">
            {[
              [ShieldCheck, "No data collected"],
              [WifiOff, "Works fully offline"],
              [Ruler, "Saved specs stay local"],
            ].map(([Icon, label]) => (
              <div key={label as string} className="rounded-md border border-line bg-surface-raised p-fib-21">
                <Icon className="h-5 w-5 text-heading" aria-hidden="true" />
                <p className="mb-0 mt-fib-13 font-sans text-sm font-semibold leading-ui text-heading">{label as string}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-line-strong bg-surface-raised p-fib-34">
          <div className="flex flex-col gap-fib-21 md:flex-row md:items-center md:justify-between">
            <div>
              <Martini className="mb-fib-13 h-6 w-6 text-heading" aria-hidden="true" />
              <h2 className="font-serif text-h2 font-medium leading-heading text-heading">Need help with InkBar?</h2>
              <p className="mb-0 mt-fib-8 font-sans text-sm leading-body text-body-secondary">
                Questions, problems, feature ideas, and bug reports are welcome.
              </p>
            </div>
            <Link
              href="/apps/inkbar/support"
              className="inline-flex w-fit items-center gap-2 rounded-md border border-line-strong px-fib-21 py-fib-13 font-sans text-sm font-semibold leading-ui text-heading transition hover:border-line-hover"
            >
              Open support
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
