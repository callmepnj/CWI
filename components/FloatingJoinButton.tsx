"use client";

import type React from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  ExternalLink,
  Globe2,
  HeartHandshake,
  Mail,
  Megaphone,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { joinConfig } from "@/lib/config/join";
import { cn } from "@/lib/utils";

type JoinSide = "left" | "right";

const storageKey = "cwi-floating-join-side";

export function FloatingJoinButton() {
  const [side, setSide] = useState<JoinSide>(joinConfig.defaultPosition);
  const [open, setOpen] = useState(false);
  const [dragX, setDragX] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const startRef = useRef({ x: 0, y: 0, moved: false });

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "left" || stored === "right") {
      setSide(stored);
    }

    function openJoin() {
      setOpen(true);
    }

    window.addEventListener("cwi:open-join", openJoin);
    return () => window.removeEventListener("cwi:open-join", openJoin);
  }, []);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (!joinConfig.enabled) return null;

  function startDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    startRef.current = { x: event.clientX, y: event.clientY, moved: false };
    setDragX(rect.left);
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging || dragX === null) return;

    const start = startRef.current;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      start.moved = true;
    }

    const width = buttonRef.current?.offsetWidth ?? 160;
    const margin = window.innerWidth < 640 ? 12 : 24;
    const next = Math.min(window.innerWidth - width - margin, Math.max(margin, dragX + deltaX));
    setDragX(next);
    startRef.current = { ...start, x: event.clientX, y: event.clientY };
  }

  function endDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nextSide: JoinSide = rect.left + rect.width / 2 < window.innerWidth / 2 ? "left" : "right";
    setSide(nextSide);
    window.localStorage.setItem(storageKey, nextSide);
    setDragging(false);
    setDragX(null);
  }

  function handleClick() {
    if (startRef.current.moved) {
      startRef.current.moved = false;
      return;
    }
    setOpen(true);
  }

  const sideClass = side === "left" ? "left-3 sm:left-6" : "right-3 sm:right-6";

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        aria-label="Join the Watch"
        className={cn(
          "cwi-floating-join fixed bottom-4 inline-flex min-h-14 touch-none select-none items-center gap-3 rounded-full px-4 py-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-amber-300 sm:bottom-6 sm:px-5",
          dragging ? "" : sideClass
        )}
        style={dragX !== null ? { left: dragX, right: "auto" } : undefined}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={handleClick}
      >
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/18 text-amber-200 ring-1 ring-blue-300/25">
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="grid leading-tight">
          <span className="text-sm font-black uppercase tracking-[0.12em]">{joinConfig.buttonLabel}</span>
          <span className="hidden text-[0.68rem] font-bold uppercase tracking-[0.14em] text-blue-100/75 sm:block">
            The Watch is live
          </span>
        </span>
        <ArrowRight className="h-4 w-4 text-amber-200" />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="cwi-join-modal-layer fixed inset-0 grid place-items-end bg-[#020817]/72 px-3 py-3 backdrop-blur-md sm:place-items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-watch-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              className="cwi-join-modal-card max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-blue-300/18 bg-[#071426]/96 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.22 }}
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#071426]/92 p-4 backdrop-blur sm:p-6">
                <div>
                  <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-amber-300">Cockroach Watch India</p>
                  <h2 id="join-watch-title" className="mt-2 font-display text-3xl font-black uppercase leading-tight sm:text-4xl">
                    {joinConfig.modalTitle}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-blue-100/76">{joinConfig.subtitle}</p>
                </div>
                <button
                  type="button"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/14"
                  aria-label="Close Join the Watch"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[0.9fr_1.1fr]">
                <section className="rounded-xl border border-blue-300/16 bg-white/[0.06] p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="h-5 w-5 text-amber-300" />
                    <h3 className="font-display text-xl font-black uppercase">Support CWI</h3>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-blue-100/74">{joinConfig.supportText}</p>

                  <div className="mt-5 rounded-xl border border-amber-300/20 bg-white p-4 text-center text-[#071426]">
                    <p className="font-mono text-xs font-black uppercase tracking-[0.16em] text-blue-700">{joinConfig.qrLabel}</p>
                    {qrFailed ? (
                      <div className="mt-4 grid aspect-square place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-bold text-slate-600">
                        QR code will appear here once added.
                      </div>
                    ) : (
                      <Image
                        src={joinConfig.qrPath}
                        alt="Scan to support Cockroach Watch India"
                        width={320}
                        height={320}
                        className="mx-auto mt-4 aspect-square w-full max-w-[260px] rounded-lg object-contain"
                        onError={() => setQrFailed(true)}
                      />
                    )}
                    {!qrFailed ? (
                      <a
                        href={joinConfig.qrPath}
                        download
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 px-4 py-2 text-sm font-black text-blue-700 transition hover:bg-blue-50"
                      >
                        <Download className="h-4 w-4" /> Download QR
                      </a>
                    ) : null}
                  </div>
                </section>

                <div className="grid gap-4">
                  <section className="rounded-xl border border-blue-300/16 bg-white/[0.06] p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <Megaphone className="h-5 w-5 text-blue-300" />
                      <h3 className="font-display text-xl font-black uppercase">Join Community</h3>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {joinConfig.socialLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                          className="inline-flex min-h-11 items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.07] px-3 py-2 text-sm font-black text-white transition hover:border-amber-300/35 hover:bg-white/[0.1]"
                        >
                          {link.label}
                          <ExternalLink className="h-4 w-4 text-amber-200" />
                        </a>
                      ))}
                    </div>
                    <a
                      href={`mailto:${joinConfig.supportEmail}`}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-100/78 hover:text-amber-200"
                    >
                      <Mail className="h-4 w-4" /> {joinConfig.supportEmail}
                    </a>
                  </section>

                  <section className="rounded-xl border border-blue-300/16 bg-white/[0.06] p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <Globe2 className="h-5 w-5 text-amber-300" />
                      <h3 className="font-display text-xl font-black uppercase">Why Join?</h3>
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-6 text-blue-100/74">{joinConfig.whyJoin}</p>
                  </section>

                  <section className="rounded-xl border border-amber-300/18 bg-amber-300/[0.08] p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-amber-200" />
                      <h3 className="font-display text-xl font-black uppercase">Safety Note</h3>
                    </div>
                    <p className="mt-3 text-sm font-semibold leading-6 text-amber-50/80">{joinConfig.safetyNote}</p>
                  </section>
                </div>
              </div>

              <div className="grid gap-2 border-t border-white/10 p-4 sm:grid-cols-4 sm:p-6">
                <ModalCta href={joinConfig.submitLink}>Submit a Report</ModalCta>
                <ModalCta href={joinConfig.liveNewsroomLink}>Open Live Newsroom</ModalCta>
                <ModalCta href="/support">Support CWI</ModalCta>
                <ModalCta href={joinConfig.socialLinks[1]?.href ?? joinConfig.websiteLink}>Follow CWI</ModalCta>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function ModalCta({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-center text-sm font-black text-white shadow-[0_0_20px_rgba(59,130,246,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-400"
    >
      {children}
    </a>
  );
}


