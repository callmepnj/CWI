import { NextResponse } from "next/server";
import { ensureReportsTable, getPool } from "@/lib/db";

export const runtime = "nodejs";

const validTypes = new Set([
  "Public Issue",
  "Viral Video",
  "Meme / Creative",
  "Fact-check request",
  "Correction",
  "Creator credit request",
  "Collaboration",
  "Youth story",
  "Local civic issue"
]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.type !== "string" || !validTypes.has(body.type)) {
    return NextResponse.json({ ok: false, error: "Submission type is required." }, { status: 400 });
  }

  if (typeof body.message !== "string" || body.message.trim().length < 10) {
    return NextResponse.json({ ok: false, error: "Describe the issue in at least 10 characters." }, { status: 400 });
  }

  if (body.consent !== "on" || body.safety !== "on") {
    return NextResponse.json({ ok: false, error: "Consent and safety confirmation are required." }, { status: 400 });
  }

  try {
    await ensureReportsTable();

    const result = await getPool().query<{ id: number }>(
      `
        insert into cwi_report_submissions (
          name,
          contact,
          city,
          state,
          type,
          source_url,
          proof_note,
          message,
          credit_preference,
          consent,
          safety,
          raw_payload
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, true, $10::jsonb)
        returning id;
      `,
      [
        optionalString(body.name),
        optionalString(body.contact),
        optionalString(body.city),
        optionalString(body.state),
        body.type,
        optionalString(body.sourceUrl),
        optionalString(body.proofNote),
        body.message.trim(),
        optionalString(body.creditPreference),
        JSON.stringify(body)
      ]
    );

    return NextResponse.json({
      ok: true,
      id: result.rows[0]?.id,
      message: "Report received. The Watch Desk will review it."
    });
  } catch (error) {
    console.error("CWI report submission failed", error);

    return NextResponse.json(
      { ok: false, error: "The Watch Desk could not save this report right now. Please try again." },
      { status: 500 }
    );
  }
}

function optionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
