import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDatabase } from "@kakehashi/db";
import type { FrameworkMetadata } from "@kakehashi/content-schema";
import DetailPageShell from "@/components/DetailPageShell";
import MarkdownArticle from "@/components/MarkdownArticle";
import EnterpriseAIFrameworkInteractive from "@/components/EnterpriseAIFrameworkInteractive";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const REFERENCE_GUIDE_SLUG = "enterprise-ai-reference-guide";
const SITE_ORIGIN = "https://www.rajagobalan.com";

const copy = {
  en: {
    back: "Back to Insights",
    framework: "Framework",
    version: "Version",
    reviewed: "Reviewed",
    content: "Framework Content",
    referenceGuide: "Enterprise AI Reference Guide",
    referenceGuideLabel: "Reference Guide",
    referenceGuideFallback:
      "A companion reference guide for architecting, deploying, and governing enterprise AI solutions at scale.",
    openGuide: "Open Reference Guide",
  },
  ja: {
    back: "知見一覧へ戻る",
    framework: "フレームワーク",
    version: "バージョン",
    reviewed: "レビュー日",
    content: "フレームワーク本文",
    referenceGuide: "エンタープライズAIリファレンスガイド",
    referenceGuideLabel: "リファレンスガイド",
    referenceGuideFallback:
      "エンタープライズAIソリューションを大規模に設計、展開、管理するための関連リファレンスガイド。",
    openGuide: "リファレンスガイドを開く",
  },
} as const;

function localeCopy(locale: string) {
  return locale === "ja" ? copy.ja : copy.en;
}

function bodyContent(content: string) {
  const trimmed = content.trim();

  if (!trimmed.startsWith("---")) {
    return trimmed;
  }

  const close = trimmed.indexOf("---", 3);
  return close >= 0 ? trimmed.slice(close + 3).trim() : trimmed;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const db = await getDatabase();
  const entities = await db.listEntities("framework");
  const entity = entities.find((candidate) => candidate.canonical_slug === slug);

  if (!entity) {
    return {};
  }

  const translation = await db.getTranslation(entity.id, locale);

  if (!translation) {
    return {};
  }

  return {
    title: `${translation.frontmatter.title} | Rajkumar Rajagobalan`,
    description: translation.frontmatter.summary,
    alternates: {
      canonical: `${SITE_ORIGIN}/${locale}/frameworks/${slug}`,
      languages: {
        en: `${SITE_ORIGIN}/en/frameworks/${slug}`,
        ja: `${SITE_ORIGIN}/ja/frameworks/${slug}`,
      },
    },
  };
}

export default async function FrameworkDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const labels = localeCopy(locale);
  const isJa = locale === "ja";
  const oppositeLocale = isJa ? "en" : "ja";
  const db = await getDatabase();

  const frameworks = await db.listEntities("framework");
  const entity = frameworks.find((candidate) => candidate.canonical_slug === slug);

  if (!entity) {
    notFound();
  }

  const framework = entity as FrameworkMetadata;
  const translation = await db.getTranslation(framework.id, locale);

  if (!translation) {
    notFound();
  }

  const guide = (await db.listEntities("insight")).find(
    (candidate) => candidate.canonical_slug === REFERENCE_GUIDE_SLUG
  );
  const guideTranslation = guide ? await db.getTranslation(guide.id, locale) : null;
  const guideTitle = guideTranslation?.frontmatter.title || labels.referenceGuide;
  const guideSummary = guideTranslation?.frontmatter.summary || labels.referenceGuideFallback;
  const guideHref = `/${locale}/insights/${REFERENCE_GUIDE_SLUG}`;
  const content = bodyContent(translation.content_markdown);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: translation.frontmatter.title,
    description: translation.frontmatter.summary,
    inLanguage: locale,
    version: framework.version,
    url: `${SITE_ORIGIN}/${locale}/frameworks/${framework.canonical_slug}`,
    author: {
      "@type": "Person",
      name: "Rajkumar Rajagobalan",
    },
    isBasedOn: {
      "@type": "TechArticle",
      name: guideTitle,
      url: `${SITE_ORIGIN}${guideHref}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DetailPageShell
        active="insights"
        aside={
          <div>
            <div className="detail-aside-kicker">{labels.referenceGuideLabel}</div>
            <h2 className="detail-aside-title">{guideTitle}</h2>
            <p className="detail-aside-text">{guideSummary}</p>
            <Link className="detail-aside-link" href={guideHref}>
              {labels.openGuide}
            </Link>
          </div>
        }
        backHref={`/${locale}/insights`}
        backLabel={labels.back}
        badge={labels.framework}
        languageHref={`/${oppositeLocale}/frameworks/${slug}`}
        locale={locale}
        meta={[
          { label: labels.version, value: framework.version },
          { label: labels.reviewed, value: translation.frontmatter.last_editorial_review },
        ]}
        summary={translation.frontmatter.summary}
        title={translation.frontmatter.title}
        wide
      >

        <EnterpriseAIFrameworkInteractive locale={locale === "ja" ? "ja" : "en"} />

        <section className="detail-article-section" aria-labelledby="framework-content">
          <h2 className="detail-section-label" id="framework-content">
            {labels.content}
          </h2>
          <MarkdownArticle content={content} />
        </section>
      </DetailPageShell>
    </>
  );
}
