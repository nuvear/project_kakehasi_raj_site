import type { MetadataRoute } from "next";
import { getDatabase } from "@kakehashi/db";
import { getEntityRoute, type PublicLocale } from "@/lib/entity-routes";
import { PUBLIC_LOCALES, SITE_ORIGIN } from "@/lib/i18n";
import { isLiveMarketingEntity } from "@/lib/marketing-entities";

/** Locale-prefixed marketing indexes and docs that are not content entities. */
const EXTRA_LOCALE_PATHS = [
  "/insights",
  "/credentials",
  "/experience",
  "/education",
  "/ventures",
  "/apps",
  "/apps/ai-transformation-command-center/docs/deployment",
] as const;

function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path}`;
}

function languageAlternates(pathWithoutLocale: string): Record<string, string> {
  return Object.fromEntries(
    PUBLIC_LOCALES.map((locale) => [
      locale,
      absoluteUrl(`/${locale}${pathWithoutLocale}`),
    ]),
  );
}

function remainderAfterLocale(pathname: string, locale: PublicLocale): string {
  const prefix = `/${locale}`;
  if (pathname === prefix) {
    return "";
  }
  return pathname.slice(prefix.length);
}

export async function getMarketingSitemapEntries(): Promise<
  MetadataRoute.Sitemap
> {
  const db = await getDatabase();
  const paths = new Set<string>();

  for (const locale of PUBLIC_LOCALES) {
    paths.add(`/${locale}`);
    for (const extra of EXTRA_LOCALE_PATHS) {
      paths.add(`/${locale}${extra}`);
    }
  }

  const entities = await db.listEntities();
  for (const entity of entities) {
    if (!isLiveMarketingEntity(entity)) {
      continue;
    }

    for (const locale of PUBLIC_LOCALES) {
      const path = getEntityRoute(entity.id, locale);
      if (!path) {
        continue;
      }
      const translation = await db.getTranslation(entity.id, locale);
      if (!translation) {
        continue;
      }
      paths.add(path);
    }
  }

  return [...paths]
    .sort((a, b) => a.localeCompare(b))
    .map((pathname) => {
      const locale = pathname.split("/").filter(Boolean)[0] as PublicLocale;
      const remainder = remainderAfterLocale(pathname, locale);
      return {
        url: absoluteUrl(pathname),
        alternates: {
          languages: languageAlternates(remainder),
        },
      };
    });
}
