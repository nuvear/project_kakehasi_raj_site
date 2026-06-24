"use client";

import React, { useState, useEffect } from "react";

interface ContactFormProps {
  id: string;
  type: string;
  locale: "en" | "ja";
  props?: {
    mode?: "contact" | "meeting";
    subjectDefault?: string;
  };
}

export default function ContactForm({
  id,
  type,
  locale,
  props: extraProps
}: ContactFormProps) {
  const mode = extraProps?.mode || "contact";
  const subjectDefault = extraProps?.subjectDefault || "";

  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(subjectDefault);
  const [message, setMessage] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Generate unique idempotency key for this form session
    const key = typeof crypto !== "undefined" && crypto.randomUUID 
      ? crypto.randomUUID() 
      : "key_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    setIdempotencyKey(key);
  }, []);

  const i18n = {
    en: {
      title: mode === "meeting" ? "Book a Meeting" : "Send a Message",
      subtitle: mode === "meeting" 
        ? "Select a suitable slot and fill in the details below to request a calendar invite."
        : "Fill in the form below and I will get back to you shortly.",
      nameLabel: "Your Name",
      emailLabel: "Email Address",
      subjectLabel: "Subject",
      messageLabel: "Message",
      meetingTimeLabel: "Preferred Meeting Date & Time",
      submitBtn: mode === "meeting" ? "Request Booking" : "Send Message",
      submitting: "Submitting...",
      successTitle: "Thank You!",
      successDesc: mode === "meeting"
        ? "Your meeting request has been submitted successfully. A calendar invitation will be sent to your email after approval."
        : "Your message has been sent successfully. I will get back to you as soon as possible.",
      successDetails: "Submitted Details:",
      errorHeader: "Submission Failed",
      validationName: "Name must be at least 2 characters.",
      validationEmail: "Please enter a valid email address.",
      validationMessage: "Message must be at least 10 characters."
    },
    ja: {
      title: mode === "meeting" ? "ミーティング予約" : "メッセージを送る",
      subtitle: mode === "meeting"
        ? "希望の日時を選択し、以下のフォームに入力してカレンダー招待をリクエストしてください。"
        : "以下のフォームに入力してください。折り返しご連絡いたします。",
      nameLabel: "お名前",
      emailLabel: "メールアドレス",
      subjectLabel: "件名",
      messageLabel: "メッセージ内容",
      meetingTimeLabel: "希望ミーティング日時",
      submitBtn: mode === "meeting" ? "予約をリクエスト" : "メッセージを送信",
      submitting: "送信中...",
      successTitle: "送信が完了しました",
      successDesc: mode === "meeting"
        ? "ミーティングリクエストが正常に送信されました。承認後、ご指定のメールアドレスにカレンダー招待が送信されます。"
        : "メッセージが正常に送信されました。できるだけ早くご連絡いたします。",
      successDetails: "送信内容:",
      errorHeader: "送信エラー",
      validationName: "お名前は2文字以上で入力してください。",
      validationEmail: "有効なメールアドレスを入力してください。",
      validationMessage: "メッセージは10文字以上で入力してください。"
    }
  }[locale];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic frontend validations
    if (name.trim().length < 2) {
      setError(i18n.validationName);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(i18n.validationEmail);
      return;
    }
    if (message.trim().length < 10) {
      setError(i18n.validationMessage);
      return;
    }

    setSubmitting(true);

    try {
      const payload: Record<string, string> = {
        name,
        email,
        subject,
        message
      };

      if (mode === "meeting" && meetingTime) {
        // Zod `.datetime()` requires ISO 8601 strings (e.g. YYYY-MM-DDTHH:MM:SSZ)
        // input type="datetime-local" outputs "YYYY-MM-DDTHH:MM", so we parse and convert to UTC ISO
        const localDate = new Date(meetingTime);
        payload.meetingTime = localDate.toISOString();
      }

      const res = await fetch("/api/write/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKey
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "An unexpected error occurred.");
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div 
        className="glass-card" 
        style={{ 
          padding: "2.5rem", 
          borderRadius: "var(--radius-lg)", 
          textAlign: "center",
          border: "1px solid rgba(13, 148, 136, 0.2)"
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
        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.5rem" }}>
          {i18n.successTitle}
        </h3>
        <p style={{ fontSize: "0.95rem", color: "var(--color-on-surface-variant)", lineHeight: 1.5, marginBottom: "1.5rem" }}>
          {i18n.successDesc}
        </p>

        <div style={{ 
          textAlign: "left", 
          backgroundColor: "var(--color-surface-container-high)", 
          padding: "1rem", 
          borderRadius: "var(--radius-sm)",
          fontSize: "0.85rem",
          border: "1px solid var(--color-outline-variant)"
        }}>
          <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{i18n.successDetails}</div>
          <div><strong>{i18n.nameLabel}:</strong> {name}</div>
          <div><strong>{i18n.emailLabel}:</strong> {email}</div>
          {mode === "meeting" && meetingTime && (
            <div><strong>{i18n.meetingTimeLabel}:</strong> {new Date(meetingTime).toLocaleString()}</div>
          )}
          <div><strong>{i18n.subjectLabel}:</strong> {subject}</div>
        </div>
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
      <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.25rem" }}>
        {i18n.title}
      </h3>
      <p style={{ fontSize: "0.85rem", color: "var(--color-on-surface-variant)", marginBottom: "1.5rem", lineHeight: 1.4 }}>
        {i18n.subtitle}
      </p>

      {error && (
        <div style={{
          backgroundColor: "rgba(185, 28, 28, 0.08)",
          color: "rgb(185, 28, 28)",
          border: "1px solid rgba(185, 28, 28, 0.2)",
          padding: "0.75rem 1rem",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.85rem",
          marginBottom: "1rem",
          fontWeight: 500
        }}>
          <strong>{i18n.errorHeader}:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-background)" }}>
            {i18n.nameLabel} <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-outline)",
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
              outline: "none",
              fontSize: "0.95rem"
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-background)" }}>
            {i18n.emailLabel} <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-outline)",
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
              outline: "none",
              fontSize: "0.95rem"
            }}
          />
        </div>

        {mode === "meeting" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-background)" }}>
              {i18n.meetingTimeLabel} <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
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
            />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-background)" }}>
            {i18n.subjectLabel} <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={submitting}
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-outline)",
              backgroundColor: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
              outline: "none",
              fontSize: "0.95rem"
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-background)" }}>
            {i18n.messageLabel} <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
