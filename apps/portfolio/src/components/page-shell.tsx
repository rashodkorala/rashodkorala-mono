"use client";

import { useRef } from "react";

interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen overflow-hidden bg-cream text-ink dark:bg-background dark:text-[#d4cfc8]">
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto lg:ml-48 px-6 md:px-12 lg:px-14 pt-16 lg:pt-20 scrollbar-hide"
      >
        {children}
      </div>
    </div>
  );
}
