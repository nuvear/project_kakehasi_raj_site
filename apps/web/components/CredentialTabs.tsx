"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProfileCredential } from "@/lib/profile-credentials";

interface CredentialTabsCopy {
  categoryLabel: string;
  issuerLabel: string;
  relatedLabel: string;
  yearLabel: string;
}

interface CredentialTabsProps {
  copy: CredentialTabsCopy;
  credentials: ProfileCredential[];
  locale: string;
}

function credentialVisualLabel(credential: ProfileCredential) {
  if (credential.issuer.includes("Stanford")) {
    return "Stanford";
  }

  if (credential.issuer.includes("Massachusetts")) {
    return "MIT";
  }

  if (credential.issuer.includes("AWS")) {
    return "AWS";
  }

  if (credential.issuer.includes("Blockchain")) {
    return "BTA";
  }

  return credential.issuer;
}

export default function CredentialTabs({ copy, credentials, locale }: CredentialTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCredential = credentials[activeIndex] || credentials[0];
  const panelId = `credential-panel-${activeIndex}`;

  if (!activeCredential) {
    return null;
  }

  return (
    <section className="credential-tabs" data-visual-kind="credential" aria-label={copy.categoryLabel}>
      <article className="tabbed-page credential-tabbed-page" id={panelId} key={`${activeCredential.title}-${activeCredential.year}`} role="tabpanel">
        <span className="hotspot-visual-mark" aria-hidden="true">
          {credentialVisualLabel(activeCredential)}
        </span>

        <div className="tabbed-page-header">
          <span className="hotspot-index">{String(activeIndex + 1).padStart(2, "0")}</span>
          <div className="tabbed-page-title">
            <span className="hotspot-eyebrow">{activeCredential.category}</span>
            <h2>{activeCredential.title}</h2>
            <p>{activeCredential.issuer} | {activeCredential.year}</p>
          </div>
          {activeCredential.relatedHref && (
            <Link className="hotspot-link" href={`/${locale}${activeCredential.relatedHref}`} aria-label={`${copy.relatedLabel}: ${activeCredential.title}`}>
              <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>

        <p className="tabbed-page-summary">{activeCredential.summary}</p>

        <dl className="credential-tabbed-meta">
          <div>
            <dt>{copy.issuerLabel}</dt>
            <dd>{activeCredential.issuer}</dd>
          </div>
          <div>
            <dt>{copy.categoryLabel}</dt>
            <dd>{activeCredential.category}</dd>
          </div>
          <div>
            <dt>{copy.yearLabel}</dt>
            <dd>{activeCredential.year}</dd>
          </div>
        </dl>

        {activeCredential.items && activeCredential.items.length > 0 && (
          <ul className="tabbed-proof-grid">
            {activeCredential.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </article>

      <div className="bottom-tab-rail credential-bottom-tabs" role="tablist" aria-label={copy.categoryLabel}>
        {credentials.map((credential, index) => {
          const isActive = index === activeIndex;
          const activate = () => setActiveIndex(index);

          return (
            <button
              aria-controls={isActive ? panelId : undefined}
              aria-selected={isActive}
              className={`bottom-tab ${isActive ? "is-active" : ""}`}
              data-visual-kind="credential"
              key={`${credential.title}-${credential.year}`}
              onClick={activate}
              onFocus={activate}
              onPointerEnter={activate}
              role="tab"
              type="button"
            >
              <span className="bottom-tab-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="bottom-tab-copy">
                <strong>{credentialVisualLabel(credential)}</strong>
                <span>{credential.category}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
