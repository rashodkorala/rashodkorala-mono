export type PortfolioNavItem = {
  id: string;
  label: string;
  href: string;
};

export const PORTFOLIO_NAV: readonly PortfolioNavItem[] = [
  { id: "about", label: "About", href: "/" },
  { id: "work", label: "Work", href: "/work" },
  {
    id: "photography",
    label: "Photography",
    href: "https://photos.rashodkorala.com",
  },
  { id: "contact", label: "Contact", href: "/contact" },
  { id: "cv",      label: "CV",      href: "/cv" },
] as const;

export function getActiveNavSectionId(pathname: string): string {
  if (pathname === "/") return "about";
  if (pathname.startsWith("/work") || pathname.startsWith("/projects")) {
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
