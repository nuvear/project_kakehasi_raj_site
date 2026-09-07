"use client";

import React from "react";
import Link from "next/link";
import { parseEntitySource } from "@/lib/entity-routes";

interface SourcePanelProps {
  id: string;
  type: string;
  sources?: string[];
  locale: "en" | "ja";
  props?: Record<string, unknown>;
}

export default function SourcePanel({
  id,
  type,
  sources = [],
  locale,
  props: extraProps
}: SourcePanelProps) {
  const allSources: string[] = sources.length > 0 ? sources : ((extraProps?.sources as string[]) || []);

  const i18n = {
    en: {
      title: "Grounded Sources & Verification",
      description: "The answer above is grounded in these profile records. Use the links to open the most relevant page.",
      empty: "No sources attached to this generation.",
      verified: "Grounded & Verified",
      revision: "Revision",
      type: "Type"
    },
    ja: {
      title: "ソース検証とグラウンディング",
      description: "上記の回答は、以下のプロフィール記録に基づいています。リンクから関連ページを開けます。",
      empty: "この生成に関連付けられたソースはありません。",
      verified: "グラウンディング検証済み",
      revision: "リビジョン",
      type: "タイプ"
    }
  }[locale];

  const parsedSources = allSources.map((source) => parseEntitySource(source, locale));

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: "1.5rem", 
        border: "1px dashed var(--color-primary)", 
        borderRadius: "var(--radius-lg)",
        backgroundColor: "rgba(2, 132, 199, 0.03)"
      }}
      aria-label={i18n.title}
      data-component-id={id}
      data-component-type={type}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <h4 style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-secondary)" }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          {i18n.title}
        </h4>
        <span style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          backgroundColor: "var(--color-secondary-container)",
          color: "var(--color-on-secondary-container)",
          padding: "0.15rem 0.5rem",
          borderRadius: "var(--radius-full)"
        }}>
          {i18n.verified}
        </span>
      </div>
      <p style={{ fontSize: "0.85rem", lineHeight: 1.4, color: "var(--color-on-surface-variant)", marginBottom: "1rem" }}>
        {i18n.description}
      </p>

      {parsedSources.length === 0 ? (
        <div style={{ fontSize: "0.85rem", color: "var(--color-on-surface-variant)", fontStyle: "italic" }}>
          {i18n.empty}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {parsedSources.map((src) => (
            <div 
              key={src.original}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.85rem",
                padding: "0.4rem 0.75rem",
                backgroundColor: "var(--color-surface-variant)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-outline-variant)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  backgroundColor: src.type === "education" ? "var(--color-secondary-container)" : src.type === "venture" ? "var(--color-tertiary-container)" : "var(--color-primary-container)",
                  color: src.type === "education" ? "var(--color-on-secondary-container)" : src.type === "venture" ? "var(--color-on-tertiary-container)" : "var(--color-on-primary-container)",
                  padding: "0.1rem 0.35rem",
                  borderRadius: "var(--radius-xs)"
                }}>
                  {src.typeLabel}
                </span>
                {src.path ? (
                  <Link 
                    href={src.path}
                    style={{
                      color: "var(--color-primary)",
                      fontWeight: 600,
                      textDecoration: "none"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    {src.label}
                  </Link>
                ) : (
                  <span style={{ fontWeight: 600 }}>{src.label}</span>
                )}
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--color-on-surface-variant)", fontFamily: "monospace" }}>
                {i18n.revision}: {src.revision}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
