"use client";

import Link from "next/link";
import ThemeToggle from "@/src/components/theme-toggle";

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex w-full h-16 lg:h-20 px-6 md:px-12 lg:px-14 items-center justify-between bg-cream/80 dark:bg-[#121110]/85 backdrop-blur">
      <Link href="/" className="inline-flex items-center gap-3 group">
        <span className="h-9 w-9 inline-flex items-center justify-center rounded-sm bg-ink text-cream dark:bg-[#2a2725] dark:text-[#ece7df] font-['Times_New_Roman','Times',serif] text-xl leading-none">
          R
        </span>
        <span className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-base md:text-lg tracking-[0.01em] text-ink dark:text-[#f0ebe4] group-hover:opacity-80 transition-opacity">
          Rashod Korala
        </span>
      </Link>

      <ThemeToggle />
    </header>
  );
}
