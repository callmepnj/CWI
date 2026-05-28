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
        paper: "#F8FAFC",
        ink: "#0B1220",
        soot: "#050A14",
        saffron: "#FFD23F",
        leaf: "#00C2A8",
        clay: "#155EEF",
        urgent: "#FF6B35",
        royal: "#0B5CFF",
        skywash: "#EAF2FF",
        line: "#DCE5F2",
        // CWI Newsroom Colors
        "cwi-cream": "#FDF8F3",
        "cwi-ink": "#1A1410",
        "cwi-green": "#1B5E20",
        "cwi-saffron": "#F57C00",
        "cwi-brown": "#5D4037",
        "cwi-muted": "#E8DCC8",
        "cwi-border": "#D7CCC8"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      boxShadow: {
        hard: "0 20px 50px rgba(11, 18, 32, 0.16)",
        soft: "0 18px 60px rgba(11, 18, 32, 0.10)",
        card: "0 14px 36px rgba(11, 18, 32, 0.08)"
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 1px 1px, rgba(11,92,255,0.05) 1px, transparent 0)"
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
