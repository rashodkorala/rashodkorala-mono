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
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        display: ["'Times New Roman'", "Times", "serif"],
        reading: ["'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        display: "var(--text-display)",
        prose: "var(--text-body-size)",
      },
      spacing: {
        sidenav: "var(--sidenav-w)",
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
