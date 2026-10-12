"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type ProjectGalleryProps = {
  images: string[];
  projectTitle: string;
};

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = useCallback((index: number) => setLightboxIndex(index), []);
  const close = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || images.length < 2) return i;
      return i === 0 ? images.length - 1 : i - 1;
    });
  }, [images.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || images.length < 2) return i;
      return i === images.length - 1 ? 0 : i + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxIndex, close, goPrev, goNext]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      closeRef.current?.focus();
    }
  }, [lightboxIndex]);

  if (images.length === 0) return null;

  const lightbox =
    lightboxIndex !== null && mounted ? (
      createPortal(
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-0 bg-[#0c0b0a]/92 backdrop-blur-sm dark:bg-black/90"
            aria-label="Close gallery"
            onClick={close}
          />
          <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="pointer-events-auto flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#0c0b0a]/40 px-4 py-3 backdrop-blur-md md:px-6 dark:bg-black/50">
            <p id={titleId} className="truncate text-sm font-medium text-white/90">
              {projectTitle}
              <span className="text-white/45"> — {lightboxIndex + 1} / {images.length}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <p id={descId} className="sr-only">
            Full screen image. Use arrow keys for previous and next, Escape to close.
          </p>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 pt-2 md:px-10">
            {images.length > 1 && (
              <button
                type="button"
                onClick={goPrev}
                className="pointer-events-auto absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-3 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60 md:flex"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
              </button>
            )}
            <div className="pointer-events-auto relative h-full w-full max-w-6xl">
              <Image
                src={images[lightboxIndex]!}
                alt={`${projectTitle} — image ${lightboxIndex + 1} of ${images.length}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, min(1152px, 100vw)"
                priority
              />
            </div>
            {images.length > 1 && (
              <button
                type="button"
                onClick={goNext}
                className="pointer-events-auto absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-3 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/60 md:flex"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
              </button>
            )}
          </div>
          {images.length > 1 && (
            <div className="pointer-events-auto flex shrink-0 justify-center gap-2 border-t border-white/10 bg-[#0c0b0a]/40 px-4 py-4 backdrop-blur-md md:hidden dark:bg-black/50">
              <button
                type="button"
                onClick={goPrev}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90"
              >
                Next
              </button>
            </div>
          )}
          </div>
        </div>,
        document.body
      )
    ) : null;

  return (
    <>
      {lightbox}
      <div className="grid gap-4 md:gap-5">
        {images.length === 1 && (
          <button
            type="button"
            onClick={() => open(0)}
            className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line text-left shadow-[0_1px_0_rgba(43,43,43,0.06)] transition-[box-shadow,transform] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30 dark:shadow-none hover:border-line-hover"
          >
            <Image
              src={images[0]!}
              alt={`${projectTitle} — gallery image`}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] dark:brightness-[0.88]"
              sizes="(max-width: 896px) 100vw, 896px"
            />
            <span className="pointer-events-none absolute inset-0 bg-ink/[0.03] opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/20" />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-white/95 backdrop-blur-sm">
              View
            </span>
          </button>
        )}

        {images.length === 2 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
            {images.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => open(i)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line text-left transition-[box-shadow,transform] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30 hover:border-line-hover"
              >
                <Image
                  src={url}
                  alt={`${projectTitle} — ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] dark:brightness-[0.88]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <span className="pointer-events-none absolute inset-0 bg-ink/[0.02] opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/15" />
              </button>
            ))}
          </div>
        )}

        {images.length >= 3 && (
          <>
            <button
              type="button"
              onClick={() => open(0)}
              className="group relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-line text-left shadow-[0_1px_0_rgba(43,43,43,0.06)] transition-[box-shadow,transform] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30 md:aspect-[21/9]"
            >
              <Image
                src={images[0]!}
                alt={`${projectTitle} — ${1}`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015] dark:brightness-[0.88]"
                sizes="(max-width: 896px) 100vw, 896px"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />
              <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-white/95 backdrop-blur-sm">
                Open gallery
              </span>
            </button>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {images.slice(1).map((url, j) => {
                const i = j + 1;
                return (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    onClick={() => open(i)}
                    className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line text-left transition-[box-shadow,transform] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30 hover:border-line-hover"
                  >
                    <Image
                      src={url}
                      alt={`${projectTitle} — ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] dark:brightness-[0.88]"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-ink/[0.02] opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/15" />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
