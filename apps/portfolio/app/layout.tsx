import type { ReactNode } from "react"

// The real <html>/<body> shell lives in app/[locale]/layout.tsx so `lang` can follow the locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
