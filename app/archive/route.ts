import { NextResponse, type NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/watch-desk";
  return NextResponse.redirect(url, 308);
}
