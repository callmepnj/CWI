import { NextResponse } from "next/server";
import { ensureReportsTable, getPool } from "@/lib/db";

export const runtime = "nodejs";

const validTypes = new Set([
  "Public Issue",
  "Student / Youth Concern",
  "Viral Claim",
  "Civic Issue",
  "Creator Credit Request",
  "Correction Request",
  "Fact-check Request",
  "Local News Tip",
  "Collaboration",
  "Other"
]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.name !== "string" || body.name.trim().length < 1) {
    return NextResponse.json({ ok: false, error: "Name or handle is required." }, { status: 400 });
  }

  if (typeof body.type !== "string" || !validTypes.has(body.type)) {
    return NextResponse.json({ ok: false, error: "Please select a submission type." }, { status: 400 });
  }

  if (typeof body.sourceUrl === "string" && body.sourceUrl.trim().length > 0 && !isValidUrl(body.sourceUrl)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid link." }, { status: 400 });
  }

  if (typeof body.message !== "string" || body.message.trim().length < 10) {
    return NextResponse.json({ ok: false, error: "Please describe the issue." }, { status: 400 });
  }

  if (body.consent !== "on" || body.safety !== "on" || body.editorialPolicy !== "on") {
    return NextResponse.json({ ok: false, error: "Consent is required before submitting." }, { status: 400 });
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
      message: "Report submitted successfully. The Watch Desk will review it before taking further action."
    });
  } catch (error) {
    console.error("CWI report submission failed", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong while submitting your report. Please try again or contact cockroachwatchindia@gmail.com."
      },
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

function isValidUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
