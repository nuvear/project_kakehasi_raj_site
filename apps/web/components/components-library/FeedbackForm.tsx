"use client";

import React, { useState, useEffect } from "react";

interface FeedbackFormProps {
  id: string;
  type: string;
  locale: "en" | "ja";
  props?: {
    categoryDefault?: "general" | "content" | "agent" | "app";
  };
}

export default function FeedbackForm({
  id,
  type,
  locale,
  props: extraProps
}: FeedbackFormProps) {
  const categoryDefault = extraProps?.categoryDefault || "general";

  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [category, setCategory] = useState<"general" | "content" | "agent" | "app">(categoryDefault);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = typeof crypto !== "undefined" && crypto.randomUUID 
      ? crypto.randomUUID() 
      : "key_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    setIdempotencyKey(key);
  }, []);

  const i18n = {
    en: {
      title: "Leave Feedback",
      subtitle: "Help me improve this platform. Your comments are valuable.",
      categoryLabel: "Category",
      ratingLabel: "Rating",
      commentLabel: "Comments",
      submitBtn: "Submit Feedback",
      submitting: "Submitting...",
      successTitle: "Feedback Received!",
      successDesc: "Thank you for taking the time to share your feedback. It has been recorded successfully.",
      validationComment: "Comments must be at least 5 characters.",
      catGeneral: "General Platform",
      catContent: "Content Accuracy",
      catAgent: "AI Agent 'Rajagobalan'",
      catApp: "Web Applications / Labs"
    },
    ja: {
      title: "フィードバックを残す",
      subtitle: "このプラットフォームの改善にご協力ください。皆様のご意見をお待ちしております。",
      categoryLabel: "カテゴリ",
      ratingLabel: "評価",
      commentLabel: "コメント",
      submitBtn: "送信する",
      submitting: "送信中...",
      successTitle: "フィードバックを受領しました",
      successDesc: "貴重なフィードバックを共有していただきありがとうございます。内容を記録いたしました。",
      validationComment: "コメントは5文字以上で入力してください。",
      catGeneral: "プラットフォーム全般",
      catContent: "コンテンツの正確性",
      catAgent: "AIエージェント「Rajagobalan」",
      catApp: "ウェブアプリ / ラボ"
    }
  }[locale];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (comment.trim().length < 5) {
      setError(i18n.validationComment);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/write/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKey
        },
        body: JSON.stringify({
          category,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An unexpected error occurred.");
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div 
        className="glass-card" 
        style={{ 
          padding: "2rem", 
          borderRadius: "var(--radius-lg)", 
          textAlign: "center",
          border: "1px solid rgba(20, 184, 166, 0.2)"
        }}
        data-component-id={id}
        data-component-type={type}
      >
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "var(--color-primary-container)",
          color: "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem auto"
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.5rem" }}>
          {i18n.successTitle}
        </h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-on-surface-variant)", lineHeight: 1.5 }}>
          {i18n.successDesc}
        </p>
      </div>
    );
  }

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: "2rem", 
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-outline-variant)",
        backgroundColor: "var(--glass-bg)"
      }}
      data-component-id={id}
      data-component-type={type}
    >
      <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.25rem" }}>
        {i18n.title}
      </h3>
      <p style={{ fontSize: "0.85rem", color: "var(--color-on-surface-variant)", marginBottom: "1.25rem" }}>
        {i18n.subtitle}
      </p>

      {error && (
        <div style={{
          backgroundColor: "rgba(185, 28, 28, 0.08)",
          color: "rgb(185, 28, 28)",
          border: "1px solid rgba(185, 28, 28, 0.2)",
          padding: "0.5rem 1rem",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.85rem",
          marginBottom: "1rem"
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-background)" }}>
            {i18n.categoryLabel}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "general" | "content" | "agent" | "app")}
            disabled={submitting}
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-outline)",
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
              outline: "none",
              fontSize: "0.95rem",
              fontFamily: "inherit"
            }}
          >
            <option value="general">{i18n.catGeneral}</option>
            <option value="content">{i18n.catContent}</option>
            <option value="agent">{i18n.catAgent}</option>
            <option value="app">{i18n.catApp}</option>
          </select>
        </div>

        {/* M3 Star Rating component */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-background)" }}>
            {i18n.ratingLabel}
          </label>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoverRating !== null ? star <= hoverRating : star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  disabled={submitting}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    outline: "none",
                    color: active ? "#eab308" : "var(--color-outline)" // Gold star color vs default border color
                  }}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-background)" }}>
            {i18n.commentLabel} <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            required
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-outline)",
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
              outline: "none",
              fontSize: "0.95rem",
              resize: "vertical"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-on-primary)",
            border: "none",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "opacity 0.2s ease, transform 0.1s ease",
            marginTop: "0.5rem"
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {submitting ? i18n.submitting : i18n.submitBtn}
        </button>
      </form>
    </div>
  );
}
