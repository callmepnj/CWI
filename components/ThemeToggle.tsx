"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const storageKey = "cwi-theme";

type Theme = "light" | "dark";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey) as Theme | null;
    const current = saved || (document.documentElement.classList.contains("dark") ? "dark" : "light");
    setTheme(current);
    document.documentElement.classList.toggle("dark", current === "dark");
    document.documentElement.dataset.theme = current;
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(storageKey, next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-cwi-brown/18 bg-cwi-card px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cwi-ink shadow-sm transition hover:border-cwi-saffron/55 hover:text-cwi-saffron"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {compact ? null : <span>{theme === "dark" ? "Light" : "Dark"}</span>}
    </button>
  );
}
