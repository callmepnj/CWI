import { existsSync, readFileSync } from "node:fs";

const targetFile = process.argv[2] || ".env.local";
const optional = process.argv.includes("--optional");
const allowPlaceholders = process.argv.includes("--allow-placeholders");

if (!existsSync(targetFile)) {
  if (optional) {
    console.log(`env check skipped: ${targetFile} does not exist`);
    process.exit(0);
  }

  console.error(`env check failed: ${targetFile} does not exist`);
  process.exit(1);
}

const raw = readFileSync(targetFile, "utf8");
const { env, malformed } = parseEnv(raw);
const issues = [];
const warnings = [];

if (malformed.length) {
  issues.push(`Malformed env line(s): ${malformed.join(", ")}`);
}

if (!looksLikePostgresUrl(env.DATABASE_URL)) {
  if (allowPlaceholders && isPlaceholder(env.DATABASE_URL)) {
    warnings.push("DATABASE_URL is still a placeholder.");
  } else {
    issues.push("DATABASE_URL must be a PostgreSQL connection string.");
  }
}

if (env.DATABASE_SSL && !["true", "false"].includes(env.DATABASE_SSL)) {
  issues.push("DATABASE_SSL must be true or false.");
}

if (!env.CWI_ADMIN_PASSWORD || env.CWI_ADMIN_PASSWORD.length < 12 || env.CWI_ADMIN_PASSWORD.includes("CHANGE_ME")) {
  if (allowPlaceholders && isPlaceholder(env.CWI_ADMIN_PASSWORD)) {
    warnings.push("CWI_ADMIN_PASSWORD is still a placeholder.");
  } else {
    issues.push("CWI_ADMIN_PASSWORD must be replaced with a real value of at least 12 characters.");
  }
}

if (env.ADMIN_PASSWORD && env.ADMIN_PASSWORD.includes("CHANGE_ME")) {
  warnings.push("ADMIN_PASSWORD is still a placeholder. It is optional if CWI_ADMIN_PASSWORD is set.");
}

const provider = (env.AI_PROVIDER || "").toLowerCase();
if (!["openai", "gemini", "mock"].includes(provider)) {
  issues.push("AI_PROVIDER must be openai, gemini, or mock.");
}

if (provider === "openai" && !hasRealSecret(env.OPENAI_API_KEY, "OPENAI")) {
  if (allowPlaceholders && isPlaceholder(env.OPENAI_API_KEY)) {
    warnings.push("OPENAI_API_KEY is still a placeholder.");
  } else {
    issues.push("AI_PROVIDER=openai requires OPENAI_API_KEY.");
  }
}

if (provider === "gemini" && !hasRealSecret(env.GEMINI_API_KEY, "GEMINI")) {
  if (allowPlaceholders && isPlaceholder(env.GEMINI_API_KEY)) {
    warnings.push("GEMINI_API_KEY is still a placeholder.");
  } else {
    issues.push("AI_PROVIDER=gemini requires GEMINI_API_KEY.");
  }
}

if (provider === "mock" && isProductionTemplate(targetFile)) {
  issues.push("AI_PROVIDER=mock must not be used in the Vercel production env template.");
}

if (containsCredentialShape(raw) && targetFile === "vercel.env") {
  warnings.push("vercel.env appears to contain credential-shaped values. Keep this file ignored and rotate any real values that were pasted here.");
}

for (const warning of warnings) {
  console.warn(`env warning: ${warning}`);
}

if (issues.length) {
  for (const issue of issues) {
    console.error(`env error: ${issue}`);
  }
  process.exit(1);
}

console.log(`env check passed: ${targetFile}`);

function parseEnv(value) {
  const env = {};
  const malformedLines = [];
  const lines = value.split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      malformedLines.push(String(index + 1));
      return;
    }

    const [, key, rawValue] = match;
    const parsed = parseValue(rawValue);
    if (parsed === null) {
      malformedLines.push(String(index + 1));
      return;
    }

    env[key] = parsed;
  });

  return { env, malformed: malformedLines };
}

function parseValue(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith('"')) {
    if (!trimmed.endsWith('"') || trimmed.length === 1) return null;
    return trimmed.slice(1, -1);
  }

  if (trimmed.startsWith("'")) {
    if (!trimmed.endsWith("'") || trimmed.length === 1) return null;
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function looksLikePostgresUrl(value) {
  if (!value || value.includes("CHANGE_ME")) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "postgresql:" || url.protocol === "postgres:";
  } catch {
    return false;
  }
}

function hasRealSecret(value, providerName) {
  return Boolean(value && value.length > 12 && !value.includes("CHANGE_ME") && !value.includes(`${providerName}_API_KEY`));
}

function isPlaceholder(value) {
  return Boolean(value && value.includes("CHANGE_ME"));
}

function isProductionTemplate(file) {
  return file.replaceAll("\\", "/").endsWith("vercel.env");
}

function containsCredentialShape(value) {
  return /sk-[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]{20,}|postgres(?:ql)?:\/\/[^"'\s]+:[^"'\s]+@/i.test(value);
}
