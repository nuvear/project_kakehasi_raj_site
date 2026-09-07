export type PublicLocale = "en" | "ja";

const ENTITY_ROUTE_SEGMENTS: Record<string, string> = {
  app: "apps",
  education: "education",
  experience: "experience",
  framework: "frameworks",
  insight: "insights",
  venture: "ventures"
};

export function getEntityRoute(entityId: string, locale: PublicLocale): string | undefined {
  if (entityId === "framework.enterprise-ai-transformation") return `/${locale}/apps/ai-transformation-command-center`;
  if (entityId === "app.to-do-list") return undefined;
  const [entityType, ...slugParts] = entityId.split(".");
  const slug = slugParts.join(".");

  if (entityType === "profile") {
    return `/${locale}`;
  }

  const segment = ENTITY_ROUTE_SEGMENTS[entityType];
  if (!segment || !slug) {
    return undefined;
  }

  return `/${locale}/${segment}/${slug}`;
}

export function getEntityTypeLabel(entityType: string, locale: PublicLocale): string {
  const labels: Record<PublicLocale, Record<string, string>> = {
    en: {
      app: "App",
      education: "Education",
      experience: "Experience",
      framework: "Framework",
      insight: "Insight",
      profile: "Profile",
      venture: "Venture"
    },
    ja: {
      app: "アプリ",
      education: "学歴",
      experience: "職歴",
      framework: "フレームワーク",
      insight: "インサイト",
      profile: "プロフィール",
      venture: "ベンチャー"
    }
  };

  return labels[locale][entityType] || entityType;
}

export function formatEntitySlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function parseEntitySource(source: string, locale: PublicLocale) {
  const [idPart, revPart] = source.split("@");
  const dotIdx = idPart.indexOf(".");
  const entityType = dotIdx !== -1 ? idPart.substring(0, dotIdx) : "unknown";
  const entitySlug = dotIdx !== -1 ? idPart.substring(dotIdx + 1) : idPart;
  const revision = revPart || "latest";

  return {
    original: source,
    type: entityType,
    typeLabel: getEntityTypeLabel(entityType, locale),
    slug: entitySlug,
    label: formatEntitySlug(entitySlug),
    revision,
    path: getEntityRoute(idPart, locale)
  };
}
