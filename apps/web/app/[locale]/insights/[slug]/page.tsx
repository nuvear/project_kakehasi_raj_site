import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/public-database";
import { InsightMetadata } from "@kakehashi/content-schema";
import type { Metadata } from "next";
import DetailPageShell from "@/components/DetailPageShell";
import MarkdownArticle from "@/components/MarkdownArticle";
import { formatMonthDate } from "@/lib/date-format";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const db = await getDatabase();
  const entities = await db.listEntities("insight");
  const entity = entities.find((e) => e.canonical_slug === slug);
  if (!entity) return {};
  
  const translation = await db.getTranslation(entity.id, locale);
  if (!translation) return {};
  
  return {
    title: `${translation.frontmatter.title} | Rajkumar Rajagobalan`,
    description: translation.frontmatter.summary,
    alternates: {
      canonical: `https://www.rajagobalan.com/${locale}/insights/${slug}`,
      languages: {
        en: `https://www.rajagobalan.com/en/insights/${slug}`,
        ja: `https://www.rajagobalan.com/ja/insights/${slug}`,
      },
    },
  };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const db = await getDatabase();
  
  const entities = await db.listEntities("insight");
  const entity = entities.find((e) => e.canonical_slug === slug);
  
  if (!entity) {
    notFound();
  }
  
  const translation = await db.getTranslation(entity.id, locale);
  if (!translation) {
    notFound();
  }

  const insight = entity as InsightMetadata;
  const isJa = locale === "ja";
  const oppositeLocale = isJa ? "en" : "ja";
  const published = formatMonthDate(entity.start_date, locale);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": translation.frontmatter.title,
    "description": translation.frontmatter.summary,
    "inLanguage": locale,
    "articleSection": insight.category || "",
    "keywords": insight.tags?.join(", ") || "",
    "author": {
      "@type": "Person",
      "name": "Rajkumar Rajagobalan"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailPageShell
        active="insights"
        backHref={`/${locale}/insights`}
        backLabel={isJa ? "知見一覧へ戻る" : "Back to Insights"}
        badge={isJa ? "知見" : "Insight"}
        languageHref={`/${oppositeLocale}/insights/${slug}`}
        locale={locale}
        meta={[
          { label: isJa ? "カテゴリ" : "Category", value: insight.category },
          { label: isJa ? "公開" : "Published", value: published },
          { label: isJa ? "タグ" : "Tags", value: insight.tags?.join(", ") },
        ]}
        summary={translation.frontmatter.summary}
        title={translation.frontmatter.title}
      >
        <MarkdownArticle content={translation.content_markdown} />
      </DetailPageShell>
    </>
  );
}
