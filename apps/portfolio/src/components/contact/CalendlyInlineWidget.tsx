'use client';
import Script from "next/script";
import { useRef } from "react";

export default function CalendlyInlineWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  function initWidget() {
    if (!containerRef.current) return;
    const dark = document.documentElement.classList.contains("dark");
    const bg      = dark ? "151311" : "f0ede8";
    const text    = dark ? "ddd7cf" : "2b2b2b";
    const primary = dark ? "ddd7cf" : "2b2b2b";

    (window as any).Calendly?.initInlineWidget({
      url: `https://calendly.com/rashodkorala?background_color=${bg}&text_color=${text}&primary_color=${primary}&hide_gdpr_banner=1`,
      parentElement: containerRef.current,
    });
  }

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={initWidget}
      />
      <div
        ref={containerRef}
        style={{ minWidth: "320px", height: "700px" }}
      />
    </>
  );
}
