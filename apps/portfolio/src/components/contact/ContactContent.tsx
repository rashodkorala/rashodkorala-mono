"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const links = [
  { label: "Email", value: "hello@rashodkorala.com", href: "mailto:hello@rashodkorala.com" },
  { label: "GitHub", value: "rashodkorala", href: "https://github.com/rashodkorala" },
  { label: "LinkedIn", value: "rashodk", href: "https://linkedin.com/in/rashodk" },
];

export default function ContactContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="max-w-4xl py-content-py md:py-content-py-md">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="font-display text-4xl md:text-5xl tracking-tight mb-6 text-heading"
      >
        Contact
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-reading text-[14px] leading-[1.75] font-light text-body-secondary max-w-md mb-14"
      >
        Have a project in mind, want to collaborate, or just want to say hello?
        Feel free to reach out.
      </motion.p>

      <div>
        {links.map((link, index) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
            className="flex items-center justify-between border-t border-line-subtle py-7 group"
          >
            <div>
              <span className="text-[11px] uppercase tracking-[0.12em] text-label font-mono block mb-1.5">
                {link.label}
              </span>
              <span className="font-reading text-lg md:text-xl font-normal tracking-tight text-title flex items-center gap-2">
                {link.value}
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-icon group-hover:text-icon-hover transition-colors"
                  strokeWidth={1.5}
                />
              </span>
            </div>
          </motion.a>
        ))}
        <div className="border-t border-line-subtle" />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="font-reading text-[13px] text-label font-light mt-14"
      >
        Based in St. John&rsquo;s, Newfoundland
      </motion.p>
    </div>
  );
}
