"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/lib/theme_switcher";

const links = [
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <Link href="/" className="text-lg font-medium tracking-tight">
          Rashod Korala
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] uppercase tracking-[0.08em] transition-colors ${
                  isActive
                    ? "text-black dark:text-white"
                    : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          <button
            className="md:hidden p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-black/5 dark:border-white/5 bg-white dark:bg-black overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm uppercase tracking-[0.08em] transition-colors ${
                      isActive
                        ? "text-black dark:text-white"
                        : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Social links */}
              <div className="pt-4 border-t border-black/5 dark:border-white/5 flex gap-6">
                <a href="https://github.com/rashodkorala" target="_blank" rel="noopener noreferrer" className="text-xs text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">GitHub</a>
                <a href="https://linkedin.com/in/rashodk" target="_blank" rel="noopener noreferrer" className="text-xs text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
                <a href="https://instagram.com/rashodk_" target="_blank" rel="noopener noreferrer" className="text-xs text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
