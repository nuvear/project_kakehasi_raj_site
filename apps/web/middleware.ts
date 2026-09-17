import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  hasPublicLocalePrefix,
  shouldSkipLocalePrefix,
} from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkipLocalePrefix(pathname) || hasPublicLocalePrefix(pathname)) {
    return;
  }

  request.nextUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip Next internals, APIs, and generic static files.
    "/((?!_next|api/|.*\\..*).*)",
    // Dotted crawler files used to be excluded by the extension skip above,
    // so [locale] treated them as languages. Match them explicitly instead.
    "/robots.txt",
    "/sitemap.xml",
  ],
};
