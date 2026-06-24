'use client';

import React, { useState } from "react";
import Link from "next/link";

interface CatalogueItem {
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
}

interface Props {
  locale: string;
  items: CatalogueItem[];
}

export default function InsightsCatalogueClient({ locale, items }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const i18nMap = {
    en: {
      siteTitle: "Rajkumar Rajagobalan",
      title: "Insights & Tools",
      subtitle: "A curated catalogue of articles, interactive applications, developer guides, and frameworks.",
      filterAll: "All",
      filterInsights: "Insights",
      filterApps: "Apps",
      filterGuides: "Guides",
      filterFrameworks: "Frameworks",
      searchPlaceholder: "Search by title, tag, or category...",
      lastReviewed: "Reviewed on",
      readAnalysis: "Read Analysis",
      openTool: "Open Tool",
      backToHome: "Back to Home",
      navHome: "Home",
      navExperience: "Experience",
      navEducation: "Education",
      navVentures: "Ventures",
      navInsights: "Insights",
      switchLang: "日本語",
      switchPath: "/ja/insights",
      noItems: "No items match your criteria.",
      badgeInsight: "Insight",
      badgeApp: "App",
      badgeGuide: "Guide",
      badgeFramework: "Framework"
    },
    ja: {
      siteTitle: "ラジクマール・ラジャゴバラン",
      title: "知見・ツール",
      subtitle: "記事、インタラクティブアプリケーション、開発者ガイド、およびフレームワークのカタログ。",
      filterAll: "すべて",
      filterInsights: "インサイト",
      filterApps: "アプリ",
      filterGuides: "ガイド",
      filterFrameworks: "フレームワーク",
      searchPlaceholder: "タイトル、タグ、カテゴリで検索...",
      lastReviewed: "最終更新:",
      readAnalysis: "解説を読む",
      openTool: "ツールを開く",
      backToHome: "ホームに戻る",
      navHome: "ホーム",
      navExperience: "職歴",
      navEducation: "学歴",
      navVentures: "ベンチャー",
      navInsights: "知見",
      switchLang: "English",
      switchPath: "/en/insights",
      noItems: "該当するアイテムが見つかりませんでした。",
      badgeInsight: "インサイト",
      badgeApp: "アプリ",
      badgeGuide: "ガイド",
      badgeFramework: "フレームワーク"
    }
  };

  const i18n = i18nMap[locale as "en" | "ja"] || i18nMap.en;

  const categories = [
    { key: "All", label: i18n.filterAll },
    { key: "insight", label: i18n.filterInsights },
    { key: "app", label: i18n.filterApps },
    { key: "guide", label: i18n.filterGuides },
    { key: "framework", label: i18n.filterFrameworks }
  ];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    
    const monthNames = {
      en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      ja: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    }[locale as "en" | "ja"] || [];
    
    if (!month) return dateStr;
    const monthIdx = parseInt(month, 10) - 1;
    if (day) {
      const dayInt = parseInt(day, 10);
      return locale === "ja" 
        ? `${year}年${monthNames[monthIdx]}${dayInt}日` 
        : `${monthNames[monthIdx]} ${dayInt}, ${year}`;
    }
    return locale === "ja" 
      ? `${year}年${monthNames[monthIdx]}` 
      : `${monthNames[monthIdx]} ${year}`;
  };

  const getRedirectLink = (item: CatalogueItem) => {
    const { type, canonical_slug, app_url } = item.entity;
    if (type === "app" && app_url) {
      return `/${locale}${app_url}`;
    }
    
    let pathSegment = "insights";
    if (type === "guide") pathSegment = "guides";
    if (type === "framework") pathSegment = "frameworks";
    if (type === "app") pathSegment = "apps";
    
    return `/${locale}/${pathSegment}/${canonical_slug}`;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "insight": return i18n.badgeInsight;
      case "app": return i18n.badgeApp;
      case "guide": return i18n.badgeGuide;
      case "framework": return i18n.badgeFramework;
      default: return type;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "insight":
        return {
          bg: "var(--color-primary-container)",
          color: "var(--color-on-primary-container)",
          border: "1px solid rgba(2, 132, 199, 0.2)"
        };
      case "app":
        return {
          bg: "var(--color-secondary-container)",
          color: "var(--color-on-secondary-container)",
          border: "1px solid rgba(13, 148, 136, 0.2)"
        };
      case "guide":
        return {
          bg: "var(--color-tertiary-container)",
          color: "var(--color-on-tertiary-container)",
          border: "1px solid rgba(99, 102, 241, 0.2)"
        };
      case "framework":
        return {
          bg: "rgba(147, 51, 234, 0.15)", // Purple container style
          color: "rgb(147, 51, 234)",
          border: "1px solid rgba(147, 51, 234, 0.2)"
        };
      default:
        return {
          bg: "var(--color-surface-variant)",
          color: "var(--color-on-surface-variant)",
          border: "1px solid var(--color-outline-variant)"
        };
    }
  };

  // Filter logic
  const filteredItems = items.filter((item) => {
    // 1. Category Filter
    if (selectedCategory !== "All" && item.entity.type !== selectedCategory) {
      return false;
    }
    // 2. Search Query Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const title = item.translation.frontmatter.title.toLowerCase();
      const summary = item.translation.frontmatter.summary.toLowerCase();
      const tags = (item.entity.tags || []).map(t => t.toLowerCase());
      const category = (item.entity.category || "").toLowerCase();
      
      const matchesTitle = title.includes(query);
      const matchesSummary = summary.includes(query);
      const matchesCategory = category.includes(query);
      const matchesTags = tags.some(tag => tag.includes(query));
      
      return matchesTitle || matchesSummary || matchesCategory || matchesTags;
    }
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background)" }}>
      <style>{`
        .nav-link {
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--color-on-background);
          text-decoration: none;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          transition: color 0.2s ease, background-color 0.2s ease;
        }
        .nav-link:hover {
          color: var(--color-primary);
          background-color: var(--color-surface-variant);
        }
        .nav-link.active {
          color: var(--color-primary);
          font-weight: 700;
        }
        .filter-chip {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-outline-variant);
          background: var(--glass-bg);
          color: var(--color-on-background);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
          outline: none;
        }
        .filter-chip:hover {
          border-color: var(--color-primary);
          transform: translateY(-1px);
        }
        .filter-chip:focus-visible {
          box-shadow: 0 0 0 2px var(--color-primary);
        }
        .filter-chip.active {
          background: var(--color-primary);
          color: var(--color-on-primary);
          border-color: var(--color-primary);
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);
        }
        .search-input {
          width: 100%;
          max-width: 480px;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-outline-variant);
          background: var(--glass-bg);
          color: var(--color-on-background);
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
          outline: none;
        }
        .search-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
          background: var(--color-surface);
        }
        .item-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s cubic-bezier(0.2, 0, 0, 1) forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .tag-pill {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          background-color: var(--color-surface-variant);
          color: var(--color-on-surface-variant);
        }
        .read-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 700;
          font-size: 0.95rem;
          transition: gap 0.2s ease;
        }
        .glass-card:hover .read-link {
          gap: 0.5rem;
        }
        @media (max-width: 768px) {
          .header-nav {
            display: none !important;
          }
        }
      `}</style>

      {/* Navigation Bar */}
      <header className="glass-panel" style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--color-primary)" }}>
          <Link href={`/${locale}`} style={{ textDecoration: "none", color: "var(--color-primary)" }}>
            {i18n.siteTitle}
          </Link>
        </div>
        <nav className="header-nav" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href={`/${locale}`} className="nav-link">{i18n.navHome}</Link>
          <Link href={`/${locale}#experience`} className="nav-link">{i18n.navExperience}</Link>
          <Link href={`/${locale}#education`} className="nav-link">{i18n.navEducation}</Link>
          <Link href={`/${locale}#ventures`} className="nav-link">{i18n.navVentures}</Link>
          <Link href={`/${locale}/insights`} className="nav-link active">{i18n.navInsights}</Link>
        </nav>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link 
            href={i18n.switchPath} 
            aria-label={locale === "ja" ? "Switch language to English" : "日本語に切り替える"}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "9999px",
              border: "1px solid var(--color-outline)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--color-primary)",
              textDecoration: "none",
              background: "var(--glass-bg)"
            }}
          >
            {i18n.switchLang}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: "4rem 2rem 2rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "center"
      }}>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "3rem",
          color: "var(--color-primary)",
          marginBottom: "1rem",
          letterSpacing: "-0.02em"
        }}>
          {i18n.title}
        </h1>
        <p style={{
          fontSize: "1.2rem",
          color: "var(--color-on-surface-variant)",
          maxWidth: "700px",
          margin: "0 auto 2.5rem auto",
          lineHeight: 1.6
        }}>
          {i18n.subtitle}
        </p>

        {/* Search Controls */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem"
        }}>
          <input
            type="text"
            className="search-input"
            placeholder={i18n.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            aria-label={i18n.searchPlaceholder}
          />
        </div>

        {/* Filter Chips */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "3rem"
        }} role="group" aria-label="Filter catalogue by type">
          {categories.map((category) => (
            <button
              key={category.key}
              className={`filter-chip ${selectedCategory === category.key ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(category.key);
              }}
              aria-pressed={selectedCategory === category.key}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid List */}
      <section style={{
        padding: "0 2rem 6rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {filteredItems.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "var(--color-on-surface-variant)",
            fontSize: "1.1rem"
          }}>
            {i18n.noItems}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem"
          }}>
            {filteredItems.map((item, index) => {
              const badgeStyle = getTypeStyles(item.entity.type);
              const isAppOrFramework = item.entity.type === "app" || item.entity.type === "framework";
              const formattedDate = formatDate(item.translation.frontmatter.last_editorial_review);

              return (
                <div 
                  key={item.entity.id} 
                  className="item-card" 
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="glass-card" style={{
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    border: "1px solid var(--glass-border)"
                  }}>
                    <div>
                      {/* Badge and Meta */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem"
                      }}>
                        <span style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.color,
                          border: badgeStyle.border
                        }}>
                          {getTypeBadge(item.entity.type)}
                        </span>
                        
                        {formattedDate && (
                          <span style={{
                            fontSize: "0.8rem",
                            color: "var(--color-on-surface-variant)"
                          }}>
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: "var(--color-primary)",
                        marginBottom: "0.75rem",
                        lineHeight: 1.3
                      }}>
                        {item.translation.frontmatter.title}
                      </h3>

                      {/* Version / Category / Subtitle information */}
                      {item.entity.type === "framework" && item.entity.version && (
                        <div style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--color-on-surface-variant)",
                          marginBottom: "0.75rem"
                        }}>
                          Version: {item.entity.version}
                        </div>
                      )}

                      {/* Summary */}
                      <p style={{
                        fontSize: "0.95rem",
                        color: "var(--color-on-surface-variant)",
                        lineHeight: 1.5,
                        marginBottom: "1.5rem"
                      }}>
                        {item.translation.frontmatter.summary}
                      </p>
                    </div>

                    <div>
                      {/* Tag pills */}
                      {(item.entity.tags || []).length > 0 && (
                        <div style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.4rem",
                          marginBottom: "1.5rem"
                        }}>
                          {(item.entity.tags || []).map((tag) => (
                            <span key={tag} className="tag-pill">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Link redirect */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <Link 
                          href={getRedirectLink(item)} 
                          className="read-link"
                          aria-label={`${isAppOrFramework ? i18n.openTool : i18n.readAnalysis}: ${item.translation.frontmatter.title}`}
                        >
                          <span>{isAppOrFramework ? i18n.openTool : i18n.readAnalysis}</span>
                          <span aria-hidden="true" style={{ transition: "transform 0.2s ease" }}>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
