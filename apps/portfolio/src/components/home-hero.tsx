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
    <div className="h-screen overflow-hidden bg-page text-body">
      <div className="h-full lg:ml-sidenav flex flex-col px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-[4.75rem] sm:pt-20 lg:pt-24 pb-8 sm:pb-10 md:pb-12">
        <div className="relative flex-1 flex flex-col lg:flex-row lg:gap-12 xl:gap-16 min-h-0">

          {/* Left column */}
          <div className="flex min-h-0 flex-1 flex-col min-w-0 lg:max-w-[56%]">

            <motion.h1
              className="shrink-0 font-serif leading-[0.9] tracking-[-0.02em] mt-4 sm:mt-6 lg:mt-8"
              initial="hidden"
              animate="visible"
            >
              <motion.span
                className="block text-display"
                variants={reveal}
                custom={0.2}
              >
                Rashod
              </motion.span>
              <motion.span
                className="block text-[clamp(3.25rem,9vw,3rem)] ml-[0em] mt-[-0.04em]"
                variants={reveal}
                custom={0.35}
              >
                Korala
              </motion.span>
            </motion.h1>

            <motion.div
              className="flex flex-1 flex-col justify-center max-w-[480px] gap-6 sm:gap-7 py-6 sm:py-8 lg:py-10"
              initial="hidden"
              animate="visible"
            >
              <motion.p
                className="font-sans text-prose leading-[1.75] tracking-[0.01em] text-body-secondary"
                variants={reveal}
                custom={0.55}
              >
                <span>Hello, I&rsquo;m Rashod.</span>
                <br />
                I&rsquo;m a software developer and entrepreneur based in St. John&rsquo;s, Newfoundland. I focus on building practical, scalable products and helping businesses use technology to grow with clarity and purpose.
              </motion.p>

              <motion.p
                className="font-sans text-prose leading-[1.8] tracking-[0.01em] text-body-secondary"
                variants={reveal}
                custom={0.7}
              >
                My work spans product discovery, software architecture, digital strategy, and translating complex technical ideas into solutions that make sense for non-technical teams. I also explore photography as a creative outlet, capturing moments and perspectives that complement my work in technology.
              </motion.p>
            </motion.div>

            <motion.div
              className="shrink-0 flex items-center gap-x-12 pb-2"
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
                  className="relative font-sans text-[13px] sm:text-sm tracking-[0.02em] text-link transition-opacity hover:opacity-60"
                >
                  {social.label}
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-link-underline" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right column — Visual panel */}
          <motion.div
            className="hidden md:block flex-shrink-0 lg:w-[38%] my-4 sm:my-6 lg:my-8"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
          >
            <div className="relative w-full h-full bg-surface">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[16rem] select-none leading-none opacity-[0.06] italic text-heading">
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
