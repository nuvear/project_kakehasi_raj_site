"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export interface CopilotDeckItem {
  eyebrow?: string;
  href?: string;
  id: string;
  meta?: string;
  proofPoints?: string[];
  summary: string;
  title: string;
  visualKind?: "app" | "credential" | "education" | "experience" | "insight" | "profile" | "venture";
  visualLabel?: string;
}

export interface CopilotDeckSlide {
  eyebrow: string;
  id: string;
  items: CopilotDeckItem[];
  navLabel: string;
  summary: string;
  title: string;
}

interface CopilotDeckProps {
  contactEmail: string;
  footerCopy: string;
  locale: string;
  slides: CopilotDeckSlide[];
  spotlightFacts: Array<{ label: string; value: string }>;
}

const slideHashMap: Record<string, string> = {
  "#about": "about",
  "#profile": "about",
  "#experience": "experience",
  "#education": "education",
  "#credentials": "credentials",
  "#ventures": "ventures",
  "#insights": "insights",
};

export default function CopilotDeck({ contactEmail, footerCopy, locale, slides, spotlightFacts }: CopilotDeckProps) {
  const isJa = locale === "ja";
  const [activeSlideId, setActiveSlideId] = useState(slides[0]?.id || "about");
  const activeSlide = useMemo(
    () => slides.find((slide) => slide.id === activeSlideId) || slides[0],
    [activeSlideId, slides]
  );
  const [activeItemId, setActiveItemId] = useState(activeSlide?.items[0]?.id || "");

  useEffect(() => {
    const syncFromHash = () => {
      const nextSlideId = slideHashMap[window.location.hash];
      if (nextSlideId && slides.some((slide) => slide.id === nextSlideId)) {
        setActiveSlideId(nextSlideId);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [slides]);

  useEffect(() => {
    if (!activeSlide?.items.some((item) => item.id === activeItemId)) {
      setActiveItemId(activeSlide?.items[0]?.id || "");
    }
  }, [activeItemId, activeSlide]);

  if (!activeSlide) {
    return null;
  }

  const activeIndex = slides.findIndex((slide) => slide.id === activeSlide.id);
  const activeItem = activeSlide.items.find((item) => item.id === activeItemId) || activeSlide.items[0];
  const activeItemIndex = Math.max(activeSlide.items.findIndex((item) => item.id === activeItem?.id), 0);
  const activePanelId = `profile-panel-${activeSlide.id}-${activeItem?.id || "empty"}`;
  const progress = `${Math.round(((activeIndex + 1) / slides.length) * 100)}%`;

  const activateSlide = (slideId: string) => {
    setActiveSlideId(slideId);
    const next = slides.find((slide) => slide.id === slideId);
    setActiveItemId(next?.items[0]?.id || "");
    window.history.replaceState(null, "", `#${slideId}`);
  };

  const copy = {
    browserTitle: isJa ? "エグゼクティブプロフィール" : "Executive profile",
    identity: isJa ? "Rajkumar Rajagobalan | Singapore / Japan" : "Rajkumar Rajagobalan | Singapore / Japan",
    open: isJa ? "詳細へ移動" : "Go to detail",
    sourceFlow: isJa
      ? [
          ["resume.md", "構造化されたプロフィール"],
          ["Profile Agent", "文脈を理解して説明"],
          ["Dynamic UI", "ブランド部品で画面化"],
        ]
      : [
          ["resume.md", "structured profile source"],
          ["Profile Agent", "grounded interpretation"],
          ["Dynamic UI", "branded screens on demand"],
        ],
    facts: isJa ? "シグナル" : "Signals",
  };

  return (
    <div className="copilot-deck-page">
      <main className="copilot-deck-shell" id="about">
        <section className="copilot-browser glass-panel" aria-label={copy.browserTitle}>
          <div className="copilot-browser-bar">
            <div className="browser-path">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <strong>{activeSlide.navLabel}</strong>
            </div>
            <div className="browser-progress" aria-hidden="true">
              <span style={{ width: progress }} />
            </div>
          </div>

          <div className="copilot-chapter-tabs" aria-label={isJa ? "章" : "Chapters"}>
            {slides.map((slide) => (
              <button
                className={`copilot-tab ${slide.id === activeSlide.id ? "is-active" : ""}`}
                key={slide.id}
                onClick={() => activateSlide(slide.id)}
                type="button"
              >
                {slide.navLabel}
              </button>
            ))}
          </div>

          <div className="copilot-stage-grid">
            <div className="copilot-stage">
              <figure className="copilot-portrait-card" aria-label={isJa ? "Rajkumarの写真" : "Portrait of Rajkumar"}>
                <Image src="/images/raj-executive-portrait.png" alt="" width={1122} height={1402} priority />
              </figure>

              <div className="copilot-stage-copy">
                {activeSlide.id === "about" && <div className="profile-identity-line">{copy.identity}</div>}
                <div className="copilot-kicker">{activeSlide.eyebrow}</div>
                <h1>{activeSlide.title}</h1>
                <p>{activeSlide.summary}</p>

                {activeSlide.id === "about" && (
                  <div className="profile-flow" aria-label={isJa ? "プロフィール生成フロー" : "Profile generation flow"}>
                    {copy.sourceFlow.map(([label, description]) => (
                      <div className="profile-flow-step" key={label}>
                        <strong>{label}</strong>
                        <span>{description}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeSlide.id === "about" && <div className="spotlight-facts" aria-label={copy.facts}>
                  {spotlightFacts.map((fact) => (
                    <div className="spotlight-fact" key={`${fact.value}-${fact.label}`}>
                      <strong>{fact.value}</strong>
                      <span>{fact.label}</span>
                    </div>
                  ))}
                </div>}
              </div>
            </div>

            <div
              className="copilot-click-map"
              data-visual-kind={activeItem?.visualKind || activeSlide.id}
              aria-label={isJa ? "プロフィールタブ" : "Profile tabs"}
            >
              {activeItem && (
                <article className="tabbed-page" id={activePanelId} key={activeItem.id} role="tabpanel">
                  <span className="hotspot-visual-mark" aria-hidden="true">
                    {activeItem.visualLabel || activeItem.eyebrow || activeItem.title}
                  </span>

                  <div className="tabbed-page-header">
                    <span className="hotspot-index">{String(activeItemIndex + 1).padStart(2, "0")}</span>
                    <div className="tabbed-page-title">
                      {activeItem.eyebrow && <span className="hotspot-eyebrow">{activeItem.eyebrow}</span>}
                      <h2>{activeItem.title}</h2>
                      {activeItem.meta && <p>{activeItem.meta}</p>}
                    </div>
                    {activeItem.href && (
                      <Link className="hotspot-link" href={activeItem.href} aria-label={`${copy.open}: ${activeItem.title}`}>
                        <span aria-hidden="true">↗</span>
                      </Link>
                    )}
                  </div>

                  <p className="tabbed-page-summary">{activeItem.summary}</p>

                  {activeItem.proofPoints && activeItem.proofPoints.length > 0 && (
                    <ul className="tabbed-proof-grid">
                      {activeItem.proofPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </article>
              )}

              <div className="bottom-tab-rail" role="tablist" aria-label={isJa ? "項目" : "Profile items"}>
                {activeSlide.items.map((item, index) => {
                  const isActive = item.id === activeItem?.id;
                  const activateItem = () => {
                    setActiveItemId((currentId) => (currentId === item.id ? currentId : item.id));
                  };

                  return (
                    <button
                      aria-controls={isActive ? activePanelId : undefined}
                      aria-selected={isActive}
                      className={`bottom-tab ${isActive ? "is-active" : ""}`}
                      data-visual-kind={item.visualKind || activeSlide.id}
                      key={item.id}
                      onClick={activateItem}
                      onFocus={activateItem}
                      onPointerEnter={activateItem}
                      role="tab"
                      type="button"
                    >
                      <span className="bottom-tab-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="bottom-tab-copy">
                        <strong>{item.visualLabel || item.title}</strong>
                        <span>{item.eyebrow || item.title}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="profile-slim-footer">
        <span>{footerCopy}</span>
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </footer>
    </div>
  );
}
