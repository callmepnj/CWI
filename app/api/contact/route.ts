import { NextResponse } from "next/server";
import { ensureReportsTable, getPool } from "@/lib/db";

export const runtime = "nodejs";

const attempts = new Map<string, { count: number; resetAt: number }>();
const allowedCategories = new Set([
  "Media inquiry",
  "Creator credit",
  "Takedown request",
  "Correction",
  "Public issue lead",
  "Collaboration",
  "Volunteer / Watcher role",
  "Other"
]);

export async function POST(request: Request) {
  const ip = clientKey(request);
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Too many messages. Please wait before trying again." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = stringValue(body.name);
  const contact = stringValue(body.contact);
  const category = stringValue(body.category);
  const subject = stringValue(body.subject);
  const message = stringValue(body.message);

  if (name.length < 1 || contact.length < 3) {
    return NextResponse.json({ ok: false, error: "Name and contact are required." }, { status: 400 });
  }

  if (!allowedCategories.has(category)) {
    return NextResponse.json({ ok: false, error: "Please select a valid contact category." }, { status: 400 });
  }

  if (subject.length < 3 || message.length < 10) {
    return NextResponse.json({ ok: false, error: "Please add a subject and message." }, { status: 400 });
  }

  if (body.consent !== "on") {
    return NextResponse.json({ ok: false, error: "Consent is required before sending a message." }, { status: 400 });
  }

  try {
    await ensureReportsTable();
    await getPool().query(
      `
        insert into cwi_report_submissions (
          name,
          contact,
          type,
          message,
          credit_preference,
          consent,
          safety,
          raw_payload
        )
        values ($1, $2, 'Other', $3, $4, true, true, $5::jsonb)
      `,
      [
        name,
        contact,
        `Contact category: ${category}\nSubject: ${subject}\n\n${message}`,
        "Contact form",
        JSON.stringify({ name, contact, category, subject, message })
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("CWI contact submission failed", error);
    return NextResponse.json({ ok: false, error: "Unable to send message. Please email CWI directly." }, { status: 500 });
  }
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 5000) : "";
}

function clientKey(request: Request) {
  return (request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown").split(",")[0].trim();
}

function rateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }

  if (current.count >= 5) {
    return false;
  }

  current.count += 1;
  return true;
}
