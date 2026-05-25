import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

const cookieName = "cwi_admin_session";

export function getAdminSecret() {
  return process.env.CWI_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "";
}

export function isAdminConfigured() {
  return getAdminSecret().length >= 12;
}

export function createAdminSessionValue() {
  return hashValue(`cwi-admin-session:${getAdminSecret()}`);
}

export function verifyAdminPassword(password: string) {
  const secret = getAdminSecret();
  if (!secret || !password) {
    return false;
  }

  return safeCompare(hashValue(password), hashValue(secret));
}

export async function isAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(cookieName)?.value ?? "";
  return verifyAdminSessionValue(session);
}

export function isAdminRequest(request: NextRequest | Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const session = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))
    ?.split("=")[1];

  return verifyAdminSessionValue(session ? decodeURIComponent(session) : "");
}

export async function requireAdminPage() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }
}

export function getAdminCookieName() {
  return cookieName;
}

function verifyAdminSessionValue(value: string) {
  if (!isAdminConfigured() || !value) {
    return false;
  }

  return safeCompare(value, createAdminSessionValue());
}

function safeCompare(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) {
    return false;
  }

  return timingSafeEqual(firstBuffer, secondBuffer);
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
