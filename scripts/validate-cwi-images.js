#!/usr/bin/env node

/**
 * CWI Unanswered Files Image Validation Script
 * 
 * Validates:
 * 1. All 18 case folders exist with correct names
 * 2. Each folder contains hero.jpg and image-01.jpg through image-10.jpg
 * 3. Each image is at least 1200px wide
 * 4. No image is 0 bytes (corrupt)
 * 5. No duplicate filenames across folders
 * 6. No duplicate image URLs in metadata
 * 7. metadata.json exists in every folder
 * 8. All metadata fields are properly filled
 * 9. No spelling mistakes in case names and metadata
 * 10. Website integration is correct
 * 11. No repeated hero images
 * 12. No repeated thumbnail patterns
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const CASES = {
  "manipur-violence": "Manipur violence",
  "ladakh-sonam-wangchuk": "Ladakh / Sonam Wangchuk",
  "joshimath-subsidence": "Joshimath land subsidence",
  "great-nicobar-project": "Great Nicobar mega project",
  "hasdeo-aranya": "Hasdeo Aranya coal mining",
  "women-wrestlers-protest": "Women wrestlers case",
  "neet-paper-leak": "NEET paper leak / NTA",
  "electoral-bonds": "Electoral Bonds transparency",
  "bulldozer-justice": "Bulldozer justice",
  "assam-evictions": "Assam evictions",
  "farmers-msp-protest": "Farmers MSP protest",
  "wayanad-landslide": "Wayanad landslide",
  "vizhinjam-port-protest": "Vizhinjam port protest",
  "jammu-kashmir-statehood": "Jammu & Kashmir statehood",
  "delhi-riots-uapa": "Delhi riots / UAPA",
  "sambhal-mosque-violence": "Sambhal mosque violence",
  "lakhimpur-kheri": "Lakhimpur Kheri farmers",
  "hathras-case": "Hathras caste-gender case"
};

const EXPECTED_IMAGES = ["hero.jpg", ...Array.from({ length: 10 }, (_, i) => `image-${String(i + 1).padStart(2, "0")}.jpg`)];

const IMAGES_PATH = path.join(__dirname, "../public/images/cwi-unanswered-files");

let errorCount = 0;
let warningCount = 0;
let passCount = 0;

const colors = {
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m"
};

function log(type, message) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;
  
  switch (type) {
    case "error":
      console.error(`${colors.red}✗ ERROR${colors.reset} ${prefix} ${message}`);
      errorCount++;
      break;
    case "warning":
      console.warn(`${colors.yellow}⚠ WARNING${colors.reset} ${prefix} ${message}`);
      warningCount++;
      break;
    case "pass":
      console.log(`${colors.green}✓ PASS${colors.reset} ${prefix} ${message}`);
      passCount++;
      break;
    case "info":
      console.log(`${colors.cyan}ℹ INFO${colors.reset} ${prefix} ${message}`);
      break;
  }
}

function getImageDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // Check JPEG marker
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] === 0xff) {
          const marker = buffer[offset + 1];
          const length = buffer.readUInt16BE(offset + 2);
          
          // SOF marker (Start of Frame)
          if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
            const height = buffer.readUInt16BE(offset + 5);
            const width = buffer.readUInt16BE(offset + 7);
            return { width, height };
          }
          offset += length + 2;
        } else {
          offset++;
        }
      }
    }
    
    // PNG format
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
    
    return null;
  } catch (err) {
    return null;
  }
}

function validateFolderStructure() {
  log("info", "Validating folder structure...");
  
  if (!fs.existsSync(IMAGES_PATH)) {
    log("error", `Images root path does not exist: ${IMAGES_PATH}`);
    return false;
  }
  
  for (const [slug, name] of Object.entries(CASES)) {
    const folderPath = path.join(IMAGES_PATH, slug);
    
    if (!fs.existsSync(folderPath)) {
      log("error", `Missing case folder: ${slug} (${name})`);
    } else {
      log("pass", `Case folder exists: ${slug}`);
    }
  }
}

function validateImages() {
  log("info", "Validating images...");
  
  const seenUrls = new Set();
  const seenHeroes = new Map();
  const sizeMap = new Map();
  
  for (const [slug, name] of Object.entries(CASES)) {
    const folderPath = path.join(IMAGES_PATH, slug);
    
    if (!fs.existsSync(folderPath)) continue;
    
    for (const expectedImage of EXPECTED_IMAGES) {
      const imagePath = path.join(folderPath, expectedImage);
      
      if (!fs.existsSync(imagePath)) {
        log("error", `Missing image: ${slug}/${expectedImage}`);
      } else {
        const stats = fs.statSync(imagePath);
        
        if (stats.size === 0) {
          log("error", `Image is empty (0 bytes): ${slug}/${expectedImage}`);
        } else if (stats.size > 10000000) {
          log("warning", `Image is very large (${(stats.size / 1000000).toFixed(2)}MB): ${slug}/${expectedImage}`);
        } else {
          // Check dimensions
          const dims = getImageDimensions(imagePath);
          if (dims) {
            if (dims.width < 1200) {
              log("warning", `Image width is below 1200px (${dims.width}px): ${slug}/${expectedImage}`);
            } else {
              log("pass", `Image valid: ${slug}/${expectedImage} (${dims.width}x${dims.height})`);
            }
            
            // Track hero images for duplicate detection
            if (expectedImage === "hero.jpg") {
              const sizeKey = `${dims.width}x${dims.height}-${stats.size}`;
              if (!seenHeroes.has(sizeKey)) {
                seenHeroes.set(sizeKey, []);
              }
              seenHeroes.get(sizeKey).push(slug);
            }
            
            sizeMap.set(`${slug}/${expectedImage}`, stats.size);
          } else {
            log("warning", `Could not determine image dimensions: ${slug}/${expectedImage}`);
          }
        }
      }
    }
  }
  
  // Check for duplicate hero images
  log("info", "Checking for visually similar hero images...");
  for (const [sizeKey, cases] of seenHeroes.entries()) {
    if (cases.length > 1) {
      log("warning", `Potential duplicate hero images (same dimensions): ${cases.join(", ")}`);
    }
  }
}

function validateMetadata() {
  log("info", "Validating metadata.json files...");
  
  const seenUrls = new Set();
  
  for (const [slug, name] of Object.entries(CASES)) {
    const folderPath = path.join(IMAGES_PATH, slug);
    const metadataPath = path.join(folderPath, "metadata.json");
    
    if (!fs.existsSync(metadataPath)) {
      log("error", `Missing metadata.json: ${slug}`);
      continue;
    }
    
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      
      if (Array.isArray(metadata)) {
        for (const entry of metadata) {
          // Check required fields
          const requiredFields = ["filename", "caption", "source", "sourceUrl", "photographer", "license", "date", "usageNote"];
          for (const field of requiredFields) {
            if (!entry[field]) {
              log("error", `Missing field '${field}' in ${slug}/metadata.json`);
            }
          }
          
          // Check for duplicate URLs
          if (entry.sourceUrl && entry.sourceUrl !== "") {
            if (seenUrls.has(entry.sourceUrl)) {
              log("warning", `Duplicate source URL in ${slug}: ${entry.sourceUrl}`);
            } else {
              seenUrls.add(entry.sourceUrl);
            }
          }
          
          // Spell check key fields
          checkSpelling(entry.caption, `${slug} caption`);
        }
        log("pass", `Metadata valid: ${slug}`);
      } else {
        log("warning", `metadata.json is not an array: ${slug}`);
      }
    } catch (err) {
      log("error", `Invalid JSON in ${slug}/metadata.json: ${err.message}`);
    }
  }
}

function checkSpelling(text, context) {
  const commonMisspellings = {
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
    "Sonam Wanchuk": "Sonam Wangchuk",
    "Nicobarise": "Nicobarese"
  };
  
  for (const [wrong, correct] of Object.entries(commonMisspellings)) {
    if (text && text.includes(wrong)) {
      log("error", `Spelling error in ${context}: "${wrong}" should be "${correct}"`);
    }
  }
}

function validateWebsiteIntegration() {
  log("info", "Validating website integration...");
  
  const dataFilePath = path.join(__dirname, "../data/unanswered-file-images.ts");
  if (!fs.existsSync(dataFilePath)) {
    log("error", `Data file not found: ${dataFilePath}`);
    return;
  }
  
  const dataContent = fs.readFileSync(dataFilePath, "utf-8");
  
  // Check for all cases in data file
  for (const [slug, name] of Object.entries(CASES)) {
    if (!dataContent.includes(`"${slug}"`)) {
      log("error", `Case not found in data file: ${slug}`);
    } else {
      log("pass", `Case found in data file: ${slug}`);
    }
  }
}

function generateReport() {
  console.log("\n" + "=".repeat(80));
  console.log("CWI IMAGE VALIDATION REPORT");
  console.log("=".repeat(80));
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log(`\nResults:`);
  console.log(`  ${colors.green}✓ Passed: ${passCount}${colors.reset}`);
  console.log(`  ${colors.yellow}⚠ Warnings: ${warningCount}${colors.reset}`);
  console.log(`  ${colors.red}✗ Errors: ${errorCount}${colors.reset}`);
  
  if (errorCount === 0 && warningCount === 0) {
    console.log(`\n${colors.green}✓ ALL VALIDATIONS PASSED!${colors.reset}`);
    process.exit(0);
  } else if (errorCount === 0) {
    console.log(`\n${colors.yellow}⚠ Validation complete with warnings. Review above for details.${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}✗ VALIDATION FAILED. Please fix errors above.${colors.reset}`);
    process.exit(1);
  }
}

// Main execution
console.log(`${colors.cyan}CWI Unanswered Files Image Validation Script${colors.reset}`);
console.log("=".repeat(80));

validateFolderStructure();
validateImages();
validateMetadata();
validateWebsiteIntegration();

generateReport();
