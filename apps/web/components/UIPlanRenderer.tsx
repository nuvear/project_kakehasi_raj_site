"use client";

import React from "react";
import { UIPlanSchema } from "@/lib/ui-schema";
import ProfileHero from "./components-library/ProfileHero";
import Timeline from "./components-library/Timeline";
import VenturesGrid from "./components-library/VenturesGrid";
import MarkdownContent from "./components-library/MarkdownContent";
import SourcePanel from "./components-library/SourcePanel";

interface UIPlanRendererProps {
  uiPlan: unknown;
  locale: "en" | "ja";
}

export default function UIPlanRenderer({ uiPlan, locale }: UIPlanRendererProps) {
  // Validate UI Plan
  const validation = UIPlanSchema.safeParse(uiPlan);

  if (!validation.success) {
    console.error("UI Plan validation error in Renderer:", validation.error);
    
    // Deterministic fallback (FR-026)
    return (
      <div 
        style={{
          padding: "1.5rem",
          border: "1px solid var(--color-error)",
          borderRadius: "var(--radius-md)",
          backgroundColor: "var(--color-surface-variant)",
          color: "var(--color-on-background)"
        }}
        aria-live="polite"
      >
        <h4 style={{ color: "var(--color-error)", fontWeight: 700, marginBottom: "0.5rem" }}>
          {locale === "ja" ? "表示エラー" : "Rendering Error"}
        </h4>
        <p style={{ fontSize: "0.9rem", color: "var(--color-on-surface-variant)" }}>
          {locale === "ja" 
            ? "申し訳ありません。プランの検証に失敗したため、コンテンツを表示できませんでした。" 
            : "Sorry, we could not display this content because it failed structural verification."}
        </p>
      </div>
    );
  }

  const plan = validation.data;

  // Render components dynamically based on mapped type
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {plan.components.map((comp) => {
        // Map component type string to exact component
        const typeLower = comp.type.toLowerCase();

        if (typeLower === "profilehero" || typeLower === "institutionhero") {
          return (
            <ProfileHero
              key={comp.id}
              id={comp.id}
              type={comp.type}
              dataRef={comp.dataRef}
              variant={comp.variant}
              title={comp.title}
              content={comp.content}
              locale={locale}
              props={comp.props}
            />
          );
        }

        if (typeLower === "timeline" || typeLower === "experiencetimeline") {
          return (
            <Timeline
              key={comp.id}
              id={comp.id}
              type={comp.type}
              dataRef={comp.dataRef}
              variant={comp.variant}
              title={comp.title}
              locale={locale}
              props={comp.props}
            />
          );
        }

        if (typeLower === "venturesgrid" || typeLower === "metricgrid" || typeLower === "ventures") {
          return (
            <VenturesGrid
              key={comp.id}
              id={comp.id}
              type={comp.type}
              dataRef={comp.dataRef}
              entityIds={comp.entityIds}
              title={comp.title}
              locale={locale}
              props={comp.props}
            />
          );
        }

        if (
          typeLower === "markdowncontent" ||
          typeLower === "biographysection" ||
          typeLower === "educationstory" ||
          typeLower === "venturecasestudy" ||
          typeLower === "articlesection"
        ) {
          return (
            <MarkdownContent
              key={comp.id}
              id={comp.id}
              type={comp.type}
              dataRef={comp.dataRef}
              content={comp.content}
              title={comp.title}
              locale={locale}
              props={comp.props}
            />
          );
        }

        if (typeLower === "sourcepanel" || typeLower === "sourceprovenancepanel") {
          return (
            <SourcePanel
              key={comp.id}
              id={comp.id}
              type={comp.type}
              sources={plan.sources}
              locale={locale}
              props={comp.props}
            />
          );
        }

        // Unknown / Fallback rendering
        return (
          <div 
            key={comp.id}
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-surface-variant)",
              border: "1px solid var(--color-outline-variant)",
              fontSize: "0.85rem",
              color: "var(--color-on-surface-variant)"
            }}
          >
            <strong>{comp.type}</strong>: {comp.title || comp.content || `(Component ID: ${comp.id})`}
          </div>
        );
      })}

      {/* Automatically append a SourcePanel at the end if none was explicitly rendered, 
          and sources exist */}
      {plan.sources && plan.sources.length > 0 && !plan.components.some(c => c.type.toLowerCase().includes("source")) && (
        <SourcePanel
          id="auto-sources"
          type="SourcePanel"
          sources={plan.sources}
          locale={locale}
        />
      )}
    </div>
  );
}
