"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface TimelineEvent {
  entity_id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  type: string;
  org_name: string;
  detail_name: string;
  description: string;
}

interface TimelineProps {
  id: string;
  type: string;
  dataRef?: string;
  variant?: string;
  title?: string;
  locale: "en" | "ja";
  props?: Record<string, unknown>;
}

export default function Timeline({
  id,
  type,
  dataRef,
  variant = "default",
  title: initialTitle,
  locale,
  props: extraProps
}: TimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If events are passed via props, use them directly
    if (extraProps?.events && Array.isArray(extraProps.events)) {
      setEvents(extraProps.events as TimelineEvent[]);
      return;
    }

    setLoading(true);
    fetch("/api/mcp/tools/get_entity_timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dataRef, locale })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch timeline");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching timeline:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dataRef, locale, extraProps?.events]);

  const formatDate = (dateStr: string) => {
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

  const getBadgeColor = (eventType: string) => {
    switch (eventType) {
      case "education":
        return "var(--color-secondary)";
      case "venture":
        return "var(--color-tertiary)";
      case "experience":
      default:
        return "var(--color-primary)";
    }
  };

  const i18n = {
    en: {
      to: "to",
      current: "Present",
      title: "Timeline Track"
    },
    ja: {
      to: "〜",
      current: "現在",
      title: "タイムライン履歴"
    }
  }[locale];

  const displayTitle = initialTitle || (extraProps?.title as string) || i18n.title;

  if (loading) {
    return (
      <div 
        className="glass-card animate-pulse" 
        style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
        aria-busy="true"
        aria-label="Loading timeline events..."
      >
        <div style={{ height: "2rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "40%" }} />
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--color-surface-variant)", marginTop: "0.5rem" }} />
          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ height: "1.2rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "70%" }} />
            <div style={{ height: "1rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "30%" }} />
            <div style={{ height: "2rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "100%" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="glass-card" 
      style={{ padding: "2rem" }}
      aria-label={`${displayTitle}`}
      data-component-id={id}
      data-component-type={type}
      data-component-variant={variant}
    >
      <h3 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "1.5rem",
        color: "var(--color-primary)",
        marginBottom: "1.5rem"
      }}>
        {displayTitle}
      </h3>
      <div style={{
        borderLeft: "2px solid var(--color-outline-variant)",
        paddingLeft: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem"
      }}>
        {events.length === 0 ? (
          <div style={{ color: "var(--color-on-surface-variant)", fontSize: "0.95rem" }}>
            {locale === "ja" ? "イベントが見つかりませんでした" : "No timeline events found"}
          </div>
        ) : (
          events.map((event) => {
            // Determine slug path based on type
            const typePath = event.type === "education" ? "education" : event.type === "venture" ? "ventures" : "experience";
            // Map event.entity_id to slug, e.g. "education.stanford-executive-program" -> "stanford-executive-program"
            const slug = event.entity_id.split(".").pop() || event.entity_id;

            return (
              <div key={event.entity_id} style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "-1.9rem",
                  top: "0.3rem",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: getBadgeColor(event.type),
                  border: "2px solid var(--color-background)"
                }} />
                <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  <Link 
                    href={`/${locale}/${typePath}/${slug}`} 
                    style={{ color: "var(--color-primary)", textDecoration: "none" }}
                  >
                    {event.title}
                  </Link>
                </div>
                <div style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--color-secondary)",
                  marginTop: "0.1rem"
                }}>
                  {event.org_name} {event.detail_name && `• ${event.detail_name}`}
                </div>
                <div style={{
                  fontSize: "0.8rem",
                  color: "var(--color-on-surface-variant)",
                  marginBottom: "0.5rem",
                  marginTop: "0.1rem"
                }}>
                  {formatDate(event.start_date)} {i18n.to} {event.end_date ? formatDate(event.end_date) : i18n.current}
                </div>
                <div style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "var(--color-on-background)" }}>
                  {event.description}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
