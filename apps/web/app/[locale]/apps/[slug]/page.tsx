import { notFound } from "next/navigation";
import { getDatabase } from "@kakehashi/db";
import { AppMetadata } from "@kakehashi/content-schema";
import Link from "next/link";
import type { Metadata } from "next";
import CommandCenterDashboard from "@/components/CommandCenterDashboard";
import TodoListDashboard from "@/components/TodoListDashboard";
import DetailPageShell from "@/components/DetailPageShell";
import MarkdownArticle from "@/components/MarkdownArticle";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const db = await getDatabase();
  const entities = await db.listEntities("app");
  const entity = entities.find((e) => e.canonical_slug === slug);
  if (!entity) return {};

  const translation = await db.getTranslation(entity.id, locale);
  if (!translation) return {};

  return {
    title: `${translation.frontmatter.title} | Rajkumar Rajagobalan`,
    description: translation.frontmatter.summary,
    alternates: {
      canonical: `https://www.rajagobalan.com/${locale}/apps/${slug}`,
      languages: {
        en: `https://www.rajagobalan.com/en/apps/${slug}`,
        ja: `https://www.rajagobalan.com/ja/apps/${slug}`,
      },
    },
  };
}

export default async function AppDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const db = await getDatabase();
  const entities = await db.listEntities("app");
  const entity = entities.find((e) => e.canonical_slug === slug);

  if (!entity) {
    notFound();
  }

  const app = entity as AppMetadata;
  const translation = await db.getTranslation(app.id, locale);
  if (!translation) {
    notFound();
  }

  const isJa = locale === "ja";
  const oppositeLocale = isJa ? "en" : "ja";
  const launchUrl = app.app_url || `/apps/${slug}`;
  const isCommandCenter = slug === "ai-transformation-command-center";
  const isTodoList = slug === "to-do-list";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": translation.frontmatter.title,
    "description": translation.frontmatter.summary,
    "inLanguage": locale,
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "url": `https://www.rajagobalan.com/${locale}/apps/${slug}`,
    "applicationSubCategory": isCommandCenter ? "Enterprise AI Transformation" : undefined
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
        backLabel={isJa ? "知見・ツールへ戻る" : "Back to Insights & Tools"}
        badge={isJa ? "アプリ" : "Application"}
        languageHref={`/${oppositeLocale}/apps/${slug}`}
        locale={locale}
        meta={[
          { label: isJa ? "種別" : "Type", value: isJa ? "ツール" : "Tool" },
          { label: isJa ? "起動先" : "Launch", value: launchUrl },
        ]}
        summary={translation.frontmatter.summary}
        title={translation.frontmatter.title}
        wide
      >
        <div className="detail-actions">
          <a className="detail-action-primary" href={launchUrl}>
            {isJa ? "アプリを起動" : "Launch App"}
          </a>

          {isCommandCenter && (
            <Link className="detail-action-secondary" href={`/${locale}/apps/${slug}/docs/deployment`}>
              {isJa ? "デプロイ資料" : "Deployment Guide"}
            </Link>
          )}
        </div>

        <MarkdownArticle content={translation.content_markdown} />

        {isCommandCenter && (
          <CommandCenterDashboard locale={locale} />
        )}

        {isTodoList && (
          <TodoListDashboard locale={locale} />
        )}
      </DetailPageShell>
    </>
  );
}
