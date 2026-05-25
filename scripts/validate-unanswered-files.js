/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const imageRoot = path.join(root, "public", "images", "india-unanswered-files");
const indexPath = path.join(imageRoot, "image-index.json");
const sitemapPath = path.join(root, "public", "sitemap.xml");
const pageSource = fs.readFileSync(path.join(root, "app", "unanswered-files", "[slug]", "page.tsx"), "utf8");
const dataSource = fs.readFileSync(path.join(root, "data", "unanswered-files.ts"), "utf8");
const imageDataSource = fs.readFileSync(path.join(root, "data", "unanswered-file-images.ts"), "utf8");
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";

const cases = [
  ["Manipur violence", "manipur-violence", "Manipur violence", "manipur-violence"],
  ["Ladakh and Sonam Wangchuk's Sixth Schedule Movement", "ladakh-sixth-schedule-statehood", "Ladakh and Sonam Wangchuk’s Sixth Schedulestatehood movement photos", "ladakh-sonam-wangchuk"],
  ["Joshimath land subsidence", "joshimath-land-subsidence", "Joshimath land subsidence", "joshimath-land-subsidence"],
  ["Great Nicobar mega project and Shompen/Nicobarese concerns", "great-nicobar-shompen-nicobarese", "Great Nicobar mega project and ShompenNicobarese concerns", "great-nicobar-project"],
  ["Hasdeo Aranya coal mining and Adivasi protests", "hasdeo-aranya-coal-mining", "Hasdeo coal mining", "hasdeo-coal-mining"],
  ["Women wrestlers' sexual harassment case", "women-wrestlers-sexual-harassment-case", "Women wrestlers sexual harassment case", "women-wrestlers-case"],
  ["NEET paper leak and NTA accountability crisis", "neet-paper-leak-nta-accountability", "NEET paper leak and NTA accountability crisis", "neet-paper-leak"],
  ["Electoral Bonds and political funding transparency", "electoral-bonds-transparency", "Electoral Bonds and political funding transparency", "electoral-bonds"],
  ["Bulldozer justice and arbitrary demolitions", "bulldozer-justice-demolitions", "Bulldozer justice and arbitrary demolitions", "bulldozer-justice"],
  ["Assam evictions", "assam-evictions", "Assam evictions", "assam-evictions"],
  ["Farmers MSP protest", "farmers-msp-protest", "Farmers MSP protest", "farmers-msp-protest"],
  ["Wayanad landslide and ignored ecological warnings", "wayanad-landslide-ecological-warnings", "Wayanad landslide and ignored ecological warnings", "wayanad-landslide"],
  ["Vizhinjam port fisherfolk protest", "vizhinjam-port-fisherfolk-protest", "Vizhinjam port fisherfolk protest", "vizhinjam-port-protest"],
  ["Jammu & Kashmir statehood delay", "jammu-kashmir-statehood-delay", "Jammu & Kashmir statehood delay", "jammu-kashmir-statehood"],
  ["Delhi riots/UAPA long pre-trial detention issue", "delhi-riots-uapa-pretrial-detention", path.join("Delhi riots", "UAPA long pre-trial detention issue"), "delhi-riots-uapa"],
  ["Sambhal mosque survey violence", "sambhal-mosque-survey-violence", "Sambhal mosque survey violence", "sambhal-mosque-survey-violence"],
  ["Lakhimpur Kheri farmers case", "lakhimpur-kheri-farmers-case", "Lakhimpur Kheri farmers case", "lakhimpur-kheri"],
  ["Hathras caste-gender justice case", "hathras-caste-gender-justice", "Hathras caste-gender justice case", "hathras-case"],
];

const buildPass = fs.existsSync(path.join(root, ".next", "BUILD_ID"));
const indexExists = fs.existsSync(indexPath);
const oldGalleryPhrases = [
  ["10 verified", "photos"].join(" "),
  ["10 verified", "local images"].join(" "),
  ["Minimum 10 verified", "photos"].join(" "),
  ["Unanswered", "ImageGallery"].join(""),
];
const oldGalleryPattern = new RegExp(oldGalleryPhrases.map(escapeRegExp).join("|"), "i");
const oldGalleryRemoved = !["app", "components", "data"].some((directory) =>
  scanText(path.join(root, directory), oldGalleryPattern)
);
const legacyHostPattern = new RegExp(
  [
    ["cwi-ten", "vercel", "app"].join("."),
    ["cwi", "git", "main"].join("-"),
  ]
    .map(escapeRegExp)
    .join("|"),
  "i"
);
const noOldVercel = !scanText(root, legacyHostPattern);
const rows = cases.map(([articleName, slug, folder, fileSlug]) => {
  const folderPath = path.join(imageRoot, folder);
  const metadataPath = path.join(folderPath, "metadata.json");
  const metadata = fs.existsSync(metadataPath) ? JSON.parse(fs.readFileSync(metadataPath, "utf8")) : [];
  const imageTypes = new Set(metadata.map((item) => item.type));
  const galleryCount = metadata.filter((item) => item.type === "gallery").length;
  const newImageUsed = metadata.some((item) => item.source === "new photos");

  return {
    "Article name": articleName,
    "URL slug": `/india-unanswered-files/${slug}`,
    "Hero image found": yesNo(fileExists(folderPath, `${fileSlug}-cwi-unanswered-files-hero-01.webp`) && imageTypes.has("hero")),
    "Thumbnail found": yesNo(fileExists(folderPath, `${fileSlug}-cwi-unanswered-files-thumbnail-01.webp`) && imageTypes.has("thumbnail")),
    "OG image found": yesNo(fileExists(folderPath, `${fileSlug}-cwi-unanswered-files-og-01.webp`) && imageTypes.has("og")),
    "Gallery count": galleryCount,
    "New photo used": yesNo(newImageUsed),
    "Old gallery removed": yesNo(oldGalleryRemoved),
    "Date-wise timeline added": yesNo(dataSource.includes("buildDateWiseTimeline")),
    "Like/share/save/view": yesNo(pageSource.includes("UnansweredArticleActions")),
    "Comment section": yesNo(pageSource.includes("UnansweredComments")),
    "SEO image fields": yesNo(["heroImage", "thumbnailImage", "ogImage", "socialImages", "galleryImages", "altText"].every((field) => dataSource.includes(field))),
    "FAQ schema": yesNo(pageSource.includes('"@type": "FAQPage"')),
    "Image index": yesNo(indexExists),
    "Sitemap added": yesNo(sitemap.includes(`https://cockroachwatchindia.online/india-unanswered-files/${slug}`)),
    "No old Vercel URL": yesNo(noOldVercel),
    "Build status": buildPass ? "pass" : "fail",
  };
});

printMarkdownTable(rows);

const failures = rows.flatMap((row) => {
  const rowFailures = [];
  for (const [key, value] of Object.entries(row)) {
    if (["Gallery count", "New photo used"].includes(key)) {
      continue;
    }
    if (value === "no" || value === "fail") {
      rowFailures.push(`${row["Article name"]}: ${key}`);
    }
  }
  if (row["Gallery count"] < 3) {
    rowFailures.push(`${row["Article name"]}: Gallery count`);
  }
  return rowFailures;
});

if (!imageDataSource.includes('unansweredFileImageRoot = "/images/india-unanswered-files"')) {
  failures.push("data/unanswered-file-images.ts does not use /images/india-unanswered-files");
}

if (failures.length > 0) {
  console.error("\nValidation failures:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("\nIndia Unanswered Files image validation passed.");
}

function fileExists(folderPath, filename) {
  const file = path.join(folderPath, filename);
  return fs.existsSync(file) && fs.statSync(file).size > 0;
}

function yesNo(value) {
  return value ? "yes" : "no";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scanText(directory, pattern) {
  if (!fs.existsSync(directory)) {
    return false;
  }

  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", ".next", "node_modules", "new photos"].includes(item.name)) {
      continue;
    }
    const itemPath = path.join(directory, item.name);
    if (item.isDirectory()) {
      if (scanText(itemPath, pattern)) {
        return true;
      }
      continue;
    }
    if (!/\.(tsx?|jsx?|md|json|html|css|mjs|cjs)$/.test(item.name)) {
      continue;
    }
    if (itemPath.endsWith(path.join("scripts", "validate-unanswered-files.js"))) {
      continue;
    }
    if (pattern.test(fs.readFileSync(itemPath, "utf8"))) {
      return true;
    }
  }
  return false;
}

function printMarkdownTable(tableRows) {
  const headers = Object.keys(tableRows[0]);
  console.log(`| ${headers.join(" | ")} |`);
  console.log(`| ${headers.map(() => "---").join(" | ")} |`);
  for (const row of tableRows) {
    console.log(`| ${headers.map((header) => String(row[header]).replace(/\|/g, "\\|")).join(" | ")} |`);
  }
}
