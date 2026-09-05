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
            {ja ? "知見とツール" : "Insights & tools"}
          </Link>
          <Link href="/diary">AI Leadership Diary</Link>
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
