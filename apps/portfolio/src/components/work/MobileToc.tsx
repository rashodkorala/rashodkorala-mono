'use client';

import { useRef, useEffect } from 'react';

interface Section { id: string; label: string; }

interface MobileTocProps {
  sections: Section[];
  wrapperClass: string;
  summaryClass: string;
  navClass: string;
  linkClass: string;
  dashClass: string;
}

export default function MobileToc({
  sections,
  wrapperClass,
  summaryClass,
  navClass,
  linkClass,
  dashClass,
}: MobileTocProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      // Measure collapsed bar height (details is closed at mount)
      document.documentElement.style.setProperty(
        '--mobile-toc-height',
        `${el.offsetHeight + 16}px`, // +16px breathing room
      );
    };
    update();
    // Re-measure on orientation change, viewport resize, font scale changes
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function close() {
    detailsRef.current?.removeAttribute('open');
  }

  return (
    <div className={wrapperClass} ref={wrapperRef}>
      <details ref={detailsRef}>
        <summary className={summaryClass}>
          On this page <span aria-hidden="true">↓</span>
        </summary>
        <nav className={navClass}>
          {sections.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className={linkClass} onClick={close}>
              <span className={dashClass} />
              {label}
            </a>
          ))}
        </nav>
      </details>
    </div>
  );
}
