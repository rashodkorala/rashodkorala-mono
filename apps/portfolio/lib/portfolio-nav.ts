/** `id` doubles as the translation key in the `Nav` namespace (messages/*.json). */
export type PortfolioNavItem = {
  id: "about" | "work" | "photography" | "contact" | "cv";
  href: string;
};

export const PORTFOLIO_NAV: readonly PortfolioNavItem[] = [
  { id: "about", href: "/" },
  { id: "work", href: "/work" },
  { id: "photography", href: "https://photos.rashodkorala.com" },
  { id: "contact", href: "/contact" },
  { id: "cv", href: "/cv" },
] as const;

/** `pathname` must be locale-free (next-intl's `usePathname` from `@/i18n/navigation`). */
export function getActiveNavSectionId(pathname: string): string {
  if (pathname === "/") return "about";
  if (pathname.startsWith("/work") || pathname.startsWith("/projects") || pathname.startsWith("/apps")) {
    return "work";
  }
  if (pathname.startsWith("/cv")) return "cv";
  const match = PORTFOLIO_NAV.find(
    (s) =>
      !s.href.startsWith("http") &&
      s.href !== "/" &&
      pathname.startsWith(s.href)
  );
  return match?.id ?? "";
}
