import { NextResponse, type NextRequest } from "next/server";

const officialHost = "cockroachwatchindia.online";
const legacyHosts = new Set([["cwi-ten", "vercel", "app"].join(".")]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (!host || !legacyHosts.has(host)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.hostname = officialHost;
  url.port = "";

  return NextResponse.redirect(url, 308);
}
