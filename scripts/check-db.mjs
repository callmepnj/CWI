import fs from "node:fs";
import process from "node:process";
import pg from "pg";

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) {
    return;
  }

  const lines = fs.readFileSync(".env.local", "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    if (index === -1) {
      continue;
    }

    const key = trimmed.slice(0, index);
    let value = trimmed.slice(index + 1);
    value = value.replace(/^"|"$/g, "");
    process.env[key] = process.env[key] || value;
  }
}

loadLocalEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not configured.");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false }
});

try {
  const result = await pool.query("select 1 as ok");
  console.log(`db ok ${result.rows[0].ok}`);
} catch (error) {
  console.error(`db failed ${error.code || error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
