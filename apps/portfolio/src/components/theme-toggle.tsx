"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem("portfolio-theme");
  if (saved === "light" || saved === "dark") return saved;
  return "dark";
}

function applyTheme(theme: Theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
}

function getThemeFromDom(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);
  /** Lucide SVGs can differ SSR vs client (e.g. aria-hidden); skip icons until mounted. */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    /* Prefer localStorage so a saved light choice wins over the default `dark` class on <html>. */
    const initial = resolveInitialTheme();
    setTheme(initial);
    applyTheme(initial);
    setReady(true);
    setMounted(true);
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ctrl-border bg-ctrl text-ctrl-text backdrop-blur transition hover:bg-ctrl-hover"
    >
      {mounted ? (
        theme === "dark" ? (
          <Sun className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
        ) : (
          <Moon className="h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden />
        )
      ) : (
        <span className="block h-4 w-4 shrink-0" aria-hidden />
      )}
    </button>
  );
}
