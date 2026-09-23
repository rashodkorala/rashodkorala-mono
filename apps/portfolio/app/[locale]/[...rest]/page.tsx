import { notFound } from "next/navigation"

// Catch-all so unknown paths render the localized app/[locale]/not-found.tsx.
export default function CatchAllPage() {
  notFound()
}
