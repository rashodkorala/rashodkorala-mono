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
  { label: "GitHub",   href: "https://github.com/rashodkorala" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rashodk" },
];

interface HomeHeroProps { imageSrc?: string; }

export default function HomeHero({ imageSrc }: HomeHeroProps = {}) {
  return (
    <>
      <style>{`
        /* Lock viewport on desktop only */
        @media (min-width: 1024px) {
          html, body { height: 100%; overflow: hidden; }
        }
        /* Responsive hero name — clamp with vh guard can't be expressed in Tailwind */
        .hero-name { font-size: clamp(4.5rem, 14vw, 12rem); }
        @media (min-width: 768px) {
          .hero-name { font-size: clamp(4.5rem, min(12vw, 15vh), 12rem); }
        }
      `}</style>

      <div className="
        min-h-svh bg-page flex flex-col w-full
        lg:h-screen lg:overflow-hidden lg:pl-sidenav
      ">
        {/* Nav — mobile/tablet only; SideNav handles desktop */}
        <nav className="
          lg:hidden shrink-0 flex items-center justify-end
          px-page-px sm:px-page-px-sm md:px-page-px-md
          py-4 sm:py-5
        ">
          <ul className="flex gap-6 sm:gap-8 list-none m-0 p-0">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-body text-[13px] text-heading tracking-[0.02em] no-underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main two-column grid */}
        <main className="
          flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1fr_44%] w-full
          px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg
          gap-4 md:gap-8
        ">
          {/* Left — name · bio · socials */}
          <div className="flex flex-col min-w-0 pb-4 md:pb-6">

            <div className="flex-1 flex flex-col justify-center">
              <motion.h1
                className="mb-6 md:mb-10 leading-[0.88]"
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  className="hero-name font-display font-normal tracking-[-0.01em] text-heading block mb-[0.08em]"
                  variants={reveal}
                  custom={0.2}
                >
                  Rashod
                </motion.span>
                <motion.span
                  className="hero-name font-display font-normal tracking-[-0.01em] text-heading block pl-5 md:pl-10 lg:pl-16"
                  variants={reveal}
                  custom={0.35}
                >
                  Korala
                </motion.span>
              </motion.h1>

              <motion.div className="max-w-xl" initial="hidden" animate="visible">
                <motion.p
                  className="font-body font-light text-[clamp(13px,1.1vw,17px)] text-body-secondary leading-[1.75] tracking-[0.015em] mb-3 md:mb-4"
                  variants={reveal}
                  custom={0.55}
                >
                  I&rsquo;m a software developer and entrepreneur based in St.&nbsp;John&rsquo;s,
                  Newfoundland. I focus on building practical, scalable products and helping
                  businesses use technology to grow with clarity and purpose.
                </motion.p>

                <motion.p
                  className="font-body font-light text-[clamp(13px,1.1vw,17px)] text-body-secondary leading-[1.75] tracking-[0.015em]"
                  variants={reveal}
                  custom={0.7}
                >
                  My work spans product discovery, software architecture, digital strategy, and
                  translating complex technical ideas into solutions that make sense for
                  non-technical teams.
                </motion.p>
              </motion.div>
            </div>

            <motion.div
              className="flex gap-6 shrink-0"
              initial="hidden"
              animate="visible"
              variants={reveal}
              custom={0.9}
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body font-medium text-[13px] text-heading underline underline-offset-4 tracking-[0.01em]"
                >
                  {s.label}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — photo */}
          <motion.div
            className="
              relative overflow-hidden bg-[#b0aca6]
              aspect-[4/5] my-4
              md:aspect-auto md:h-[calc(100%-2.5rem)] md:self-center md:my-0
            "
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt="Rashod Korala"
                fill
                className="object-cover object-[center_20%]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 35vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#b8b4ae] via-[#888480] to-[#9a9590]" />
            )}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg py-3 md:py-4">
          <span className="font-body text-[11px] text-label tracking-[0.02em]">
            St. John&rsquo;s, NL
          </span>
        </footer>
      </div>
    </>
  );
}
