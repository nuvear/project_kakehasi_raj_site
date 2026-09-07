import Link from "next/link";
export default function NotFound() {
  return <main className="resources-shell" id="main-content"><div className="resources-intro">
    <p className="campus-eyebrow">Rajkumar Rajagobalan · 404</p>
    <h1>Page not found.</h1>
    <p>The address may have changed. Explore the current profile, GATE and AI learning resources.</p>
    <div className="campus-actions"><Link className="campus-button" href="/en/insights">Explore resources →</Link><Link className="campus-text-link" href="/en">Home</Link><Link className="campus-text-link" href="/ja">日本語</Link></div>
  </div></main>;
}
