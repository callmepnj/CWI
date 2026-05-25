import { NextResponse } from "next/server";
import { createAdminSessionValue, getAdminCookieName, isAdminConfigured, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin password is not configured. Set CWI_ADMIN_PASSWORD with at least 12 characters." },
      { status: 503 }
    );
  }

  if (!verifyAdminPassword(body?.password ?? "")) {
    return NextResponse.json({ ok: false, error: "Invalid admin password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, message: "Admin session started." });
  response.cookies.set(getAdminCookieName(), createAdminSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/"
  });

  return response;
}
