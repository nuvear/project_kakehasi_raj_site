"use client";

import React from "react";

interface SEOAuditIssue {
  entityId: string;
  entityType: string;
  locale: "en" | "ja" | "all";
  issueType: string;
  severity: "error" | "warning" | "info";
  details: string;
  fix: string;
}

interface SEOAuditReportProps {
  id: string;
  type: string;
  locale: "en" | "ja";
  props?: {
    issues?: SEOAuditIssue[];
  };
}

export default function SEOAuditReport({
  id,
  type,
  locale,
  props: extraProps
}: SEOAuditReportProps) {
  const issues = extraProps?.issues || [];

  const totalIssues = issues.length;
  const errorsCount = issues.filter(i => i.severity === "error").length;
  const warningsCount = issues.filter(i => i.severity === "warning").length;

  const i18n = {
    en: {
      title: "Bilingual Metadata SEO Audit",
      description: "Automated scan of active database entities. Displays metadata compliance warnings and errors.",
      empty: "Congratulations! All bilingual metadata conforms to SEO requirements (0 issues found).",
      totalIssues: "Total Issues",
      errors: "Errors",
      warnings: "Warnings",
      statusHealthy: "SEO Healthy",
      colEntity: "Entity ID",
      colLocale: "Locale",
      colSeverity: "Severity",
      colIssue: "Audit Issue Details",
      colFix: "Actionable Fix",
      severityError: "Error",
      severityWarning: "Warning",
      severityInfo: "Info"
    },
    ja: {
      title: "バイリンガル・メタデータ SEO監査",
      description: "アクティブなデータベース・エンティティの自動スキャン。メタデータの警告およびエラーを表示します。",
      empty: "おめでとうございます！すべてのバイリンガル・メタデータがSEO要件を満たしています（検出された問題: 0）。",
      totalIssues: "検出された問題",
      errors: "エラー",
      warnings: "警告",
      statusHealthy: "SEO適合",
      colEntity: "エンティティID",
      colLocale: "言語",
      colSeverity: "重要度",
      colIssue: "監査エラー詳細",
      colFix: "推奨される修正アクション",
      severityError: "エラー",
      severityWarning: "警告",
      severityInfo: "情報"
    }
  }[locale];

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "error":
        return {
          bg: "rgba(185, 28, 28, 0.09)",
          color: "rgb(185, 28, 28)",
          border: "1px solid rgba(185, 28, 28, 0.2)"
        };
      case "warning":
        return {
          bg: "rgba(217, 119, 6, 0.09)",
          color: "rgb(217, 119, 6)",
          border: "1px solid rgba(217, 119, 6, 0.2)"
        };
      default:
        return {
          bg: "rgba(2, 132, 199, 0.09)",
          color: "rgb(2, 132, 199)",
          border: "1px solid rgba(2, 132, 199, 0.2)"
        };
    }
  };

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.25rem" }}>
            {i18n.title}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--color-on-surface-variant)", lineHeight: 1.4 }}>
            {i18n.description}
          </p>
        </div>

        {totalIssues === 0 && (
          <span style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            padding: "0.25rem 0.75rem",
            backgroundColor: "var(--color-secondary-container)",
            color: "var(--color-on-secondary-container)",
            borderRadius: "var(--radius-full)"
          }}>
            ✓ {i18n.statusHealthy}
          </span>
        )}
      </div>

      {/* Summary Scorecard Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "1rem",
        marginBottom: "1.5rem"
      }}>
        <div style={{
          padding: "1rem",
          borderRadius: "var(--radius-sm)",
          backgroundColor: "var(--color-surface-container-high)",
          border: "1px solid var(--color-outline-variant)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "0.8rem", color: "var(--color-on-surface-variant)", fontWeight: 600 }}>{i18n.totalIssues}</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-primary)", marginTop: "0.25rem" }}>{totalIssues}</div>
        </div>
        <div style={{
          padding: "1rem",
          borderRadius: "var(--radius-sm)",
          backgroundColor: errorsCount > 0 ? "rgba(185, 28, 28, 0.05)" : "var(--color-surface-container-high)",
          border: "1px solid " + (errorsCount > 0 ? "rgba(185, 28, 28, 0.2)" : "var(--color-outline-variant)"),
          textAlign: "center"
        }}>
          <div style={{ fontSize: "0.8rem", color: errorsCount > 0 ? "rgb(185, 28, 28)" : "var(--color-on-surface-variant)", fontWeight: 600 }}>{i18n.errors}</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: errorsCount > 0 ? "rgb(185, 28, 28)" : "var(--color-on-surface)", marginTop: "0.25rem" }}>{errorsCount}</div>
        </div>
        <div style={{
          padding: "1rem",
          borderRadius: "var(--radius-sm)",
          backgroundColor: warningsCount > 0 ? "rgba(217, 119, 6, 0.05)" : "var(--color-surface-container-high)",
          border: "1px solid " + (warningsCount > 0 ? "rgba(217, 119, 6, 0.2)" : "var(--color-outline-variant)"),
          textAlign: "center"
        }}>
          <div style={{ fontSize: "0.8rem", color: warningsCount > 0 ? "rgb(217, 119, 6)" : "var(--color-on-surface-variant)", fontWeight: 600 }}>{i18n.warnings}</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: warningsCount > 0 ? "rgb(217, 119, 6)" : "var(--color-on-surface)", marginTop: "0.25rem" }}>{warningsCount}</div>
        </div>
      </div>

      {totalIssues === 0 ? (
        <div style={{
          padding: "1.5rem",
          textAlign: "center",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--color-outline-variant)",
          backgroundColor: "var(--color-surface-container-low)",
          color: "var(--color-on-surface-variant)",
          fontStyle: "italic",
          fontSize: "0.9rem"
        }}>
          {i18n.empty}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.85rem",
            textAlign: "left"
          }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-outline)" }}>
                <th style={{ padding: "0.75rem 0.5rem", fontWeight: 700 }}>{i18n.colEntity}</th>
                <th style={{ padding: "0.75rem 0.5rem", fontWeight: 700, width: "70px" }}>{i18n.colLocale}</th>
                <th style={{ padding: "0.75rem 0.5rem", fontWeight: 700, width: "90px" }}>{i18n.colSeverity}</th>
                <th style={{ padding: "0.75rem 0.5rem", fontWeight: 700 }}>{i18n.colIssue}</th>
                <th style={{ padding: "0.75rem 0.5rem", fontWeight: 700 }}>{i18n.colFix}</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, idx) => {
                const style = getSeverityStyle(issue.severity);
                return (
                  <tr key={idx} style={{ 
                    borderBottom: "1px solid var(--color-outline-variant)",
                    backgroundColor: idx % 2 === 0 ? "var(--color-surface-container-low)" : "transparent"
                  }}>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600, color: "var(--color-primary)" }}>{issue.entityId}</td>
                    <td style={{ padding: "0.75rem 0.5rem", textTransform: "uppercase" }}>
                      <span style={{
                        padding: "0.1rem 0.35rem",
                        borderRadius: "var(--radius-xs)",
                        backgroundColor: "var(--color-surface-variant)",
                        fontSize: "0.75rem",
                        fontWeight: 600
                      }}>
                        {issue.locale}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      <span style={{
                        padding: "0.15rem 0.45rem",
                        borderRadius: "var(--radius-xs)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: style.bg,
                        color: style.color,
                        border: style.border,
                        display: "inline-block",
                        textAlign: "center",
                        width: "100%"
                      }}>
                        {issue.severity === "error" ? i18n.severityError : issue.severity === "warning" ? i18n.severityWarning : i18n.severityInfo}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", lineHeight: 1.4 }}>{issue.details}</td>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 500, color: "var(--color-secondary)", lineHeight: 1.4 }}>{issue.fix}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
