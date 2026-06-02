"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cockroachTakeoverConfig } from "@/lib/config/cockroach-takeover";

type SwarmPath = {
  id: number;
  side: "top" | "right" | "bottom" | "left";
  left: string;
  top: string;
  x: string[];
  y: string[];
  rotate: number[];
  scale: number[];
  opacity: number[];
  delay: number;
  duration: number;
  size: number;
  zIndex: number;
};

const intensityCount = {
  low: { desktop: 35, mobile: 15 },
  medium: { desktop: cockroachTakeoverConfig.desktopCount, mobile: cockroachTakeoverConfig.mobileCount },
  high: { desktop: 50, mobile: 25 }
};

const missingImageWarning = "Cockroach image missing at /images/cockroach-takeover/cockroach.png";

export function CockroachTakeoverButton() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageReady, setImageReady] = useState(true);

  const count = isMobile
    ? intensityCount[cockroachTakeoverConfig.intensity].mobile
    : intensityCount[cockroachTakeoverConfig.intensity].desktop;

  const swarmPaths = useMemo(() => buildSwarmPaths(count, isMobile), [count, isMobile]);
  const hiddenOnRoute = cockroachTakeoverConfig.hideOnAdmin && pathname.startsWith("/admin");

  const handleImageError = useCallback(() => {
    setImageReady(false);
    if (process.env.NODE_ENV !== "production") {
      console.warn(missingImageWarning);
    }
  }, []);

  const closeTakeover = useCallback(() => {
    setActive(false);
    setRevealed(false);
  }, []);

  const openTakeover = useCallback(() => {
    if (!cockroachTakeoverConfig.enabled || hiddenOnRoute) return;
    try {
      sessionStorage.setItem("cwi-cockroach-takeover-played", "true");
    } catch {
      // Session storage is optional; the animation never auto-runs.
    }
    setActive(true);
    setRevealed(Boolean(reducedMotion));
  }, [hiddenOnRoute, reducedMotion]);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 768);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!active) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const revealTimer = window.setTimeout(() => setRevealed(true), reducedMotion ? 80 : 5200);
    const autoCloseTimer = window.setTimeout(closeTakeover, reducedMotion ? 9000 : 9000);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTakeover();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(revealTimer);
      window.clearTimeout(autoCloseTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, closeTakeover, reducedMotion]);

  if (!cockroachTakeoverConfig.enabled || hiddenOnRoute) return null;

  return (
    <>
      <motion.button
        type="button"
        aria-label="Activate CWI cockroach animation"
        onClick={openTakeover}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-40 grid h-[54px] w-[54px] place-items-center overflow-hidden rounded-full border border-[#fbbf24]/40 bg-[#050814]/92 shadow-[0_0_28px_rgba(56,189,248,0.30),0_0_18px_rgba(251,191,36,0.26)] backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbbf24] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050814] md:h-16 md:w-16"
        whileHover={{ y: -4, scale: 1.04 }}
        whileTap={{ scale: 0.92 }}
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(251,191,36,0.24),transparent_36%),radial-gradient(circle_at_70%_75%,rgba(56,189,248,0.26),transparent_42%)]" />
        <motion.span
          aria-hidden="true"
          className="absolute inset-[-3px] rounded-full border border-[#fbbf24]/35"
          animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {imageReady ? (
          <Image
            src={cockroachTakeoverConfig.logoPath}
            alt=""
            width={58}
            height={58}
            className="relative z-10 h-12 w-12 object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.62)] md:h-14 md:w-14"
            onError={handleImageError}
            priority={false}
          />
        ) : (
          <span className="relative z-10 font-display text-sm font-black text-[#fbbf24]">CWI</span>
        )}
      </motion.button>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-[90] h-[100vh] w-[100vw] overflow-hidden bg-[#050814]/94 text-[#ffffff] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={() => {
              if (revealed) closeTakeover();
            }}
            role="dialog"
            aria-modal="true"
            aria-label="CWI cockroach takeover animation"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_80%,rgba(251,191,36,0.18),transparent_34%),radial-gradient(circle_at_78%_22%,rgba(56,189,248,0.18),transparent_36%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#fbbf24]/70 to-transparent" />

            <button
              type="button"
              aria-label="Close CWI cockroach animation"
              onClick={closeTakeover}
              className="absolute right-4 top-4 z-[96] grid h-11 w-11 place-items-center rounded-full border border-[#38bdf8]/35 bg-[#07111f]/90 text-[#ffffff] shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition hover:border-[#fbbf24]/80 hover:text-[#fbbf24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbbf24]"
            >
              <X className="h-5 w-5" />
            </button>

            {!reducedMotion ? (
              <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
                {swarmPaths.map((path) => (
                  <motion.span
                    key={path.id}
                    className="absolute block"
                    initial={{ x: "0vw", y: "0vh", rotate: path.rotate[0], scale: path.scale[0], opacity: 0 }}
                    animate={{ x: path.x, y: path.y, rotate: path.rotate, scale: path.scale, opacity: path.opacity }}
                    transition={{ duration: path.duration, delay: path.delay, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      left: path.left,
                      top: path.top,
                      width: path.size,
                      height: path.size,
                      zIndex: path.zIndex,
                      filter: "drop-shadow(0 14px 14px rgba(0,0,0,0.55)) blur(0.15px)",
                      willChange: "transform, opacity"
                    }}
                  >
                    {imageReady ? (
                      <Image
                        src={cockroachTakeoverConfig.logoPath}
                        alt=""
                        width={64}
                        height={64}
                        className="h-full w-full object-contain"
                        onError={handleImageError}
                      />
                    ) : (
                      <span className="block h-full w-full rounded-full border border-[#fbbf24]/70 bg-[#fbbf24]/65" />
                    )}
                  </motion.span>
                ))}
              </div>
            ) : null}

            <AnimatePresence>
              {revealed ? (
                <motion.div
                  className="absolute inset-0 z-[94] grid place-items-center px-4"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <motion.div
                    className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[rgba(56,189,248,0.45)] bg-[rgba(8,15,30,0.96)] p-6 text-center text-[#ffffff] shadow-[0_0_90px_rgba(56,189,248,0.30),0_0_54px_rgba(251,191,36,0.18)] backdrop-blur-2xl sm:p-10"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(251,191,36,0.18),transparent_28%),radial-gradient(circle_at_80%_90%,rgba(56,189,248,0.20),transparent_32%)]" />
                    <div className="relative">
                      <p className="font-mono text-xs font-black uppercase tracking-[0.32em] text-[#fbbf24]">Cockroach Watch India</p>
                      <h2 className="mt-4 font-display text-7xl font-black leading-none tracking-normal text-[#ffffff] sm:text-8xl">CWI</h2>
                      <p className="mt-4 text-xl font-black uppercase tracking-[0.16em] text-[#38bdf8]">Document. Verify. Amplify.</p>
                      <p className="mx-auto mt-3 max-w-xl text-base font-semibold leading-7 text-[#d1d5db] sm:text-lg">
                        The youth are not silent. India is watching.
                      </p>
                      {cockroachTakeoverConfig.showFinalCTA ? (
                        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                          <TakeoverLink href="/live-newsroom">Enter Live Newsroom</TakeoverLink>
                          <TakeoverLink href="/submit" secondary>Submit Report</TakeoverLink>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function TakeoverLink({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return (
    <Link
      href={href}
      className={
        secondary
          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#fbbf24]/70 bg-[#fbbf24]/10 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#fbbf24] transition hover:bg-[#fbbf24] hover:text-[#050814] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbbf24]"
          : "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#38bdf8] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#050814] shadow-[0_0_24px_rgba(56,189,248,0.35)] transition hover:bg-[#7dd3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbbf24]"
      }
    >
      {children} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function buildSwarmPaths(count: number, mobile: boolean): SwarmPath[] {
  const sides: SwarmPath["side"][] = ["left", "right", "bottom", "top"];
  const centerOffsets = buildCwiFormation(count, mobile);

  return Array.from({ length: count }, (_, index) => {
    const side = sides[index % sides.length];
    const seed = seeded(index + (mobile ? 200 : 0));
    const next = () => seed.next().value as number;
    const start = startPointForSide(side, next);
    const midA = { x: -36 + next() * 72, y: -34 + next() * 68 };
    const midB = { x: -44 + next() * 88, y: -38 + next() * 76 };
    const formation = centerOffsets[index];
    const drift = { x: -10 + next() * 20, y: -8 + next() * 16 };
    const size = Math.round((mobile ? 34 : 42) + next() * (mobile ? 18 : 26));
    const delay = 0.2 + index * (mobile ? 0.105 : 0.072);

    return {
      id: index,
      side,
      left: `${start.left}vw`,
      top: `${start.top}vh`,
      x: ["0vw", `${midA.x}vw`, `${midB.x}vw`, `${formation.x + drift.x}vw`, `${formation.x}vw`],
      y: ["0vh", `${midA.y}vh`, `${midB.y}vh`, `${formation.y + drift.y}vh`, `${formation.y}vh`],
      rotate: [start.rotate, start.rotate + 80 + next() * 180, start.rotate - 160 - next() * 130, start.rotate + 360 + next() * 220, start.rotate + (index % 2 ? 8 : -8)],
      scale: [0.38, 0.78 + next() * 0.5, 0.62 + next() * 0.36, 0.52, 0.28 + next() * 0.1],
      opacity: [0, 0.82 + next() * 0.16, 0.6 + next() * 0.24, 0.34, 0.13],
      delay,
      duration: 4.55 + next() * 0.65,
      size,
      zIndex: index % 5 === 0 ? 95 : index % 3 === 0 ? 93 : 82
    };
  });
}

function startPointForSide(side: SwarmPath["side"], next: () => number) {
  if (side === "left") return { left: -12, top: next() * 100, rotate: 82 + next() * 28 };
  if (side === "right") return { left: 106, top: next() * 100, rotate: -96 - next() * 28 };
  if (side === "top") return { left: next() * 100, top: -14, rotate: 165 + next() * 50 };
  return { left: next() * 100, top: 106, rotate: -10 + next() * 60 };
}

function buildCwiFormation(count: number, mobile: boolean) {
  const width = mobile ? 34 : 42;
  const height = mobile ? 16 : 18;
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / 11);
    const col = index % 11;
    const letterBand = col < 4 ? -width / 3 : col < 7 ? 0 : width / 3;
    const x = letterBand + ((col % 4) - 1.5) * (mobile ? 1.7 : 2.3);
    const y = -height / 2 + row * (mobile ? 4.4 : 4.8);
    return { x, y };
  });
}

function* seeded(seedValue: number) {
  let value = seedValue || 1;
  while (true) {
    value = (value * 9301 + 49297) % 233280;
    yield value / 233280;
  }
}
