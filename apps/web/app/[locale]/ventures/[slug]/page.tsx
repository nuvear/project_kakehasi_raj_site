import { notFound } from "next/navigation";
import { getDatabase } from "@kakehashi/db";
import { VentureMetadata } from "@kakehashi/content-schema";
import Link from "next/link";
import type { Metadata } from "next";

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
        <div style={{
          fontSize: "1.1rem",
          fontWeight: 500,
          color: "var(--color-secondary)",
          marginBottom: "1.5rem"
        }}>
          {ventureEntity.company_name || ""} — {ventureEntity.role || ""}
        </div>
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
