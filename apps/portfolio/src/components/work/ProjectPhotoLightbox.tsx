"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { jakartaSans } from "@/lib/font";

const SWIPE_THRESHOLD_PX = 50;

type ProjectPhotoLightboxProps = {
  images: string[];
  projectTitle: string;
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function ProjectPhotoLightbox({
  images,
  projectTitle,
  index,
  onClose,
  onIndexChange,
}: ProjectPhotoLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeIndex = images.length > 0 ? Math.min(Math.max(index, 0), images.length - 1) : 0;
  const src = images[safeIndex];
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    onIndexChange(safeIndex === 0 ? images.length - 1 : safeIndex - 1);
  }, [hasMultiple, images.length, onIndexChange, safeIndex]);

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    onIndexChange(safeIndex === images.length - 1 ? 0 : safeIndex + 1);
  }, [hasMultiple, images.length, onIndexChange, safeIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
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
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || !hasMultiple) return;
      const endX = e.changedTouches[0]?.clientX;
      if (endX === undefined) return;
      const dx = endX - touchStartX.current;
      touchStartX.current = null;
      if (dx > SWIPE_THRESHOLD_PX) goPrev();
      else if (dx < -SWIPE_THRESHOLD_PX) goNext();
    },
    [hasMultiple, goPrev, goNext]
  );

  if (!mounted || images.length === 0 || !src) return null;

  return createPortal(
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
        onClick={onClose}
      />
      <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col">
        <div
          className="pointer-events-auto flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#0c0b0a]/40 px-4 py-3 backdrop-blur-md md:px-6 dark:bg-black/50"
          style={{ fontFamily: jakartaSans }}
        >
          <p id={titleId} className="truncate text-sm font-medium text-white/90">
            {projectTitle}
            <span className="text-white/45">
              {" "}
              — {safeIndex + 1} / {images.length}
            </span>
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <p id={descId} className="sr-only">
          Full screen image. Swipe left or right to change image. Use on-screen buttons or arrow keys for
          previous and next. Escape to close.
        </p>
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 pt-2 sm:px-4 md:px-10">
          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="pointer-events-auto absolute left-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 p-0 text-white/90 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 sm:left-2 md:h-12 md:w-12"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-7 w-7 sm:h-6 sm:w-6" strokeWidth={1.5} aria-hidden />
            </button>
          )}
          <div
            className="pointer-events-auto relative mx-auto w-full max-w-6xl px-10 sm:px-12 md:px-14"
            style={{ height: "min(78dvh, calc(100dvh - 140px))", touchAction: hasMultiple ? "none" : "auto" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              key={src}
              src={src}
              alt={`${projectTitle} — image ${safeIndex + 1} of ${images.length}`}
              fill
              className="object-contain select-none"
              sizes="(max-width: 768px) 100vw, min(1152px, 100vw)"
              priority
              draggable={false}
            />
          </div>
          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="pointer-events-auto absolute right-1 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 p-0 text-white/90 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 sm:right-2 md:h-12 md:w-12"
              aria-label="Next image"
            >
              <ChevronRight className="h-7 w-7 sm:h-6 sm:w-6" strokeWidth={1.5} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
