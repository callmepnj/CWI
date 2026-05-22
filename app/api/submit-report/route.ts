import { NextResponse } from "next/server";
import { ensureReportsTable, getPool } from "@/lib/db";

export const runtime = "nodejs";

const maxEvidenceFiles = 3;
const maxEvidenceBytes = 4 * 1024 * 1024;
const allowedEvidenceTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

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
  const parsed = await parseReportRequest(request);

  if (!parsed) {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const { body, evidenceFiles } = parsed;

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

  const evidenceError = validateEvidenceFiles(evidenceFiles);

  if (evidenceError) {
    return NextResponse.json({ ok: false, error: evidenceError }, { status: 400 });
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
        evidenceFiles.length > 0 ? evidenceFiles.map((file) => file.name).join(", ") : optionalString(body.proofNote),
        body.message.trim(),
        optionalString(body.creditPreference),
        JSON.stringify({
          ...body,
          evidenceFiles: evidenceFiles.map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size
          }))
        })
      ]
    );
    const reportId = result.rows[0]?.id;

    if (reportId && evidenceFiles.length > 0) {
      await saveEvidenceFiles(reportId, evidenceFiles);
    }

    return NextResponse.json({
      ok: true,
      id: reportId,
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

async function parseReportRequest(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData().catch(() => null);

    if (!formData) {
      return null;
    }

    const body: Record<string, unknown> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        body[key] = value;
      }
    }

    const evidenceFiles = formData
      .getAll("evidenceFiles")
      .filter((value): value is File => value instanceof File && value.size > 0);

    return { body, evidenceFiles };
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return null;
  }

  return { body, evidenceFiles: [] };
}

function validateEvidenceFiles(files: File[]) {
  if (files.length > maxEvidenceFiles) {
    return `Please upload no more than ${maxEvidenceFiles} evidence files.`;
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  if (totalBytes > maxEvidenceBytes) {
    return "Evidence files must be under 4 MB total. For larger videos, paste the source link instead.";
  }

  const unsupportedFile = files.find((file) => !allowedEvidenceTypes.has(file.type));

  if (unsupportedFile) {
    return "Please upload JPG, PNG, PDF, MP4, WebM, MOV, DOC, or DOCX files only.";
  }

  return "";
}

async function saveEvidenceFiles(reportId: number, files: File[]) {
  for (const file of files) {
    const fileData = Buffer.from(await file.arrayBuffer());

    await getPool().query(
      `
        insert into cwi_report_evidence_files (
          report_id,
          file_name,
          file_type,
          file_size,
          file_data
        )
        values ($1, $2, $3, $4, $5);
      `,
      [reportId, file.name, file.type || "application/octet-stream", file.size, fileData]
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
