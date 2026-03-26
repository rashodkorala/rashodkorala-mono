"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const sections = [
  { id: "about", label: "About", href: "/about" },
  { id: "work", label: "Work", href: "/work" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "contact", label: "Contact", href: "mailto:hello@rashodkorala.com" },
];

export default function SideNav() {
  const pathname = usePathname();
  const [active, setActive] = useState("");
  const isHome = pathname === "/";

  useEffect(() => {
    const match = sections.find(
      (s) => pathname.startsWith(s.href) && !s.href.startsWith("mailto:")
    );
    if (match) {
      setActive(match.id);
    } else if (isHome) {
      setActive("about");
    }
  }, [pathname, isHome]);

  return (
    <motion.nav
      className="hidden lg:flex flex-col justify-center fixed left-0 top-0 h-screen w-48 pl-8 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
    >
      <ul className="space-y-7">
        {sections.map(({ id, label, href }) => (
          <li key={id}>
            <Link
              href={href}
              className={`flex items-center gap-3 transition-all duration-500 group ${
                active === id
                  ? isHome
                    ? "text-[#2b2b2b]/80"
                    : "text-white/90"
                  : isHome
                    ? "text-[#2b2b2b]/25 hover:text-[#2b2b2b]/50"
                    : "text-white/20 hover:text-white/50"
              }`}
            >
              <span
                className={`h-px transition-all duration-500 ${
                  active === id
                    ? isHome
                      ? "w-8 bg-[#2b2b2b]/40"
                      : "w-8 bg-white/60"
                    : isHome
                      ? "w-0 group-hover:w-4 bg-[#2b2b2b]/20"
                      : "w-0 group-hover:w-4 bg-white/30"
                }`}
              />
              <span className="text-[13px] tracking-[0.06em] font-light">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
