import { notFound } from "next/navigation";
import { getDatabase } from "@kakehashi/db";
import { ExperienceMetadata } from "@kakehashi/content-schema";
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
  const entities = await db.listEntities("experience");
  const entity = entities.find((e) => e.canonical_slug === slug);
  if (!entity) return {};
  
  const translation = await db.getTranslation(entity.id, locale);
  if (!translation) return {};
  
  return {
    title: `${translation.frontmatter.title} | Rajkumar Rajagobalan`,
    description: translation.frontmatter.summary,
    alternates: {
      canonical: `https://www.rajagobalan.com/${locale}/experience/${slug}`,
      languages: {
        en: `https://www.rajagobalan.com/en/experience/${slug}`,
        ja: `https://www.rajagobalan.com/ja/experience/${slug}`,
      },
    },
  };
}

export default async function ExperiencePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const db = await getDatabase();
  
  // Find entity by type and slug
  const entities = await db.listEntities("experience");
  const entity = entities.find((e) => e.canonical_slug === slug);
  
  if (!entity) {
    notFound();
  }
  
  const expEntity = entity as ExperienceMetadata;
  
  const translation = await db.getTranslation(expEntity.id, locale);
  if (!translation) {
    notFound();
  }
  
  // Generate schema.org structured JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OrganizationRole",
    "roleName": expEntity.role || "",
    "startDate": expEntity.start_date || "",
    "endDate": expEntity.end_date || "Present",
    "hiringOrganization": {
      "@type": "Organization",
      "name": expEntity.company?.official_name || ""
    }
  };
  const isJa = locale === "ja";
  const oppositeLocale = isJa ? "en" : "ja";
  const company = expEntity.company?.official_name || "";
  const dateRange = formatDateRange(expEntity.start_date, expEntity.end_date, locale);

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
        badge={isJa ? "職歴" : "Experience"}
        languageHref={`/${oppositeLocale}/experience/${slug}`}
        locale={locale}
        meta={[
          { label: isJa ? "役割" : "Role", value: expEntity.role },
          { label: isJa ? "期間" : "Period", value: dateRange },
        ]}
        subtitle={company}
        summary={translation.frontmatter.summary}
        title={translation.frontmatter.title}
      >
        <MarkdownArticle content={translation.content_markdown} />
      </DetailPageShell>
    </>
  );
}
