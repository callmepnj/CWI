import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createAdminSupporterNote, getAdminSupporterNotes, updateAdminSupporterNote } from "@/lib/db/support";
import { invalidateAdminDashboardCache } from "@/lib/cwi-admin-os";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 401 });
  }

  try {
    const notes = await getAdminSupporterNotes(120);
    return NextResponse.json({ ok: true, data: notes });
  } catch (error) {
    console.error("CWI admin supporter notes failed", error);
    return NextResponse.json({ ok: false, error: "Supporter notes could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Supporter note data is required." }, { status: 400 });
  }

  try {
    const note = await createAdminSupporterNote(body);
    invalidateAdminDashboardCache();
    return NextResponse.json({ ok: true, data: note, message: "Supporter note saved." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supporter note could not be saved.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body?.id) {
    return NextResponse.json({ ok: false, error: "Supporter note ID is required." }, { status: 400 });
  }

  try {
    const note = await updateAdminSupporterNote(body);
    invalidateAdminDashboardCache();
    return NextResponse.json({ ok: true, data: note, message: "Supporter note updated." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supporter note could not be updated.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
