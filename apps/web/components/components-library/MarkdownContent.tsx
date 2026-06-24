"use client";

import React, { useEffect, useState } from "react";

interface MarkdownContentProps {
  id: string;
  type: string;
  dataRef?: string;
  content?: string;
  title?: string;
  locale: "en" | "ja";
  props?: Record<string, unknown>;
}

export default function MarkdownContent({
  id,
  type,
  dataRef,
  content: initialContent,
  title: initialTitle,
  locale,
  props: extraProps
}: MarkdownContentProps) {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialContent || extraProps?.content) {
      setContent(initialContent || (extraProps?.content as string) || "");
      setTitle(initialTitle || (extraProps?.title as string) || "");
      return;
    }

    if (!dataRef) return;

    setLoading(true);
    fetch("/api/mcp/tools/get_entity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dataRef, locale })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entity content");
        return res.json();
      })
      .then((data) => {
        const translation = data.translation || {};
        const frontmatter = translation.frontmatter || {};
        setTitle(frontmatter.title || "");
        
        // Strip out frontmatter if it is embedded in content_markdown
        const rawMarkdown = translation.content_markdown || "";
        const parts = rawMarkdown.split("---");
        const bodyContent = parts.length > 2 ? parts.slice(2).join("---").trim() : rawMarkdown.trim();
        setContent(bodyContent);
      })
      .catch((err) => console.error("Error fetching MarkdownContent:", err))
      .finally(() => setLoading(false));
  }, [dataRef, initialContent, initialTitle, locale, extraProps?.content, extraProps?.title]);

  const displayTitle = title || initialTitle || (extraProps?.title as string) || "";

  // Helper to safely parse basic markdown elements to HTML-like nodes
  const renderMarkdown = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul 
            key={`list-${key}`} 
            style={{ 
              paddingLeft: "1.5rem", 
              margin: "0.75rem 0 1rem 0", 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.5rem",
              listStyleType: "disc" 
            }}
          >
            {listItems.map((item, idx) => (
              <li 
                key={`li-${idx}`}
                style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--color-on-surface-variant)" }}
                dangerouslySetInnerHTML={{ __html: formatInline(item) }}
              />
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const formatInline = (str: string): string => {
      // Bold text replacement (**text**)
      let formatted = str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Link replacement ([text](url))
      formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">$1</a>');
      return formatted;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Headers
      if (trimmed.startsWith("### ")) {
        flushList(idx);
        elements.push(
          <h4 
            key={idx} 
            style={{ 
              fontFamily: "var(--font-sans)", 
              fontSize: "1.25rem", 
              fontWeight: 700, 
              color: "var(--color-secondary)", 
              margin: "1.5rem 0 0.5rem 0" 
            }}
          >
            {trimmed.substring(4)}
          </h4>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList(idx);
        elements.push(
          <h3 
            key={idx} 
            style={{ 
              fontFamily: "var(--font-serif)", 
              fontSize: "1.6rem", 
              fontWeight: 700, 
              color: "var(--color-primary)", 
              margin: "1.75rem 0 0.75rem 0" 
            }}
          >
            {trimmed.substring(3)}
          </h3>
        );
      } else if (trimmed.startsWith("# ")) {
        flushList(idx);
        elements.push(
          <h2 
            key={idx} 
            style={{ 
              fontFamily: "var(--font-serif)", 
              fontSize: "2rem", 
              fontWeight: 700, 
              color: "var(--color-primary)", 
              margin: "2rem 0 1rem 0" 
            }}
          >
            {trimmed.substring(2)}
          </h2>
        );
      }
      // Unordered List Items
      else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        listItems.push(trimmed.substring(2));
      }
      // Empty lines (paragraph break)
      else if (trimmed === "") {
        flushList(idx);
      }
      // Regular Paragraphs
      else {
        flushList(idx);
        elements.push(
          <p 
            key={idx} 
            style={{ 
              fontSize: "1rem", 
              lineHeight: 1.6, 
              color: "var(--color-on-surface)", 
              marginBottom: "1rem" 
            }}
            dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
          />
        );
      }
    });

    flushList(lines.length);
    return elements;
  };

  if (loading) {
    return (
      <div 
        className="glass-card animate-pulse" 
        style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}
        aria-busy="true"
        aria-label="Loading document content..."
      >
        <div style={{ height: "1.75rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "50%" }} />
        <div style={{ height: "1rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "100%" }} />
        <div style={{ height: "1rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "100%" }} />
        <div style={{ height: "1rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "80%" }} />
      </div>
    );
  }

  return (
    <div 
      className="glass-card" 
      style={{ padding: "2rem" }}
      aria-label={displayTitle || "Biography or detail section"}
      data-component-id={id}
      data-component-type={type}
    >
      {displayTitle && (
        <h3 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.5rem",
          color: "var(--color-primary)",
          marginBottom: "1.25rem",
          borderBottom: "1px solid var(--color-outline-variant)",
          paddingBottom: "0.5rem"
        }}>
          {displayTitle}
        </h3>
      )}
      <div style={{ wordBreak: "break-word" }}>
        {renderMarkdown(content)}
      </div>
    </div>
  );
}
