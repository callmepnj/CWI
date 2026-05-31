import { NextResponse, type NextRequest } from "next/server";

const officialHost = "cockroachwatchindia.online";
const redirectHosts = new Set([["cwi-ten", "vercel", "app"].join("."), "cockroachwatchindia.online"]);

const routeRedirects: Array<[RegExp, string | ((pathname: string) => string)]> = [
  [/^\/latest$/, "/live-newsroom"],
  [/^\/latest-cwi-updates$/, "/live-newsroom"],
  [/^\/watch-desk$/, "/archive"],
  [/^\/watch-desk\/(category|tag)\/[^/]+$/, "/archive"],
  [/^\/watch-desk\/(.+)$/, (pathname) => pathname.replace("/watch-desk/", "/archive/")],
  [/^\/watch$/, "/archive"],
  [/^\/watch\/manipur-crisis$/, "/india-unanswered-files/manipur-violence"],
  [/^\/manipur-investigation$/, "/india-unanswered-files/manipur-violence"],
  [/^\/charter$/, "/editorial-policy#charter"],
  [/^\/issues$/, "/submit#what-to-submit"],
  [/^\/join$/, "/submit#how-to-contribute"],
  [/^\/five-point-agenda$/, "/archive/cjp-five-point-agenda-explained-with-context"],
  [/^\/youth-voice$/, "/submit#youth-voice"],
  [/^\/media-bank$/, "/credit-policy"],
  [/^\/cockroach-watch-india-guide$/, "/about"],
  [/^\/what-is-cwi$/, "/about"],
  [/^\/about-cockroach-watch-india$/, "/about"],
  [/^\/cockroach-watch-india$/, "/about"]
];

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
    normalizeHost(url, host);
    return NextResponse.redirect(url, 308);
  }

  for (const [pattern, destination] of routeRedirects) {
    if (pattern.test(url.pathname)) {
      const target = typeof destination === "function" ? destination(url.pathname) : destination;
      const [pathname, hash] = target.split("#");
      url.pathname = pathname;
      url.hash = hash ? `#${hash}` : "";
      normalizeHost(url, host);
      return NextResponse.redirect(url, 308);
    }
  }

  if (!host || !redirectHosts.has(host)) {
    return NextResponse.next();
  }

  normalizeHost(url, host);
  return NextResponse.redirect(url, 308);
}

function normalizeHost(url: URL, host?: string) {
  if (host && redirectHosts.has(host)) {
    url.protocol = "https:";
    url.hostname = officialHost;
    url.port = "";
  }
}


