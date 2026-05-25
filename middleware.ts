import { NextResponse, type NextRequest } from "next/server";

const officialHost = "cockroachwatchindia.online";
const legacyHosts = new Set([["cwi-ten", "vercel", "app"].join("."), `www.${officialHost}`]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  const url = request.nextUrl.clone();

  if (
    url.pathname === "/unanswered-files" ||
    url.pathname.startsWith("/unanswered-files/") ||
    url.pathname === "/indias-unanswered-files" ||
    url.pathname.startsWith("/indias-unanswered-files/")
  ) {
    url.pathname = url.pathname
      .replace("/unanswered-files", "/india-unanswered-files")
      .replace("/indias-unanswered-files", "/india-unanswered-files");
    if (host && legacyHosts.has(host)) {
      url.protocol = "https:";
      url.hostname = officialHost;
      url.port = "";
    }
    return NextResponse.redirect(url, 308);
  }

  if (!host || !legacyHosts.has(host)) {
    return NextResponse.next();
  }

  url.protocol = "https:";
  url.hostname = officialHost;
  url.port = "";

  return NextResponse.redirect(url, 308);
}
