import { NextResponse } from "next/server";
import { createPublicSupporterNote, getApprovedSupporterNotes } from "@/lib/db/support";

export const runtime = "nodejs";

export async function GET() {
  try {
    const notes = await getApprovedSupporterNotes(24);
    return NextResponse.json({ ok: true, data: notes });
  } catch (error) {
    console.error("CWI public supporter notes failed", error);
    return NextResponse.json({ ok: true, data: [] });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ ok: false, error: "Supporter note is required." }, { status: 400 });
  }

  try {
    await createPublicSupporterNote({
      displayName: text(body.displayName),
      handle: text(body.handle),
      amount: text(body.amount),
      amountDisplayMode: text(body.amountDisplayMode),
      comment: text(body.comment),
      consentToDisplay: Boolean(body.consentToDisplay),
      confirmation: Boolean(body.confirmation)
    });

    return NextResponse.json({
      ok: true,
      message: "Supporter note submitted for review. It will appear only after verification, consent check, and moderation."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supporter note could not be submitted.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}
