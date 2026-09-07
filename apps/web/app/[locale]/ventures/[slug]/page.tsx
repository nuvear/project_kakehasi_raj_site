import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/public-database";
import { VentureMetadata } from "@kakehashi/content-schema";
import type { Metadata } from "next";
import DetailPageShell from "@/components/DetailPageShell";
import MarkdownArticle from "@/components/MarkdownArticle";
import { formatDateRange } from "@/lib/date-format";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const db = await getDatabase();
  const entities = await db.listEntities("venture");
  const entity = entities.find((e) => e.canonical_slug === slug);
  if (!entity) return {};
  
  const translation = await db.getTranslation(entity.id, locale);
  if (!translation) return {};
  
  return {
    title: `${translation.frontmatter.title} | Rajkumar Rajagobalan`,
    description: translation.frontmatter.summary,
    alternates: {
      canonical: `https://www.rajagobalan.com/${locale}/ventures/${slug}`,
      languages: {
        en: `https://www.rajagobalan.com/en/ventures/${slug}`,
        ja: `https://www.rajagobalan.com/ja/ventures/${slug}`,
      },
    },
  };
}

export default async function VenturePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const db = await getDatabase();
  
  // Find entity by type and slug
  const entities = await db.listEntities("venture");
  const entity = entities.find((e) => e.canonical_slug === slug);
  
  if (!entity) {
    notFound();
  }
  
  const ventureEntity = entity as VentureMetadata;
  
  const translation = await db.getTranslation(ventureEntity.id, locale);
  if (!translation) {
    notFound();
  }
  
  // Generate schema.org structured JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": ventureEntity.company_name || "",
    "founder": {
      "@type": "Person",
      "name": "Rajkumar Rajagobalan"
    }
  };
  const isJa = locale === "ja";
  const oppositeLocale = isJa ? "en" : "ja";
  const dateRange = formatDateRange(ventureEntity.start_date, ventureEntity.end_date, locale);
  const subtitle = [ventureEntity.company_name, ventureEntity.role].filter(Boolean).join(" - ");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailPageShell
        active="none"
        backHref={`/${locale}`}
        backLabel={isJa ? "ホームへ戻る" : "Back to Home"}
        badge={isJa ? "ベンチャー" : "Venture"}
        languageHref={`/${oppositeLocale}/ventures/${slug}`}
        locale={locale}
        meta={[
          { label: isJa ? "会社" : "Company", value: ventureEntity.company_name },
          { label: isJa ? "役割" : "Role", value: ventureEntity.role },
          { label: isJa ? "期間" : "Period", value: dateRange },
        ]}
        subtitle={subtitle}
        summary={translation.frontmatter.summary}
        title={translation.frontmatter.title}
      >
        <MarkdownArticle content={translation.content_markdown} />
      </DetailPageShell>
    </>
  );
}
