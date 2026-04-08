/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-jakarta)", "system-ui", "sans-serif"],
        body:    ["var(--font-jakarta)", "system-ui", "sans-serif"],
        reading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        serif:   ["var(--font-cormorant)", "Georgia", "serif"],
      },
      fontSize: {
        display: "var(--text-display)",
        prose: "var(--text-body-size)",
        h1: "var(--text-h1)",
        h2: "var(--text-h2)",
        h3: "var(--text-h3)",
        lead: "var(--text-lead)",
        caption: "var(--text-caption)",
        label: "var(--text-label)",
        nav: "var(--text-nav-size)",
      },
      lineHeight: {
        tight: "var(--leading-tight)",
        display: "var(--leading-display)",
        heading: "var(--leading-heading)",
        sub: "var(--leading-sub)",
        body: "var(--leading-body)",
        ui: "var(--leading-ui)",
      },
      letterSpacing: {
        display: "var(--tracking-display)",
        h1: "var(--tracking-h1)",
        h2: "var(--tracking-h2)",
        body: "var(--tracking-body)",
        ui: "var(--tracking-ui)",
        caps: "var(--tracking-caps)",
      },
      spacing: {
        // ── Structural layout tokens (consume CSS vars, unchanged names) ──────
        sidenav: "var(--sidenav-w)",
        header: "var(--header-h)",
        "header-lg": "var(--header-h-lg)",
        "page-px": "var(--page-px)",
        "page-px-sm": "var(--page-px-sm)",
        "page-px-md": "var(--page-px-md)",
        "page-px-lg": "var(--page-px-lg)",
        "page-px-xl": "var(--page-px-xl)",
        "content-py": "var(--content-py)",
        "content-py-md": "var(--content-py-md)",
        // ── Fibonacci scale tokens — use as `p-fib-21`, `gap-fib-34`, etc. ───
        // Sequence: 8 → 13 → 21 → 34 → 55 → 89 → 144 (each step × φ ≈ 1.618)
        "fib-8":   "var(--fib-8)",    //  8px — hairline
        "fib-13":  "var(--fib-13)",   // 13px — tight
        "fib-21":  "var(--fib-21)",   // 21px — base
        "fib-34":  "var(--fib-34)",   // 34px — comfortable
        "fib-55":  "var(--fib-55)",   // 55px — section
        "fib-89":  "var(--fib-89)",   // 89px — generous
        "fib-144": "var(--fib-144)",  // 144px — structural
      },
      maxWidth: {
        // Content cap for ultrawide screens — 89rem = 1424px (fib-89 × 16)
        content: "var(--content-max-w)",
        // Comfortable reading measure for prose / long-form body copy
        reading: "var(--measure-reading)",
      },
      colors: {
        cream: "#e9e6e0",
        ink: "#2b2b2b",
        muted_ink: "#6b6560",
        systemGray: "#8E8E93",

        page: "var(--color-page)",
        surface: {
          DEFAULT: "var(--color-surface)",
          raised: "var(--color-surface-raised)",
          elevated: "var(--color-surface-elevated)",
          overlay: "var(--color-surface-overlay)",
          "overlay-strong": "var(--color-surface-overlay-strong)",
        },
        heading: "var(--color-heading)",
        title: "var(--color-title)",
        body: {
          DEFAULT: "var(--color-body)",
          secondary: "var(--color-body-secondary)",
          tertiary: "var(--color-body-tertiary)",
        },
        caption: "var(--color-caption)",
        label: "var(--color-label)",
        faint: "var(--color-faint)",
        inverse: "var(--color-inverse)",
        nav: {
          active: "var(--color-nav-active)",
          inactive: "var(--color-nav-inactive)",
          hover: "var(--color-nav-hover)",
          indicator: "var(--color-nav-indicator)",
          "indicator-subtle": "var(--color-nav-indicator-subtle)",
        },
        link: {
          DEFAULT: "var(--color-link)",
          hover: "var(--color-link-hover)",
          underline: "var(--color-link-underline)",
        },
        icon: {
          DEFAULT: "var(--color-icon)",
          hover: "var(--color-icon-hover)",
        },
        line: {
          DEFAULT: "var(--color-border)",
          subtle: "var(--color-border-subtle)",
          strong: "var(--color-border-strong)",
          hover: "var(--color-border-hover)",
        },
        ctrl: {
          DEFAULT: "var(--color-ctrl-bg)",
          text: "var(--color-ctrl-text)",
          hover: "var(--color-ctrl-hover)",
          border: "var(--color-ctrl-border)",
        },
        "doc-bg": "var(--color-doc-bg)",

        background: "var(--color-page)",
        foreground: "var(--color-body)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwindcss-animate")],
};
