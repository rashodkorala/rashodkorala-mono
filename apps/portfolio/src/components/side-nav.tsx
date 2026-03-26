"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Blog" },
  { id: "about", label: "About" },
];

export default function SideNav() {
  const [active, setActive] = useState("work");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="hidden lg:flex flex-col justify-center fixed left-0 top-0 h-screen w-56 pl-10">
      <ul className="space-y-6">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
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
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
