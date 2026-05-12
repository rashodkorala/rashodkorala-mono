'use client';
import Script from "next/script";
import { useState } from "react";

interface CalendlyPopupButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function CalendlyPopupButton({ className, children }: CalendlyPopupButtonProps) {
  const [ready, setReady] = useState(false);

  function openCalendly() {
    const dark = document.documentElement.classList.contains("dark");
    const bg      = dark ? "151311" : "f0ede8";
    const text    = dark ? "ddd7cf" : "2b2b2b";
    const primary = dark ? "ddd7cf" : "2b2b2b";

    (window as any).Calendly?.initPopupWidget({
      url: `https://calendly.com/rashodkorala?background_color=${bg}&text_color=${text}&primary_color=${primary}&hide_gdpr_banner=1`,
    });
  }

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <button
        onClick={openCalendly}
        disabled={!ready}
        className={`${className ?? ""} disabled:opacity-40`}
      >
        {children ?? "Schedule a call"}
      </button>
    </>
  );
}
