export const SITE_NAV_SECTIONS = [
  "experience",
  "education",
  "credentials",
  "ventures",
  "apps",
  "insights",
] as const;

export type SiteNavSection = (typeof SITE_NAV_SECTIONS)[number];
export type SiteNavActive = "home" | "none" | SiteNavSection;

const HASH_ON_HOME = new Set<SiteNavSection>([
  "experience",
  "education",
  "credentials",
  "ventures",
]);

export function siteNavHref(
  section: SiteNavSection,
  locale: string,
  isHome: boolean,
): string {
  if (isHome && HASH_ON_HOME.has(section)) {
    return `/${locale}#${section}`;
  }

  return `/${locale}/${section}`;
}

export function languageSwitchPath(
  active: SiteNavActive,
  locale: string,
  languageHref?: string,
): string {
  if (languageHref) {
    return languageHref;
  }

  const oppositeLocale = locale === "ja" ? "en" : "ja";
  if (active === "home" || active === "none") {
    return `/${oppositeLocale}`;
  }

  return `/${oppositeLocale}/${active}`;
}
