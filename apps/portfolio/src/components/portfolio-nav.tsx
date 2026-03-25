"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/lib/theme_switcher";

const links = [
  { href: "/work", label: "Work" },
  { href: "/view", label: "The View" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function PortfolioNav() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-black/90">
      <div className="mx-auto flex max-w-[2800px] items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="text-sm font-light tracking-tight text-black dark:text-white hover:opacity-70"
        >
          Rashod Korala
        </Link>
        <nav className="hidden flex-wrap items-center justify-end gap-4 text-xs uppercase tracking-[0.12em] text-black/50 dark:text-white/50 sm:flex sm:gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                pathname === href || pathname.startsWith(`${href}/`)
                  ? "text-black dark:text-white"
                  : "hover:text-black dark:hover:text-white"
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="sm:hidden">
            <select
              className="max-w-[140px] rounded-md border border-black/10 bg-transparent px-2 py-1 text-xs dark:border-white/10"
              aria-label="Navigate"
              value=""
              onChange={(e) => {
                const v = e.target.value;
                if (v) window.location.href = v;
              }}
            >
              <option value="">Menu</option>
              {links.map(({ href, label }) => (
                <option key={href} value={href}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
