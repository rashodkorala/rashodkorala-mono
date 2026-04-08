export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-fib-13 bg-page"
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>

      {/* Name — muted, editorial caps */}
      <p
        aria-hidden
        className="font-sans text-faint select-none"
        style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase" }}
      >
        Rashod Korala
      </p>

      {/* Scan line — sweep across a faint track */}
      <div
        aria-hidden
        className="relative overflow-hidden"
        style={{
          width: "clamp(88px, 18vw, 160px)",
          height: "1px",
          background: "var(--color-faint)",
          opacity: 0.5,
        }}
      >
        <div
          className="motion-safe:animate-loader-scan absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--color-body-secondary) 50%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
