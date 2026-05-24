# CWI India's Unanswered Files - Image System Rebuild Guide

**Status:** Image system rebuild infrastructure complete
**Last Updated:** May 24, 2026
**Priority:** HIGH - Complete image replacement required

---

## ⚠️ Current Issues

The image validation has identified the following problems:

### **Dimension Issues**
- ❌ Multiple images below 1200px minimum width
- Examples: manipur-violence (612px), great-nicobar-project (512px), electoral-bonds (400px)
- **Impact:** Poor rendering on desktop and tablet views

### **Image Quality Issues**
- ❌ Some images appear to be generic/placeholder stock photos
- ❌ Some images may be repeated across multiple cases
- ❌ Some captions may contain spelling mistakes
- **Impact:** Reduced credibility and user engagement

### **Metadata Issues**
- ⚠️ Some images lack proper source attribution
- ⚠️ Some images may use internal-only references instead of public URLs
- **Impact:** Transparency and licensing compliance

---

## ✅ What Has Been Built

### 1. **Image Sourcing Guide**
📄 **File:** `docs/IMAGE_SOURCING_GUIDE.md`

Complete guide with:
- 18 case-by-case sourcing instructions
- Specific image type requirements for each case
- Primary/fallback sources (Wikimedia Commons, news archives, government sites)
- Copyright and licensing guidelines
- Quality standards and red flags
- Batch sourcing tips

### 2. **Validation Script (Node.js)**
🔍 **File:** `scripts/validate-cwi-images.js`

Validates:
- ✅ All 18 case folders exist with correct names
- ✅ Each folder contains hero.jpg + 10 gallery images
- ✅ Each image meets minimum 1200px width
- ✅ No 0-byte (corrupted) files
- ✅ No duplicate filenames across folders
- ✅ No duplicate source URLs
- ✅ metadata.json exists and is valid
- ✅ No spelling mistakes in case names
- ✅ All required metadata fields present

**Run validation:**
```bash
node scripts/validate-cwi-images.js
```

### 3. **Image Management Scripts (Python)**
🐍 **File:** `scripts/manage-cwi-images.py`

Helper functions:
- Generate diagnostic reports
- Check for duplicate images
- Check for duplicate URLs
- Check for spelling errors
- Generate metadata templates

**Run diagnostics:**
```bash
python scripts/manage-cwi-images.py --report
python scripts/manage-cwi-images.py --check-duplicates
python scripts/manage-cwi-images.py --check-urls
python scripts/manage-cwi-images.py --check-spelling
```

### 4. **Metadata Generator (Python)**
🔧 **File:** `scripts/generate-cwi-metadata.py`

Already run to generate clean metadata.json templates for all 18 cases with:
- Proper structure for all images
- Case-specific image descriptions
- Sourcing guidance for each image

**Re-run if needed:**
```bash
python scripts/generate-cwi-metadata.py
```

### 5. **Metadata Structure (Clean)**
📋 **Location:** `public/images/cwi-unanswered-files/[case]/metadata.json`

Each metadata.json now contains:
```json
{
  "filename": "hero.jpg",
  "title": "Image title",
  "caption": "Factual description of image",
  "alt": "SEO-friendly alt text",
  "source": "Source name",
  "sourceUrl": "Full URL to source",
  "photographer": "Photographer name",
  "license": "CC BY-SA 4.0",
  "case": "Case name",
  "year": "Relevant year",
  "usageNote": "Sourcing and compliance notes"
}
```

---

## 🎯 What Needs to Be Done Next

### Phase 1: Source Images (MANUAL REQUIRED)

For each of the 18 cases, source 11 high-quality images:

1. **1 Hero Image** (1600x900px minimum, preferably 1800x1000px)
   - Primary visual for case card
   - Case-specific
   - High quality

2. **10 Gallery Images** (1200px+ width, no maximum)
   - Supporting documentation
   - Diverse perspectives
   - Case-specific

**Step-by-step sourcing:**

1. Open `docs/IMAGE_SOURCING_GUIDE.md`
2. Find your case in the guide
3. Read specific image requirements
4. Search Wikimedia Commons or verified news archives
5. Download full-size versions (1200px+ wide)
6. Verify license (CC BY-SA 4.0, CC0, or public domain)
7. Place in correct folder with correct filename
8. Run validation to verify

**Example workflow for Manipur violence:**
```bash
# Search Wikimedia Commons for:
# - "Manipur relief" → download as hero.jpg
# - "Imphal" → download as image-01.jpg
# - "Churachandpur" → download as image-02.jpg
# etc.

# Place in: public/images/cwi-unanswered-files/manipur-violence/

# Verify:
node scripts/validate-cwi-images.js
```

### Phase 2: Update Metadata (PER IMAGE)

For each image you add:

1. Open case's `metadata.json`
2. Find the corresponding entry (hero.jpg or image-XX.jpg)
3. Update fields:
   - `sourceUrl`: Direct link to image source
   - `photographer`: Name of photographer/creator
   - `source`: "Wikimedia Commons", "Reuters", etc.
   - `license`: "CC BY-SA 4.0" or actual license
   - `caption`: Accurate, non-graphic description
   - `alt`: SEO-friendly alt text
   - `year`: Year image was taken/published

**Example metadata entry:**
```json
{
  "filename": "hero.jpg",
  "title": "Relief Camp in Manipur",
  "caption": "Displaced families at a relief camp following 2023 communal violence in Manipur. Documentary image of humanitarian response.",
  "alt": "Displaced families in relief camp during Manipur violence crisis 2023",
  "source": "Wikimedia Commons",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Manipur_relief_camp.jpg",
  "photographer": "John Smith",
  "license": "CC BY-SA 4.0",
  "case": "Manipur violence",
  "year": "2023",
  "usageNote": "Downloaded legally from Wikimedia Commons."
}
```

### Phase 3: Validation (AUTOMATED)

After sourcing images:

```bash
# Run full validation
node scripts/validate-cwi-images.js

# Check for specific issues
python scripts/manage-cwi-images.py --check-duplicates
python scripts/manage-cwi-images.py --check-urls
python scripts/manage-cwi-images.py --check-spelling
```

**Expected output for each case:**
- ✅ All 11 images present
- ✅ All images ≥1200px wide
- ✅ No 0-byte files
- ✅ metadata.json valid and complete
- ✅ No spelling errors
- ✅ No duplicate filenames
- ✅ No duplicate URLs

### Phase 4: Website Testing (MANUAL)

After validation passes:

1. **Run development server:**
   ```bash
   npm run dev
   ```

2. **Test India's Unanswered Files:**
   - Visit `/unanswered-files`
   - Check each of 18 article links
   - Verify:
     - ✅ Hero image displays (correct size, quality)
     - ✅ 10 gallery images display
     - ✅ Captions are readable
     - ✅ Source URLs work
     - ✅ Alt text is accurate
     - ✅ No duplicate images
     - ✅ No broken image links

3. **Test responsiveness:**
   - Desktop view (1920px+)
   - Tablet view (768px-1024px)
   - Mobile view (320px-480px)

4. **Test dark mode:**
   - Toggle dark mode
   - Verify images display correctly

5. **Performance check:**
   - Page load speed
   - Image loading time
   - No layout shift from images

---

## 📊 Image Requirements Summary

| Requirement | Value |
|------------|-------|
| **Cases** | 18 total |
| **Images per case** | 11 (1 hero + 10 gallery) |
| **Total images needed** | 198 |
| **Minimum width** | 1200px |
| **Recommended width** | 1600-3000px |
| **Max file size** | 10MB per image |
| **Format** | JPG (hero.jpg, image-01.jpg - image-10.jpg) |
| **No repeats** | Zero images can appear in more than one case |

---

## 🌍 Sourcing by Priority

### ⭐ Priority 1 (Most Critical)
- Manipur violence (news/humanitarian focus)
- Women wrestlers case (recent activism)
- Farmers MSP protest (ongoing movement)
- Wayanad landslide (2024 disaster)

### ⭐⭐ Priority 2 (High)
- Ladakh statehood (political focus)
- Joshimath subsidence (geological crisis)
- NEET paper leak (education crisis)
- Electoral Bonds (systemic transparency)

### ⭐⭐⭐ Priority 3 (Standard)
All remaining cases

---

## 📚 Wikimedia Commons Search Tips

**High-quality search strategies:**

1. **Case-specific searches:**
   ```
   "Manipur" OR "Imphal"
   "Ladakh" OR "Leh"
   "Joshimath"
   ```

2. **Activity-specific searches:**
   ```
   "Farmers protest India" + date:2023-2024
   "Landslide Kerala" + date:2024
   "Wrestler protest"
   ```

3. **License filter:**
   - Filter: CC BY-SA 4.0, CC0, Public Domain
   - No copyright restrictions

4. **Size filter:**
   - Minimum: 1200px width
   - Check EXIF data for actual dimensions

5. **Date filter:**
   - Recent images (within 2-3 years of case)
   - Historical images only for context

---

## 🚫 What NOT to Do

❌ **DON'T use:**
- Random stock photos (Unsplash, Pexels without verification)
- AI-generated images labeled as "news"
- Heavily pixelated or compressed thumbnails
- Screenshots with UI elements
- Same image in multiple cases
- Images with graphic violence
- Images violating privacy
- Generic placeholder images
- Blurry or out-of-focus photos (unless documentarily significant)

---

## 📝 Spelling Checklist

**Ensure correct spelling in captions/titles:**
- ✅ Manipur (not Mnaipur)
- ✅ Sonam Wangchuk (not Wangchup)
- ✅ Ladakh (not Ladak)
- ✅ Joshimath (not Joshi math)
- ✅ Nicobarese (not Nicobarise)
- ✅ Hasdeo (not Hasdeao)
- ✅ Wrestlers (not Wreslers)
- ✅ Electoral (not Electrical)
- ✅ Bulldozer (not Buldozer)
- ✅ Wayanad (not Waynad)
- ✅ Vizhinjam (consistent spelling)
- ✅ Sambhal (not Shambhal)
- ✅ Lakhimpur Kheri (not Lakhimpur Keri)
- ✅ Hathras (not Hathras casee)

---

## 🔄 Recommended Timeline

| Phase | Timeframe | Priority |
|-------|-----------|----------|
| Source Priority 1 cases | 1-2 weeks | CRITICAL |
| Source Priority 2 cases | 2-3 weeks | HIGH |
| Source Priority 3 cases | 2-3 weeks | NORMAL |
| Metadata completion | Concurrent | DAILY |
| Validation | Daily | DAILY |
| Website testing | Final phase | 1 week |

---

## ❓ Troubleshooting

### Issue: Image Below 1200px Width
**Solution:** 
- Re-source from a higher-resolution source
- Use different image
- Check Wikimedia Commons for larger version

### Issue: Can't Find Case-Specific Image
**Solution:**
- Use fallback searches from IMAGE_SOURCING_GUIDE.md
- Source related/contextual image
- Consult Geography/History resources

### Issue: Metadata Validation Fails
**Solution:**
- Check all fields are populated
- Verify sourceUrl is valid HTTP/HTTPS URL
- Run: `python scripts/manage-cwi-images.py --check-spelling`

### Issue: Duplicate Detected
**Solution:**
- Check if same image in multiple cases
- If yes: Replace one with different image
- If no: Run `--check-duplicates` to verify

---

## 📞 Reference Commands

```bash
# Full system validation
node scripts/validate-cwi-images.js

# Python diagnostics
python scripts/manage-cwi-images.py --report
python scripts/manage-cwi-images.py --check-duplicates
python scripts/manage-cwi-images.py --check-urls
python scripts/manage-cwi-images.py --check-spelling

# Website testing
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## 📄 Files Created/Modified

### New Files:
- ✅ `docs/IMAGE_SOURCING_GUIDE.md` - Comprehensive sourcing instructions
- ✅ `scripts/validate-cwi-images.js` - Validation script
- ✅ `scripts/manage-cwi-images.py` - Management utilities
- ✅ `scripts/generate-cwi-metadata.py` - Metadata generator
- ✅ `README_IMAGE_REBUILD.md` - This file

### Modified Files:
- ✅ `public/images/cwi-unanswered-files/*/metadata.json` - All 18 cases updated

### Unchanged:
- ℹ️ `data/unanswered-files.ts` - References existing structure (will work with new images)
- ℹ️ `data/unanswered-file-images.ts` - References metadata.json files

---

## 🎯 Success Criteria

Project is complete when:

1. ✅ All 18 cases have 11 images each (198 total)
2. ✅ All images ≥1200px wide
3. ✅ No image appears in multiple cases
4. ✅ All metadata complete and accurate
5. ✅ No spelling mistakes
6. ✅ All source URLs valid
7. ✅ Website displays all images correctly
8. ✅ Validation script shows 0 errors
9. ✅ All pages load without broken images
10. ✅ Performance acceptable on all devices

---

## 📞 Questions?

Refer to:
1. `docs/IMAGE_SOURCING_GUIDE.md` - Detailed sourcing by case
2. `scripts/validate-cwi-images.js` - Validation details
3. Wikimedia Commons documentation - Licensing

---

**Project Goal:** Replace entire Unanswered Files image system with high-quality, unique, case-specific images from authoritative sources.

**Status:** Infrastructure ready ✅ | Awaiting image sourcing 🔄

---
