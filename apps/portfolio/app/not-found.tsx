import Link from "next/link"

// Only reached for requests the i18n middleware skips (e.g. unknown paths with a file extension).
// Localized 404s are handled by app/[locale]/not-found.tsx.
export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 2rem" }}>
        <h1 style={{ fontWeight: 300, fontSize: "4rem", margin: 0 }}>404</h1>
        <p>This page doesn&apos;t exist.</p>
        <Link href="/">Back to home</Link>
      </body>
    </html>
  )
}
