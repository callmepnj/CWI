import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--cwi-bg)",
        ink: "var(--cwi-text-primary)",
        soot: "var(--cwi-night)",
        saffron: "var(--cwi-accent-amber)",
        leaf: "var(--cwi-accent-blue)",
        clay: "var(--cwi-text-secondary)",
        urgent: "var(--cwi-alert-red)",
        royal: "var(--cwi-accent-blue)",
        skywash: "var(--cwi-bg-secondary)",
        line: "var(--cwi-border)",
        "cwi-cream": "var(--cwi-bg)",
        "cwi-ink": "var(--cwi-text-primary)",
        "cwi-green": "var(--cwi-accent-blue)",
        "cwi-saffron": "var(--cwi-accent-amber)",
        "cwi-brown": "var(--cwi-text-secondary)",
        "cwi-muted": "var(--cwi-bg-secondary)",
        "cwi-border": "var(--cwi-border)",
        "cwi-card": "var(--cwi-card)"
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      boxShadow: {
        hard: "0 20px 50px var(--cwi-shadow-strong)",
        soft: "0 18px 60px var(--cwi-shadow-soft)",
        card: "0 14px 36px var(--cwi-shadow-soft)"
      },
      backgroundImage: {
        "paper-grain": "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--cwi-text-secondary) 10%, transparent) 1px, transparent 0)"
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        stamp: {
          "0%": { transform: "rotate(-2deg) scale(0.96)", opacity: "0" },
          "100%": { transform: "rotate(-2deg) scale(1)", opacity: "1" }
        }
      },
      animation: {
        ticker: "ticker 24s linear infinite",
        stamp: "stamp 700ms ease-out both"
      }
    }
  },
  plugins: []
};

export default config;
