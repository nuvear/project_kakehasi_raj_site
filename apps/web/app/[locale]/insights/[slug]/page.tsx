import { notFound } from "next/navigation";
import { getDatabase } from "@kakehashi/db";
import {
  InsightMetadata,
  GuideMetadata,
  FrameworkMetadata,
  AppMetadata
} from "@kakehashi/content-schema";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const db = await getDatabase();
  const entities = await db.listEntities();
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
  
  const entities = await db.listEntities();
  const entity = entities.find((e) => e.canonical_slug === slug);
  
  if (!entity) {
    notFound();
  }
  
  const translation = await db.getTranslation(entity.id, locale);
  if (!translation) {
    notFound();
  }

  // Generate schema.org structured JSON-LD based on entity type
  let jsonLd: Record<string, unknown> = {};
  
  if (entity.type === "insight" || entity.type === "guide") {
    const categorizable = entity as InsightMetadata | GuideMetadata;
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": translation.frontmatter.title,
      "description": translation.frontmatter.summary,
      "inLanguage": locale,
      "articleSection": categorizable.category || "",
      "keywords": categorizable.tags?.join(", ") || "",
      "author": {
        "@type": "Person",
        "name": "Rajkumar Rajagobalan"
      }
    };
  } else if (entity.type === "framework") {
    const fw = entity as FrameworkMetadata;
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": translation.frontmatter.title,
      "description": translation.frontmatter.summary,
      "inLanguage": locale,
      "version": fw.version || "1.0.0",
      "author": {
        "@type": "Person",
        "name": "Rajkumar Rajagobalan"
      }
    };
  } else if (entity.type === "app") {
    const app = entity as AppMetadata;
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": translation.frontmatter.title,
      "description": translation.frontmatter.summary,
      "inLanguage": locale,
      "operatingSystem": "All",
      "applicationCategory": entity.id === "app.bp-chart" ? "HealthApplication" : "LifestyleApplication",
      "downloadUrl": app.app_url || ""
    };
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background)", padding: "4rem 2rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="glass-panel" style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "3rem",
        borderRadius: "1.5rem",
        border: "1px solid var(--color-outline-variant)"
      }}>
        <Link href={`/${locale}`} style={{
          display: "inline-flex",
          alignItems: "center",
          marginBottom: "2rem",
          color: "var(--color-primary)",
          fontWeight: 600,
          fontSize: "0.9rem"
        }}>
          ← {locale === "ja" ? "ホームへ戻る" : "Back to Home"}
        </Link>
        
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "2.5rem",
          color: "var(--color-primary)",
          marginBottom: "0.5rem"
        }}>
          {translation.frontmatter.title}
        </h1>

        {/* Dynamic Meta Info */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
          fontSize: "0.9rem",
          color: "var(--color-secondary)",
          marginBottom: "2rem"
        }}>
          {entity.type && (
            <span style={{
              textTransform: "uppercase",
              fontWeight: 700,
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
              backgroundColor: "var(--color-primary-container)",
              color: "var(--color-on-primary-container)"
            }}>
              {entity.type}
            </span>
          )}

          {entity.start_date && (
            <span>
              {locale === "ja" ? `公開日: ${entity.start_date}` : `Published: ${entity.start_date}`}
            </span>
          )}

          {entity.type === "framework" && (entity as FrameworkMetadata).version && (
            <span>
              v{(entity as FrameworkMetadata).version}
            </span>
          )}

          {(entity.type === "insight" || entity.type === "guide") && (entity as InsightMetadata | GuideMetadata).category && (
            <span style={{ fontStyle: "italic" }}>
              • {(entity as InsightMetadata | GuideMetadata).category}
            </span>
          )}
        </div>

        {/* Tags */}
        {(entity.type === "insight" || entity.type === "guide") && (entity as InsightMetadata | GuideMetadata).tags && (entity as InsightMetadata | GuideMetadata).tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            {(entity as InsightMetadata | GuideMetadata).tags.map((tag) => (
              <span key={tag} style={{
                fontSize: "0.8rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "1rem",
                backgroundColor: "var(--color-surface-container-high)",
                color: "var(--color-on-surface)"
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* App link for type "app" */}
        {entity.type === "app" && (entity as AppMetadata).app_url && (
          <div style={{ marginBottom: "2rem" }}>
            <a
              href={(entity as AppMetadata).app_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              {locale === "ja" ? "アプリを起動する" : "Launch App"}
            </a>
          </div>
        )}

        <div style={{
          lineHeight: 1.7,
          fontSize: "1.05rem",
          whiteSpace: "pre-line"
        }}>
          {translation.content_markdown.split("---").pop()?.trim()}
        </div>
      </div>
    </div>
  );
}
