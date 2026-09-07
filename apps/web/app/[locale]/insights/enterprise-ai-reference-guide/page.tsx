import type { Metadata } from "next";
import Link from "next/link";
import DetailPageShell from "@/components/DetailPageShell";
import MarkdownArticle from "@/components/MarkdownArticle";
import { getReferenceGuide } from "@/lib/editorial-content";
import { headingId } from "@/lib/markdown-headings";

interface Props { params: Promise<{locale: string}> }
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const guide = getReferenceGuide(locale);
  return {title: `${guide.title} | Rajkumar Rajagobalan`, description: guide.summary,
    alternates: {canonical: `https://www.rajagobalan.com/${locale}/insights/enterprise-ai-reference-guide`, languages: {en: "https://www.rajagobalan.com/en/insights/enterprise-ai-reference-guide", ja: "https://www.rajagobalan.com/ja/insights/enterprise-ai-reference-guide"}}};
}
export default async function ReferenceGuidePage({params}: Props) {
  const {locale} = await params;
  const ja = locale === "ja";
  const guide = getReferenceGuide(locale);
  const content = guide.content.replace(/^# Enterprise AI Transformation — The Reference Guide\s*\n/, "");
  const chapters = [...content.matchAll(/^#{1,2} (.+)$/gm)].map(m => m[1]);
  return <DetailPageShell locale={locale} active="insights" backHref={`/${locale}/insights`} backLabel={ja ? "リソースへ戻る" : "Back to resources"} badge={ja ? "学習資料" : "Learning resource"} title={guide.title} summary={guide.summary} languageHref={`/${ja ? "en" : "ja"}/insights/enterprise-ai-reference-guide`} meta={[{label: ja ? "更新日" : "Updated", value: guide.last_editorial_review}]}>
    <div className="reading-notice">{ja ? "日本語概要です。" : "Looking for the command center? "}<Link href={ja ? "/en/insights/enterprise-ai-reference-guide" : "/en/apps/ai-transformation-command-center"}>{ja ? "英語の全文を読む →" : "Explore GATE →"}</Link></div>
    <details className="reading-toc"><summary>{ja ? "このページの内容" : "In this guide · 21 chapters"}</summary><nav aria-label={ja ? "目次" : "Table of contents"}><ol>{chapters.map(title => <li key={title}><Link prefetch={false} href={`/${locale}/insights/enterprise-ai-reference-guide#${headingId(title)}`}>{title}</Link></li>)}</ol></nav></details>
    <MarkdownArticle content={content} />
    <p className="reading-next"><Link href={`/${locale}/insights`}>{ja ? "すべてのリソースを見る →" : "Explore all resources →"}</Link></p>
  </DetailPageShell>;
}
