"use client";

import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: d, ease },
  }),
};

const socials = [
  { label: "GitHub", href: "https://github.com/rashodkorala" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rashodk" },
];

export default function HomeHero() {
  return (
    <div className="h-screen overflow-hidden bg-cream text-ink dark:bg-[#151311] dark:text-[#e6e1da]">
      <div className="h-full lg:ml-48 flex flex-col px-6 sm:px-8 md:px-12 lg:px-16 pt-[4.75rem] sm:pt-20 lg:pt-24 pb-10 sm:pb-12 md:pb-14">
        <div className="relative flex-1 flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16 xl:gap-20 min-h-0">

          {/* Left column */}
          <div className="flex min-h-0 flex-1 flex-col justify-between min-w-0 lg:max-w-[55%] gap-6 sm:gap-8 lg:gap-12">
            <div className="flex min-h-0 flex-1 flex-col">
              <motion.h1
                className="shrink-0 font-serif leading-[0.88] tracking-[-0.03em] text-balance mb-6 sm:mb-9 md:mb-11"
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  className="block text-[clamp(3rem,8.5vw,7.25rem)]"
                  variants={reveal}
                  custom={0.2}
                >
                  Rashod
                </motion.span>
                <motion.span
                  className="block text-[clamp(3rem,8.5vw,7.25rem)] ml-[0.12em] mt-[-0.02em]"
                  variants={reveal}
                  custom={0.35}
                >
                  Korala
                </motion.span>
              </motion.h1>

              <motion.div
                className="flex min-h-0 flex-1 flex-col justify-center gap-8 sm:gap-10 lg:gap-12 w-full max-w-none overflow-y-auto pr-1"
                initial="hidden"
                animate="visible"
              >
                <motion.p
                  className="font-sans w-full max-w-none text-pretty text-[clamp(0.9375rem,0.82rem+0.55vw,1.125rem)] leading-[1.85] sm:leading-[1.82] font-normal tracking-[0.006em] text-muted_ink dark:text-[#b8b0a9]"
                  variants={reveal}
                  custom={0.55}
                >
                  <span className="text-ink dark:text-[#ebe6df] font-medium">
                    Hello, I&rsquo;m Rashod.
                  </span>
                  <br />
                  I&rsquo;m a software developer and entrepreneur based in
                  St. John&rsquo;s, Newfoundland. I build products, help
                  businesses grow with technology, and capture moments
                  through photography.
                </motion.p>

                <motion.p
                  className="font-sans w-full max-w-none text-pretty text-[clamp(0.9375rem,0.8rem+0.5vw,1.0625rem)] leading-[1.85] sm:leading-[1.82] font-normal tracking-[0.006em] text-muted_ink dark:text-[#a9a29b]"
                  variants={reveal}
                  custom={0.7}
                >
                  Things I do include: product discovery and validation,
                  building software architecture, volunteering to support
                  small businesses, digital branding for local brands,
                  photography, business operations strategy, product
                  placement, and helping non-technical people understand
                  technical solutions.
                </motion.p>
              </motion.div>
            </div>

            <motion.div
              className="shrink-0 flex flex-wrap items-center gap-x-10 gap-y-3 pt-4 sm:pt-6 border-t border-ink/[0.08] dark:border-[#3d3935]/80"
              variants={reveal}
              initial="hidden"
              animate="visible"
              custom={0.9}
            >
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative font-sans text-sm sm:text-[15px] tracking-[0.02em] text-ink transition-opacity hover:opacity-60 dark:text-[#e8e2db]"
                >
                  {social.label}
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-ink/30 dark:bg-[#6b6560]" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right column — Photo */}
          <motion.div
            className="hidden md:block flex-shrink-0 lg:w-[40%]"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
          >
            <div className="relative w-full h-full bg-ink/[0.06] dark:bg-[#171514]">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[16rem] select-none leading-none opacity-[0.06] italic text-ink dark:text-[#f2ece4]">
                  R
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
