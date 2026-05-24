/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import type { UnansweredFile } from "@/data/unanswered-files";
import { getFileVisual } from "@/data/unanswered-files";
import { cn } from "@/lib/utils";

type UnansweredFileVisualProps = {
  file: UnansweredFile;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  showCaption?: boolean;
};

export function UnansweredFileVisual({
  file,
  priority = false,
  className,
  imageClassName,
  showCaption = false
}: UnansweredFileVisualProps) {
  const visual = getFileVisual(file);

  return (
    <figure className={cn("overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink shadow-card", className)}>
      <div className="relative aspect-[16/10] overflow-hidden">
        {visual.isPhoto ? (
          <Image
            src={visual.src}
            alt={visual.alt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={cn("object-cover", imageClassName)}
          />
        ) : (
          <img
            src={visual.src}
            alt={visual.alt}
            loading={priority ? "eager" : "lazy"}
            className={cn("h-full w-full object-cover", imageClassName)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/82 via-ink/8 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-mono text-[0.68rem] font-black uppercase tracking-[0.16em] text-saffron">
            {visual.credit}
          </p>
          <p className="mt-2 font-display text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-white">
            {file.title}
          </p>
        </div>
      </div>
      {showCaption ? <figcaption className="bg-white p-4 text-xs font-semibold leading-6 text-ink/58">{visual.caption}</figcaption> : null}
    </figure>
  );
}
