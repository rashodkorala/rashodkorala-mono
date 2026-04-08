"use client";

import Image from "next/image";
import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { jakartaSans } from "@/lib/font";
import ProjectPhotoLightbox from "./ProjectPhotoLightbox";

type CaseStudyMediaBlocksProps = {
  caseTitle: string;
  beforeSrc: string | null;
  afterSrc: string | null;
  screenshotSrcs: string[];
  sectionLabel: CSSProperties;
};

export default function CaseStudyMediaBlocks({
  caseTitle,
  beforeSrc,
  afterSrc,
  screenshotSrcs,
  sectionLabel,
}: CaseStudyMediaBlocksProps) {
  const lightboxImages = useMemo(() => {
    const out: string[] = [];
    if (beforeSrc) out.push(beforeSrc);
    if (afterSrc) out.push(afterSrc);
    out.push(...screenshotSrcs);
    return out;
  }, [beforeSrc, afterSrc, screenshotSrcs]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openAt = useCallback(
    (i: number) => {
      if (lightboxImages.length === 0) return;
      setLightboxIndex(Math.min(Math.max(i, 0), lightboxImages.length - 1));
    },
    [lightboxImages.length]
  );

  const galleryOffset = (beforeSrc ? 1 : 0) + (afterSrc ? 1 : 0);
  const hasBeforeAfter = Boolean(beforeSrc || afterSrc);
  const baCols = beforeSrc && afterSrc ? "1fr 1fr" : "1fr";

  const captionStyle: CSSProperties = {
    fontSize: "clamp(10px,0.75vw,11px)",
    color: "var(--color-body-secondary)",
    fontFamily: jakartaSans,
    marginBottom: 6,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  };

  if (!hasBeforeAfter && screenshotSrcs.length === 0) return null;

  return (
    <>
      {hasBeforeAfter && (
        <section id="cs-before-after" style={{ margin: "clamp(24px,3vw,44px) 0" }}>
          <p style={{ ...sectionLabel, marginBottom: "clamp(12px,1.2vw,16px)" }}>Before / After</p>
          <div style={{ display: "grid", gridTemplateColumns: baCols, gap: "clamp(8px,1vw,16px)" }}>
            {beforeSrc && (
              <div>
                <p style={captionStyle}>Before</p>
                <button
                  type="button"
                  className="cs-case-thumb-btn"
                  aria-label={`Open before image — ${caseTitle}`}
                  onClick={() => openAt(0)}
                >
                  <div className="cs-case-ba-frame">
                    <Image
                      src={beforeSrc}
                      alt="Before"
                      width={1600}
                      height={2000}
                      sizes="(max-width:900px) 50vw, min(480px, 40vw)"
                      className="cs-case-ba-img"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </button>
              </div>
            )}
            {afterSrc && (
              <div>
                <p style={captionStyle}>After</p>
                <button
                  type="button"
                  className="cs-case-thumb-btn"
                  aria-label={`Open after image — ${caseTitle}`}
                  onClick={() => openAt(beforeSrc ? 1 : 0)}
                >
                  <div className="cs-case-ba-frame">
                    <Image
                      src={afterSrc}
                      alt="After"
                      width={1600}
                      height={2000}
                      sizes="(max-width:900px) 50vw, min(480px, 40vw)"
                      className="cs-case-ba-img"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {screenshotSrcs.length > 0 && (
        <div id="cs-gallery" style={{ margin: "clamp(24px,3vw,44px) 0" }}>
          <p style={{ ...sectionLabel, marginBottom: "clamp(12px,1.2vw,16px)" }}>Gallery</p>
          <div
            className="cs-img-duo"
            style={{
              display: "grid",
              gridTemplateColumns: screenshotSrcs.length === 1 ? "1fr" : "1fr 1fr",
              gap: "clamp(8px,1vw,16px)",
            }}
          >
            {screenshotSrcs.map((src, i) => {
              const isWideLead = i === 0 && screenshotSrcs.length > 2;
              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={isWideLead ? "cs-case-thumb-btn cs-case-gallery-lead" : "cs-case-thumb-btn"}
                  aria-label={`Open gallery image ${i + 1} of ${screenshotSrcs.length} — ${caseTitle}`}
                  onClick={() => openAt(galleryOffset + i)}
                >
                  <div className="cs-case-gallery-frame">
                    <Image
                      src={src}
                      alt={`${caseTitle} — gallery ${i + 1}`}
                      width={2000}
                      height={1600}
                      sizes={isWideLead ? "(max-width:900px) 100vw, min(900px, 75vw)" : "(max-width:900px) 48vw, 28vw"}
                      className="cs-case-gallery-img"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <ProjectPhotoLightbox
          images={lightboxImages}
          projectTitle={caseTitle}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
}
