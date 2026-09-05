"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

interface SiteHeaderProps {
  active?: "home" | "insights" | "none";
  languageHref?: string;
  locale: string;
}

export default function SiteHeader({ active = "home", languageHref, locale }: SiteHeaderProps) {
  const isJa = locale === "ja";
  const isHome = active === "home";
  const isInsights = active === "insights";
  const oppositeLocale = isJa ? "en" : "ja";
  const defaultSwitchPath = isInsights ? `/${oppositeLocale}/insights` : `/${oppositeLocale}`;

  const copy = isJa
    ? {
        siteTitle: "ラジクマール・ラジャゴバラン",
        home: "ホーム",
        about: "略歴",
        experience: "職歴",
        education: "学歴",
        credentials: "資格",
        ventures: "ベンチャー",
        insights: "知見",
        switchLang: "English",
        switchPath: languageHref || defaultSwitchPath,
        languageLabel: "Switch language to English",
      }
    : {
        siteTitle: "Rajkumar Rajagobalan",
        home: "Home",
        about: "About",
        experience: "Experience",
        education: "Education",
        credentials: "Credentials",
        ventures: "Ventures",
        insights: "Insights",
        switchLang: "日本語",
        switchPath: languageHref || defaultSwitchPath,
        languageLabel: "日本語に切り替える",
      };

  const sectionPrefix = `/${locale}`;

  return (
    <header className="site-header glass-panel">
      <Link className="site-brand" href={sectionPrefix}>
        <span>{copy.siteTitle}</span>
      </Link>

      <nav className="site-nav" aria-label={isJa ? "主要ナビゲーション" : "Main navigation"}>
        {!isHome && (
          <Link className="site-nav-link" href={sectionPrefix}>
            {copy.home}
          </Link>
        )}
        {isHome && (
          <a className="site-nav-link is-active" href="#about">
            {copy.about}
          </a>
        )}
        <a className="site-nav-link" href={`${sectionPrefix}#experience`}>
          {copy.experience}
        </a>
        <a className="site-nav-link" href={`${sectionPrefix}#education`}>
          {copy.education}
        </a>
        <a className="site-nav-link" href={`${sectionPrefix}#credentials`}>
          {copy.credentials}
        </a>
        <a className="site-nav-link" href={`${sectionPrefix}#ventures`}>
          {copy.ventures}
        </a>
        <Link className={`site-nav-link ${isInsights ? "is-active" : ""}`} href={`${sectionPrefix}/insights`}>
          {copy.insights}
        </Link>
      </nav>

      <div className="site-actions">
        <ThemeToggle locale={locale} />
        <Link className="language-link" href={copy.switchPath} aria-label={copy.languageLabel}>
          {copy.switchLang}
        </Link>
      </div>
    </header>
  );
}
