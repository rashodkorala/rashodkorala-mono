"use client";

import { useRef } from "react";

interface PageShellProps {
  children: React.ReactNode;
  noScroll?: boolean;
}

export default function PageShell({ children, noScroll }: PageShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen overflow-hidden bg-page text-body">
      {/* --content-max-w (120rem ≈ 1920px) caps line length on 4K/ultrawide.
          w-[min(100%,var(--content-max-w))] + mx-auto centers the column once
          the main pane is wider than the cap (more reliable than max-w alone
          with some block/flex descendants). Padding uses --page-px-* tokens. */}
      <div
        ref={scrollRef}
        className={`h-full min-w-0 lg:ml-sidenav scrollbar-hide ${noScroll ? "overflow-y-auto lg:overflow-hidden" : "overflow-y-auto"}`}
      >
        <div className="box-border mx-auto w-[min(100%,var(--content-max-w))] min-w-0 px-page-px sm:px-page-px-sm md:px-page-px-md lg:px-page-px-lg xl:px-page-px-xl pt-16 lg:pt-20">
          {children}
        </div>
      </div>
    </div>
  );
}
