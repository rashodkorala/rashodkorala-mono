'use client'
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cormorantGaramond } from "@/lib/font";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 1, delay: d, ease },
  }),
};

const socials = [
  { label: "GitHub",    href: "https://github.com/rashodkorala" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/rashodk" },
  { label: "Instagram", href: "https://instagram.com/rashodkorala" },
  { label: "CV",        href: "/cv" },
];

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

interface HomeHeroProps { imageSrc?: string; }

export default function HomeHero({ imageSrc }: HomeHeroProps = {}) {
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
          .hero-top-spacer {
            flex: 0 0 auto !important;
            height: 0.5rem;
            min-height: 0;
          }
          .hero-copy-col { padding-bottom: 0; }
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
        /* Narrow phones: lower display min so “Rashod / Korala” fits without horizontal scroll */
        .hero-name { font-size: clamp(2.5rem, 13vw, 12rem); }
        @media (min-width: 400px) {
          .hero-name { font-size: clamp(3rem, 12vw, 12rem); }
        }
        @media (min-width: 640px) {
          .hero-name { font-size: clamp(3.75rem, 11vw, 12rem); }
        }
        @media (min-width: 768px) {
          .hero-name { font-size: clamp(4.5rem, min(12vw, 15vh), 12rem); }
        }
        @media (max-width: 639px) {
          .hero-top-spacer {
            flex: 0 0 auto !important;
            height: 0.75rem;
            min-height: 0;
          }
          .hero-photo {
            max-height: min(72svh, 28rem);
            width: 100%;
          }
        }
        /*
          Bio cap grows slightly toward 4K: 10% steps along viewport range 768px → 3840px
          (each step +0.5rem, 40rem → 45rem), still clamped by --measure-reading & column width.
        */
        .hero-bio-copy {
          width: 100%;
          min-width: 0;
          max-width: min(100%, var(--measure-reading));
          text-wrap: pretty;
        }
        /*
          Body size: avoid 2vw + 22px cap — in md–xl the copy sits in a half-width column but vw
          is full viewport, so type read huge on laptops. Cap 18px, gentler vw.
        */
        .hero-bio-text {
          font-size: clamp(15px, 0.2rem + 0.95vw, 18px);
        }
        @media (min-width: 768px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 41rem); }
        }
        @media (min-width: 1075px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 41.5rem); }
        }
        @media (min-width: 1382px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 42rem); }
        }
        @media (min-width: 1690px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 42.5rem); }
        }
        @media (min-width: 1997px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 43rem); }
        }
        @media (min-width: 2304px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 44.5rem); }
        }
        @media (min-width: 2611px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 45rem); }
        }
        @media (min-width: 2918px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 45.5rem); }
        }
        @media (min-width: 3226px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 46rem); }
        }
        @media (min-width: 3533px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 46.5rem); }
        }
        @media (min-width: 3840px) {
          .hero-bio-copy { max-width: min(100%, var(--measure-reading), 48rem); }
        }
      `}</style>

      <div className="hero-shell min-h-svh bg-page flex flex-col w-full max-w-[100vw] overflow-x-hidden lg:h-screen lg:max-w-none lg:overflow-hidden lg:pl-sidenav pt-16 lg:pt-20">

        {/* Main grid: 50/50 md–lg landscape; portrait md–xl stacks via CSS; φ split from xl */}
        <main className="hero-main flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1fr_1fr] xl:grid-cols-[55fr_34fr] w-full min-w-0 px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg gap-fib-21 md:gap-fib-34">

          {/* Left — name + bio only (socials moved to footer) */}
          <div className="hero-copy-col flex flex-col min-w-0 pb-fib-21 md:pb-fib-34">

            {/* Zone 1: top spacer — optical centre */}
            <div className="hero-top-spacer flex-[0.2] md:flex-[0.618]" aria-hidden="true" />

            {/* Zone 2: name + bio */}
            <div className="flex flex-col justify-center">
              <motion.h1
                className="mb-fib-34 min-w-0 leading-[0.88]"
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  className="hero-name text-heading block uppercase break-words [letter-spacing:-0.06em] sm:[letter-spacing:-0.1em]"
                  style={{ fontFamily: cormorantGaramond, fontWeight: 500 }}
                  variants={reveal}
                  custom={0.2}
                >
                  Rashod
                </motion.span>
                <motion.span
                  className="hero-name text-heading block uppercase italic"
                  style={{ fontFamily: cormorantGaramond, fontWeight: 400, letterSpacing: "-0.01em" }}
                  variants={reveal}
                  custom={0.35}
                >
                  Korala
                </motion.span>
              </motion.h1>

              <motion.div className="hero-bio-copy" initial="hidden" animate="visible">
                <motion.p
                  className="hero-bio-text font-sans font-normal text-body-secondary leading-[var(--leading-body)] tracking-[0.01em] mb-fib-21 md:mb-fib-34"
                  variants={reveal}
                  custom={0.55}
                >
                  I am a software engineer and entrepreneur based in St. John&rsquo;s, Newfoundland, recently graduated and actively building experience across product, design, and technology. I am drawn to the craft of building, where I take an idea and shape it through code and design into something that solves a real problem. I am looking for roles where I can contribute meaningfully from day one, keep learning, and build things that matter.
                </motion.p>

                <motion.p
                  className="hero-bio-text font-sans font-normal text-body-secondary leading-[var(--leading-body)] tracking-[0.01em]"
                  variants={reveal}
                  custom={0.7}
                >
                  I{" "}
                  <Link
                    href="/work"
                    className="font-medium text-heading underline underline-offset-[0.2em] decoration-from-font transition-opacity hover:opacity-80"
                  >
                    work
                  </Link>{" "}
                  across the full arc from discovery to delivery, covering product design (UI/UX) and full-stack engineering, with a focus on translating complex technical ideas into outcomes that matter.
                </motion.p>
                <motion.p
                  className="hero-bio-text font-sans font-normal text-body-secondary leading-[var(--leading-body)] tracking-[0.01em]"
                  variants={reveal}
                  custom={0.85}
                >
                  <a
                    href="https://photos.rashodkorala.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-heading underline underline-offset-[0.2em] decoration-from-font transition-opacity hover:opacity-80"
                  >
                    Photography
                  </a>{" "}
                  runs alongside all of it, shaping how I see and communicate.
                </motion.p>
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
                alt="Rashod Korala"
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

          <div className="flex w-full max-w-full flex-wrap justify-center gap-x-4 gap-y-2 sm:w-auto sm:justify-end sm:items-center">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-body font-medium text-xs text-heading underline underline-offset-4 tracking-[0.01em] sm:text-[13px]"
              >
                {s.label}
              </a>
            ))}
            <Link
              href="/privacy"
              className="font-body font-medium text-xs text-body-secondary underline underline-offset-4 tracking-[0.01em] transition-opacity hover:opacity-80 sm:text-[13px]"
            >
              Privacy
            </Link>
          </div>
        </motion.footer>
      </div>
    </>
  );
}
