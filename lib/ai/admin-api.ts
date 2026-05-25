import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

export function requireAdminApi(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 401 });
  }
  return null;
}

export function ok(data: unknown, message?: string) {
  return NextResponse.json({ ok: true, message, data });
}

export function fail(error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : "Request failed.";
  return NextResponse.json({ ok: false, error: message }, { status });
}
