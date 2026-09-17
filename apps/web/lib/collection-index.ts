import type { Metadata } from "next";
import type { EntityMetadata, EntityType, FullTranslation } from "@kakehashi/content-schema";
import { getDatabase } from "@kakehashi/db";
import { formatDateRange } from "@/lib/date-format";
import { getEntityRoute } from "@/lib/entity-routes";
import { isPublicLocale, SITE_ORIGIN, type PublicLocale } from "@/lib/i18n";
import { isLiveMarketingEntity } from "@/lib/marketing-entities";
import { ventureBandEyebrow, ventureStatusLabel } from "@/lib/venture-band";

export const COLLECTION_KEYS = [
  "experience",
  "education",
  "ventures",
  "apps",
] as const;

export type CollectionKey = (typeof COLLECTION_KEYS)[number];

const COLLECTION_ENTITY_TYPE: Record<CollectionKey, EntityType> = {
  experience: "experience",
  education: "education",
  ventures: "venture",
  apps: "app",
};

export const COLLECTION_COPY = {
  experience: {
    en: {
      title: "Experience",
      subtitle:
        "Roles and organizations I have worked with across Japan and APAC.",
      empty: "No published experience pages yet.",
      cta: "Read the role",
      back: "Back to Experience",
    },
    ja: {
      title: "職歴",
      subtitle: "日本とAPACで携わってきた役割と組織。",
      empty: "公開中の職歴ページはまだありません。",
      cta: "職歴を見る",
      back: "職歴一覧へ戻る",
    },
  },
  education: {
    en: {
      title: "Education",
      subtitle: "Programmes and institutions that shaped how I work.",
      empty: "No published education pages yet.",
      cta: "View programme",
      back: "Back to Education",
    },
    ja: {
      title: "学歴",
      subtitle: "仕事の考え方を形づくった学びと機関。",
      empty: "公開中の学歴ページはまだありません。",
      cta: "プログラムを見る",
      back: "学歴一覧へ戻る",
    },
  },
  ventures: {
    en: {
      title: "Ventures",
      subtitle:
        "Nuvear and Innuir are current ventures. AAGNAA is an earlier venture.",
      empty: "No published venture pages yet.",
      cta: "Read about the venture",
      back: "Back to Ventures",
    },
    ja: {
      title: "ベンチャー",
      subtitle:
        "NuvearとInnuirが現在の事業です。AAGNAAは以前の事業です。",
      empty: "公開中のベンチャーページはまだありません。",
      cta: "ベンチャーを見る",
      back: "ベンチャー一覧へ戻る",
    },
  },
  apps: {
    en: {
      title: "Apps",
      subtitle: "Tools published on this site.",
      empty: "No published apps yet.",
      cta: "Open the app",
      back: "Back to Apps",
    },
    ja: {
      title: "アプリ",
      subtitle: "このサイトで公開しているツール。",
      empty: "公開中のアプリはまだありません。",
      cta: "アプリを見る",
      back: "アプリ一覧へ戻る",
    },
  },
} as const;

export interface CollectionIndexItem {
  badge: string;
  href: string;
  id: string;
  meta: string;
  slug: string;
  summary: string;
  title: string;
}

function collectionMeta(entity: EntityMetadata, locale: string): string {
  switch (entity.type) {
    case "experience":
      return [
        entity.company.official_name,
        formatDateRange(entity.start_date, entity.end_date, locale),
      ]
        .filter(Boolean)
        .join(" · ");
    case "education":
      return [
        entity.institution.official_name,
        formatDateRange(entity.start_date, entity.end_date, locale),
      ]
        .filter(Boolean)
        .join(" · ");
    case "venture":
      return ventureBandEyebrow({
        locale,
        role: entity.role,
        endDate: entity.end_date,
        period: formatDateRange(entity.start_date, entity.end_date, locale),
      });
    case "app":
      return locale === "ja" ? "ツール" : "Tool";
    default:
      return "";
  }
}

function collectionBadge(entity: EntityMetadata, locale: string): string {
  switch (entity.type) {
    case "experience":
      return entity.role;
    case "education":
      return entity.programme.official_name;
    case "venture":
      return ventureStatusLabel(entity.end_date, locale);
    case "app":
      return locale === "ja" ? "アプリ" : "App";
    default:
      return entity.type;
  }
}

function sortNewestFirst(a: EntityMetadata, b: EntityMetadata) {
  return (b.start_date || "").localeCompare(a.start_date || "");
}

export function collectionCopy(collection: CollectionKey, locale: string) {
  return locale === "ja"
    ? COLLECTION_COPY[collection].ja
    : COLLECTION_COPY[collection].en;
}

export function generateCollectionMetadata(
  collection: CollectionKey,
  locale: string,
): Metadata {
  const copy = collectionCopy(collection, locale);

  return {
    title: `${copy.title} | Rajkumar Rajagobalan`,
    description: copy.subtitle,
    alternates: {
      canonical: `${SITE_ORIGIN}/${locale}/${collection}`,
      languages: {
        en: `${SITE_ORIGIN}/en/${collection}`,
        ja: `${SITE_ORIGIN}/ja/${collection}`,
      },
    },
  };
}

export async function listCollectionItems(
  collection: CollectionKey,
  locale: string,
): Promise<CollectionIndexItem[]> {
  if (!isPublicLocale(locale)) {
    return [];
  }

  const db = await getDatabase();
  const entities = await db.listEntities(COLLECTION_ENTITY_TYPE[collection]);
  const loaded = await Promise.all(
    entities.map(async (entity) => {
      if (!isLiveMarketingEntity(entity)) {
        return null;
      }

      const translation = await db.getTranslation(entity.id, locale);
      if (!translation) {
        return null;
      }

      const href = getEntityRoute(entity.id, locale as PublicLocale);
      if (!href) {
        return null;
      }

      return { entity, href, translation };
    }),
  );

  return loaded
    .filter(
      (
        item,
      ): item is {
        entity: EntityMetadata;
        href: string;
        translation: FullTranslation;
      } => Boolean(item),
    )
    .sort((a, b) => sortNewestFirst(a.entity, b.entity))
    .map(({ entity, href, translation }) => ({
      badge: collectionBadge(entity, locale),
      href,
      id: entity.id,
      meta: collectionMeta(entity, locale),
      slug: entity.canonical_slug,
      summary: translation.frontmatter.summary,
      title: translation.frontmatter.title,
    }));
}
