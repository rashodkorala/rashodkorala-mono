"use client";

import { useRef } from "react";

interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen overflow-hidden bg-page text-body">
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto lg:ml-sidenav px-6 md:px-12 lg:px-14 pt-16 lg:pt-20 scrollbar-hide"
      >
        {children}
      </div>
    </div>
  );
}
