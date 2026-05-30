"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Live Newsroom", href: "/live-newsroom" },
  { label: "Unanswered Files", href: "/india-unanswered-files" },
  { label: "Archive", href: "/archive" },
  { label: "Submit", href: "/submit" },
  { label: "Support CWI", href: "/support" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-cwi-border bg-cwi-card/92 shadow-[0_10px_30px_var(--cwi-shadow-soft)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-cwi-border bg-cwi-card shadow-sm">
            <Image src="/brand/logo.png" alt="Cockroach Watch India CWI logo" width={48} height={48} className="h-full w-full object-cover" priority />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-black uppercase leading-none text-cwi-ink sm:text-xl">Cockroach Watch</span>
            <span className="font-mono text-[0.62rem] font-black uppercase tracking-[0.2em] text-cwi-saffron">India / Live Newsroom</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-cwi-ink/70 transition hover:bg-cwi-muted hover:text-cwi-saffron",
                isActive(pathname, item.href) && "bg-cwi-muted text-cwi-saffron ring-1 ring-cwi-border"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild size="sm" variant="saffron">
            <Link href="/submit">Send source or correction</Link>
          </Button>
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg border border-cwi-border bg-cwi-card text-cwi-ink shadow-sm lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-cwi-border bg-cwi-bg px-4 py-5 shadow-[0_18px_52px_var(--cwi-shadow-soft)] lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg border border-cwi-border bg-cwi-card px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-cwi-ink",
                  isActive(pathname, item.href) && "border-cwi-saffron/40 bg-cwi-saffron/10 text-cwi-saffron"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto mt-3 max-w-7xl"><ThemeToggle /></div>
        </div>
      ) : null}
    </header>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
