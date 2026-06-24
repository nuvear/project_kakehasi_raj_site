"use client";

import React, { useState, useRef, useEffect } from "react";
import UIPlanRenderer from "./UIPlanRenderer";
import { UIPlan } from "@/lib/ui-schema";

interface Message {
  role: "user" | "assistant";
  content: string;
  uiPlan?: unknown;
}

interface AgentSandboxProps {
  locale: string;
}

export default function AgentSandbox({ locale }: AgentSandboxProps) {
  const activeLocale = (locale === "ja" ? "ja" : "en") as "en" | "ja";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCitations, setOpenCitations] = useState<Record<number, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Localization map
  const i18n = {
    en: {
      agentTitle: "Agent 'Rajagobalan'",
      agentDesc: "Ask the grounded agent a question about my profile, background, or insights. Grounded with Firestore Vector Search.",
      placeholder: "Ask about Stanford, Capgemini, or HealthKitSync...",
      sendBtn: "Ask Agent",
      loading: "Thinking...",
      showSources: "Show Grounded Sources",
      hideSources: "Hide Grounded Sources",
      sourceBadge: "Source",
      revisionBadge: "Revision",
      welcomeMsg: "Hello! I am Rajkumar's AI assistant, grounded in his official career records. Ask me anything about his professional experience, education, or ventures.",
      offlineError: "Agent offline or request failed. Please try again."
    },
    ja: {
      agentTitle: "エージェント「Rajagobalan」",
      agentDesc: "私の経歴、実績、考察に関する質問をエージェントに投げかけることができます。Firestoreのネイティブベクトル検索でグラウンディングされています。",
      placeholder: "スタンフォード、キャップジェミニ、HealthKitSyncについて尋ねる...",
      sendBtn: "送信",
      loading: "考案中...",
      showSources: "参照ソースを表示",
      hideSources: "参照ソースを非表示",
      sourceBadge: "ソース",
      revisionBadge: "リビジョン",
      welcomeMsg: "こんにちは！私はラジクマールのAIアシスタントです。彼の職歴、学歴、起業プロジェクトについて、公式データに基づいてお答えします。",
      offlineError: "エージェントがオフラインか、リクエストが失敗しました。もう一度お試しください。"
    }
  }[activeLocale];

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: i18n.welcomeMsg
      }
    ]);
  }, [i18n.welcomeMsg]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userText = inputValue.trim();
    setInputValue("");
    setLoading(true);

    // Append user message
    const updatedMessages = [
      ...messages,
      { role: "user" as const, content: userText }
    ];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content
          })),
          locale: activeLocale
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const resData = await response.json();

      if (resData.uiPlan) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "",
            uiPlan: resData.uiPlan
          }
        ]);
      } else {
        throw new Error("No UI Plan returned");
      }
    } catch (err) {
      console.error("Chat sandbox error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: i18n.offlineError
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCitation = (idx: number) => {
    setOpenCitations((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const parseSource = (src: string) => {
    const [idPart, revPart] = src.split("@");
    const dotIdx = idPart.indexOf(".");
    const entityType = dotIdx !== -1 ? idPart.substring(0, dotIdx) : "unknown";
    const entitySlug = dotIdx !== -1 ? idPart.substring(dotIdx + 1) : idPart;
    const revision = revPart || "latest";

    let pathType = "experience";
    if (entityType === "education") pathType = "education";
    else if (entityType === "venture") pathType = "ventures";

    return {
      type: entityType,
      slug: entitySlug,
      revision,
      path: `/${activeLocale}/${pathType}/${entitySlug}`
    };
  };

  return (
    <div 
      className="glass-panel" 
      style={{
        padding: "1.5rem",
        borderRadius: "1.5rem",
        border: "1px solid var(--color-outline-variant)",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        height: "650px",
        maxHeight: "85vh",
        position: "relative"
      }}
      aria-label={i18n.agentTitle}
    >
      {/* Header section */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid var(--color-outline-variant)", paddingBottom: "0.75rem" }}>
        <div style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#22c55e",
          boxShadow: "0 0 8px #22c55e"
        }} />
        <h4 style={{ fontWeight: 700, fontSize: "1.15rem", margin: 0 }}>
          {i18n.agentTitle}
        </h4>
      </div>

      {/* Scrollable messages container */}
      <div 
        role="log"
        aria-live="polite"
        style={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          paddingRight: "0.5rem"
        }}
      >
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          const plan = msg.uiPlan as UIPlan | undefined;

          return (
            <div 
              key={idx} 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isUser ? "flex-end" : "flex-start",
                width: "100%",
                gap: "0.5rem"
              }}
            >
              {/* User text message */}
              {isUser ? (
                <div 
                  className="glass-card"
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderRadius: "1.5rem 1.5rem 0 1.5rem",
                    backgroundColor: "var(--color-primary-container)",
                    color: "var(--color-on-primary-container)",
                    border: "1px solid var(--color-primary)",
                    maxWidth: "85%",
                    fontSize: "0.95rem",
                    lineHeight: 1.4
                  }}
                >
                  {msg.content}
                </div>
              ) : (
                /* Assistant message */
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {/* Text content if present */}
                  {msg.content && (
                    <div 
                      className="glass-card"
                      style={{
                        padding: "1rem 1.25rem",
                        borderRadius: "1.5rem 1.5rem 1.5rem 0",
                        backgroundColor: "var(--color-surface)",
                        border: "1px solid var(--color-outline-variant)",
                        maxWidth: "90%",
                        fontSize: "0.95rem",
                        lineHeight: 1.5
                      }}
                    >
                      {msg.content}
                    </div>
                  )}

                  {/* UI Plan rendering if present */}
                  {plan && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <UIPlanRenderer uiPlan={plan} locale={activeLocale} />
                      
                      {/* Collapsible Citation Accordion */}
                      {plan.sources && plan.sources.length > 0 && (
                        <div 
                          style={{ 
                            border: "1px solid var(--color-outline-variant)", 
                            borderRadius: "var(--radius-md)", 
                            overflow: "hidden" 
                          }}
                        >
                          <button
                            onClick={() => toggleCitation(idx)}
                            aria-expanded={!!openCitations[idx]}
                            aria-controls={`citation-panel-${idx}`}
                            style={{
                              width: "100%",
                              padding: "0.6rem 1rem",
                              backgroundColor: "var(--color-surface-variant)",
                              border: "none",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "var(--color-primary)",
                              cursor: "pointer",
                              outline: "none"
                            }}
                          >
                            <span>
                              {openCitations[idx] ? i18n.hideSources : i18n.showSources} ({plan.sources.length})
                            </span>
                            <svg 
                              width="14" 
                              height="14" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2.5"
                              style={{
                                transform: openCitations[idx] ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease"
                              }}
                            >
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          </button>
                          
                          {openCitations[idx] && (
                            <div 
                              id={`citation-panel-${idx}`}
                              style={{ 
                                padding: "0.75rem", 
                                backgroundColor: "var(--color-surface)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                                borderTop: "1px solid var(--color-outline-variant)"
                              }}
                            >
                              {plan.sources.map((src: string) => {
                                const parsed = parseSource(src);
                                return (
                                  <div 
                                    key={src} 
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      fontSize: "0.75rem",
                                      padding: "0.25rem 0.5rem",
                                      borderRadius: "var(--radius-xs)",
                                      backgroundColor: "var(--color-surface-variant)"
                                    }}
                                  >
                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                      <span style={{
                                        fontWeight: 700,
                                        fontSize: "0.65rem",
                                        textTransform: "uppercase",
                                        padding: "0.05rem 0.25rem",
                                        borderRadius: "2px",
                                        backgroundColor: parsed.type === "education" ? "var(--color-secondary-container)" : parsed.type === "venture" ? "var(--color-tertiary-container)" : "var(--color-primary-container)",
                                        color: parsed.type === "education" ? "var(--color-on-secondary-container)" : parsed.type === "venture" ? "var(--color-on-tertiary-container)" : "var(--color-on-primary-container)"
                                      }}>
                                        {parsed.type}
                                      </span>
                                      {parsed.type !== "unknown" ? (
                                        <a 
                                          href={parsed.path}
                                          style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}
                                        >
                                          {parsed.slug}
                                        </a>
                                      ) : (
                                        <span style={{ fontWeight: 600 }}>{parsed.slug}</span>
                                      )}
                                    </div>
                                    <span style={{ fontSize: "0.7rem", color: "var(--color-on-surface-variant)" }}>
                                      {i18n.revisionBadge}: {parsed.revision}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading skeleton */}
        {loading && (
          <div 
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}
            aria-busy="true"
            aria-label={i18n.loading}
          >
            <div 
              className="glass-card animate-pulse"
              style={{
                padding: "1.5rem",
                width: "90%",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                borderRadius: "1.5rem 1.5rem 1.5rem 0",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-outline-variant)"
              }}
            >
              <div style={{ height: "1.2rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "40%" }} />
              <div style={{ height: "0.9rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "85%" }} />
              <div style={{ height: "0.9rem", backgroundColor: "var(--color-surface-variant)", borderRadius: "var(--radius-sm)", width: "70%" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box section */}
      <form 
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "0.5rem",
          borderTop: "1px solid var(--color-outline-variant)",
          paddingTop: "0.75rem"
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
          placeholder={i18n.placeholder}
          aria-label={locale === "ja" ? "質問を入力" : "Enter query"}
          style={{
            flexGrow: 1,
            padding: "0.75rem 1.25rem",
            borderRadius: "2rem",
            border: "1px solid var(--color-outline)",
            fontSize: "0.95rem",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-on-background)",
            outline: "none",
            transition: "border-color 0.2s ease"
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-primary)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-outline)")}
        />
        <button 
          type="submit"
          disabled={loading || !inputValue.trim()} 
          aria-label={i18n.sendBtn}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "2rem",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-on-primary)",
            border: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: loading || !inputValue.trim() ? "not-allowed" : "pointer",
            opacity: loading || !inputValue.trim() ? 0.6 : 1,
            transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1), background-color 0.2s ease"
          }}
          onMouseEnter={(e) => {
            if (!loading && inputValue.trim()) {
              e.currentTarget.style.backgroundColor = "var(--color-secondary)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && inputValue.trim()) {
              e.currentTarget.style.backgroundColor = "var(--color-primary)";
            }
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8"/>
              </svg>
            </span>
          ) : (
            i18n.sendBtn
          )}
        </button>
      </form>

      {/* Embedded CSS animation for spinner & skeleton pulse */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
