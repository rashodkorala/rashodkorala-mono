"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/src/components/theme-toggle";
import {
  PORTFOLIO_NAV,
  getActiveNavSectionId,
} from "@/lib/portfolio-nav";

const navLinkClass = (isActive: boolean) =>
  `font-sans whitespace-normal sm:whitespace-nowrap transition-colors duration-300 ${
    isActive
      ? "text-ink dark:text-[#ebe6df] font-medium"
      : "text-ink/55 hover:text-ink dark:text-[#9c9590] dark:hover:text-[#d7d2cc] font-normal"
  }`;

export default function TopBar() {
  const pathname = usePathname();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(getActiveNavSectionId(pathname));
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex w-full h-16 lg:h-20 flex-nowrap items-center justify-center gap-2 px-3 sm:px-5 md:px-10 lg:justify-between lg:gap-4 lg:px-14 bg-cream/80 dark:bg-[#151311]/85 backdrop-blur">
      <Link
        href="/"
        className="hidden min-w-0 items-center gap-3 group shrink-0 lg:inline-flex"
      >
        <span className="h-9 w-9 inline-flex shrink-0 items-center justify-center rounded-sm bg-ink text-cream dark:bg-[#2a2725] dark:text-[#ece7df] font-['Times_New_Roman','Times',serif] text-xl leading-none">
          R
        </span>
        <span className="font-sans text-base md:text-lg lg:text-xl tracking-[0.01em] text-ink dark:text-[#f0ebe4] truncate group-hover:opacity-80 transition-opacity">
          Rashod Korala
        </span>
      </Link>

      <nav
        className="grid lg:hidden w-full min-w-0 flex-1 grid-cols-4 items-center gap-x-0 px-1 py-1.5 sm:px-2"
        aria-label="Primary"
      >
        {PORTFOLIO_NAV.map(({ id, href, label }) => {
          const isExternal = href.startsWith("http");
          return (
            <Link
              key={id}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={`${navLinkClass(active === id)} flex min-h-11 min-w-0 items-center justify-center px-0.5 text-center text-[11px] leading-snug sm:min-h-0 sm:text-xs md:text-sm`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden shrink-0 items-center lg:flex">
        <ThemeToggle />
      </div>
    </header>
  );
}
