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
        className="h-full overflow-y-auto lg:ml-sidenav px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg xl:px-page-px-xl pt-12 lg:pt-16 scrollbar-hide"
      >
        {children}
      </div>
    </div>
  );
}
