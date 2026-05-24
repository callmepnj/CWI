import { UnansweredFileVisual } from "@/components/UnansweredFileVisual";
import type { UnansweredFile } from "@/data/unanswered-files";
import { getGalleryVisuals } from "@/data/unanswered-files";

export function UnansweredImageGallery({ file }: { file: UnansweredFile }) {
  const visuals = getGalleryVisuals(file);

  return (
    <section>
      <div className="mb-6 max-w-3xl">
        <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-royal">
          Image gallery
        </p>
        <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-[-0.05em] text-ink">
          10 verified local images
        </h2>
        <p className="mt-4 text-base leading-8 text-ink/70">
          CWI uses ethical, non-graphic visuals. These files are stored locally under <span className="font-mono text-royal">/images/cwi-unanswered-files/</span> and each image shows a caption, source label, source URL, and license note.
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
