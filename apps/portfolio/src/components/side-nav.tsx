"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PORTFOLIO_NAV,
  getActiveNavSectionId,
} from "@/lib/portfolio-nav";

export default function SideNav() {
  const pathname = usePathname();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(getActiveNavSectionId(pathname));
  }, [pathname]);

  return (
    <motion.nav
      className={[
        "hidden lg:flex flex-col justify-end fixed left-0 top-0 h-screen w-sidenav z-50",
        // pl-8 (32px) → fib-34 (34px) nearest Fibonacci step
        "pl-fib-34",
        // py-12 (48px) → fib-55 (55px) nearest Fibonacci step
        "py-fib-55",
      ].join(" ")}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
    >
      <div className="flex-1 flex items-center">
        {/* space-y-6 (24px) → fib-21 (21px); xl/2xl bumps follow Fibonacci steps 21→34 */}
        <ul className="space-y-fib-21 xl:space-y-fib-21 2xl:space-y-fib-34">
          {PORTFOLIO_NAV.map(({ id, href, label }) => (
            <li key={id}>
              <Link
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                // gap-3 (12px) → fib-13 (13px) nearest Fibonacci step
                className={`flex items-center gap-fib-13 transition-all duration-500 group ${
                  active === id
                    ? "text-nav-active"
                    : "text-nav-inactive hover:text-nav-hover"
                }`}
              >
                <span
                  className={`h-px transition-all duration-500 ${
                    active === id
                      // w-8 (32px) → fib-34 (34px) active indicator width
                      ? "w-fib-34 bg-nav-indicator"
                      // w-4 (16px) → fib-13 (13px) hover indicator width
                      : "w-0 group-hover:w-fib-13 bg-nav-indicator-subtle"
                  }`}
                />
                <span className="font-sans text-[length:var(--text-nav-size)] tracking-[0.05em] font-normal leading-none">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}
