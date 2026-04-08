"use client";

import { useRef } from "react";

interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen overflow-hidden bg-page text-body">
      {/* --content-max-w (120rem ≈ 1920px) caps line length on 4K/ultrawide.
          w-[min(100%,var(--content-max-w))] + mx-auto centers the column once
          the main pane is wider than the cap (more reliable than max-w alone
          with some block/flex descendants). Padding uses --page-px-* tokens. */}
      <div
        ref={scrollRef}
        className="h-full min-w-0 overflow-y-auto lg:ml-sidenav scrollbar-hide"
      >
        <div className="box-border mx-auto w-[min(100%,var(--content-max-w))] min-w-0 px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg xl:px-page-px-xl pt-16 lg:pt-20">
          {children}
        </div>
      </div>
    </div>
  );
}
