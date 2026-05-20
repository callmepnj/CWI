"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const primaryItems = [
  { label: "Home", href: "/" },
  { label: "Watch Desk", href: "/watch-desk" },
  { label: "Issues", href: "/issues" },
  { label: "Join", href: "/join" },
  { label: "Submit", href: "/submit" },
  { label: "Contact", href: "/contact" }
];

const moreItems = [
  { label: "Charter", href: "/charter" },
  { label: "Five-Point Agenda", href: "/five-point-agenda" },
  { label: "Youth Voice", href: "/youth-voice" },
  { label: "Media Bank", href: "/media-bank" },
  { label: "Credit Policy", href: "/credit-policy" },
  { label: "About", href: "/about" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const moreActive = moreItems.some((item) => pathname === item.href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/92 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-white shadow-[0_12px_28px_rgba(11,92,255,0.18)] ring-1 ring-line">
            <Image
              src="/brand/logo.png"
              alt="Cockroach Watch India CWI logo"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span>
            <span className="block font-display text-lg font-black uppercase leading-none tracking-tight text-ink sm:text-xl">
              Cockroach Watch
            </span>
            <span className="font-mono text-[0.62rem] font-black uppercase tracking-[0.22em] text-royal">
              India / Civic Watch
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {primaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-ink/70 transition hover:bg-skywash hover:text-royal",
                pathname === item.href && "bg-skywash text-royal"
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-ink/70 transition hover:bg-skywash hover:text-royal",
                moreActive && "bg-skywash text-royal"
              )}
              onClick={() => setMoreOpen((value) => !value)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 120)}
            >
              More <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {moreOpen ? (
              <div className="absolute right-0 top-full mt-3 w-64 rounded-3xl border border-line bg-white p-3 shadow-soft">
                {moreItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-sm font-bold text-ink/75 transition hover:bg-skywash hover:text-royal",
                      pathname === item.href && "bg-skywash text-royal"
                    )}
                    onClick={() => setMoreOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="hidden lg:block">
          <Button asChild size="sm">
            <Link href="/submit">Submit Report</Link>
          </Button>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white text-ink shadow-sm lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-white px-4 py-5 shadow-soft lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2">
            {primaryItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl bg-paper px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-ink",
                  pathname === item.href && "bg-skywash text-royal ring-1 ring-royal/15"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <p className="mt-4 px-1 font-mono text-[0.68rem] font-black uppercase tracking-[0.22em] text-ink/45">
              More
            </p>
            <div className="grid gap-1 sm:grid-cols-2">
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-bold text-ink/65 transition hover:bg-skywash hover:text-royal",
                    pathname === item.href && "bg-skywash text-royal"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
