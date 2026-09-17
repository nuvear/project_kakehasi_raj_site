"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import {
  languageSwitchPath,
  siteNavHref,
  type SiteNavActive,
  type SiteNavSection,
} from "@/lib/site-nav";

interface SiteHeaderProps {
  active?: SiteNavActive;
  languageHref?: string;
  locale: string;
}

export default function SiteHeader({
  active = "home",
  languageHref,
  locale,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isJa = locale === "ja";
  const isHome = active === "home";

  const copy = isJa
    ? {
        siteTitle: "ラジクマール・ラジャゴバラン",
        home: "ホーム",
        about: "略歴",
        experience: "職歴",
        education: "学歴",
        credentials: "資格",
        ventures: "ベンチャー",
        apps: "アプリ",
        insights: "知見",
        switchLang: "English",
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
        apps: "Apps",
        insights: "Insights",
        switchLang: "日本語",
        languageLabel: "日本語に切り替える",
      };

  const sectionPrefix = `/${locale}`;
  const switchPath = languageSwitchPath(active, locale, languageHref);

  const navItems: Array<{
    key: SiteNavSection;
    label: string;
  }> = [
    { key: "experience", label: copy.experience },
    { key: "education", label: copy.education },
    { key: "credentials", label: copy.credentials },
    { key: "ventures", label: copy.ventures },
    { key: "apps", label: copy.apps },
    { key: "insights", label: copy.insights },
  ];

  return (
    <header className="site-header glass-panel">
      <a className="campus-skip" href="#main-content">
        {isJa ? "本文へ" : "Skip to content"}
      </a>
      <Link className="site-brand" href={sectionPrefix}>
        <span className="campus-monogram" aria-hidden="true">
          R.
        </span>
        <span>{copy.siteTitle}</span>
      </Link>

      <nav
        id="site-navigation"
        onClick={() => setMenuOpen(false)}
        className={`site-nav ${menuOpen ? "is-open" : ""}`}
        aria-label={isJa ? "主要ナビゲーション" : "Main navigation"}
      >
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
        {navItems.map((item) => {
          const href = siteNavHref(item.key, locale, isHome);
          const isActive = active === item.key;
          const className = `site-nav-link ${isActive ? "is-active" : ""}`;

          if (href.includes("#")) {
            return (
              <a className={className} href={href} key={item.key}>
                {item.label}
              </a>
            );
          }

          return (
            <Link className={className} href={href} key={item.key}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="campus-menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (isJa ? "閉じる" : "Close") : isJa ? "メニュー" : "Menu"}
      </button>
      <div className="site-actions">
        <ThemeToggle locale={locale} />
        <Link
          className="language-link"
          href={switchPath}
          aria-label={copy.languageLabel}
        >
          {copy.switchLang}
        </Link>
      </div>
    </header>
  );
}
