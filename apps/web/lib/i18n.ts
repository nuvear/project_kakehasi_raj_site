export const PUBLIC_LOCALES = ["en", "ja"] as const;
export type PublicLocale = (typeof PUBLIC_LOCALES)[number];
export const DEFAULT_LOCALE: PublicLocale = "en";
export const SITE_ORIGIN = "https://www.rajagobalan.com";

export const CRAWLER_FILE_PATHS = ["/robots.txt", "/sitemap.xml"] as const;

export const DIRECT_RUNTIME_PREFIXES = [
  "/apps/ai-transformation-command-center",
] as const;

export function isPublicLocale(value: string): value is PublicLocale {
  return (PUBLIC_LOCALES as readonly string[]).includes(value);
}

export function isCrawlerFilePath(pathname: string): boolean {
  return (CRAWLER_FILE_PATHS as readonly string[]).includes(pathname);
}

export function hasPublicLocalePrefix(pathname: string): boolean {
  return PUBLIC_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

export function hasDirectRuntimePrefix(pathname: string): boolean {
  return DIRECT_RUNTIME_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Paths that must reach their own handlers instead of being locale-prefixed.
 * Crawler files are listed first so dotted well-known names are not treated as locales.
 */
export function shouldSkipLocalePrefix(pathname: string): boolean {
  if (isCrawlerFilePath(pathname)) {
    return true;
  }

  if (hasDirectRuntimePrefix(pathname)) {
    return true;
  }

  if (pathname.startsWith("/api/") || pathname === "/favicon.ico") {
    return true;
  }

  return pathname.includes(".");
}
