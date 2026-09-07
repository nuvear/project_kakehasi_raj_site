import Link from "next/link";
export default function SiteFooter({ locale }: { locale: string }) {
  const ja = locale === "ja";
  return (
    <footer className="campus-footer">
      <div className="campus-footer-main">
        <div>
          <p className="campus-eyebrow">
            {ja ? "対話から、次の一歩へ" : "Start a conversation"}
          </p>
          <h2>{ja ? "次の可能性を、共に。" : "Let’s build what’s next."}</h2>
          <a href="mailto:raj@innuir.com">
            raj@innuir.com <span aria-hidden="true">↗</span>
          </a>
        </div>
        <nav aria-label={ja ? "フッターナビゲーション" : "Footer navigation"}>
          <Link href={`/${locale}`}>{ja ? "プロフィール" : "Profile"}</Link>
          <Link href={`/${locale}/insights`}>
            {ja ? "AI学習リソース" : "AI learning resources"}
          </Link>
          <Link href={`/${locale}/apps/ai-transformation-command-center`}>GATE</Link>
          {/* Diary is a separate Cloud Run application and needs document navigation. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/diary">AI Leadership Diary</a>
          <Link href={`/${locale}/credentials`}>
            {ja ? "資格" : "Credentials"}
          </Link>
        </nav>
      </div>
      <div className="campus-footer-bottom">
        <span>© {new Date().getFullYear()} Rajkumar Rajagobalan</span>
        <span>Singapore · Japan</span>
        <a
          href="https://unsplash.com/photos/golden-gate-bridge-san-francisco-california-SNdAWKVN1q0"
          target="_blank"
          rel="noreferrer"
        >
          {ja
            ? "写真：Griffin Wooldridge / Unsplash"
            : "Bridge photograph: Griffin Wooldridge / Unsplash"}
        </a>
      </div>
    </footer>
  );
}
