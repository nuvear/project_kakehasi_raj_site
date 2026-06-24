import { getDatabase } from "@kakehashi/db";
import type { Metadata } from "next";
import InsightsCatalogueClient from "@/components/InsightsCatalogueClient";
import type { InsightMetadata, AppMetadata, GuideMetadata, FrameworkMetadata } from "@kakehashi/content-schema";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ja" 
    ? "知見・ツール カタログ — ラジクマール・ラジャゴバラン" 
    : "Insights & Tools Catalogue — Rajkumar Rajagobalan";
  const description = locale === "ja" 
    ? "ラジクマール・ラジャゴバランが構築したエンタープライズAI戦略、ガバナンス、開発者ガイド、ウェアラブル健康アプリケーションの知見カタログ。" 
    : "Catalogue of enterprise AI strategy, governance, developer guides, and wearable health analytics built by Rajkumar Rajagobalan.";
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.rajagobalan.com/${locale}/insights`,
      languages: {
        en: "https://www.rajagobalan.com/en/insights",
        ja: "https://www.rajagobalan.com/ja/insights",
      },
    },
  };
}

export default async function InsightsPage({ params }: PageProps) {
  const { locale } = await params;
  const db = await getDatabase();

  // Load all catalogue entities from the database layer
  const insightEntities = await db.listEntities("insight");
  const appEntities = await db.listEntities("app");
  const guideEntities = await db.listEntities("guide");
  const frameworkEntities = await db.listEntities("framework");

  // Fetch translations for all types
  const allList = await Promise.all([
    ...insightEntities.map(async (e) => {
      const metadata = e as InsightMetadata;
      return {
        entity: {
          id: metadata.id,
          type: metadata.type,
          canonical_slug: metadata.canonical_slug,
          category: metadata.category,
          tags: metadata.tags,
          ui_capabilities: metadata.ui_capabilities
        },
        translation: await db.getTranslation(metadata.id, locale)
      };
    }),
    ...appEntities.map(async (e) => {
      const metadata = e as AppMetadata;
      return {
        entity: {
          id: metadata.id,
          type: metadata.type,
          canonical_slug: metadata.canonical_slug,
          app_url: metadata.app_url,
          ui_capabilities: metadata.ui_capabilities
        },
        translation: await db.getTranslation(metadata.id, locale)
      };
    }),
    ...guideEntities.map(async (e) => {
      const metadata = e as GuideMetadata;
      return {
        entity: {
          id: metadata.id,
          type: metadata.type,
          canonical_slug: metadata.canonical_slug,
          category: metadata.category,
          tags: metadata.tags,
          ui_capabilities: metadata.ui_capabilities
        },
        translation: await db.getTranslation(metadata.id, locale)
      };
    }),
    ...frameworkEntities.map(async (e) => {
      const metadata = e as FrameworkMetadata;
      return {
        entity: {
          id: metadata.id,
          type: metadata.type,
          canonical_slug: metadata.canonical_slug,
          version: metadata.version,
          ui_capabilities: metadata.ui_capabilities
        },
        translation: await db.getTranslation(metadata.id, locale)
      };
    })
  ]);

  // Filter items where translation exists
  const validItems = allList.filter(item => item.translation !== null) as Array<{
    entity: {
      id: string;
      type: string;
      canonical_slug: string;
      category?: string;
      tags?: string[];
      version?: string;
      app_url?: string;
    };
    translation: {
      frontmatter: {
        locale: string;
        title: string;
        summary: string;
        translation_status: string;
        last_editorial_review?: string;
      };
      content_markdown: string;
    };
  }>;

  // Sort items: newest review date first
  const sortByReviewDate = (a: typeof validItems[0], b: typeof validItems[0]) => {
    const dateA = a.translation.frontmatter.last_editorial_review || "";
    const dateB = b.translation.frontmatter.last_editorial_review || "";
    return dateB.localeCompare(dateA);
  };

  const sortedItems = validItems.sort(sortByReviewDate);

  return (
    <InsightsCatalogueClient locale={locale} items={sortedItems} />
  );
}
