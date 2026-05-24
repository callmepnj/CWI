import { UnansweredFileVisual } from "@/components/UnansweredFileVisual";
import type { UnansweredFile } from "@/data/unanswered-files";
import { getFileVisuals } from "@/data/unanswered-files";

export function UnansweredImageGallery({ file }: { file: UnansweredFile }) {
  const visuals = getFileVisuals(file);

  return (
    <section>
      <div className="mb-6 max-w-3xl">
        <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-royal">
          Image research board
        </p>
        <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink">
          Visual context for this file
        </h2>
        <p className="mt-4 text-base leading-8 text-ink/70">
          CWI uses ethical, non-graphic visuals. Real local archive photos are labelled as such. Editorial visuals from the image pack are labelled clearly and are not presented as incident photographs.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visuals.map((visual, index) => (
          <UnansweredFileVisual
            key={`${file.slug}-${visual.src}`}
            file={file}
            visual={visual}
            showCaption
            priority={index === 0}
            imageClassName="transition duration-500 hover:scale-[1.03]"
          />
        ))}
      </div>
    </section>
  );
}
