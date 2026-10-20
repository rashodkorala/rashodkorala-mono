'use client'
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { poppins } from "@/lib/font";
import CalendlyPopupButton from "@/src/components/contact/CalendlyPopupButton";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 1, delay: d, ease },
  }),
};

const defaultSocials = [
  { label: "GitHub", href: "https://github.com/rashodkorala" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rashodk" },
  { label: "Instagram", href: "https://instagram.com/rashodkorala" },
  { label: "CV", href: "/cv" },
];

const FALLBACK_BIO = [
  "Software Engineer & Product Designer based in St. John\u2019s, Newfoundland. I bridge full-stack development, UI/UX design, and visual storytelling to transform complex ideas into polished, user-centered products.",
];

function splitName(displayName?: string | null): [string, string] {
  const name = displayName?.trim();
  if (!name) return ["Rashod", "Korala"];
  const parts = name.split(/\s+/);
  if (parts.length === 1) return [parts[0], ""];
  return [parts[0], parts.slice(1).join(" ")];
}

function safeHref(url: string): string | null {
  const value = url.trim();
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return value;
  } catch {
    return null;
  }
  return null;
}

function BioText({ text }: { text: string }) {
  const linkClass =
    "font-normal text-heading underline underline-offset-[0.2em] decoration-from-font transition-opacity hover:opacity-80";
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const href = safeHref(match[2]);
    if (!href) {
      nodes.push(match[1]);
    } else if (href.startsWith("/")) {
      nodes.push(
        <Link key={key++} href={href} className={linkClass}>
          {match[1]}
        </Link>
      );
    } else {
      nodes.push(
        <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {match[1]}
        </a>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

/**
 * Match grid + gap for srcset selection (next/image `sizes`):
 * - Single column: page padding only (--fib-21/34).
 * - md–lg: 50/50 columns, pad 110px, md:gap-fib-34 (34px).
 * - lg+: sidenav 12rem + same pad → reserve 336px total (302 + gap) before track math.
 * - xl+: φ columns again → image = (row − gap) × 34/89.
 */
const HERO_PORTRAIT_SIZES =
  "(max-width: 639px) calc(100vw - 42px), " +
  "(max-width: 767px) calc(100vw - 68px), " +
  "(orientation: portrait) and (min-width: 768px) and (max-width: 1023px) calc(100vw - 110px), " +
  "(max-width: 1023px) calc((100vw - 144px) / 2), " +
  "(orientation: portrait) and (min-width: 1024px) and (max-width: 1279px) calc(100vw - 336px), " +
  "(max-width: 1279px) calc((100vw - 336px) / 2), " +
  "calc((100vw - 336px) * 34 / 89)";

interface HomeHeroProps {
  imageSrc?: string;
  displayName?: string | null;
  bio?: string | null;
  /** Undefined keeps the built-in links. An array, including empty, is what was saved. */
  socials?: { label: string; url: string }[];
}

export default function HomeHero({ imageSrc, displayName, bio, socials }: HomeHeroProps = {}) {
  const [firstName, lastName] = splitName(displayName);
  const savedBio = bio?.trim() ? bio : null;
  const paragraphs = (savedBio ?? FALLBACK_BIO.join("\n\n"))
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const footerLinks =
    socials === undefined
      ? defaultSocials
      : socials
          .map((link) => ({ label: link.label.trim(), href: safeHref(link.url) }))
          .filter((link): link is { label: string; href: string } => !!link.label && !!link.href);
  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          html, body { height: 100%; overflow: hidden; }
        }
        /* Tablet portrait: allow scroll + single-column hero so photo isn’t a full-height strip */
        @media (min-width: 768px) and (max-width: 1279px) and (orientation: portrait) {
          .hero-main {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .hero-top-spacer { height: 0.5rem; }
          .hero-copy-col { justify-content: flex-start; padding-bottom: 0; }
          .hero-photo {
            aspect-ratio: 4 / 5 !important;
            width: 100%;
            max-width: none;
            height: auto !important;
            max-height: min(48svh, 38rem);
            margin-inline: 0;
            margin-top: var(--fib-34);
            margin-bottom: var(--fib-21);
            align-self: stretch;
            border-radius: var(--radius);
          }
        }
        @media (min-width: 1024px) and (max-width: 1279px) and (orientation: portrait) {
          html, body {
            height: auto;
            min-height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
          }
          .hero-shell {
            min-height: 100svh;
            height: auto !important;
            overflow: visible !important;
          }
        }
        /* Size from the name column so each line stays intact. */
        .hero-copy-col { container-type: inline-size; }
        .hero-top-spacer { height: 0; }
        .hero-copy-block {
          width: fit-content;
          max-width: 100%;
        }
        .hero-name {
          font-size: clamp(2.5rem, 16cqi, 8.5rem);
          font-weight: 400;
          letter-spacing: -0.03em;
          font-style: normal;
          white-space: nowrap;
        }
        /* Bio shares the name's width, with a gap that scales with the column. */
        .hero-bio-copy {
          width: 100%;
          max-width: 100%;
          margin-top: clamp(1.15rem, 3.2cqi, 2.25rem);
          text-wrap: pretty;
        }
        @media (min-width: 768px) {
          .hero-copy-col { justify-content: center; }
          .hero-bio-copy { max-width: 42ch; }
        }
        @media (max-width: 639px) {
          .hero-top-spacer { height: 0.25rem; }
          .hero-photo {
            max-height: min(72svh, 28rem);
            width: 100%;
            margin-top: var(--fib-34);
          }
        }
        /*
          Lead size for the hero bio. vw is the full viewport while the copy sits in a
          half-width column, so the preferred value stays gentle and the cap holds it.
        */
        .hero-bio-text {
          font-size: clamp(17px, 0.9rem + 0.5vw, 21px);
          margin-bottom: 0;
        }
        .hero-bio-text + .hero-bio-text { margin-top: var(--fib-21); }
      `}</style>

      <div className="hero-shell min-h-svh bg-page flex flex-col w-full max-w-[100vw] overflow-x-hidden lg:h-screen lg:max-w-none lg:overflow-hidden lg:pl-sidenav pt-16 lg:pt-20">

        {/* Main grid: 50/50 md–lg landscape; portrait md–xl stacks via CSS; φ split from xl */}
        <main className="hero-main flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1fr_1fr] xl:grid-cols-[55fr_34fr] w-full min-w-0 px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg gap-fib-21 md:gap-fib-34">

          {/* Left — name + bio only (socials moved to footer) */}
          <div className="hero-copy-col flex flex-col min-w-0">

            <div className="hero-top-spacer" aria-hidden="true" />

            <div className="hero-copy-block flex flex-col">
              {/* Poppins R and K sit 0.077em in from their box; pull the name back so the
                  letters' left edge lines up with the bio text below. */}
              <motion.h1
                className="min-w-0 leading-[0.92]"
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  className="hero-name text-heading block -ml-[0.077em]"
                  style={{ fontFamily: poppins, fontWeight: 400 }}
                  variants={reveal}
                  custom={0.2}
                >
                  {firstName}
                </motion.span>
                {lastName && (
                  <motion.span
                    className="hero-name text-heading block -ml-[0.077em]"
                    style={{ fontFamily: poppins, fontWeight: 400 }}
                    variants={reveal}
                    custom={0.35}
                  >
                    {lastName}
                  </motion.span>
                )}
              </motion.h1>

              <motion.div className="hero-bio-copy" initial="hidden" animate="visible">
                {paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    className={`hero-bio-text font-sans font-normal text-body-secondary leading-[var(--leading-body)] tracking-[0.01em]${
                      (savedBio ? index < paragraphs.length - 1 : index === 0)
                        ? " mb-fib-21 md:mb-fib-34"
                        : ""
                    }`}
                    variants={reveal}
                    custom={0.55 + index * 0.15}
                  >
                    <BioText text={paragraph} />
                  </motion.p>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Right — portrait golden rectangle photo */}
          <motion.div
            className="hero-photo relative min-h-0 w-full max-w-full overflow-hidden bg-[#b0aca6] aspect-[1/1.618] my-fib-21 md:aspect-auto md:h-[calc(100%-var(--fib-34))] md:max-h-none md:self-center md:my-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={displayName?.trim() || "Rashod Korala"}
                fill
                sizes={HERO_PORTRAIT_SIZES}
                className="object-cover object-[center_20%] grayscale"
                quality={88}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#b8b4ae] via-[#888480] to-[#9a9590]" />
            )}
          </motion.div>
        </main>

        {/* Footer — location left, social links right */}
        <motion.footer
          className="shrink-0 px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg py-fib-13 md:py-fib-21 flex items-center justify-center sm:justify-between"
          initial="hidden"
          animate="visible"
          variants={reveal}
          custom={0.9}
        >

          <div className="flex w-full max-w-full flex-wrap justify-center gap-x-4 gap-y-2 sm:w-auto sm:justify-start sm:items-center">
            {footerLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-body font-normal text-xs text-heading underline underline-offset-4 tracking-[0.01em] sm:text-[13px]"
              >
                {s.label}
              </a>
            ))}
            <CalendlyPopupButton className="font-body font-normal text-xs text-heading underline underline-offset-4 tracking-[0.01em] sm:text-[13px]">
              Schedule a call
            </CalendlyPopupButton>
          </div>

          <Link
            href="/privacy"
            className="font-body font-normal text-xs text-body-secondary underline underline-offset-4 tracking-[0.01em] transition-opacity hover:opacity-80 sm:text-[13px]"
          >
            Privacy
          </Link>
        </motion.footer>
      </div>
    </>
  );
}
