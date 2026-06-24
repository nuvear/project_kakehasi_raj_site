"use client";

import React, { useEffect, useState } from "react";

interface ProfileHeroProps {
  id: string;
  type: string;
  dataRef?: string;
  variant?: string;
  title?: string;
  content?: string;
  locale: "en" | "ja";
  props?: Record<string, unknown>;
}

export default function ProfileHero({
  id,
  type,
  dataRef,
  variant = "default",
  title: initialTitle,
  content: initialContent,
  locale,
  props: extraProps
}: ProfileHeroProps) {
  const [data, setData] = useState<{
    title?: string;
    subtitle?: string;
    summary?: string;
    imageUrl?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataRef) return;

    setLoading(true);
    fetch("/api/mcp/tools/get_entity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dataRef, locale })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entity");
        return res.json();
      })
      .then((resData) => {
        const entity = resData.entity || {};
        const translation = resData.translation || {};
        const frontmatter = translation.frontmatter || {};

        let subtitle = "";
        if (entity.type === "experience") {
          subtitle = entity.company?.official_name || entity.company_name || "";
        } else if (entity.type === "education") {
          subtitle = entity.institution?.official_name || "";
        } else if (entity.type === "venture") {
          subtitle = entity.company_name || "";
        }

        setData({
          title: frontmatter.title || entity.id,
          subtitle,
          summary: frontmatter.summary || ""
        });
      })
      .catch((err) => {
        console.error("Error fetching ProfileHero data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dataRef, locale]);

  const displayTitle = data?.title || initialTitle || (extraProps?.title as string) || "";
  const displaySubtitle = data?.subtitle || (extraProps?.subtitle as string) || "";
  const displaySummary = data?.summary || initialContent || (extraProps?.summary as string) || "";

  if (loading) {
    return (
      <div 
        className="glass-card animate-pulse" 
        style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}
        aria-busy="true"
        aria-label="Loading profile hero..."
      >
        <div style={{ height: "2.5rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "60%" }} />
        <div style={{ height: "1.5rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "40%" }} />
        <div style={{ height: "4rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "100%" }} />
      </div>
    );
  }

  // Define visual styling variants
  let bgStyles: React.CSSProperties = {
    padding: "2.5rem",
    position: "relative",
    overflow: "hidden"
  };

  let titleStyles: React.CSSProperties = {
    fontFamily: variant === "editorial" ? "var(--font-serif)" : "var(--font-sans)",
    fontSize: variant === "editorial" ? "2.5rem" : "2rem",
    fontWeight: 700,
    color: "var(--color-primary)",
    marginBottom: "0.5rem"
  };

  let subtitleStyles: React.CSSProperties = {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "var(--color-secondary)",
    marginBottom: "1rem"
  };

  if (variant === "venture") {
    titleStyles = {
      ...titleStyles,
      color: "var(--color-tertiary)"
    };
    subtitleStyles = {
      ...subtitleStyles,
      color: "var(--color-secondary)"
    };
  } else if (variant === "minimal") {
    bgStyles = {
      ...bgStyles,
      padding: "1.5rem",
      borderRadius: "var(--radius-md)"
    };
    titleStyles = {
      ...titleStyles,
      fontSize: "1.5rem"
    };
  }

  return (
    <div 
      className="glass-card" 
      style={bgStyles}
      aria-label={`${displayTitle} profile banner`}
      data-component-id={id}
      data-component-type={type}
    >
      {variant === "venture" && (
        <span 
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "var(--color-tertiary-container)",
            color: "var(--color-on-tertiary-container)",
            fontSize: "0.75rem",
            fontWeight: 700,
            padding: "0.25rem 0.75rem",
            borderRadius: "var(--radius-full)"
          }}
        >
          {locale === "ja" ? "ベンチャー" : "Venture"}
        </span>
      )}
      <h2 style={titleStyles}>{displayTitle}</h2>
      {displaySubtitle && <h3 style={subtitleStyles}>{displaySubtitle}</h3>}
      {displaySummary && (
        <p style={{
          fontSize: "1rem",
          lineHeight: 1.6,
          color: "var(--color-on-surface-variant)",
          whiteSpace: "pre-line"
        }}>
          {displaySummary}
        </p>
      )}
    </div>
  );
}
