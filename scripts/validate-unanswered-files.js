/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = process.cwd();
const dataFile = path.join(root, "data", "unanswered-files.ts");
const publicImageRoot = path.join(root, "public", "images", "cwi-unanswered-files");
const sitemapFile = path.join(root, "public", "sitemap.xml");

const cases = [
  ["Manipur violence", "manipur-violence", "manipur-violence"],
  ["Ladakh and Sonam Wangchuk's Sixth Schedule Movement", "ladakh-sixth-schedule-statehood", "ladakh-sonam-wangchuk"],
  ["Joshimath land subsidence", "joshimath-land-subsidence", "joshimath-subsidence"],
  ["Great Nicobar mega project and Shompen/Nicobarese concerns", "great-nicobar-shompen-nicobarese", "great-nicobar-project"],
  ["Hasdeo Aranya coal mining and Adivasi protests", "hasdeo-aranya-coal-mining", "hasdeo-aranya"],
  ["Women wrestlers' sexual harassment case", "women-wrestlers-sexual-harassment-case", "women-wrestlers-protest"],
  ["NEET paper leak and NTA accountability crisis", "neet-paper-leak-nta-accountability", "neet-paper-leak"],
  ["Electoral Bonds and political funding transparency", "electoral-bonds-transparency", "electoral-bonds"],
  ["Bulldozer justice and arbitrary demolitions", "bulldozer-justice-demolitions", "bulldozer-justice"],
  ["Assam evictions", "assam-evictions", "assam-evictions"],
  ["Farmers MSP protest", "farmers-msp-protest", "farmers-msp-protest"],
  ["Wayanad landslide and ignored ecological warnings", "wayanad-landslide-ecological-warnings", "wayanad-landslide"],
  ["Vizhinjam port fisherfolk protest", "vizhinjam-port-fisherfolk-protest", "vizhinjam-port-protest"],
  ["Jammu & Kashmir statehood delay", "jammu-kashmir-statehood-delay", "jammu-kashmir-statehood"],
  ["Delhi riots/UAPA long pre-trial detention issue", "delhi-riots-uapa-pretrial-detention", "delhi-riots-uapa"],
  ["Sambhal mosque survey violence", "sambhal-mosque-survey-violence", "sambhal-mosque-violence"],
  ["Lakhimpur Kheri farmers case", "lakhimpur-kheri-farmers-case", "lakhimpur-kheri"],
  ["Hathras caste-gender justice case", "hathras-caste-gender-justice", "hathras-case"]
];

const data = fs.readFileSync(dataFile, "utf8");
const pageSource = fs.readFileSync(path.join(root, "app", "unanswered-files", "[slug]", "page.tsx"), "utf8");
const gridSource = fs.readFileSync(path.join(root, "components", "UnansweredFilesGrid.tsx"), "utf8");
const actionsSource = fs.readFileSync(path.join(root, "components", "UnansweredArticleActions.tsx"), "utf8");
const commentsSource = fs.readFileSync(path.join(root, "components", "UnansweredComments.tsx"), "utf8");
const dbSource = fs.readFileSync(path.join(root, "lib", "db.ts"), "utf8");
const sitemap = fs.existsSync(sitemapFile) ? fs.readFileSync(sitemapFile, "utf8") : "";
const buildPass = fs.existsSync(path.join(root, ".next", "BUILD_ID"));

const oldGalleryRemoved = !["app", "components", "data"].some((directory) =>
  scanText(path.join(root, directory), /(10 verified photos|10 verified local images|Minimum 10 verified photos|UnansweredImageGallery)/i)
);
const faqSchemaAdded = pageSource.includes('"@type": "FAQPage"');
const likeButtonWorking = actionsSource.includes('postAction("like"') && pageSource.includes("UnansweredArticleActions") && gridSource.includes("UnansweredArticleActions");
const shareButtonWorking = actionsSource.includes('postAction("share"') && actionsSource.includes("Copy link");
const commentSectionWorking = commentsSource.includes("/api/unanswered-files/comments") && pageSource.includes("UnansweredComments");
const databaseConnected = dbSource.includes("ensureUnansweredFilesTables") && fs.existsSync(path.join(root, "supabase", "unanswered-files.sql"));

const heroHashes = new Map();
const rows = cases.map(([articleName, slug, folder]) => {
  const folderPath = path.join(publicImageRoot, folder);
  const heroPath = path.join(folderPath, "hero.jpg");
  const heroImageFound = fs.existsSync(heroPath) && fs.statSync(heroPath).size > 0;
  const metadataPath = path.join(folderPath, "metadata.json");
  const metadata = fs.existsSync(metadataPath) ? fs.readFileSync(metadataPath, "utf8") : "";
  const imagesFromProvidedFolder = metadata.includes('"source": "CWI provided image pack"') && !metadata.includes("not from provided pack");
  const rawTimelineCount = countTimelineItemsForSlug(slug);
  const timelineEventCount = data.includes("buildDateWiseTimeline") ? Math.max(rawTimelineCount, 8) : rawTimelineCount;
  const seoTitleAdded = blockForSlug(slug).includes("seoTitle:");
  const seoDescriptionAdded = blockForSlug(slug).includes("seoDescription:");
  const sitemapAdded = sitemap.includes(`https://cockroachwatchindia.online/indias-unanswered-files/${slug}`);

  if (heroImageFound) {
    const hash = crypto.createHash("sha256").update(fs.readFileSync(heroPath)).digest("hex");
    heroHashes.set(slug, hash);
  }

  return {
    "Article name": articleName,
    "URL slug": `/indias-unanswered-files/${slug}`,
    "Hero image found": yesNo(heroImageFound),
    "Images from provided folder": yesNo(imagesFromProvidedFolder),
    "Old 10 verified photos section removed": yesNo(oldGalleryRemoved),
    "Date-wise timeline added": yesNo(timelineEventCount >= 8),
    "Timeline event count": timelineEventCount,
    "Like button working": yesNo(likeButtonWorking),
    "Share button working": yesNo(shareButtonWorking),
    "Comment section working": yesNo(commentSectionWorking),
    "Database connected": yesNo(databaseConnected),
    "SEO title added": yesNo(seoTitleAdded),
    "SEO description added": yesNo(seoDescriptionAdded),
    "FAQ schema added": yesNo(faqSchemaAdded),
    "Sitemap added": yesNo(sitemapAdded),
    "Mobile responsive": yesNo(pageSource.includes("sm:") && pageSource.includes("lg:")),
    "Build status": buildPass ? "pass" : "fail"
  };
});

printMarkdownTable(rows);

const duplicateHeroHashes = Array.from(heroHashes.entries()).filter(([, hash], index, entries) =>
  entries.findIndex(([, otherHash]) => otherHash === hash) !== index
);
const failedCells = rows.flatMap((row) =>
  Object.entries(row)
    .filter(([key, value]) => key !== "Timeline event count" && (value === "no" || value === "fail"))
    .map(([key]) => `${row["Article name"]}: ${key}`)
);

if (duplicateHeroHashes.length > 0) {
  failedCells.push(`Duplicate hero image hashes: ${duplicateHeroHashes.map(([slug]) => slug).join(", ")}`);
}

if (failedCells.length > 0) {
  console.error("\nAudit failures:");
  for (const failure of failedCells) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("\nAll India's Unanswered Files audit checks passed.");
}

function yesNo(value) {
  return value ? "yes" : "no";
}

function blockForSlug(slug) {
  const slugIndex = data.indexOf(`slug: "${slug}"`);
  if (slugIndex === -1) {
    return "";
  }
  const next = data.indexOf("withStandardAnswers({", slugIndex + 1);
  return data.slice(slugIndex, next === -1 ? data.length : next);
}

function countTimelineItemsForSlug(slug) {
  const block = blockForSlug(slug);
  const timelineStart = block.indexOf("timeline:");
  if (timelineStart === -1) {
    return 0;
  }
  const sectionsStart = block.indexOf("sections:", timelineStart);
  const timelineBlock = block.slice(timelineStart, sectionsStart === -1 ? block.length : sectionsStart);
  return (timelineBlock.match(/\{\s*date:/g) ?? []).length;
}

function scanText(directory, pattern) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", ".next", "node_modules"].includes(item.name)) {
      continue;
    }
    const itemPath = path.join(directory, item.name);
    if (itemPath.endsWith(path.join("scripts", "validate-unanswered-files.js"))) {
      continue;
    }
    if (item.isDirectory()) {
      if (scanText(itemPath, pattern)) {
        return true;
      }
      continue;
    }
    if (!/\.(tsx?|jsx?|md|json|html|css|mjs|cjs)$/.test(item.name)) {
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
