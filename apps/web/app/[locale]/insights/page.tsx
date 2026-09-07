import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { publicResources } from "@/lib/resources";

interface Props { params: Promise<{ locale: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `${locale === "ja" ? "GATE・AI学習リソース" : "GATE & AI Learning Resources"} | Rajkumar Rajagobalan`,
    description: locale === "ja" ? "GATE、企業AIリファレンスガイド、エグゼクティブ・シミュレーション、AI Leadership Diary。" : "Explore GATE, the Enterprise AI Reference Guide, executive simulation and AI Leadership Diary.",
    alternates: { canonical: `https://www.rajagobalan.com/${locale}/insights`, languages: {en: "https://www.rajagobalan.com/en/insights", ja: "https://www.rajagobalan.com/ja/insights"} },
  };
}
export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  const ja = locale === "ja";
  return <>
    <SiteHeader locale={locale} active="insights" />
    <main id="main-content" className="resources-shell">
      <div className="resources-intro">
        <p className="campus-eyebrow">{ja ? "企業AI · 戦略から実践へ" : "Enterprise AI · From strategy to practice"}</p>
        <h1>{ja ? "理解を深め、判断につなげる。" : "Learn the principles. Put them to work."}</h1>
        <p>{ja ? "GATEでプロジェクトを検討し、ガイドで理解を深め、シミュレーションで判断を練習する。ダイアリーでは個人の学びを振り返ります。" : "Review projects in GATE, build understanding with the guide, practise decisions in the simulation and reflect in your Diary."}</p>
      </div>
      <div className="resources-list">
        {publicResources(locale).map((item, i) => <article key={item.id} className={`resource-row ${i === 0 ? "resource-featured" : ""}`}>
          <div className="resource-number" aria-hidden="true">0{i + 1}</div>
          <div><p className="campus-eyebrow">{item.label}</p><h2>{item.title}</h2><p>{item.summary}</p><span className="resource-status">{item.status}</span></div>
          <a className="resource-link" href={item.href}>{item.verb}<span aria-hidden="true">↗</span></a>
        </article>)}
      </div>
    </main>
    <SiteFooter locale={locale} />
  </>;
}
