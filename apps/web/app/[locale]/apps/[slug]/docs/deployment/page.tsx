import { notFound } from "next/navigation";
import { getDatabase } from "@kakehashi/db";
import type { Metadata } from "next";
import DetailPageShell from "@/components/DetailPageShell";
import MarkdownArticle from "@/components/MarkdownArticle";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const COMMAND_CENTER_SLUG = "ai-transformation-command-center";

const deploymentCopy = {
  en: {
    back: "Back to Command Center",
    badge: "Deployment Notes",
    title: "AI Transformation Command Center Deployment Guide",
    summary:
      "Public deployment notes for the Command Center boundary. The full operational runbook from the legacy source is review-gated because it is marked internal and confidential.",
    body: `
## Runtime Boundary

The AI Transformation Command Center remains a dedicated Cloud Run sub-application. Kakehashi provides the localized catalogue and app entry pages, while the full dashboard runtime is served from the stable runtime path.

## Services

- Command Center web: Next.js Pages Router frontend deployed as \`command-center-web\`.
- Command Center API: FastAPI backend deployed as \`command-center-api\`.
- Demo database: pre-seeded SQLite for the cost-to-zero showcase runtime.
- Main shell: Project Kakehashi Next.js App Router application deployed as \`kakehashi-app\`.

## Route Model

- Localized app entry: \`/en/apps/ai-transformation-command-center\` and \`/ja/apps/ai-transformation-command-center\`.
- Runtime launch path: \`/apps/ai-transformation-command-center\`.
- Legacy route during recovery: \`/ai-transformation-command-center.html\` redirects temporarily to the English app entry.

## API Boundary

The runtime frontend calls the Command Center API backend directly from the browser. Production CORS must explicitly allow the public site origin; route rewrites alone do not satisfy this boundary.

## Public Review Status

The legacy deployment guide includes internal configuration examples and production hardening notes. Keep the full runbook out of public canonical content until the owner approves the exact disclosure level.

## Acceptance Checks

- Runtime path opens the Cloud Run frontend.
- API health endpoint responds from the deployed backend.
- Browser preflight from the public site origin succeeds and returns the matching \`access-control-allow-origin\`.
- Dashboard, maturity, ROI, discovery, roadmap, and export flows do not fail from browser CORS.
- Localized app entry pages remain readable without the runtime or agent layer.
- Legacy redirects are promoted from temporary to permanent only after owner acceptance.
`
  },
  ja: {
    back: "コマンドセンターへ戻る",
    badge: "デプロイメモ",
    title: "AI変革コマンドセンター デプロイガイド",
    summary:
      "コマンドセンター境界に関する公開用デプロイメモです。旧ソースの完全な運用手順書は Internal — Confidential と明記されているため、公開範囲のレビューが必要です。",
    body: `
## ランタイム境界

AI変革コマンドセンターは専用のCloud Runサブアプリケーションとして維持します。Kakehashiはローカライズされたカタログとアプリ入口を提供し、完全なダッシュボードランタイムは安定したランタイムパスで提供します。

## サービス

- Command Center web: \`command-center-web\` としてデプロイされる Next.js Pages Router フロントエンド。
- Command Center API: \`command-center-api\` としてデプロイされる FastAPI バックエンド。
- デモデータベース: コストゼロ方針に合わせた事前シード済みSQLite。
- メインシェル: \`kakehashi-app\` としてデプロイされる Project Kakehashi Next.js App Router アプリケーション。

## ルートモデル

- ローカライズされた入口: \`/en/apps/ai-transformation-command-center\` と \`/ja/apps/ai-transformation-command-center\`。
- ランタイム起動パス: \`/apps/ai-transformation-command-center\`。
- 回復期間中の旧ルート: \`/ai-transformation-command-center.html\` は英語のアプリ入口へ一時リダイレクトします。

## API境界

ランタイムのフロントエンドはブラウザからCommand Center APIバックエンドを直接呼び出します。本番CORSでは公開サイトのオリジンを明示的に許可する必要があり、ルートのrewriteだけではこの境界を満たせません。

## 公開レビュー状態

旧デプロイガイドには内部設定例と本番運用の詳細が含まれています。所有者が公開範囲を承認するまで、完全な手順書は公開カノニカルコンテンツにしません。

## 受け入れチェック

- ランタイムパスがCloud Runフロントエンドを開く。
- APIヘルスエンドポイントがデプロイ済みバックエンドから応答する。
- 公開サイトのオリジンからのブラウザpreflightが成功し、一致する \`access-control-allow-origin\` を返す。
- ダッシュボード、成熟度、ROI、ディスカバリー、ロードマップ、エクスポート機能がブラウザCORSで失敗しない。
- ローカライズされたアプリ入口ページはランタイムやエージェント層なしでも読める。
- 旧URLのリダイレクトは所有者承認後に一時から恒久へ昇格する。
`
  }
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (slug !== COMMAND_CENTER_SLUG) return {};

  const copy = locale === "ja" ? deploymentCopy.ja : deploymentCopy.en;
  return {
    title: `${copy.title} | Rajkumar Rajagobalan`,
    description: copy.summary,
    alternates: {
      canonical: `https://www.rajagobalan.com/${locale}/apps/${slug}/docs/deployment`,
      languages: {
        en: `https://www.rajagobalan.com/en/apps/${slug}/docs/deployment`,
        ja: `https://www.rajagobalan.com/ja/apps/${slug}/docs/deployment`,
      },
    },
  };
}

export default async function CommandCenterDeploymentPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (slug !== COMMAND_CENTER_SLUG) {
    notFound();
  }

  const db = await getDatabase();
  const app = (await db.listEntities("app")).find((entity) => entity.canonical_slug === slug);
  if (!app) {
    notFound();
  }

  const copy = locale === "ja" ? deploymentCopy.ja : deploymentCopy.en;
  const isJa = locale === "ja";
  const oppositeLocale = isJa ? "en" : "ja";

  return (
    <DetailPageShell
      active="insights"
      backHref={`/${locale}/apps/${slug}`}
      backLabel={copy.back}
      badge={copy.badge}
      languageHref={`/${oppositeLocale}/apps/${slug}/docs/deployment`}
      locale={locale}
      meta={[
        { label: isJa ? "範囲" : "Scope", value: isJa ? "公開境界" : "Public boundary" },
        { label: isJa ? "ランタイム" : "Runtime", value: "Cloud Run" },
      ]}
      summary={copy.summary}
      title={copy.title}
    >
        <MarkdownArticle content={copy.body} />
    </DetailPageShell>
  );
}
