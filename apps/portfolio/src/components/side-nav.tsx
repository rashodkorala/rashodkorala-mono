"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/src/components/theme-toggle";

const sections = [
  { id: "about", label: "About", href: "/" },
  { id: "work", label: "Work", href: "/work" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function SideNav() {
  const pathname = usePathname();
  const [active, setActive] = useState("");

  useEffect(() => {
    if (pathname === "/") {
      setActive("about");
    } else if (pathname.startsWith("/work") || pathname.startsWith("/projects")) {
      setActive("work");
    } else {
      const match = sections.find(
        (s) => s.href !== "/" && pathname.startsWith(s.href)
      );
      if (match) setActive(match.id);
    }
  }, [pathname]);

  return (
    <motion.nav
      className="hidden lg:flex flex-col justify-between fixed left-0 top-0 h-screen w-48 pl-8 py-12 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
    >
      <div className="flex-1 flex items-center">
        <ul className="space-y-7">
          {sections.map(({ id, label, href }) => (
            <li key={id}>
              <Link
                href={href}
                className={`flex items-center gap-3 transition-all duration-500 group ${
                  active === id
                    ? "text-ink/80 dark:text-[#d7d2cc]"
                    : "text-ink/25 hover:text-ink/50 dark:text-[#8f8780] dark:hover:text-[#beb8b1]"
                }`}
              >
                <span
                  className={`h-px transition-all duration-500 ${
                    active === id
                      ? "w-8 bg-ink/40 dark:bg-[#7d756f]"
                      : "w-0 group-hover:w-4 bg-ink/20 dark:bg-[#4d4844]"
                  }`}
                />
                <span className="text-[13px] tracking-[0.06em] font-light">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="pl-11">
        <ThemeToggle />
      </div>
    </motion.nav>
  );
}
