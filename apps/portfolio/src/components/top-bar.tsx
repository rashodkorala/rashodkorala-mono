"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/src/components/theme-toggle";
import {
  PORTFOLIO_NAV,
  getActiveNavSectionId,
} from "@/lib/portfolio-nav";

/** Returns a back-navigation target for sub-pages, null for top-level pages. */
function getBackTarget(pathname: string): { href: string; label: string } | null {
  if (pathname.startsWith("/work/")) return { href: "/work", label: "Work" };
  return null;
}

/** Returns the short label for the current page (used as mobile centre title). */
function getMobilePageLabel(pathname: string): string {
  if (pathname === "/") return "About";
  if (pathname === "/work") return "Work";
  if (pathname.startsWith("/work/")) return "Work";
  if (pathname.startsWith("/contact")) return "Contact";
  if (pathname.startsWith("/cv")) return "CV";
  if (pathname.startsWith("/privacy")) return "Privacy";
  return "";
}

export default function TopBar() {
  const pathname = usePathname();
  const [active, setActive] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActive(getActiveNavSectionId(pathname));
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const backTarget  = getBackTarget(pathname);
  const mobileLabel = getMobilePageLabel(pathname);

  // Spacing changes — all hardcoded values mapped to nearest Fibonacci step:
  //   h-16 (64px) / lg:h-20 (80px)  — kept as-is, structural header heights
  //   px-3  (12px) → px-fib-13  (13px)
  //   sm:px-5  (20px) → sm:px-fib-21  (21px)
  //   md:px-10 (40px) → md:px-fib-34  (34px)
  //   lg:px-14 (56px) → lg:px-fib-55  (55px)
  //   gap-2 (8px) ✓ already Fibonacci
  //   lg:gap-4 (16px) → lg:gap-fib-13 (13px)
  //   h-9 w-9 (36px) → h-fib-34 w-fib-34 (34px)  — logo box
  //   h-10 w-10 (40px) → h-fib-34 w-fib-34 (34px)  — menu button
  //   gap-3 (12px) → gap-fib-13 (13px)
  //   px-6 (24px) → px-fib-21 (21px)  — mobile nav
  //   py-5 (20px) → py-fib-21 (21px)  — mobile nav
  //   space-y-4 (16px) → space-y-fib-13 (13px)
  //   w-8 (32px) → w-fib-34 (34px)  — active indicator
  //   w-2 (8px) → w-fib-8 (8px) ✓  — default indicator
  //   w-4 (16px) → w-fib-13 (13px)  — hover indicator
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex w-full h-16 lg:h-20 flex-nowrap items-center justify-center gap-2 px-fib-13 sm:px-fib-21 md:px-fib-34 lg:justify-between lg:gap-fib-13 lg:px-fib-55 bg-page">
      <Link
        href="/"
        className="hidden min-w-0 items-center gap-fib-13 group shrink-0 lg:inline-flex"
      >
        <span className="uppercase font-sans h-fib-34 w-fib-34 inline-flex shrink-0 items-center justify-center rounded-sm bg-surface-elevated text-inverse font-sans text-xl leading-none">
          R
        </span>
      </Link>

      {/* ── Mobile header: 3-column grid ────────────────────────────────────── */}
      <div className="lg:hidden grid w-full items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>

        {/* Left: back arrow on sub-pages, logo mark on top-level */}
        {backTarget ? (
          <Link
            href={backTarget.href}
            className="inline-flex items-center gap-1 text-body-secondary hover:text-heading transition-colors min-w-0"
            style={{ fontSize: "13px", fontFamily: "var(--font-jakarta)", letterSpacing: "0.02em", minHeight: "34px" }}
          >
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 15, height: 15, flexShrink: 0 }}>
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{backTarget.label}</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="inline-flex h-fib-34 w-fib-34 items-center justify-center rounded-sm bg-surface-elevated text-inverse font-sans text-sm font-bold shrink-0"
            aria-label="Home"
          >
            R
          </Link>
        )}

        {/* Centre: current page label */}
        <span className="font-sans text-heading text-center px-2" style={{ fontSize: "13px", letterSpacing: "0.04em" }}>
          {mobileLabel}
        </span>

        {/* Right: theme toggle + hamburger */}
        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="group inline-flex h-fib-34 w-fib-34 items-center justify-center rounded-md border border-line-strong text-body transition-colors hover:border-line-hover"
          >
            <span className="sr-only">Menu</span>
            <span className="relative inline-flex h-4 w-5 flex-col justify-between">
              <span className={`h-px w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`h-px w-full bg-current transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`h-px w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        // top-16 kept to align flush with header height
        <nav
          className="absolute left-0 right-0 top-16 z-50 border-b border-line bg-surface-overlay-strong px-fib-21 py-fib-21 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.35)] backdrop-blur lg:hidden"
          aria-label="Mobile primary"
        >
          <ul className="space-y-fib-13">
            {PORTFOLIO_NAV.map(({ id, href, label }) => {
              const isExternal = href.startsWith("http");
              const isActive = active === id;

              return (
                <li key={id}>
                  <Link
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={`group flex items-center gap-fib-13 transition-all duration-300 ${
                      isActive
                        ? "text-nav-active"
                        : "text-nav-inactive hover:text-nav-hover"
                    }`}
                  >
                    <span
                      className={`h-px transition-all duration-300 ${
                        isActive
                          ? "w-fib-34 bg-nav-indicator"
                          : "w-fib-8 group-hover:w-fib-13 bg-nav-indicator-subtle"
                      }`}
                    />
                    <span className="font-sans text-sm tracking-[0.03em]">
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
