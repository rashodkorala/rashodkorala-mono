"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("portfolio-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark", isDark);
  document.documentElement.dataset.theme = theme;
}

function getThemeFromDom(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = getThemeFromDom() === "dark" ? "dark" : resolveInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "portfolio-theme") return;
      const next = event.newValue === "dark" ? "dark" : "light";
      setTheme(next);
      applyTheme(next);
    };

    const onThemeChanged = () => {
      const current = getThemeFromDom();
      setTheme(current);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("portfolio-theme-change", onThemeChanged as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("portfolio-theme-change", onThemeChanged as EventListener);
    };
  }, []);

  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  const toggleTheme = () => {
    const next = nextTheme;
    setTheme(next);
    applyTheme(next);
    window.localStorage.setItem("portfolio-theme", next);
    window.dispatchEvent(new Event("portfolio-theme-change"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ready ? `Switch to ${nextTheme} theme` : "Toggle theme"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 bg-cream/80 text-ink/70 backdrop-blur transition hover:bg-cream dark:border-[#2f2c2a] dark:bg-[#151311] dark:text-[#d0cbc5] dark:hover:bg-[#1a1817]"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" strokeWidth={1.8} /> : <Moon className="h-4 w-4" strokeWidth={1.8} />}
    </button>
  );
}
