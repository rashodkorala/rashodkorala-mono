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
    <div className="h-screen overflow-hidden bg-cream text-ink">
      <div className="h-full lg:ml-48 flex flex-col px-6 md:px-12 lg:px-14 py-10 md:py-12">
        <div className="relative flex-1 flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-0">

          {/* Left column */}
          <div className="flex flex-col justify-between flex-1 min-w-0 lg:max-w-[55%]">
            <div>
              <motion.h1
                className="font-serif leading-[0.92] tracking-[-0.02em] mb-8 md:mb-10"
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  className="block text-[clamp(3.2rem,9vw,7.5rem)]"
                  variants={reveal}
                  custom={0.2}
                >
                  Rashod
                </motion.span>
                <motion.span
                  className="block text-[clamp(3.2rem,9vw,7.5rem)] ml-[0.15em]"
                  variants={reveal}
                  custom={0.35}
                >
                  Korala
                </motion.span>
              </motion.h1>

              <motion.div
                className="ml-0 md:ml-[12%] max-w-[400px]"
                initial="hidden"
                animate="visible"
              >
                <motion.p
                  className="text-[14px] leading-[1.75] font-light text-muted_ink"
                  variants={reveal}
                  custom={0.55}
                >
                  Hello, I&rsquo;m Rashod.
                  <br />
                  I&rsquo;m a software developer and entrepreneur based in
                  St. John&rsquo;s, Newfoundland. I build products, help
                  businesses grow with technology, and capture moments
                  through photography.
                </motion.p>

                <motion.p
                  className="text-[14px] leading-[1.75] font-light text-muted_ink mt-5"
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
              className="flex items-center gap-10 pt-6"
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
                  className="relative text-[14px] tracking-[0.01em] text-ink transition-opacity hover:opacity-60"
                >
                  {social.label}
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-ink/25" />
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
            <div className="relative w-full h-full bg-ink/[0.06]">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[16rem] select-none leading-none opacity-[0.06] italic text-ink">
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
