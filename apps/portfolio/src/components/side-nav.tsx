"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const sections = [
  { id: "about", label: "About", href: "/about" },
  { id: "work", label: "Work", href: "/work" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "footer", label: "Contact", href: "mailto:hello@rashodkorala.com" },
];

export default function SideNav() {
  const pathname = usePathname();
  const [active, setActive] = useState("");

  useEffect(() => {
    const match = sections.find((s) => pathname.startsWith(s.href) && s.href !== "mailto:hello@rashodkorala.com");
    if (match) {
      setActive(match.id);
    } else if (pathname === "/") {
      setActive("about");
    }
  }, [pathname]);

  return (
    <nav className="hidden lg:flex flex-col justify-center fixed left-0 top-0 h-screen w-56 pl-10 z-50">
      <ul className="space-y-6">
        {sections.map(({ id, label, href }) => (
          <li key={id}>
            <Link
              href={href}
              className={`flex items-center gap-3 text-left transition-colors duration-200 ${
                active === id
                  ? "text-white"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {active === id && (
                <span className="w-6 h-px bg-white inline-block" />
              )}
              <span className="text-[15px] font-light">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
