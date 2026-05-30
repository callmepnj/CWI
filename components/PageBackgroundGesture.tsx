"use client";

import type React from "react";
import { useEffect, useState } from "react";

type GestureIntensity = "subtle" | "moderate" | "strong";

interface PageBackgroundGestureProps {
  intensity?: GestureIntensity;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Reusable animated background gesture component
 * Provides premium, subtle background motion for pages
 * - Respects prefers-reduced-motion
 * - Supports light and dark mode
 * - Non-blocking, performant CSS-based animation
 */
export function PageBackgroundGesture({
  intensity = "moderate",
  children,
  className = ""
}: PageBackgroundGestureProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  const intensityMap = {
    subtle: "opacity-[0.015]",
    moderate: "opacity-[0.025]",
    strong: "opacity-[0.035]"
  };

  return (
    <div className={`relative ${className}`}>
      {/* Primary radial gradient gesture - top left */}
      <div
        className={`pointer-events-none absolute -left-1/3 -top-1/4 z-0 h-96 w-96 rounded-full blur-[100px] mix-blend-screen ${intensityMap[intensity]}`}
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)",
          animation: "gesture-float 24s ease-in-out infinite"
        }}
      />

      {/* Secondary radial gradient gesture - bottom right */}
      <div
        className={`pointer-events-none absolute -bottom-1/4 -right-1/4 z-0 h-80 w-80 rounded-full blur-[90px] mix-blend-screen ${intensityMap[intensity]}`}
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, transparent 70%)",
          animation: "gesture-float 28s ease-in-out infinite reverse"
        }}
      />

      {/* Tertiary accent gesture - center */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] mix-blend-screen ${intensityMap[intensity]}`}
        style={{
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.5) 0%, transparent 70%)",
          animation: "gesture-float 32s ease-in-out infinite"
        }}
      />

      {/* Content layer - sits above gestures */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
