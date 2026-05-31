from __future__ import annotations

import json
import shutil
import zipfile
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
NEW_PHOTOS = ROOT / "new photos"
LEGACY_ROOT = ROOT / "public" / "images" / "cwi-unanswered-files"
OUTPUT_ROOT = ROOT / "public" / "images" / "india-unanswered-files"
DATA_FILE = ROOT / "data" / "unanswered-file-images.ts"
FINAL_ZIP = ROOT / "CWI_India_Unanswered_Files_Final_Website_Image_Pack.zip"
README_TEXT = (
    "This image pack is organized for Cockroach Watch India \u2014 CWI India Unanswered Files. "
    "Folder names are preserved for website compatibility. Images are organized by topic for article hero images, "
    "thumbnails, social posts, OpenGraph previews, and gallery use."
)

SUPPORTED = {".png", ".jpg", ".jpeg", ".webp", ".avif"}


@dataclass(frozen=True)
class Topic:
    slug: str
    title: str
    folder: str
    file_slug: str
    alt: str
    legacy_folder: str


TOPICS = [
    Topic(
        "assam-evictions",
        "Assam evictions",
        "Assam evictions",
        "assam-evictions",
        "CWI India Unanswered Files visual on Assam evictions, displacement, and public accountability.",
        "assam-evictions",
    ),
    Topic(
        "bulldozer-justice-demolitions",
        "Bulldozer justice and arbitrary demolitions",
        "Bulldozer justice and arbitrary demolitions",
        "bulldozer-justice",
        "CWI India Unanswered Files visual on bulldozer justice, demolitions, and due process concerns.",
        "bulldozer-justice",
    ),
    Topic(
        "delhi-riots-uapa-pretrial-detention",
        "Delhi riots/UAPA long pre-trial detention issue",
        "Delhi riots/UAPA long pre-trial detention issue",
        "delhi-riots-uapa",
        "CWI India Unanswered Files visual on Delhi riots, UAPA pre-trial detention, civil liberties, and delayed justice.",
        "delhi-riots-uapa",
    ),
    Topic(
        "electoral-bonds-transparency",
        "Electoral Bonds and political funding transparency",
        "Electoral Bonds and political funding transparency",
        "electoral-bonds",
        "CWI India Unanswered Files visual on electoral bonds, political funding transparency, and unanswered donor questions.",
        "electoral-bonds",
    ),
    Topic(
        "farmers-msp-protest",
        "Farmers MSP protest",
        "Farmers MSP protest",
        "farmers-msp-protest",
        "CWI India Unanswered Files visual on farmers MSP protest, policy demands, and public accountability.",
        "farmers-msp-protest",
    ),
    Topic(
        "great-nicobar-shompen-nicobarese",
        "Great Nicobar mega project and ShompenNicobarese concerns",
        "Great Nicobar mega project and ShompenNicobarese concerns",
        "great-nicobar-project",
        "CWI India Unanswered Files visual on the Great Nicobar project, Shompen and Nicobarese concerns, ecology, and development questions.",
        "great-nicobar-project",
    ),
    Topic(
        "hasdeo-aranya-coal-mining",
        "Hasdeo coal mining",
        "Hasdeo coal mining",
        "hasdeo-coal-mining",
        "CWI India Unanswered Files visual on Hasdeo coal mining, forest protection, Adivasi resistance, and public accountability.",
        "hasdeo-aranya",
    ),
    Topic(
        "hathras-caste-gender-justice",
        "Hathras caste-gender justice case",
        "Hathras caste-gender justice case",
        "hathras-case",
        "CWI India Unanswered Files visual on Hathras caste-gender justice, dignity, and accountability.",
        "hathras-case",
    ),
    Topic(
        "jammu-kashmir-statehood-delay",
        "Jammu & Kashmir statehood delay",
        "Jammu & Kashmir statehood delay",
        "jammu-kashmir-statehood",
        "CWI India Unanswered Files visual on Jammu and Kashmir statehood delay, representation, and democratic accountability.",
        "jammu-kashmir-statehood",
    ),
    Topic(
        "joshimath-land-subsidence",
        "Joshimath land subsidence",
        "Joshimath land subsidence",
        "joshimath-land-subsidence",
        "CWI India Unanswered Files visual on Joshimath land subsidence, cracked homes, Himalayan risk, and ignored warnings.",
        "joshimath-subsidence",
    ),
    Topic(
        "ladakh-sixth-schedule-statehood",
        "Ladakh and Sonam Wangchuk\u2019s Sixth Schedulestatehood movement photos",
        "Ladakh and Sonam Wangchuk\u2019s Sixth Schedulestatehood movement photos",
        "ladakh-sonam-wangchuk",
        "CWI India Unanswered Files visual on Ladakh Sixth Schedule, statehood, Sonam Wangchuk, and public voice.",
        "ladakh-sonam-wangchuk",
    ),
    Topic(
        "lakhimpur-kheri-farmers-case",
        "Lakhimpur Kheri farmers case",
        "Lakhimpur Kheri farmers case",
        "lakhimpur-kheri",
        "CWI India Unanswered Files visual on the Lakhimpur Kheri farmers case, trial delay, and justice questions.",
        "lakhimpur-kheri",
    ),
    Topic(
        "neet-paper-leak-nta-accountability",
        "NEET paper leak and NTA accountability crisis",
        "NEET paper leak and NTA accountability crisis",
        "neet-paper-leak",
        "CWI India Unanswered Files visual on NEET paper leak concerns, student protests, and NTA accountability.",
        "neet-paper-leak",
    ),
    Topic(
        "sambhal-mosque-survey-violence",
        "Sambhal mosque survey violence",
        "Sambhal mosque survey violence",
        "sambhal-mosque-survey-violence",
        "CWI India Unanswered Files visual on Sambhal mosque survey violence, public order, and unanswered accountability questions.",
        "sambhal-mosque-violence",
    ),
    Topic(
        "wayanad-landslide-ecological-warnings",
        "Wayanad landslide and ignored ecological warnings",
        "Wayanad landslide and ignored ecological warnings",
        "wayanad-landslide",
        "CWI India Unanswered Files visual on Wayanad landslide, ecological warnings, and disaster accountability.",
        "wayanad-landslide",
    ),
    Topic(
        "women-wrestlers-sexual-harassment-case",
        "Women wrestlers sexual harassment case",
        "Women wrestlers sexual harassment case",
        "women-wrestlers-case",
        "CWI India Unanswered Files visual on women wrestlersâ€™ protest, dignity, and accountability.",
        "women-wrestlers-protest",
    ),
    Topic(
        "manipur-violence",
        "Manipur violence",
        "Manipur violence",
        "manipur-violence",
        "CWI India Unanswered Files visual on Manipur violence, displacement, human cost, and unresolved accountability.",
        "manipur-violence",
    ),
    Topic(
        "vizhinjam-port-fisherfolk-protest",
        "Vizhinjam port fisherfolk protest",
        "Vizhinjam port fisherfolk protest",
        "vizhinjam-port-protest",
        "CWI India Unanswered Files visual on Vizhinjam port fisherfolk protest, coastal livelihoods, and accountability questions.",
        "vizhinjam-port-protest",
    ),
]

NEW_IMAGE_MAP = {
    "1 (2).png": "assam-evictions",
    "1 (21).png": "assam-evictions",
    "1 (3).png": "bulldozer-justice-demolitions",
    "1 (18).png": "bulldozer-justice-demolitions",
    "1 (4).png": "delhi-riots-uapa-pretrial-detention",
    "1 (5).png": "electoral-bonds-transparency",
    "1 (19).png": "electoral-bonds-transparency",
    "1 (6).png": "farmers-msp-protest",
    "1 (7).png": "great-nicobar-shompen-nicobarese",
    "1 (8).png": "hasdeo-aranya-coal-mining",
    "1 (15).png": "hasdeo-aranya-coal-mining",
    "1 (9).png": "hathras-caste-gender-justice",
    "1 (13).png": "hathras-caste-gender-justice",
    "1 (10).png": "jammu-kashmir-statehood-delay",
    "1 (11).png": "joshimath-land-subsidence",
    "1 (20).png": "joshimath-land-subsidence",
    "1 (16).png": "ladakh-sixth-schedule-statehood",
    "1 (17).png": "neet-paper-leak-nta-accountability",
    "1 (14).png": "wayanad-landslide-ecological-warnings",
    "1 (12).png": "women-wrestlers-sexual-harassment-case",
}

REVIEW_IMAGES = {
    "1 (1).png",
    "1 (22).png",
    "1 (23).png",
    "1 (24).png",
    "1 (25).png",
    "1 (26).png",
    "1 (27).png",
    "1 (28).png",
    "1 (29).png",
    "1 (30).png",
    "1 (31).png",
    "1 (32).png",
}

VARIANTS = [
    ("hero", (1600, 900), "hero"),
    ("thumbnail", (800, 450), "thumbnail"),
    ("og", (1200, 630), "og"),
    ("social", (1080, 1080), "social"),
    ("poster", (1080, 1350), "poster"),
]


def main() -> None:
    if not NEW_PHOTOS.exists():
        raise SystemExit(f"Missing source image folder: {NEW_PHOTOS}")

    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    inventory = []
    index_topics = []
    data_folders = {}
    data_images = {}

    new_sources_by_slug: dict[str, list[Path]] = {topic.slug: [] for topic in TOPICS}
    review_sources = []

    for image_path in sorted(NEW_PHOTOS.iterdir(), key=lambda p: p.name):
        if not image_path.is_file() or image_path.suffix.lower() not in SUPPORTED:
            continue
        match_slug = NEW_IMAGE_MAP.get(image_path.name)
        if match_slug:
            new_sources_by_slug[match_slug].append(image_path)
            suggested_use = "topic hero/social/thumbnail/OG/gallery"
            topic_match = next(topic.title for topic in TOPICS if topic.slug == match_slug)
        else:
            review_sources.append(image_path)
            suggested_use = "manual review before article use"
            topic_match = "unanswered-files-review"

        width, height = image_size(image_path)
        inventory.append(
            {
                "currentFilename": image_path.name,
                "currentPath": str(image_path.relative_to(ROOT)).replace("\\", "/"),
                "imageSize": f"{width}x{height}",
                "topicMatch": topic_match,
                "qualityRating": quality_rating(width, height),
                "suggestedUse": suggested_use,
            }
        )

    for topic in TOPICS:
        folder = OUTPUT_ROOT / topic.folder
        folder.mkdir(parents=True, exist_ok=True)
        new_sources = new_sources_by_slug[topic.slug]
        legacy_sources = legacy_images(topic.legacy_folder)
        usable_sources = new_sources + legacy_sources
        if not usable_sources:
            raise RuntimeError(f"No usable images for {topic.slug}")

        entries = []
        primary = usable_sources[0]
        for variant, size, image_type in VARIANTS:
            filename = f"{topic.file_slug}-cwi-unanswered-files-{variant}-01.webp"
            output_path = folder / filename
            save_cover(primary, output_path, size)
            entries.append(image_entry(topic, filename, image_type, primary, output_path, is_new=primary in new_sources))

        gallery_sources = (usable_sources * 6)[:6]
        for index, source in enumerate(gallery_sources, start=1):
            filename = f"{topic.file_slug}-cwi-unanswered-files-gallery-{index:02d}.webp"
            output_path = folder / filename
            save_cover(source, output_path, (1200, 800))
            entries.append(image_entry(topic, filename, "gallery", source, output_path, is_new=source in new_sources))

        original_entries = []
        for index, source in enumerate(new_sources, start=1):
            extension = source.suffix.lower()
            filename = f"{topic.file_slug}-cwi-unanswered-files-original-{index:02d}{extension}"
            output_path = folder / filename
            shutil.copy2(source, output_path)
            original_entries.append(image_entry(topic, filename, "original", source, output_path, is_new=True))

        all_entries = entries + original_entries
        (folder / "metadata.json").write_text(json.dumps(all_entries, indent=2, ensure_ascii=False), encoding="utf-8")

        data_folders[topic.slug] = topic.folder
        data_images[topic.slug] = [
            {
                "filename": entry["fileName"],
                "type": entry["type"],
                "caption": entry["recommendedUse"],
                "source": entry["source"],
                "sourceUrl": entry["sourceUrl"],
                "photographer": entry["photographer"],
                "license": entry["license"],
                "date": "2026-05-24",
                "usageNote": entry["usageNote"],
                "altText": entry["altText"],
            }
            for entry in entries
        ]
        index_topics.append(
            {
                "section": "India Unanswered Files",
                "topic": topic.title,
                "folderName": topic.folder,
                "images": entries,
            }
        )

    review_folder = OUTPUT_ROOT / "unanswered-files-review"
    review_folder.mkdir(parents=True, exist_ok=True)
    review_entries = []
    for index, source in enumerate(review_sources, start=1):
        filename = f"unanswered-files-review-cwi-unanswered-files-poster-{index:02d}.webp"
        output_path = review_folder / filename
        save_cover(source, output_path, (1080, 1080))
        review_entries.append(
            {
                "fileName": filename,
                "path": public_path(output_path),
                "type": "review",
                "usedIn": "unanswered-files-review",
                "altText": "CWI India Unanswered Files visual held for manual review before article use.",
                "recommendedUse": "Manual review only. Not assigned to a case because topic match is unclear.",
                "source": "new photos",
                "sourceUrl": str(source.relative_to(ROOT)).replace("\\", "/"),
                "photographer": "Provided to CWI",
                "license": "User-provided local website asset",
                "usageNote": "Not used in published topic pages until manually reviewed.",
            }
        )
    (review_folder / "metadata.json").write_text(json.dumps(review_entries, indent=2, ensure_ascii=False), encoding="utf-8")

    image_index = {
        "section": "India Unanswered Files",
        "site": "https://cockroachwatchindia.online",
        "generatedAt": "2026-05-24",
        "topics": index_topics,
        "review": {
            "section": "India Unanswered Files",
            "topic": "unanswered-files-review",
            "folderName": "unanswered-files-review",
            "images": review_entries,
        },
    }
    (OUTPUT_ROOT / "image-index.json").write_text(json.dumps(image_index, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUTPUT_ROOT / "image-inventory.json").write_text(json.dumps(inventory, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUTPUT_ROOT / "README.txt").write_text(README_TEXT + "\n", encoding="utf-8")

    write_data_file(data_folders, data_images)
    write_zip()
    print(json.dumps({"topics": len(index_topics), "inventory": len(inventory), "review": len(review_entries)}, indent=2))


def image_size(path: Path) -> tuple[int, int]:
    with Image.open(path) as image:
        return image.size


def quality_rating(width: int, height: int) -> str:
    minimum = min(width, height)
    if minimum >= 1080:
        return "high"
    if minimum >= 800:
        return "medium"
    return "review"


def legacy_images(folder: str) -> list[Path]:
    legacy_folder = LEGACY_ROOT / folder
    if not legacy_folder.exists():
        return []
    return sorted(
        [
            item
            for item in legacy_folder.iterdir()
            if item.is_file() and item.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        ],
        key=lambda item: (item.name != "hero.jpg", item.name),
    )


def save_cover(source: Path, destination: Path, size: tuple[int, int]) -> None:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        covered = ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        covered.save(destination, "WEBP", quality=84, method=6)


def image_entry(topic: Topic, filename: str, image_type: str, source: Path, output_path: Path, is_new: bool) -> dict:
    source_label = "new photos" if is_new else "legacy CWI unanswered files archive"
    source_url = public_path(output_path)
    usage_note = (
        "Optimized from the new photos folder for the matching India Unanswered Files topic."
        if is_new
        else "Optimized from existing CWI local images because no matching new photo was available for this slot."
    )

    return {
        "fileName": filename,
        "path": public_path(output_path),
        "type": image_type,
        "usedIn": f"/india-unanswered-files/{topic.slug}",
        "altText": topic.alt,
        "recommendedUse": f"{topic.alt} Recommended as {image_type} image.",
        "source": source_label,
        "sourceUrl": source_url,
        "photographer": "Provided to CWI" if is_new else "CWI visual archive",
        "license": "User-provided local website asset" if is_new else "Existing local website asset",
        "usageNote": usage_note,
    }


def public_path(path: Path) -> str:
    return "/" + str(path.relative_to(ROOT / "public")).replace("\\", "/")


def write_data_file(folders: dict[str, str], images: dict[str, list[dict]]) -> None:
    output = f'''export type UnansweredFileImage = {{
  filename: string;
  type: "hero" | "thumbnail" | "og" | "social" | "poster" | "gallery" | "original" | "review";
  caption: string;
  source: string;
  sourceUrl: string;
  photographer: string;
  license: string;
  date: string;
  usageNote: string;
  altText: string;
}};

export const unansweredFileImageRoot = "/images/india-unanswered-files";

export const unansweredFileImageFolders = {json.dumps(folders, indent=2, ensure_ascii=False)} as const;

export const unansweredFileImages = {json.dumps(images, indent=2, ensure_ascii=False)} as const satisfies Record<string, UnansweredFileImage[]>;
'''
    DATA_FILE.write_text(output, encoding="utf-8")


def write_zip() -> None:
    if FINAL_ZIP.exists():
        FINAL_ZIP.unlink()
    with zipfile.ZipFile(FINAL_ZIP, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in OUTPUT_ROOT.rglob("*"):
            if path.is_file():
                archive.write(path, path.relative_to(OUTPUT_ROOT.parent))


if __name__ == "__main__":
    main()

