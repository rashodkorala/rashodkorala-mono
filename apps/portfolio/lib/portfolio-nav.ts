export type PortfolioNavItem = {
  id: string;
  label: string;
  href: string;
};

export const PORTFOLIO_NAV: readonly PortfolioNavItem[] = [
  { id: "about", label: "About", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "satahan", label: "Satahan", href: "/satahan" },
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
  if (pathname.startsWith("/projects") || pathname.startsWith("/apps")) return "projects";
  if (pathname.startsWith("/satahan")) return "satahan";
  if (pathname.startsWith("/cv")) return "cv";
  const match = PORTFOLIO_NAV.find(
    (s) =>
      !s.href.startsWith("http") &&
      s.href !== "/" &&
      pathname.startsWith(s.href)
  );
  return match?.id ?? "";
}
