"use client";

import { useEffect, useState } from "react";

export function ArticleProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollHeight <= 0 ? 0 : Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      setProgress(nextProgress);
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-transparent">
      <div className="h-full bg-saffron transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}
