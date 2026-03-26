"use client";

import { motion } from "framer-motion";

const thingsIDo = [
  "Product discovery and validation for my startup",
  "Building the software (architecture, features, optimisation)",
  "Volunteering to support small business owners leverage technology to scale and grow",
  "Digital branding services for local brands and businesses",
  "Photography as a hobby (and occasional side gigs)",
  "Knowledge of business operations and strategies to boost ROI",
  "Understanding of product placement and merchandising",
  "Helping non-technical people understand technical solutions",
];

const socials = [
  { label: "GitHub", href: "https://github.com/rashodkorala" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rashodk" },
  { label: "Email", href: "mailto:hello@rashodkorala.com" },
];

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease },
  }),
};

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: (i: number) => ({
    scaleX: 1,
    transition: { duration: 1.2, delay: 0.6 + i * 0.1, ease },
  }),
};

export default function HomeHero() {
  return (
    <main className="relative flex-1 flex items-center lg:ml-56 overflow-hidden">
      {/* Film grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-overlay grain-overlay" />

      {/* Subtle radial glow behind name */}
      <div className="pointer-events-none absolute -left-40 top-1/4 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[120px]" />

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-16 xl:gap-24 items-start max-w-[1200px]">

          {/* Left column */}
          <div className="flex flex-col justify-between min-h-[85vh]">
            <div>
              {/* Name — magazine masthead */}
              <motion.h1
                className="font-serif leading-[0.88] tracking-[-0.03em] mb-12 md:mb-16"
                initial="hidden"
                animate="visible"
              >
                <motion.span
                  className="block text-[clamp(3.5rem,10vw,7.5rem)] text-white"
                  variants={fadeUp}
                  custom={0}
                >
                  Rashod
                </motion.span>
                <motion.span
                  className="block text-[clamp(3.5rem,10vw,7.5rem)] text-white/90 italic"
                  variants={fadeUp}
                  custom={1}
                >
                  Korala
                </motion.span>
              </motion.h1>

              {/* Divider line */}
              <motion.div
                className="w-16 h-px bg-white/20 mb-10 origin-left"
                variants={lineReveal}
                initial="hidden"
                animate="visible"
                custom={0}
              />

              {/* Intro */}
              <motion.div
                className="space-y-6 max-w-[420px]"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
              >
                <p className="text-white/55 text-[15px] font-light leading-[1.8]">
                  Software developer and entrepreneur based in
                  St. John&rsquo;s, Newfoundland. I build products, help businesses
                  grow with technology, and capture moments through photography.
                </p>
              </motion.div>

              {/* Things I do */}
              <motion.div
                className="mt-10"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
              >
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/25 mb-5 font-medium">
                  What I do
                </p>
                <ul className="space-y-3 max-w-[420px]">
                  {thingsIDo.map((item, i) => (
                    <motion.li
                      key={item}
                      className="text-white/35 text-[13px] font-light leading-[1.7] pl-5 relative"
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={4.5 + i * 0.15}
                    >
                      <span className="absolute left-0 top-[0.65em] w-2 h-px bg-white/15" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Social links — editorial underline style */}
            <motion.div
              className="flex items-center gap-10 pt-14"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={7}
            >
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="group relative text-[13px] tracking-[0.05em] text-white/35 hover:text-white/80 transition-colors duration-500"
                >
                  {social.label}
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-white/15 group-hover:bg-white/40 transition-colors duration-500" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right column — Photo frame */}
          <motion.div
            className="relative mt-4 lg:mt-8"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* Photo container with editorial frame */}
              <div className="absolute inset-0 bg-white/[0.02]" />

              {/* Subtle inner border */}
              <div className="absolute inset-3 md:inset-4 border border-white/[0.06]" />

              {/* Monogram placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[14rem] md:text-[18rem] text-white/[0.025] select-none leading-none italic">
                  R
                </span>
              </div>

              {/* Corner accents */}
              <div className="absolute top-3 left-3 md:top-4 md:left-4 w-4 h-4 border-t border-l border-white/10" />
              <div className="absolute top-3 right-3 md:top-4 md:right-4 w-4 h-4 border-t border-r border-white/10" />
              <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-4 h-4 border-b border-l border-white/10" />
              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-4 h-4 border-b border-r border-white/10" />
            </div>

            {/* Caption beneath photo */}
            <motion.p
              className="text-[10px] tracking-[0.2em] uppercase text-white/15 mt-4 text-right"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={6}
            >
              St. John&rsquo;s, NL &mdash; {new Date().getFullYear()}
            </motion.p>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
