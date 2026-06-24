"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface VentureItem {
  id: string;
  title: string;
  summary: string;
  start_date?: string;
  end_date?: string | null;
  role?: string;
  company_name?: string;
}

interface VenturesGridProps {
  id: string;
  type: string;
  dataRef?: string;
  entityIds?: string[];
  title?: string;
  locale: "en" | "ja";
  props?: Record<string, unknown>;
}

export default function VenturesGrid({
  id,
  type,
  dataRef,
  entityIds,
  title: initialTitle,
  locale,
  props: extraProps
}: VenturesGridProps) {
  const [ventures, setVentures] = useState<VentureItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If ventures are passed directly in props, use them
    if (extraProps?.ventures && Array.isArray(extraProps.ventures)) {
      setVentures(extraProps.ventures as VentureItem[]);
      return;
    }

    setLoading(true);

    const fetchSingleEntity = async (entityId: string): Promise<VentureItem | null> => {
      try {
        const res = await fetch("/api/mcp/tools/get_entity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: entityId, locale })
        });
        if (!res.ok) return null;
        const data = await res.json();
        const entity = data.entity || {};
        const translation = data.translation || {};
        return {
          id: entity.id,
          title: translation.frontmatter?.title || entity.id,
          summary: translation.frontmatter?.summary || "",
          start_date: entity.start_date,
          end_date: entity.end_date,
          role: entity.role,
          company_name: entity.company_name
        };
      } catch (err) {
        console.error(`Error fetching entity ${entityId}:`, err);
        return null;
      }
    };

    if (entityIds && entityIds.length > 0) {
      // Fetch specific entity IDs
      Promise.all(entityIds.map(fetchSingleEntity))
        .then((results) => {
          const valid = results.filter((item): item is VentureItem => item !== null);
          setVentures(valid);
        })
        .finally(() => setLoading(false));
    } else if (dataRef) {
      // Fetch related entities
      fetch("/api/mcp/tools/get_related_entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dataRef, locale })
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch related entities");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            const items = data
              .filter((item) => item.type === "venture")
              .map((item) => ({
                id: item.id,
                title: item.title || item.id,
                summary: item.summary || "",
                start_date: item.start_date,
                end_date: item.end_date,
                role: item.role,
                company_name: item.company_name
              }));
            setVentures(items);
          }
        })
        .catch((err) => console.error("Error fetching related ventures:", err))
        .finally(() => setLoading(false));
    } else {
      // Fetch all ventures via timeline route filtering
      fetch("/api/mcp/tools/get_entity_timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale })
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch timeline");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            const items = data
              .filter((e) => e.type === "venture")
              .map((e) => ({
                id: e.entity_id,
                title: e.title,
                summary: e.description,
                start_date: e.start_date,
                end_date: e.end_date,
                role: e.detail_name,
                company_name: e.org_name
              }));
            setVentures(items);
          }
        })
        .catch((err) => console.error("Error fetching all ventures:", err))
        .finally(() => setLoading(false));
    }
  }, [dataRef, entityIds, locale, extraProps?.ventures]);

  const i18n = {
    en: {
      title: "Ventures & Case Studies",
      viewProject: "View details",
      to: "to",
      current: "Present"
    },
    ja: {
      title: "起業・プロジェクト一覧",
      viewProject: "詳細を見る",
      to: "〜",
      current: "現在"
    }
  }[locale];

  const displayTitle = initialTitle || (extraProps?.title as string) || i18n.title;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length < 2) return dateStr;
    const [year, month] = parts;
    const monthNames = {
      en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      ja: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    }[locale] || [];
    const monthIdx = parseInt(month, 10) - 1;
    return locale === "ja" ? `${year}年${monthNames[monthIdx]}` : `${monthNames[monthIdx]} ${year}`;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ height: "2rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "30%" }} className="animate-pulse" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[1, 2].map((i) => (
            <div 
              key={i} 
              className="glass-card animate-pulse" 
              style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", height: "180px" }}
              aria-busy="true"
              aria-label="Loading ventures..."
            >
              <div style={{ height: "1.2rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "60%" }} />
              <div style={{ height: "0.8rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "40%" }} />
              <div style={{ height: "3rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "100%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} aria-label={displayTitle} data-component-id={id} data-component-type={type}>
      <h3 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "1.5rem",
        color: "var(--color-primary)",
        marginBottom: "0.5rem"
      }}>
        {displayTitle}
      </h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem"
      }}>
        {ventures.length === 0 ? (
          <div style={{ color: "var(--color-on-surface-variant)", fontSize: "0.95rem" }} className="glass-panel">
            {locale === "ja" ? "プロジェクトが見つかりませんでした" : "No ventures found"}
          </div>
        ) : (
          ventures.map((venture) => {
            const slug = venture.id.split(".").pop() || venture.id;
            return (
              <div 
                key={venture.id} 
                className="glass-card" 
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "200px"
                }}
              >
                <div>
                  <h4 style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                    marginBottom: "0.25rem"
                  }}>
                    {venture.title}
                  </h4>
                  {venture.company_name && (
                    <div style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--color-secondary)",
                      marginBottom: "0.25rem"
                    }}>
                      {venture.company_name} {venture.role && `• ${venture.role}`}
                    </div>
                  )}
                  {venture.start_date && (
                    <div style={{
                      fontSize: "0.8rem",
                      color: "var(--color-on-surface-variant)",
                      marginBottom: "0.75rem"
                    }}>
                      {formatDate(venture.start_date)} {i18n.to} {venture.end_date ? formatDate(venture.end_date) : i18n.current}
                    </div>
                  )}
                  <p style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.5,
                    color: "var(--color-on-surface)",
                    marginBottom: "1rem"
                  }}>
                    {venture.summary}
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Link 
                    href={`/${locale}/ventures/${slug}`} 
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--color-primary)",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                  >
                    {i18n.viewProject} →
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
