#!/usr/bin/env python3
"""
Collect public-license contextual images for CWI India's Unanswered Files.

Rules enforced by this script:
- Downloads only from Wikimedia Commons API.
- Skips obvious document scans and non-raster files.
- Converts downloaded images to local JPG files with deterministic names.
- Writes per-folder metadata.json and a TypeScript data file consumed by the site.

The images are contextual public-license visuals, not copyrighted agency photos.
"""

from __future__ import annotations

import io
import json
import re
import shutil
import time
from pathlib import Path
from typing import Any
from urllib.parse import quote

import requests
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ROOT = ROOT / "public" / "images" / "cwi-unanswered-files"
DATA_FILE = ROOT / "data" / "unanswered-file-images.ts"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "CockroachWatchIndia/1.0 (public-license image collection; cockroachwatchindia@gmail.com)"
TARGET_COUNT = 11

LOCAL_MANIPUR = [
    ("public/manipur/manipur-vigil-banner.jpg", "Manipur public memory and peace vigil visual from the CWI local archive."),
    ("public/manipur/burned-place-of-worship.jpg", "Non-graphic documentary visual of destruction in Manipur from the CWI local archive."),
    ("public/manipur/security-patrol.jpg", "Security patrol visual used for Manipur crisis context from the CWI local archive."),
    ("public/manipur/burned-vehicle-road.jpg", "Road damage and burned vehicle visual used for Manipur crisis context from the CWI local archive."),
    ("public/manipur/street-smoke-civilian-area.jpg", "Street smoke and civilian-area disruption visual from the CWI local archive."),
]

CASES: list[dict[str, Any]] = [
    {
        "slug": "manipur-violence",
        "folder": "manipur-violence",
        "title": "Manipur Violence",
        "queries": ["Manipur India", "Imphal Manipur", "Churachandpur Manipur", "Kangpokpi Manipur", "Assam Rifles Manipur", "India relief camp"],
        "categories": ["Manipur", "Imphal", "Churachandpur district", "Kangpokpi district", "Assam Rifles"],
    },
    {
        "slug": "ladakh-sixth-schedule-statehood",
        "folder": "ladakh-sonam-wangchuk",
        "title": "Ladakh and Sonam Wangchuk's Sixth Schedule Movement",
        "queries": ["Sonam Wangchuk", "Ladakh protest", "Leh Ladakh", "Kargil Ladakh", "Ladakh glaciers", "Ladakh people"],
        "categories": ["Ladakh", "Leh", "Kargil", "Sonam Wangchuk", "Protests in India"],
    },
    {
        "slug": "joshimath-land-subsidence",
        "folder": "joshimath-subsidence",
        "title": "Joshimath Land Subsidence",
        "queries": ["Joshimath", "Jyotirmath", "Chamoli Uttarakhand", "Uttarakhand landslide", "Himalayan road Uttarakhand", "Badrinath road"],
        "categories": ["Joshimath", "Chamoli district", "Uttarakhand", "Landslides in India"],
    },
    {
        "slug": "great-nicobar-shompen-nicobarese",
        "folder": "great-nicobar-project",
        "title": "Great Nicobar Mega Project",
        "queries": ["Great Nicobar Island", "Nicobar Islands", "Shompen", "Galathea Bay", "Campbell Bay", "Andaman Nicobar forest"],
        "categories": ["Great Nicobar Island", "Nicobar Islands", "Andaman and Nicobar Islands", "Campbell Bay National Park"],
    },
    {
        "slug": "hasdeo-aranya-coal-mining",
        "folder": "hasdeo-aranya",
        "title": "Hasdeo Aranya Coal Mining and Adivasi Protests",
        "queries": ["Chhattisgarh forest", "coal mining India", "Adivasi protest India", "Hasdeo Arand", "Surguja Chhattisgarh", "elephant corridor Chhattisgarh"],
        "categories": ["Chhattisgarh", "Coal mining in India", "Forests in Chhattisgarh", "Adivasi"],
    },
    {
        "slug": "women-wrestlers-sexual-harassment-case",
        "folder": "women-wrestlers-protest",
        "title": "Women Wrestlers' Sexual Harassment Case",
        "queries": ["Indian wrestlers protest", "Jantar Mantar protest", "Vinesh Phogat", "Sakshi Malik", "Bajrang Punia", "India Gate protest"],
        "categories": ["Jantar Mantar", "Vinesh Phogat", "Sakshi Malik", "Bajrang Punia", "Protests in Delhi"],
    },
    {
        "slug": "neet-paper-leak-nta-accountability",
        "folder": "neet-paper-leak",
        "title": "NEET Paper Leak and NTA Accountability Crisis",
        "queries": ["students protest India", "exam hall India", "Supreme Court of India", "Ministry of Education India", "National Testing Agency", "medical students India"],
        "categories": ["Students in India", "Education in India", "Supreme Court of India", "Protests in India"],
    },
    {
        "slug": "electoral-bonds-transparency",
        "folder": "electoral-bonds",
        "title": "Electoral Bonds and Political Funding Transparency",
        "queries": ["Supreme Court of India", "State Bank of India", "Election Commission of India", "Parliament of India", "Indian elections", "political funding India"],
        "categories": ["Supreme Court of India", "State Bank of India", "Election Commission of India", "Parliament of India", "Elections in India"],
    },
    {
        "slug": "bulldozer-justice-demolitions",
        "folder": "bulldozer-justice",
        "title": "Bulldozer Justice and Arbitrary Demolitions",
        "queries": ["bulldozer India", "excavator India", "demolition India", "Supreme Court of India", "urban demolition India", "housing India"],
        "categories": ["Bulldozers", "Excavators", "Demolition", "Supreme Court of India", "Housing in India"],
    },
    {
        "slug": "assam-evictions",
        "folder": "assam-evictions",
        "title": "Assam Evictions",
        "queries": ["Assam village", "Darrang district", "Brahmaputra river Assam", "char area Assam", "Assam police", "Assam flood shelter"],
        "categories": ["Assam", "Darrang district", "Brahmaputra River", "Villages in Assam"],
    },
    {
        "slug": "farmers-msp-protest",
        "folder": "farmers-msp-protest",
        "title": "Farmers' MSP Protest",
        "queries": ["Indian farmers protest", "2020 Indian farmers protest", "Punjab farmers protest", "tractor protest India", "Shambhu border farmers", "MSP protest India"],
        "categories": ["2020–2021 Indian farmers' protest", "Farmers' protests in India", "Tractors in India", "Agriculture in India"],
    },
    {
        "slug": "wayanad-landslide-ecological-warnings",
        "folder": "wayanad-landslide",
        "title": "Wayanad Landslide and Ignored Ecological Warnings",
        "queries": ["Wayanad landslide", "Wayanad Kerala", "Chooralmala", "Mundakkai", "Kerala disaster rescue", "Western Ghats landslide"],
        "categories": ["Wayanad district", "Landslides in Kerala", "Kerala floods", "Western Ghats"],
    },
    {
        "slug": "vizhinjam-port-fisherfolk-protest",
        "folder": "vizhinjam-port-protest",
        "title": "Vizhinjam Port Fisherfolk Protest",
        "queries": ["Vizhinjam", "Vizhinjam port", "Kerala fishing boats", "fishermen Kerala", "coastal erosion Kerala", "Thiruvananthapuram coast"],
        "categories": ["Vizhinjam", "Fishing in Kerala", "Fishing boats in India", "Ports and harbours of Kerala"],
    },
    {
        "slug": "jammu-kashmir-statehood-delay",
        "folder": "jammu-kashmir-statehood",
        "title": "Jammu and Kashmir Statehood Delay",
        "queries": ["Jammu and Kashmir", "Srinagar", "Kashmir protest", "Article 370", "Jammu Kashmir election", "Dal Lake security"],
        "categories": ["Jammu and Kashmir", "Srinagar", "Kashmir", "Politics of Jammu and Kashmir"],
    },
    {
        "slug": "delhi-riots-uapa-pretrial-detention",
        "folder": "delhi-riots-uapa",
        "title": "Delhi Riots and UAPA Pre-trial Detention",
        "queries": ["Delhi riots 2020", "Delhi protest", "Tihar Jail", "Delhi court", "civil liberties India", "UAPA India"],
        "categories": ["2020 Delhi riots", "Protests in Delhi", "Tihar Jail", "Delhi High Court", "Supreme Court of India"],
    },
    {
        "slug": "sambhal-mosque-survey-violence",
        "folder": "sambhal-mosque-violence",
        "title": "Sambhal Mosque Survey Violence",
        "queries": ["Sambhal Uttar Pradesh", "Jama Masjid Sambhal", "Uttar Pradesh police", "mosque Uttar Pradesh", "court order India", "Moradabad division"],
        "categories": ["Sambhal district", "Mosques in Uttar Pradesh", "Uttar Pradesh Police", "Uttar Pradesh"],
    },
    {
        "slug": "lakhimpur-kheri-farmers-case",
        "folder": "lakhimpur-kheri",
        "title": "Lakhimpur Kheri Farmers Case",
        "queries": ["Lakhimpur Kheri", "Indian farmers protest", "Uttar Pradesh farmers", "Tikonia Uttar Pradesh", "farmers memorial India", "Supreme Court of India"],
        "categories": ["Lakhimpur Kheri district", "2020–2021 Indian farmers' protest", "Farmers' protests in India", "Uttar Pradesh"],
    },
    {
        "slug": "hathras-caste-gender-justice",
        "folder": "hathras-case",
        "title": "Hathras Caste-Gender Justice Case",
        "queries": ["Hathras", "Dalit protest India", "Uttar Pradesh police", "women protest India", "Hathras district", "caste protest India"],
        "categories": ["Hathras district", "Dalit", "Protests in India", "Uttar Pradesh Police", "Women's rights in India"],
    },
]

GENERIC_FALLBACKS = [
    "Supreme Court of India",
    "Parliament of India",
    "Protests in India",
    "Indian police",
    "villages in India",
    "Indian court building",
    "Indian students",
    "India road",
]


def api_get(params: dict[str, Any], retries: int = 6) -> dict[str, Any]:
    params = {**params, "format": "json", "origin": "*"}
    delay = 1.5
    for attempt in range(retries):
        response = requests.get(
            COMMONS_API,
            params=params,
            headers={"User-Agent": USER_AGENT},
            timeout=45,
        )
        if response.status_code == 429:
            time.sleep(delay * (attempt + 2))
            continue
        response.raise_for_status()
        time.sleep(0.35)
        return response.json()
    response.raise_for_status()
    raise RuntimeError("Commons API failed after retries")


def sanitize_html(value: str | None) -> str:
    if not value:
        return ""
    value = re.sub(r"<[^>]+>", "", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def reject_title(title: str) -> bool:
    lowered = title.lower()
    blocked = [
        ".djvu",
        ".pdf",
        "page",
        "book",
        "journal",
        "index",
        "grammar",
        "dictionary",
        "gazetteer",
        "the international",
        "female suffrage",
        "liberalism",
    ]
    return any(token in lowered for token in blocked)


def metadata_from_page(page: dict[str, Any]) -> dict[str, Any] | None:
    infos = page.get("imageinfo") or []
    if not infos:
        return None
    info = infos[0]
    mime = info.get("mime", "")
    if not mime.startswith("image/") or mime == "image/svg+xml":
        return None
    title = page.get("title", "")
    if reject_title(title):
        return None
    extmetadata = info.get("extmetadata", {})
    license_name = sanitize_html(extmetadata.get("LicenseShortName", {}).get("value")) or "Wikimedia Commons license"
    author = sanitize_html(extmetadata.get("Artist", {}).get("value")) or "Not listed"
    description = sanitize_html(extmetadata.get("ImageDescription", {}).get("value"))
    date = sanitize_html(extmetadata.get("DateTimeOriginal", {}).get("value")) or sanitize_html(extmetadata.get("DateTime", {}).get("value")) or "Not listed"
    source_url = info.get("descriptionurl") or f"https://commons.wikimedia.org/wiki/{quote(title.replace(' ', '_'))}"
    url = info.get("thumburl") or info.get("url")
    if not url:
        return None
    return {
        "title": title,
        "downloadUrl": url,
        "sourceUrl": source_url,
        "source": "Wikimedia Commons",
        "photographer": author,
        "license": license_name,
        "date": date,
        "description": description,
    }


def search_commons(query: str, limit: int = 35) -> list[dict[str, Any]]:
    data = api_get(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": query,
            "gsrnamespace": 6,
            "gsrlimit": str(limit),
            "prop": "imageinfo",
            "iiprop": "url|mime|size|extmetadata",
            "iiurlwidth": "1800",
        }
    )
    pages = data.get("query", {}).get("pages", {})
    results = []
    for page in pages.values():
        item = metadata_from_page(page)
        if item:
            results.append(item)
    return results


def category_commons(category: str, limit: int = 35) -> list[dict[str, Any]]:
    data = api_get(
        {
            "action": "query",
            "generator": "categorymembers",
            "gcmtitle": f"Category:{category}",
            "gcmtype": "file",
            "gcmlimit": str(limit),
            "prop": "imageinfo",
            "iiprop": "url|mime|size|extmetadata",
            "iiurlwidth": "1800",
        }
    )
    pages = data.get("query", {}).get("pages", {})
    results = []
    for page in pages.values():
        item = metadata_from_page(page)
        if item:
            results.append(item)
    return results


def download_and_convert(item: dict[str, Any], output: Path) -> bool:
    try:
        response = requests.get(item["downloadUrl"], headers={"User-Agent": USER_AGENT}, timeout=60)
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content))
        image = image.convert("RGB")
        width, height = image.size
        if width < 360 or height < 240:
            return False
        image.thumbnail((1800, 1200), Image.Resampling.LANCZOS)
        image.save(output, format="JPEG", quality=86, optimize=True, progressive=True)
        return output.exists() and output.stat().st_size > 8_000
    except Exception as exc:
        print(f"  skipped download: {item.get('title')} ({exc})")
        return False


def copy_local_image(source_path: Path, output: Path) -> bool:
    try:
        image = Image.open(source_path)
        image = image.convert("RGB")
        image.thumbnail((1800, 1200), Image.Resampling.LANCZOS)
        image.save(output, format="JPEG", quality=86, optimize=True, progressive=True)
        return True
    except Exception as exc:
        print(f"  skipped local image: {source_path} ({exc})")
        return False


def collect_case(case: dict[str, Any]) -> list[dict[str, Any]]:
    out_dir = PUBLIC_ROOT / case["folder"]
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    records: list[dict[str, Any]] = []
    seen_sources: set[str] = set()

    def save_item(item: dict[str, Any], caption_prefix: str) -> None:
        if len(records) >= TARGET_COUNT:
            return
        if item["sourceUrl"] in seen_sources:
            return
        seen_sources.add(item["sourceUrl"])
        filename = "hero.jpg" if len(records) == 0 else f"image-{len(records):02d}.jpg"
        output = out_dir / filename
        if not download_and_convert(item, output):
            return
        caption = item.get("description") or f"Contextual public-license image for {case['title']}: {caption_prefix}."
        records.append(
            {
                "filename": filename,
                "caption": caption[:360],
                "source": item["source"],
                "sourceUrl": item["sourceUrl"],
                "photographer": item["photographer"],
                "license": item["license"],
                "date": item["date"],
                "usageNote": "Downloaded legally from Wikimedia Commons as a contextual public-license image.",
            }
        )
        print(f"  saved {case['folder']}/{filename} - {item['title']}")

    if case["slug"] == "manipur-violence":
        for local_path, caption in LOCAL_MANIPUR:
            if len(records) >= TARGET_COUNT:
                break
            source_path = ROOT / local_path
            if not source_path.exists():
                continue
            filename = "hero.jpg" if len(records) == 0 else f"image-{len(records):02d}.jpg"
            if copy_local_image(source_path, out_dir / filename):
                records.append(
                    {
                        "filename": filename,
                        "caption": caption,
                        "source": "CWI local archive",
                        "sourceUrl": "/watch/manipur-crisis",
                        "photographer": "CWI visual archive",
                        "license": "CWI-owned/local archive",
                        "date": "2026-05-24",
                        "usageNote": "Copied from existing CWI local Manipur archive and used as non-graphic contextual imagery.",
                    }
                )

    for category in case["categories"]:
        if len(records) >= TARGET_COUNT:
            break
        print(f"  category: {category}")
        try:
            for item in category_commons(category):
                save_item(item, category)
                if len(records) >= TARGET_COUNT:
                    break
        except Exception as exc:
            print(f"  category failed {category}: {exc}")
            time.sleep(2)

    for query in case["queries"]:
        if len(records) >= TARGET_COUNT:
            break
        print(f"  search: {query}")
        try:
            for item in search_commons(query):
                save_item(item, query)
                if len(records) >= TARGET_COUNT:
                    break
        except Exception as exc:
            print(f"  search failed {query}: {exc}")
            time.sleep(2)

    for query in GENERIC_FALLBACKS:
        if len(records) >= TARGET_COUNT:
            break
        print(f"  fallback: {query}")
        try:
            for item in search_commons(query):
                save_item(item, f"{case['title']} contextual fallback: {query}")
                if len(records) >= TARGET_COUNT:
                    break
        except Exception as exc:
            print(f"  fallback failed {query}: {exc}")
            time.sleep(2)

    if len(records) < TARGET_COUNT:
        print(f"WARNING: {case['title']} has only {len(records)} images after all searches.")

    (out_dir / "metadata.json").write_text(json.dumps(records, indent=2, ensure_ascii=False), encoding="utf-8")
    return records


def generate_typescript(all_records: dict[str, list[dict[str, Any]]]) -> None:
    folders = {case["slug"]: case["folder"] for case in CASES}
    data = {
        "folders": folders,
        "images": all_records,
    }
    content = """export type UnansweredFileImage = {
  filename: string;
  caption: string;
  source: string;
  sourceUrl: string;
  photographer: string;
  license: string;
  date: string;
  usageNote: string;
};

export const unansweredFileImageFolders = %s as const;

export const unansweredFileImages = %s satisfies Record<string, UnansweredFileImage[]>;
""" % (
        json.dumps(data["folders"], indent=2, ensure_ascii=False),
        json.dumps(data["images"], indent=2, ensure_ascii=False),
    )
    DATA_FILE.write_text(content, encoding="utf-8")


def main() -> None:
    PUBLIC_ROOT.mkdir(parents=True, exist_ok=True)
    all_records: dict[str, list[dict[str, Any]]] = {}
    for case in CASES:
        print(f"\n=== {case['title']} ===")
        all_records[case["slug"]] = collect_case(case)
    generate_typescript(all_records)
    missing = {slug: len(records) for slug, records in all_records.items() if len(records) < TARGET_COUNT}
    if missing:
        raise SystemExit(f"Some cases have fewer than {TARGET_COUNT} images: {missing}")
    print("\nDone. All cases have hero.jpg plus image-01.jpg through image-10.jpg")


if __name__ == "__main__":
    main()
