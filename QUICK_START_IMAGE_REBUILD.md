# CWI Image Rebuild - Quick Start Guide

## 📋 What's Been Done ✅

1. **Image Sourcing Guide** → `docs/IMAGE_SOURCING_GUIDE.md`
   - 18 cases with specific image requirements
   - Where to find images for each case
   - Licensing and copyright guidelines

2. **Validation Script** → `scripts/validate-cwi-images.js`
   - Checks image dimensions, file integrity, metadata
   - Run: `node scripts/validate-cwi-images.js`

3. **Python Tools** → `scripts/manage-cwi-images.py` & `scripts/generate-cwi-metadata.py`
   - Generate reports, check duplicates, fix spelling
   - Metadata templates for all 18 cases

4. **Clean Metadata** → `public/images/cwi-unanswered-files/[case]/metadata.json`
   - All 18 cases have updated metadata structure
   - Ready for image sources to be filled in

5. **Full Documentation** → `README_IMAGE_REBUILD.md`
   - Complete rebuild timeline and process
   - Troubleshooting guide
   - Quality checklist

---

## 🎯 What You Need to Do (Next Steps)

### For Each of the 18 Cases:

1. **Open `docs/IMAGE_SOURCING_GUIDE.md`**
   - Find your case
   - Read specific image requirements

2. **Source 11 Images** (1 hero + 10 gallery)
   - Search Wikimedia Commons or verified news sources
   - Minimum 1200px width
   - Download full-size version

3. **Place in Correct Folder**
   - Folder: `public/images/cwi-unanswered-files/[case-slug]/`
   - Filenames: `hero.jpg`, `image-01.jpg` through `image-10.jpg`

4. **Update `metadata.json`**
   - For each image, fill in:
   - `sourceUrl` (full URL to source)
   - `photographer` (creator name)
   - `source` (e.g., "Wikimedia Commons")
   - `license` (e.g., "CC BY-SA 4.0")
   - `caption` (accurate description)

5. **Run Validation**
   ```bash
   node scripts/validate-cwi-images.js
   ```
   - Should show ✅ for all images
   - Check for warnings about dimensions

6. **Test Website**
   ```bash
   npm run dev
   ```
   - Open `/unanswered-files`
   - Click each article
   - Verify images display correctly

---

## 🚀 Getting Started (Step-by-Step)

### Step 1: Pick a Case
Pick one of these to start:
- Manipur violence
- Women wrestlers case
- Farmers MSP protest

### Step 2: Read the Guide
```bash
# Open and read:
docs/IMAGE_SOURCING_GUIDE.md
```

Find your case section. Example for Manipur:
```
Manipur Violence
Focus: 2023 communal violence, displacement, humanitarian crisis

Hero Image: Relief camp, displaced families, or Imphal cityscape
Gallery Images (10 required):
1. Relief camp or IDP settlement
2. Imphal street/urban scene
3. Churachandpur area
... etc
```

### Step 3: Source Images
**Search Wikimedia Commons:**
1. Go to commons.wikimedia.org
2. Search: "Manipur relief" OR "Imphal"
3. Filter by: CC BY-SA 4.0, CC0, Public Domain
4. Choose high-res version (≥1200px wide)
5. Download

### Step 4: Place in Folder
```
public/images/cwi-unanswered-files/manipur-violence/
├── hero.jpg                 ← Your downloaded image
├── image-01.jpg            ← Your downloaded image
├── image-02.jpg
├── ... (image-03 through image-10)
└── metadata.json
```

### Step 5: Fill Metadata
Edit `metadata.json`:
```json
{
  "filename": "hero.jpg",
  "title": "Relief Camp in Manipur",
  "caption": "Displaced families at relief camp following 2023 violence",
  "alt": "Displaced families in relief camp",
  "source": "Wikimedia Commons",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:...",
  "photographer": "John Smith",
  "license": "CC BY-SA 4.0",
  "case": "Manipur violence",
  "year": "2023",
  "usageNote": "Downloaded legally from Wikimedia Commons"
}
```

### Step 6: Validate
```bash
node scripts/validate-cwi-images.js
```

Should show:
```
✓ PASS [time] Image valid: manipur-violence/hero.jpg (1800x1000)
✓ PASS [time] Image valid: manipur-violence/image-01.jpg (1600x1200)
... etc
```

### Step 7: Test
```bash
npm run dev
```
Visit http://localhost:3000/unanswered-files/manipur-violence

---

## 📊 Priority Order

Start with these (highest impact):

| # | Case | Why | Difficulty |
|---|------|-----|------------|
| 1 | Manipur violence | Recent news, high profile | Medium |
| 2 | Women wrestlers | Clear subject, recent | Easy |
| 3 | Farmers MSP protest | Ongoing movement | Medium |
| 4 | Wayanad landslide | Natural disaster, 2024 | Medium |
| 5 | Ladakh statehood | Political focus | Medium |

---

## 🎨 Image Quality Checklist

For each image before uploading:

- [ ] ≥1200px wide
- [ ] Clear and sharp (not pixelated)
- [ ] Color-appropriate (not washed out)
- [ ] Case-specific (not generic)
- [ ] License verified (CC BY-SA 4.0 or CC0)
- [ ] File size <10MB
- [ ] Format: JPG
- [ ] Filename matches (hero.jpg or image-XX.jpg)

---

## 🐛 Common Issues & Fixes

### "Image width is below 1200px"
- ❌ Don't use that image
- ✅ Find higher-resolution version
- ✅ Use different image from same source

### "Can't find case-specific image"
- ✅ Use fallback search from guide
- ✅ Use related/contextual image
- ✅ Check alternative Wikimedia searches

### "License unclear"
- ✅ Only use CC BY-SA 4.0, CC0, Public Domain
- ❌ Skip if uncertain
- ❌ Do not use copyrighted images

### "Image looks like placeholder"
- ❌ Do not use
- ✅ Find authentic image instead
- ✅ Verify from reliable source

---

## 📞 Files to Reference

| File | Purpose | When to Use |
|------|---------|------------|
| `docs/IMAGE_SOURCING_GUIDE.md` | Detailed sourcing per case | Planning which images to source |
| `README_IMAGE_REBUILD.md` | Full rebuild process | Understanding complete project |
| `scripts/validate-cwi-images.js` | Validate images | After adding images |
| `scripts/manage-cwi-images.py --report` | System diagnostics | Checking overall progress |

---

## ✨ Expected Results

When complete:
- ✅ 198 high-quality images (18 cases × 11 images)
- ✅ All ≥1200px wide
- ✅ All case-specific (no repeats)
- ✅ All properly sourced and licensed
- ✅ All with accurate captions
- ✅ Website shows 18 complete galleries
- ✅ Zero broken images
- ✅ Zero placeholder images
- ✅ Zero spelling mistakes

---

## 🎯 Success Metric

Run this when done:
```bash
node scripts/validate-cwi-images.js
```

Expected output:
```
===============================================================================
CWI IMAGE VALIDATION REPORT
===============================================================================
Results:
  ✓ Passed: 198
  ⚠ Warnings: 0
  ✗ Errors: 0

✓ ALL VALIDATIONS PASSED!
```

---

**Questions? See:**
- `docs/IMAGE_SOURCING_GUIDE.md` - Case-specific guidance
- `README_IMAGE_REBUILD.md` - Full documentation

**Ready to start? Pick a case above and follow the 7 steps!** 🚀

---
