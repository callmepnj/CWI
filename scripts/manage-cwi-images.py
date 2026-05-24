#!/usr/bin/env python3

"""
CWI Unanswered Files - Image Sourcing & Management Helper
Helps organize, validate, and source images for the 18 case folders.
"""

import os
import json
import argparse
from pathlib import Path
from datetime import datetime
import hashlib
from urllib.parse import urljoin

# Configuration
ROOT_DIR = Path(__file__).parent.parent
IMAGES_DIR = ROOT_DIR / "public" / "images" / "cwi-unanswered-files"

CASES = {
    "manipur-violence": "Manipur violence",
    "ladakh-sonam-wangchuk": "Ladakh / Sonam Wangchuk Statehood",
    "joshimath-subsidence": "Joshimath Land Subsidence",
    "great-nicobar-project": "Great Nicobar Project & Shompen",
    "hasdeo-aranya": "Hasdeo Aranya Coal Mining",
    "women-wrestlers-protest": "Women Wrestlers Case",
    "neet-paper-leak": "NEET Paper Leak / NTA",
    "electoral-bonds": "Electoral Bonds Transparency",
    "bulldozer-justice": "Bulldozer Justice",
    "assam-evictions": "Assam Evictions",
    "farmers-msp-protest": "Farmers MSP Protest",
    "wayanad-landslide": "Wayanad Landslide",
    "vizhinjam-port-protest": "Vizhinjam Port Protest",
    "jammu-kashmir-statehood": "Jammu & Kashmir Statehood",
    "delhi-riots-uapa": "Delhi Riots / UAPA",
    "sambhal-mosque-violence": "Sambhal Mosque Survey Violence",
    "lakhimpur-kheri": "Lakhimpur Kheri Farmers Case",
    "hathras-case": "Hathras Caste-Gender Justice"
}

REQUIRED_IMAGES = ["hero.jpg"] + [f"image-{i:02d}.jpg" for i in range(1, 11)]


def create_metadata_template(case_slug, case_name):
    """Create metadata template for a case."""
    template = []
    
    descriptions = {
        "hero.jpg": {
            "title": f"Hero Image - {case_name}",
            "caption_template": "Key visual representing the {case} case. High-quality, case-specific image.",
            "guidelines": "Primary hero image for case cards. 1600x900px or larger."
        },
        "image-01.jpg": {
            "title": f"Primary Documentation - {case_name}",
            "caption_template": "Primary visual documentation of {case}.",
            "guidelines": "Main supporting image"
        },
    }
    
    for i, image_name in enumerate(REQUIRED_IMAGES):
        if image_name == "hero.jpg":
            title = f"Hero Image - {case_name}"
            caption = f"Primary visual for {case_name} case. High-quality, case-specific image."
        else:
            num = int(image_name.split('-')[1].split('.')[0])
            title = f"Gallery Image {num} - {case_name}"
            caption = f"Supporting image {num} for {case_name} case documentation."
        
        entry = {
            "filename": image_name,
            "title": title,
            "caption": caption,
            "alt": f"{case_name} - Image {i+1}",
            "source": "To be sourced",
            "sourceUrl": "",
            "photographer": "",
            "license": "CC BY-SA 4.0 or equivalent",
            "case": case_name,
            "year": "",
            "usageNote": f"Source from Wikimedia Commons or verified news archives. See docs/IMAGE_SOURCING_GUIDE.md for {case_name}."
        }
        template.append(entry)
    
    return template


def check_image_duplicates():
    """Check for duplicate images across folders."""
    print("\n📋 Checking for Duplicate Images...")
    
    file_hashes = {}
    duplicates = []
    
    for case_slug in CASES.keys():
        case_dir = IMAGES_DIR / case_slug
        if not case_dir.exists():
            continue
        
        for image_file in case_dir.glob("*.jpg"):
            if image_file.stat().st_size == 0:
                print(f"  ⚠️  Empty file: {case_slug}/{image_file.name}")
                continue
            
            try:
                with open(image_file, "rb") as f:
                    file_hash = hashlib.md5(f.read()).hexdigest()
                
                if file_hash in file_hashes:
                    duplicates.append({
                        "file": image_file.name,
                        "case": case_slug,
                        "duplicate_of": file_hashes[file_hash]
                    })
                    print(f"  ❌ DUPLICATE: {case_slug}/{image_file.name} = {file_hashes[file_hash]}")
                else:
                    file_hashes[file_hash] = f"{case_slug}/{image_file.name}"
            except Exception as e:
                print(f"  ⚠️  Error checking {case_slug}/{image_file.name}: {e}")
    
    if duplicates:
        print(f"\n  Found {len(duplicates)} duplicate images!")
        return False
    else:
        print(f"  ✅ No duplicate images found")
        return True


def check_metadata_urls():
    """Check for duplicate URLs in metadata."""
    print("\n📋 Checking for Duplicate URLs in Metadata...")
    
    seen_urls = {}
    duplicates = []
    
    for case_slug in CASES.keys():
        metadata_file = IMAGES_DIR / case_slug / "metadata.json"
        if not metadata_file.exists():
            continue
        
        try:
            with open(metadata_file, "r") as f:
                metadata = json.load(f)
            
            for entry in metadata:
                url = entry.get("sourceUrl", "").strip()
                if url and url.startswith("http"):
                    if url in seen_urls:
                        duplicates.append({
                            "url": url,
                            "case": case_slug,
                            "duplicate_of": seen_urls[url]
                        })
                        print(f"  ❌ DUPLICATE URL: {case_slug}/{entry['filename']} = {seen_urls[url]}")
                    else:
                        seen_urls[url] = f"{case_slug}/{entry['filename']}"
        except Exception as e:
            print(f"  ⚠️  Error reading metadata: {case_slug}/metadata.json: {e}")
    
    if duplicates:
        print(f"\n  Found {len(duplicates)} duplicate URLs!")
        return False
    else:
        print(f"  ✅ No duplicate URLs found")
        return True


def check_spelling_errors():
    """Check for common spelling mistakes."""
    print("\n📋 Checking for Spelling Errors...")
    
    misspellings = {
        "Mnaipur": "Manipur",
        "Wangchup": "Wangchuk",
        "Ladak": "Ladakh",
        "Joshi math": "Joshimath",
        "Nicobarise": "Nicobarese",
        "Hasdeao": "Hasdeo",
        "Wreslers": "Wrestlers",
        "Electrical": "Electoral",
        "Buldozer": "Bulldozer",
        "Waynad": "Wayanad",
        "Shambhal": "Sambhal",
        "Lakhimpur Keri": "Lakhimpur Kheri",
        "Hathras casee": "Hathras case",
    }
    
    errors = []
    
    for case_slug in CASES.keys():
        metadata_file = IMAGES_DIR / case_slug / "metadata.json"
        if not metadata_file.exists():
            continue
        
        try:
            with open(metadata_file, "r") as f:
                metadata = json.load(f)
            
            for entry in metadata:
                for field in ["caption", "title", "alt"]:
                    text = entry.get(field, "")
                    for wrong, correct in misspellings.items():
                        if wrong.lower() in text.lower():
                            errors.append({
                                "file": f"{case_slug}/{entry['filename']}",
                                "field": field,
                                "wrong": wrong,
                                "correct": correct,
                                "text": text
                            })
                            print(f"  ❌ SPELLING: {case_slug}/{entry['filename']} [{field}]: '{wrong}' → '{correct}'")
        except Exception as e:
            print(f"  ⚠️  Error: {case_slug}/metadata.json: {e}")
    
    if errors:
        print(f"\n  Found {len(errors)} spelling errors!")
        return False
    else:
        print(f"  ✅ No spelling errors found")
        return True


def generate_report():
    """Generate full validation report."""
    print("\n" + "="*80)
    print("CWI IMAGE SYSTEM - FULL DIAGNOSTIC REPORT")
    print("="*80)
    print(f"Generated: {datetime.now().isoformat()}")
    print(f"Images Directory: {IMAGES_DIR}")
    
    print("\nFOLDER STRUCTURE:")
    for case_slug, case_name in CASES.items():
        case_dir = IMAGES_DIR / case_slug
        if case_dir.exists():
            image_count = len(list(case_dir.glob("*.jpg")))
            metadata_exists = (case_dir / "metadata.json").exists()
            status = "OK" if image_count == 11 and metadata_exists else "WARN"
            print(f"  [{status}] {case_slug}: {image_count} images, metadata: {metadata_exists}")
        else:
            print(f"  [ERR] {case_slug}: FOLDER NOT FOUND")
    
    # Run all checks
    check_image_duplicates()
    check_metadata_urls()
    check_spelling_errors()
    
    print("\n" + "="*80)
    print("For detailed sourcing guidance, see: docs/IMAGE_SOURCING_GUIDE.md")
    print("="*80)


def main():
    parser = argparse.ArgumentParser(description="CWI Image Management Helper")
    parser.add_argument("--report", action="store_true", help="Generate diagnostic report")
    parser.add_argument("--check-duplicates", action="store_true", help="Check for duplicate images")
    parser.add_argument("--check-urls", action="store_true", help="Check for duplicate URLs")
    parser.add_argument("--check-spelling", action="store_true", help="Check for spelling errors")
    parser.add_argument("--template", metavar="CASE", help="Generate metadata template for a case")
    
    args = parser.parse_args()
    
    if args.report:
        generate_report()
    elif args.check_duplicates:
        check_image_duplicates()
    elif args.check_urls:
        check_metadata_urls()
    elif args.check_spelling:
        check_spelling_errors()
    elif args.template:
        if args.template in CASES:
            template = create_metadata_template(args.template, CASES[args.template])
            print(json.dumps(template, indent=2))
        else:
            print(f"Unknown case: {args.template}")
            print(f"Available cases: {', '.join(CASES.keys())}")
    else:
        generate_report()


if __name__ == "__main__":
    main()
