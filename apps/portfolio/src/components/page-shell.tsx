"use client";

import { useRef } from "react";

interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen overflow-hidden bg-page text-body">
      {/* max-w-[var(--content-max-w)] caps the content at 89rem (1424px) so it
          never stretches illegibly on 4K/ultrawide displays. mx-auto keeps it
          centred once the viewport exceeds that width. All horizontal padding
          uses the Fibonacci-derived --page-px-* tokens. */}
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto lg:ml-sidenav scrollbar-hide"
      >
        <div className="max-w-[var(--content-max-w)] mx-auto px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg xl:px-page-px-xl pt-16 lg:pt-20">
          {children}
        </div>
      </div>
    </div>
  );
}
