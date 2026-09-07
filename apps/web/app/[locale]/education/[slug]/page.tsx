import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/public-database";
import { EducationMetadata } from "@kakehashi/content-schema";
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
  const entities = await db.listEntities("education");
  const entity = entities.find((e) => e.canonical_slug === slug);
  if (!entity) return {};
  
  const translation = await db.getTranslation(entity.id, locale);
  if (!translation) return {};
  
  return {
    title: `${translation.frontmatter.title} | Rajkumar Rajagobalan`,
    description: translation.frontmatter.summary,
    alternates: {
      canonical: `https://www.rajagobalan.com/${locale}/education/${slug}`,
      languages: {
        en: `https://www.rajagobalan.com/en/education/${slug}`,
        ja: `https://www.rajagobalan.com/ja/education/${slug}`,
      },
    },
  };
}

export default async function EducationPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const db = await getDatabase();
  
  // Find entity by type and slug
  const entities = await db.listEntities("education");
  const entity = entities.find((e) => e.canonical_slug === slug);
  
  if (!entity) {
    notFound();
  }
  
  const eduEntity = entity as EducationMetadata;
  
  const translation = await db.getTranslation(eduEntity.id, locale);
  if (!translation) {
    notFound();
  }
  
  // Generate schema.org structured JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    "name": translation.frontmatter.title,
    "credentialCategory": "Certificate",
    "recognizedBy": {
      "@type": "EducationalOrganization",
      "name": eduEntity.institution?.official_name || ""
    }
  };
  const isJa = locale === "ja";
  const oppositeLocale = isJa ? "en" : "ja";
  const dateRange = formatDateRange(eduEntity.start_date, eduEntity.end_date, locale);

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
        badge={isJa ? "学歴" : "Education"}
        languageHref={`/${oppositeLocale}/education/${slug}`}
        locale={locale}
        meta={[
          { label: isJa ? "プログラム" : "Programme", value: eduEntity.programme?.official_name },
          { label: isJa ? "期間" : "Period", value: dateRange },
        ]}
        subtitle={eduEntity.institution?.official_name || ""}
        summary={translation.frontmatter.summary}
        title={translation.frontmatter.title}
      >
        <MarkdownArticle content={translation.content_markdown} />
      </DetailPageShell>
    </>
  );
}
