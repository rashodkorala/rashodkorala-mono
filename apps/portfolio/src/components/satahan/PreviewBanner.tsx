import { satoshi } from "@/lib/font";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  archived: "Archived",
  published: "Published",
};

/** Shown on Satahan entries opened from the CMS in Draft Mode, so a preview is never mistaken for the live page. */
export default function PreviewBanner({ status, slug }: { status: string; slug: string }) {
  const label = STATUS_LABEL[status] ?? status;
  const isLive = status === "published";
  return (
    <div
      role="status"
      style={{
        // Fixed to the bottom so the site header never covers it while scrolling.
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        width: "max-content",
        maxWidth: "calc(100vw - 32px)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "6px 16px",
        padding: "10px 16px",
        borderRadius: 999,
        border: "1px solid var(--color-border-strong)",
        background: "var(--color-surface-raised)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        fontFamily: satoshi,
        fontSize: 13,
        color: "var(--color-body-secondary)",
      }}
    >
      <span>
        <strong style={{ fontWeight: 500, color: "var(--color-heading)" }}>Preview</strong>
        {" · "}
        {label}
        {" · "}
        {isLive ? "Latest saved version" : "Not public yet"}
      </span>
      <a
        href={`/api/preview/exit?to=${encodeURIComponent(isLive ? `/satahan/${slug}` : "/satahan")}`}
        style={{ color: "var(--color-link)", textDecoration: "underline", textUnderlineOffset: 4 }}
      >
        Exit preview
      </a>
    </div>
  );
}
