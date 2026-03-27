"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/src/components/theme-toggle";
import {
  PORTFOLIO_NAV,
  getActiveNavSectionId,
} from "@/lib/portfolio-nav";

export default function TopBar() {
  const pathname = usePathname();
  const [active, setActive] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActive(getActiveNavSectionId(pathname));
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex w-full h-16 lg:h-20 flex-nowrap items-center justify-center gap-2 px-3 sm:px-5 md:px-10 lg:justify-between lg:gap-4 lg:px-14 bg-surface-overlay backdrop-blur">
      <Link
        href="/"
        className="hidden min-w-0 items-center gap-3 group shrink-0 lg:inline-flex"
      >
        <span className="h-9 w-9 inline-flex shrink-0 items-center justify-center rounded-sm bg-surface-elevated text-inverse font-display text-xl leading-none">
          R
        </span>
        <span className="font-sans text-base md:text-lg lg:text-xl tracking-[0.01em] text-heading truncate group-hover:opacity-80 transition-opacity">
          Rashod Korala
        </span>
      </Link>

      <div className="lg:hidden flex w-full min-w-0 flex-1 items-center justify-end">
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="group inline-flex h-10 w-10 items-center justify-center rounded-md border border-line-strong text-body transition-colors hover:border-line-hover"
        >
          <span className="sr-only">Menu</span>
          <span className="relative inline-flex h-4 w-5 flex-col justify-between">
            <span
              className={`h-px w-full bg-current transition-all duration-300 ${
                isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-current transition-opacity duration-300 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-px w-full bg-current transition-all duration-300 ${
                isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav
          className="absolute left-0 right-0 top-16 z-50 border-b border-line bg-surface-overlay-strong px-6 py-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)] backdrop-blur lg:hidden"
          aria-label="Mobile primary"
        >
          <ul className="space-y-4">
            {PORTFOLIO_NAV.map(({ id, href, label }) => {
              const isExternal = href.startsWith("http");
              const isActive = active === id;

              return (
                <li key={id}>
                  <Link
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={`group flex items-center gap-3 transition-all duration-300 ${
                      isActive
                        ? "text-nav-active"
                        : "text-nav-inactive hover:text-nav-hover"
                    }`}
                  >
                    <span
                      className={`h-px transition-all duration-300 ${
                        isActive
                          ? "w-8 bg-nav-indicator"
                          : "w-2 group-hover:w-4 bg-nav-indicator-subtle"
                      }`}
                    />
                    <span className="font-sans text-sm tracking-[0.05em]">
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className="hidden shrink-0 items-center lg:flex">
        <ThemeToggle />
      </div>
    </header>
  );
}
