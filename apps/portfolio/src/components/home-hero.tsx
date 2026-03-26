"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: d, ease },
  }),
};

const navLinks = [
  { label: "About", href: "/about", active: true },
  { label: "Work", href: "/work", active: false },
  { label: "Contact", href: "mailto:hello@rashodkorala.com", active: false },
];

const socials = [
  { label: "GitHub", href: "https://github.com/rashodkorala" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rashodk" },
];

export default function HomeHero() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#ece8e1", color: "#2b2b2b" }}
    >
      {/* Top navigation */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-8 md:px-12 lg:px-16 pt-8 md:pt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center w-12 h-12 text-white font-serif text-xl"
          style={{ backgroundColor: "#2b2b2b" }}
        >
          R
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-8 md:gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-[15px] tracking-[0.01em] transition-opacity hover:opacity-60"
              style={{ color: "#2b2b2b" }}
            >
              {link.label}
              {link.active && (
                <span
                  className="absolute -bottom-1 left-0 w-full h-px"
                  style={{ backgroundColor: "#2b2b2b" }}
                />
              )}
            </Link>
          ))}
        </nav>
      </motion.header>

      {/* Main content */}
      <div className="relative px-8 md:px-12 lg:px-16 pt-12 md:pt-16 lg:pt-20 pb-8">
        <div className="relative flex flex-col lg:block min-h-[calc(100vh-140px)]">

          {/* Name */}
          <motion.h1
            className="font-serif leading-[0.92] tracking-[-0.02em] relative z-10"
            initial="hidden"
            animate="visible"
          >
            <motion.span
              className="block text-[clamp(4rem,11vw,9rem)]"
              variants={reveal}
              custom={0.2}
            >
              Rashod
            </motion.span>
            <motion.span
              className="block text-[clamp(4rem,11vw,9rem)] ml-[0.15em]"
              variants={reveal}
              custom={0.35}
            >
              Korala
            </motion.span>
          </motion.h1>

          {/* Bio text — positioned below name, indented */}
          <motion.div
            className="relative z-10 mt-10 md:mt-14 ml-0 md:ml-[18%] lg:ml-[16%] max-w-[420px]"
            initial="hidden"
            animate="visible"
          >
            <motion.p
              className="text-[15px] leading-[1.75] font-light"
              style={{ color: "#6b6560" }}
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
              className="text-[15px] leading-[1.75] font-light mt-6"
              style={{ color: "#6b6560" }}
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

          {/* Photo — absolute positioned on the right for desktop */}
          <motion.div
            className="relative lg:absolute lg:right-0 lg:top-0 mt-12 lg:mt-0 lg:w-[42%] xl:w-[40%] lg:h-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
          >
            <div
              className="relative w-full aspect-[3/4] lg:aspect-auto lg:h-[calc(100vh-180px)]"
              style={{ backgroundColor: "#d8d3cc" }}
            >
              {/* Placeholder — replace with <Image> when photo is ready */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-serif text-[16rem] md:text-[20rem] select-none leading-none opacity-[0.06] italic"
                  style={{ color: "#2b2b2b" }}
                >
                  R
                </span>
              </div>
            </div>
          </motion.div>

          {/* Social links — bottom left */}
          <motion.div
            className="relative z-10 mt-auto pt-16 lg:pt-0 lg:absolute lg:bottom-0 lg:left-0 flex items-center gap-10"
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
                className="relative text-[15px] tracking-[0.01em] transition-opacity hover:opacity-60"
                style={{ color: "#2b2b2b" }}
              >
                {social.label}
                <span
                  className="absolute -bottom-1 left-0 w-full h-px"
                  style={{ backgroundColor: "#9e9890" }}
                />
              </a>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
