"use client";

import { useState } from "react";
import Link from "next/link";
import SiteHeader from "./SiteHeader";

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
      badgeFramework: "Framework",
      itemsLabel: "items",
      showingLabel: "Showing",
      versionLabel: "Version"
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
      badgeFramework: "フレームワーク",
      itemsLabel: "件",
      showingLabel: "表示中",
      versionLabel: "バージョン"
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
    const { canonical_slug, type } = item.entity;
    if (type === "framework") {
      return `/${locale}/frameworks/${canonical_slug}`;
    }
    if (type === "app") {
      return `/${locale}/apps/${canonical_slug}`;
    }
    return `/${locale}/insights/${canonical_slug}`;
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
  const categoriesWithCounts = categories.map((category) => ({
    ...category,
    count: category.key === "All"
      ? items.length
      : items.filter((item) => item.entity.type === category.key).length
  }));

  return (
    <div className="catalogue-page">
      <SiteHeader locale={locale} active="insights" />

      <main className="catalogue-shell">
        <section className="catalogue-hero" aria-labelledby="catalogue-title">
          <div className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            {i18n.showingLabel} {filteredItems.length} {i18n.itemsLabel}
          </div>
          <h1 className="catalogue-title" id="catalogue-title">
            {i18n.title}
          </h1>
          <p className="catalogue-subtitle">{i18n.subtitle}</p>

          <div className="catalogue-controls">
            <input
              type="search"
              className="search-input"
              placeholder={i18n.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              aria-label={i18n.searchPlaceholder}
            />

            <div className="catalogue-filter-group" role="group" aria-label="Filter catalogue by type">
              {categoriesWithCounts.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  className={`filter-chip ${selectedCategory === category.key ? "active" : ""}`}
                  onClick={() => {
                    setSelectedCategory(category.key);
                  }}
                  aria-pressed={selectedCategory === category.key}
                >
                  <span>{category.label}</span>
                  <span className="filter-count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="catalogue-results" aria-live="polite">
        {filteredItems.length === 0 ? (
          <div className="catalogue-empty">
            {i18n.noItems}
          </div>
        ) : (
          <div className="catalogue-grid">
            {filteredItems.map((item, index) => {
              const isAppOrFramework = item.entity.type === "app" || item.entity.type === "framework";
              const formattedDate = formatDate(item.translation.frontmatter.last_editorial_review);

              return (
                <div 
                  key={item.entity.id} 
                  className="item-card" 
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <article className="catalogue-card glass-card" data-type={item.entity.type}>
                    <div>
                      <div className="catalogue-card-meta">
                        <span className="catalogue-badge" data-type={item.entity.type}>
                          {getTypeBadge(item.entity.type)}
                        </span>
                        
                        {formattedDate && (
                          <span className="catalogue-date">
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      <h3 className="catalogue-card-title">
                        {item.translation.frontmatter.title}
                      </h3>

                      {item.entity.type === "framework" && item.entity.version && (
                        <div className="catalogue-version">
                          {i18n.versionLabel}: {item.entity.version}
                        </div>
                      )}

                      <p className="catalogue-summary">
                        {item.translation.frontmatter.summary}
                      </p>
                    </div>

                    <div>
                      {(item.entity.tags || []).length > 0 && (
                        <div className="catalogue-tags">
                          {(item.entity.tags || []).map((tag) => (
                            <span key={tag} className="tag-pill">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        href={getRedirectLink(item)}
                        className="read-link"
                        aria-label={`${isAppOrFramework ? i18n.openTool : i18n.readAnalysis}: ${item.translation.frontmatter.title}`}
                      >
                        <span>{isAppOrFramework ? i18n.openTool : i18n.readAnalysis}</span>
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        )}
      </section>
      </main>
    </div>
  );
}
