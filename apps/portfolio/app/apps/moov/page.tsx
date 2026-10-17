import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/src/components/page-shell";
import { poppins, satoshi } from "@/lib/font";

const appStoreUrl = "https://apps.apple.com/ca/app/moov/id6799535974";

const screens = [
  {
    src: "/moov/launch.png",
    title: "Welcome",
    alt: "MOOV welcome screen: Rise and shine, better mornings start now.",
    width: 1320,
    height: 2868,
  },
  {
    src: "/moov/alarm.png",
    title: "Wake",
    alt: "MOOV new alarm screen with a weekday schedule.",
    width: 1206,
    height: 2622,
  },
  {
    src: "/moov/sleep.png",
    title: "Sleep",
    alt: "MOOV sleep screen with a wind-down reminder and sleep sounds.",
    width: 1206,
    height: 2622,
  },
  {
    src: "/moov/hub.png",
    title: "Hub",
    alt: "MOOV hub with a short morning task list.",
    width: 1206,
    height: 2622,
  },
];

export const metadata: Metadata = {
  title: "MOOV",
  description:
    "MOOV is an iPhone morning app built during an internship: a wake alarm, sleep sounds, and a short daily list.",
  alternates: { canonical: "/apps/moov" },
  openGraph: {
    title: "MOOV",
    description:
      "An iPhone morning app built during an internship. Wake alarm, sleep sounds, and a short list for the day.",
    url: "https://rashodkorala.com/apps/moov",
  },
};

export default function MoovPage() {
  return (
    <PageShell>
      <style>{`
        .mv-back { display:inline-flex; align-items:center; gap:6px; font-family:${satoshi}; font-size:13px;
          letter-spacing:0.04em; color:var(--color-body-secondary); text-decoration:none; padding:6px 0;
          margin-bottom:clamp(28px,4vw,48px); transition:color .15s; }
        .mv-back:hover { color:var(--color-heading); }
        .mv-kicker { font-family:${satoshi}; font-size:11px; letter-spacing:0.14em; text-transform:uppercase;
          color:var(--color-body-secondary); margin:0 0 12px; }
        .mv-title { font-family:${poppins}; font-weight:400; font-size:clamp(48px,7vw,96px); line-height:0.92;
          letter-spacing:-0.025em; color:var(--color-heading); margin:0; }
        .mv-lead { font-family:${satoshi}; font-size:clamp(15px,1.1vw,18px); line-height:1.6;
          color:var(--color-body-secondary); max-width:42rem; margin:clamp(16px,2vw,24px) 0 0; }
        .mv-store { display:inline-flex; align-items:center; gap:8px; margin-top:clamp(16px,2vw,22px);
          font-family:${satoshi}; font-size:clamp(13px,1vw,15px); color:var(--color-heading); text-decoration:none; }
        .mv-store span { text-decoration:underline; text-underline-offset:4px; text-decoration-color:var(--color-link-underline); }
        .mv-store:hover span { text-decoration-color:var(--color-heading); }
        .mv-grid { list-style:none; margin:clamp(36px,5vw,64px) 0 0; padding:0;
          display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:clamp(12px,1.6vw,24px); }
        .mv-frame { background:#f4f1ea; border:1px solid var(--color-border-subtle); overflow:hidden; }
        .mv-frame img { display:block; width:100%; height:auto; }
        .mv-cap { font-family:${satoshi}; font-size:12px; color:var(--color-label); margin:10px 0 0; }
        @media (max-width: 900px) { .mv-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 520px) { .mv-grid { grid-template-columns:minmax(0, 1fr); } }
      `}</style>

      <article style={{ paddingBottom: "89px" }}>
        <Link href="/projects" className="mv-back">
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }} aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Projects
        </Link>

        <p className="mv-kicker">iPhone · Internship</p>
        <h1 className="mv-title">MOOV</h1>
        <p className="mv-lead">
          Built during an internship. A morning app for iPhone: set a wake alarm,
          wind down with sleep sounds, and keep a short list for the day.
        </p>
        <a className="mv-store" href={appStoreUrl} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <rect width="24" height="24" rx="5.5" fill="currentColor" />
            <path
              fill="var(--color-page)"
              transform="translate(4.15 3.7) scale(0.66)"
              d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
            />
          </svg>
          <span>App Store</span>
        </a>

        <ul className="mv-grid">
          {screens.map((screen) => (
            <li key={screen.src}>
              <div className="mv-frame">
                <Image
                  src={screen.src}
                  alt={screen.alt}
                  width={screen.width}
                  height={screen.height}
                  sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 25vw"
                />
              </div>
              <p className="mv-cap">{screen.title}</p>
            </li>
          ))}
        </ul>
      </article>
    </PageShell>
  );
}
