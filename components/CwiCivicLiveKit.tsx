"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  CircleUserRound,
  Mail,
  MapPin,
  MessageSquareText,
  Radio,
  ShieldCheck
} from "lucide-react";

const newsroomJoiners = [
  "Arjun K. from Delhi joined 4 min ago",
  "Sneha R. from Pune joined 11 min ago",
  "Mihir V. from Ahmedabad joined 23 min ago",
  "Priya M. from Chennai joined 31 min ago",
  "Rohan D. from Kolkata joined 45 min ago",
  "Simran K. from Amritsar joined 1 hr ago",
  "Vikram S. from Hyderabad joined 2 hr ago"
];

const supportJoiners = [
  "Priya M. from Chennai joined",
  "Rohan D. from Kolkata joined",
  "Simran K. from Amritsar joined",
  "Aditi N. from Lucknow joined",
  "Kabir S. from Mumbai joined",
  "Tanvi R. from Jaipur joined",
  "Nikhil M. from Guwahati joined"
];

const avatarThemes = [
  "bg-[var(--cwi-accent-blue)]",
  "bg-violet-500",
  "bg-[var(--cwi-alert-red)]",
  "bg-[var(--cwi-success-green)]",
  "bg-[var(--cwi-accent-amber)]",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-emerald-500",
  "bg-indigo-500"
];

export function CwiTicker({ items, tone = "news" }: { items: string[]; tone?: "news" | "refusal" }) {
  const fullText = useMemo(() => [...items, ...items].join("   *   "), [items]);

  return (
    <div className={`cwi-ticker-wrap ${tone === "refusal" ? "cwi-ticker-refusal" : ""}`}>
      <span className="cwi-live-dot" aria-hidden="true" />
      <div className="cwi-ticker-track">
        <div className="cwi-ticker-inner">{fullText}</div>
      </div>
    </div>
  );
}

export function CwiJoinButton({
  children = "JOIN THE WATCH",
  className = "",
  type = "button",
  onClick
}: {
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button type={type} className={`cwi-join-btn ${className}`} onClick={onClick}>
      {children} <span aria-hidden="true">-&gt;</span>
    </button>
  );
}

export function CwiGestureBar({
  count,
  text,
  support = false
}: {
  count: string;
  text: string;
  support?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const joiners = support ? supportJoiners : newsroomJoiners;
  const initials = support ? ["AK", "SR", "PM", "RN", "VK", "TS", "DS", "NM"] : ["AK", "SR", "PM", "NV", "DS", "RK", "VT", "MS"];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => value + 1), 3500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="cwi-gesture-bar">
      <div className="cwi-avatars" aria-hidden="true">
        {initials.map((initial, avatarIndex) => (
          <span key={initial} className={`cwi-avatar ${avatarThemes[avatarIndex % avatarThemes.length]}`}>
            {initial}
          </span>
        ))}
      </div>
      <div className="cwi-gesture-text">
        <div>
          <span className="cwi-count">{count}</span> {text}
        </div>
        <div className="cwi-typewriter">{joiners[index % joiners.length]}</div>
      </div>
      <CwiJoinButton className="w-full sm:w-auto">JOIN NOW</CwiJoinButton>
    </div>
  );
}

export function NewsroomJoinForm() {
  const [success, setSuccess] = useState(false);

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 4200);
  }

  return (
    <form onSubmit={submitForm} className="cwi-declaration-form">
      {success ? <BurstOverlay message={"You're in. The Watch never sleeps."} mode="confetti" /> : null}
      <FormField icon={<CircleUserRound />} label="Your Name" placeholder="What do we call you?" />
      <FormField icon={<Mail />} label="Email" placeholder="Where do we reach you?" type="email" />
      <FormField icon={<MapPin />} label="City / State" placeholder="Where are you watching from?" />
      <label className="cwi-field cwi-field-select">
        <span>Why are you joining?</span>
        <ChevronDown className="cwi-field-icon" aria-hidden="true" />
        <select required defaultValue="">
          <option value="" disabled>Choose your reason</option>
          <option>I&apos;m a student tired of corrupt systems</option>
          <option>I care about accountability in India</option>
          <option>I want to submit reports and leads</option>
          <option>I support independent civic media</option>
          <option>I just want to stay informed</option>
          <option>I want to volunteer for CWI</option>
        </select>
      </label>
      <label className="cwi-field md:col-span-2">
        <span>What issue concerns you most?</span>
        <MessageSquareText className="cwi-field-icon" aria-hidden="true" />
        <textarea placeholder={"Tell us what's keeping you up at night. We're listening."} />
      </label>
      <CwiJoinButton type="submit" className="md:col-span-2 w-full">JOIN THE WATCH</CwiJoinButton>
    </form>
  );
}

export function SupportDeclarationForm() {
  const [success, setSuccess] = useState(false);

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 4200);
  }

  return (
    <form onSubmit={submitForm} className="cwi-declaration-form">
      {success ? <BurstOverlay message={"You're part of the Watch now. India is watching - and so are you."} mode="roach" /> : null}
      <FormField icon={<CircleUserRound />} label="Your Name" placeholder="Your name here" />
      <FormField icon={<Mail />} label="Email" placeholder="Your email address" type="email" />
      <FormField icon={<MapPin />} label="City" placeholder="Where are you watching from?" />
      <fieldset className="cwi-radio-group md:col-span-2">
        <legend>How do you want to support CWI?</legend>
        {["Financial contribution", "Volunteer as a writer or researcher", "Submit tip-offs and leads", "Amplify CWI on social media", "Just stay connected and informed"].map((option) => (
          <label key={option}>
            <input type="radio" name="support" required />
            <Radio aria-hidden="true" />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <label className="cwi-field md:col-span-2">
        <span>Message</span>
        <MessageSquareText className="cwi-field-icon" aria-hidden="true" />
        <textarea placeholder="Anything you want to tell the CWI team?" />
      </label>
      <CwiJoinButton type="submit" className="md:col-span-2 w-full">JOIN THE WATCH</CwiJoinButton>
      <p className="md:col-span-2 text-xs leading-5 text-[var(--cwi-text-secondary)]">
        CWI does not share your data with third parties. We do not send spam. By joining you agree to receive occasional CWI updates. You can unsubscribe anytime.
      </p>
    </form>
  );
}

function FormField({ icon, label, placeholder, type = "text" }: { icon: React.ReactNode; label: string; placeholder: string; type?: string }) {
  return (
    <label className="cwi-field">
      <span>{label}</span>
      <span className="cwi-field-icon" aria-hidden="true">{icon}</span>
      <input type={type} placeholder={placeholder} required />
    </label>
  );
}

function BurstOverlay({ message, mode }: { message: string; mode: "confetti" | "roach" }) {
  const particles = mode === "roach" ? ["🪳", "🪳", "🪳", "🪳", "🪳", "🪳", "🪳", "🪳"] : ["*", "+", "*", "+", "*", "+", "*", "+"];

  return (
    <div className="cwi-success-flash" role="status" aria-live="polite">
      <ShieldCheck className="h-10 w-10 text-[var(--cwi-success-green)]" aria-hidden="true" />
      <p>{message}</p>
      <div className="cwi-burst" aria-hidden="true">
        {particles.map((particle, index) => <span key={`${particle}-${index}`}>{particle}</span>)}
      </div>
    </div>
  );
}


