'use client'
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 1, delay: d, ease },
  }),
};

const navLinks = [
  { label: "Work",    href: "/work" },
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  { label: "GitHub",    href: "https://github.com/rashodkorala" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/rashodk" },
  { label: "Instagram", href: "https://instagram.com/rashodkorala" },
  { label: "CV",        href: "/cv" },
];

interface HomeHeroProps { imageSrc?: string; }

export default function HomeHero({ imageSrc }: HomeHeroProps = {}) {
  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          html, body { height: 100%; overflow: hidden; }
        }
        .hero-name { font-size: clamp(4.5rem, 14vw, 12rem); }
        @media (min-width: 768px) {
          .hero-name { font-size: clamp(4.5rem, min(12vw, 15vh), 12rem); }
        }
      `}</style>

      <div className="min-h-svh bg-page flex flex-col w-full lg:h-screen lg:overflow-hidden lg:pl-sidenav">

        {/* Nav — mobile/tablet only */}
        <nav className="lg:hidden shrink-0 flex items-center justify-end px-page-px sm:px-page-px-sm md:px-page-px-md py-fib-21 sm:py-fib-34">
          <ul className="flex gap-fib-21 sm:gap-fib-34 list-none m-0 p-0">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="font-body text-[13px] text-heading tracking-[0.02em] no-underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main two-column grid — φ split 55fr/34fr */}
        <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[55fr_34fr] w-full px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg gap-fib-21 md:gap-fib-34">

          {/* Left — name + bio only (socials moved to footer) */}
          <div className="flex flex-col min-w-0 pb-fib-21 md:pb-fib-34">

            {/* Zone 1: top spacer — optical centre */}
            <div className="flex-[0.618]" aria-hidden="true" />

            {/* Zone 2: name + bio */}
            <div className="flex flex-col justify-center">
              <motion.h1
                className="mb-fib-34 leading-[0.88]"
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  className="hero-name font-display tracking-[0.03em] text-heading block mb-[0.08em]"
                  variants={reveal}
                  custom={0.2}
                >
                  RASHOD
                </motion.span>
                <motion.span
                  className="hero-name font-display font-normal tracking-[-0.01em] text-heading block"
                  variants={reveal}
                  custom={0.35}
                >
                  KORALA
                </motion.span>
              </motion.h1>

              <motion.div className="max-w-[61.8%]" initial="hidden" animate="visible">
                <motion.p
                  className="font-serif font-light text-[clamp(13px,1.1vw,25px)] text-body-secondary leading-[1.75] tracking-[0.015em] mb-fib-21"
                  variants={reveal}
                  custom={0.55}
                >
                  I'm a software engineer and entrepreneur based in Canada, building practical products and helping businesses grow through technology.
                </motion.p>

                <motion.p
                  className="font-serif font-light text-[clamp(13px,1.1vw,25px)] text-body-secondary leading-[1.75] tracking-[0.015em]"
                  variants={reveal}
                  custom={0.7}
                >
                  My work spans the full arc from discovery to delivery, covering product design (UI/UX), digital strategy, and consulting, with a focus on making complex technical ideas legible to the people who need to act on them. Photography runs alongside all of it, shaping how I see and communicate.
                </motion.p>
              </motion.div>
            </div>
          </div>

          {/* Right — portrait golden rectangle photo */}
          <motion.div
            className="relative overflow-hidden bg-[#b0aca6] aspect-[1/1.618] my-fib-21 md:aspect-auto md:h-[calc(100%-var(--fib-34))] md:self-center md:my-0"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt="Rashod Korala"
                fill
                className="object-cover object-[center_20%] grayscale"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 38vw, 28vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#b8b4ae] via-[#888480] to-[#9a9590]" />
            )}
          </motion.div>
        </main>

        {/* Footer — location left, social links right */}
        <motion.footer
          className="shrink-0 px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg py-fib-13 md:py-fib-21 flex items-center justify-between"
          initial="hidden"
          animate="visible"
          variants={reveal}
          custom={0.9}
        >

          <div className="flex gap-fib-21">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-body font-medium text-[13px] text-heading underline underline-offset-4 tracking-[0.01em]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </motion.footer>
      </div>
    </>
  );
}
