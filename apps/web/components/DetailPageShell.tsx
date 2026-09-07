import type { ReactNode } from "react";
import Link from "next/link";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export interface DetailMetaItem {
  label?: string;
  value?: string | null;
}

interface DetailPageShellProps {
  active?: "home" | "insights" | "none";
  aside?: ReactNode;
  backHref: string;
  backLabel: string;
  badge: string;
  children: ReactNode;
  languageHref?: string;
  locale: string;
  meta?: DetailMetaItem[];
  summary?: string | null;
  subtitle?: string | null;
  title: string;
  wide?: boolean;
}

export default function DetailPageShell({
  active = "none",
  aside,
  backHref,
  backLabel,
  badge,
  children,
  languageHref,
  locale,
  meta = [],
  summary,
  subtitle,
  title,
  wide = false,
}: DetailPageShellProps) {
  const visibleMeta = meta.filter((item) => item.value);

  return (
    <div className={`detail-page ${wide ? "is-wide" : ""}`}>
      <SiteHeader locale={locale} active={active} languageHref={languageHref} />

      <main id="main-content" className="detail-shell">
        <article className="detail-card glass-panel">
          <Link className="detail-back" href={backHref}>
            <span aria-hidden="true">&larr;</span>
            {backLabel}
          </Link>

          <div className={aside ? "detail-hero has-aside" : "detail-hero"}>
            <div className="detail-hero-copy">
              <div className="detail-badge">{badge}</div>
              <h1 className="detail-title">{title}</h1>
              {subtitle && <p className="detail-subtitle">{subtitle}</p>}
              {summary && <p className="detail-summary">{summary}</p>}

              {visibleMeta.length > 0 && (
                <dl className="detail-meta">
                  {visibleMeta.map((item) => (
                    <div
                      className="detail-meta-chip"
                      key={`${item.label || "meta"}-${item.value}`}
                    >
                      {item.label && <dt>{item.label}</dt>}
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {aside && <aside className="detail-aside">{aside}</aside>}
          </div>

          <div className="detail-content">{children}</div>
        </article>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
