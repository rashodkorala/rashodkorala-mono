"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PORTFOLIO_NAV,
  getActiveNavSectionId,
} from "@/lib/portfolio-nav";

export default function SideNav() {
  const pathname = usePathname();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(getActiveNavSectionId(pathname));
  }, [pathname]);

  return (
    <motion.nav
      className="hidden lg:flex flex-col justify-end fixed left-0 top-0 h-screen w-sidenav pl-8 py-12 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
    >
      <div className="flex-1 flex items-center">
        <ul className="space-y-6 xl:space-y-7 2xl:space-y-8">
          {PORTFOLIO_NAV.map(({ id, href, label }) => (
            <li key={id}>
              <Link
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`flex items-center gap-3 transition-all duration-500 group ${
                  active === id
                    ? "text-nav-active"
                    : "text-nav-inactive hover:text-nav-hover"
                }`}
              >
                <span
                  className={`h-px transition-all duration-500 ${
                    active === id
                      ? "w-8 bg-nav-indicator"
                      : "w-0 group-hover:w-4 bg-nav-indicator-subtle"
                  }`}
                />
                <span className="font-sans text-[length:var(--text-nav-size)] tracking-[0.05em] font-normal leading-none">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}
