import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// TODO: OVERWRITE FILE IN NEXT RELEASE
const ENABLE_TICKETING = process.env.NEXT_PUBLIC_ENABLE_TICKETING === "true";

export function proxy(request: NextRequest) {
  if (ENABLE_TICKETING) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Redirect ticketing-related pages to home when ticketing is disabled
  const blockedPaths = new Set([
    "/upcoming-event",
    "/checkout",
    "/payment",
    "/confirmation",
  ]);

  if (blockedPaths.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/upcoming-event", "/checkout", "/payment", "/confirmation"],
};
