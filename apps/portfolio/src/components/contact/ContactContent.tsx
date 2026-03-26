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
    <div ref={ref} className="max-w-3xl py-12 md:py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="font-['Times_New_Roman','Times',serif] text-4xl md:text-5xl tracking-tight mb-6 text-ink dark:text-[#f0ebe4]"
      >
        Contact
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-[14px] leading-[1.75] font-light text-muted_ink dark:text-[#b5ada6] max-w-md mb-14"
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
            className="flex items-center justify-between border-t border-ink/8 dark:border-[#33302d] py-7 group"
          >
            <div>
              <span className="text-[11px] uppercase tracking-[0.12em] text-ink/35 dark:text-[#8f8781] font-mono block mb-1.5">
                {link.label}
              </span>
              <span className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-lg md:text-xl font-normal tracking-tight text-ink dark:text-[#eee8e0] flex items-center gap-2">
                {link.value}
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-ink/20 group-hover:text-ink transition-colors dark:text-[#77706a] dark:group-hover:text-[#e2ddd6]"
                  strokeWidth={1.5}
                />
              </span>
            </div>
          </motion.a>
        ))}
        <div className="border-t border-ink/8 dark:border-[#33302d]" />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-[13px] text-ink/35 dark:text-[#9c948e] font-light mt-14"
      >
        Based in St. John&rsquo;s, Newfoundland
      </motion.p>
    </div>
  );
}
