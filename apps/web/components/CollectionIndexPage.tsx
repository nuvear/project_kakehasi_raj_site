import Link from "next/link";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import {
  type CollectionKey,
  collectionCopy,
  listCollectionItems,
} from "@/lib/collection-index";

export default async function CollectionIndexPage({
  collection,
  locale,
}: {
  collection: CollectionKey;
  locale: string;
}) {
  const copy = collectionCopy(collection, locale);
  const items = await listCollectionItems(collection, locale);
  const isJa = locale === "ja";
  const showingLabel = isJa ? "表示中" : "Showing";
  const itemsLabel = isJa ? "件" : "items";

  return (
    <div className="catalogue-page">
      <SiteHeader active={collection} locale={locale} />

      <main id="main-content" className="catalogue-shell">
        <section className="catalogue-hero" aria-labelledby="catalogue-title">
          <div className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            {showingLabel} {items.length} {itemsLabel}
          </div>
          <h1 className="catalogue-title" id="catalogue-title">
            {copy.title}
          </h1>
          <p className="catalogue-subtitle">{copy.subtitle}</p>
        </section>

        <section className="catalogue-results">
          {items.length === 0 ? (
            <div className="catalogue-empty">{copy.empty}</div>
          ) : (
            <div className="catalogue-grid">
              {items.map((item, index) => (
                <article
                  className="catalogue-card glass-card"
                  data-type={collection}
                  key={item.id}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div>
                    <div className="catalogue-card-meta">
                      <span className="catalogue-badge" data-type={collection}>
                        {item.badge}
                      </span>
                      {item.meta && (
                        <span className="catalogue-date">{item.meta}</span>
                      )}
                    </div>
                    <h2 className="catalogue-card-title">{item.title}</h2>
                    <p className="catalogue-summary">{item.summary}</p>
                  </div>
                  <Link
                    aria-label={`${copy.cta}: ${item.title}`}
                    className="read-link"
                    href={item.href}
                  >
                    <span>{copy.cta}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
