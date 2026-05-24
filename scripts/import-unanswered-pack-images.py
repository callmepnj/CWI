from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PACK_ROOT = ROOT / "CWI_India_Unanswered_Files_Image_Pack"
PUBLIC_ROOT = ROOT / "public" / "images" / "cwi-unanswered-files"
DATA_FILE = ROOT / "data" / "unanswered-file-images.ts"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

CASE_MAP = {
    "manipur-violence": {
        "folder": "manipur-violence",
        "source": None,
        "title": "Manipur violence",
    },
    "ladakh-sixth-schedule-statehood": {
        "folder": "ladakh-sonam-wangchuk",
        "source": "Ladakh and Sonam Wangchuk’s Sixth Schedulestatehood movement photos",
        "title": "Ladakh and Sonam Wangchuk Sixth Schedule/statehood movement",
    },
    "joshimath-land-subsidence": {
        "folder": "joshimath-subsidence",
        "source": "Joshimath land subsidence",
        "title": "Joshimath land subsidence",
    },
    "great-nicobar-shompen-nicobarese": {
        "folder": "great-nicobar-project",
        "source": "Great Nicobar mega project and ShompenNicobarese concerns",
        "title": "Great Nicobar mega project and Shompen/Nicobarese concerns",
    },
    "hasdeo-aranya-coal-mining": {
        "folder": "hasdeo-aranya",
        "source": "Hasdeo coal mining",
        "title": "Hasdeo Aranya coal mining and Adivasi protests",
    },
    "women-wrestlers-sexual-harassment-case": {
        "folder": "women-wrestlers-protest",
        "source": "Women wrestlers sexual harassment case",
        "title": "Women wrestlers sexual harassment case",
    },
    "neet-paper-leak-nta-accountability": {
        "folder": "neet-paper-leak",
        "source": "NEET paper leak and NTA accountability crisis",
        "title": "NEET paper leak and NTA accountability crisis",
    },
    "electoral-bonds-transparency": {
        "folder": "electoral-bonds",
        "source": "Electoral Bonds and political funding transparency",
        "title": "Electoral Bonds and political funding transparency",
    },
    "bulldozer-justice-demolitions": {
        "folder": "bulldozer-justice",
        "source": "Bulldozer justice and arbitrary demolitions",
        "title": "Bulldozer justice and arbitrary demolitions",
    },
    "assam-evictions": {
        "folder": "assam-evictions",
        "source": "Assam evictions",
        "title": "Assam evictions",
    },
    "farmers-msp-protest": {
        "folder": "farmers-msp-protest",
        "source": "Farmers MSP protest",
        "title": "Farmers MSP protest",
    },
    "wayanad-landslide-ecological-warnings": {
        "folder": "wayanad-landslide",
        "source": "Wayanad landslide and ignored ecological warnings",
        "title": "Wayanad landslide and ignored ecological warnings",
    },
    "vizhinjam-port-fisherfolk-protest": {
        "folder": "vizhinjam-port-protest",
        "source": None,
        "title": "Vizhinjam port fisherfolk protest",
    },
    "jammu-kashmir-statehood-delay": {
        "folder": "jammu-kashmir-statehood",
        "source": "Jammu & Kashmir statehood delay",
        "title": "Jammu & Kashmir statehood delay",
    },
    "delhi-riots-uapa-pretrial-detention": {
        "folder": "delhi-riots-uapa",
        "source": "Delhi riots/UAPA long pre-trial detention issue",
        "title": "Delhi riots / UAPA long pre-trial detention issue",
    },
    "sambhal-mosque-survey-violence": {
        "folder": "sambhal-mosque-violence",
        "source": "Sambhal mosque survey violence",
        "title": "Sambhal mosque survey violence",
    },
    "lakhimpur-kheri-farmers-case": {
        "folder": "lakhimpur-kheri",
        "source": "Lakhimpur Kheri farmers case",
        "title": "Lakhimpur Kheri farmers case",
    },
    "hathras-caste-gender-justice": {
        "folder": "hathras-case",
        "source": "Hathras caste-gender justice case",
        "title": "Hathras caste-gender justice case",
    },
}


def source_dir(name: str | None) -> Path | None:
    if not name:
        return None

    direct = PACK_ROOT / name
    if direct.exists():
        return direct

    for path in PACK_ROOT.rglob("*"):
        if path.is_dir() and path.name == name.split("/")[-1]:
            return path

    return None


def image_files(path: Path) -> list[Path]:
    return sorted(
        [item for item in path.iterdir() if item.is_file() and item.suffix.lower() in IMAGE_EXTENSIONS],
        key=lambda item: (-item.stat().st_size, item.name.lower()),
    )


def clear_generated_images(path: Path) -> None:
    resolved_root = PUBLIC_ROOT.resolve()
    resolved_path = path.resolve()
    if resolved_root not in resolved_path.parents and resolved_path != resolved_root:
        raise RuntimeError(f"Refusing to edit outside image root: {path}")

    path.mkdir(parents=True, exist_ok=True)
    for item in path.iterdir():
        if item.is_file() and (item.suffix.lower() in IMAGE_EXTENSIONS or item.name == "metadata.json"):
            item.unlink()


def write_metadata(folder: Path, entries: list[dict]) -> None:
    (folder / "metadata.json").write_text(json.dumps(entries, indent=2), encoding="utf-8")


def pack_entries(slug: str, folder_name: str, title: str, files: list[Path]) -> list[dict]:
    selected = files[:11]
    entries = []
    for index, src in enumerate(selected):
        filename = "hero.jpg" if index == 0 else f"image-{index:02d}.jpg"
        destination = PUBLIC_ROOT / folder_name / filename
        shutil.copy2(src, destination)
        caption = (
            f"{title} visual from the CWI provided image pack."
            if index == 0
            else f"Date-wise investigation visual {index} for {title} from the CWI provided image pack."
        )
        entries.append(
            {
                "filename": filename,
                "caption": caption,
                "source": "CWI provided image pack",
                "sourceUrl": str(src.relative_to(ROOT)).replace("\\", "/"),
                "photographer": "Provided to CWI",
                "license": "User-provided local website asset",
                "date": "2026-05-24",
                "usageNote": "Copied from CWI_India_Unanswered_Files_Image_Pack and used only for the matching case file.",
            }
        )
    return entries


def fallback_entries(slug: str, folder_name: str, title: str) -> list[dict]:
    folder = PUBLIC_ROOT / folder_name
    files = []
    for name in ["hero.jpg", *[f"image-{index:02d}.jpg" for index in range(1, 11)]]:
        if (folder / name).exists():
            files.append(name)

    entries = []
    for index, filename in enumerate(files[:11]):
        entries.append(
            {
                "filename": filename,
                "caption": f"{title} contextual visual retained because this case folder is missing from the provided image pack.",
                "source": "Existing CWI local archive - not from provided pack",
                "sourceUrl": f"/images/cwi-unanswered-files/{folder_name}/{filename}",
                "photographer": "CWI visual archive",
                "license": "Existing local archive",
                "date": "2026-05-24",
                "usageNote": "Not from CWI_India_Unanswered_Files_Image_Pack. Audit should remain failed until matching pack photos are provided.",
            }
        )
    return entries


def ts_string(value: object) -> str:
    return json.dumps(value, indent=2, ensure_ascii=False)


def main() -> None:
    if not PACK_ROOT.exists():
        raise SystemExit(f"Image pack not found: {PACK_ROOT}")

    folders: dict[str, str] = {}
    images: dict[str, list[dict]] = {}
    audit: list[dict] = []

    for slug, info in CASE_MAP.items():
        folder_name = info["folder"]
        title = info["title"]
        folders[slug] = folder_name
        target = PUBLIC_ROOT / folder_name
        src_dir = source_dir(info["source"])

        if src_dir:
            files = image_files(src_dir)
            if len(files) >= 11:
                clear_generated_images(target)
                entries = pack_entries(slug, folder_name, title, files)
                write_metadata(target, entries)
                images[slug] = entries
                audit.append({"slug": slug, "status": "imported", "count": len(entries), "source": str(src_dir.relative_to(ROOT))})
                continue
            audit.append({"slug": slug, "status": "insufficient-pack-images", "count": len(files), "source": str(src_dir.relative_to(ROOT))})
        else:
            audit.append({"slug": slug, "status": "missing-pack-folder", "count": 0, "source": info["source"]})

        entries = fallback_entries(slug, folder_name, title)
        if entries:
            images[slug] = entries
            write_metadata(target, entries)
        else:
            images[slug] = []

    data_file = f'''export type UnansweredFileImage = {{
  filename: string;
  caption: string;
  source: string;
  sourceUrl: string;
  photographer: string;
  license: string;
  date: string;
  usageNote: string;
}};

export const unansweredFileImageFolders = {ts_string(folders)} as const;

export const unansweredFileImages = {ts_string(images)} as const satisfies Record<string, UnansweredFileImage[]>;
'''
    DATA_FILE.write_text(data_file, encoding="utf-8")
    print(json.dumps(audit, indent=2))


if __name__ == "__main__":
    main()
