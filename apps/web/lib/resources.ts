import { GATE_URL } from "./gate-pitch";

export function publicResources(locale: string) {
  const ja = locale === "ja";
  return [
    {
      id: "gate", href: `/${locale}/apps/ai-transformation-command-center`,
      label: ja ? "AI変革コマンドセンター" : "AI transformation command center",
      title: "GATE™", verb: ja ? "GATEを見る" : "Explore GATE",
      summary: ja ? "プロジェクト、根拠、意思決定をつなぎ、企業のAI変革を支援します。現在は限定プレビューです。" : "Bring AI projects, evidence and accountable decisions into one workspace. Currently available as a restricted preview.",
      status: ja ? "限定プレビュー" : "Restricted preview",
    },
    {
      id: "guide", href: `/${locale}/insights/enterprise-ai-reference-guide`,
      label: ja ? "リファレンスガイド" : "Reference guide",
      title: ja ? "企業AIの実践ガイド" : "Enterprise AI Reference Guide",
      verb: ja ? "ガイドを読む" : "Read the guide",
      summary: ja ? "戦略、データ、ガバナンス、投資判断を考えるための実践資料。日本語の概要と英語の全文を掲載しています。" : "Practical questions for AI strategy, data, governance and investment decisions. A companion to the work you review in GATE.",
      status: ja ? "公開資料 · 日本語概要／英語全文" : "Public learning resource",
    },
    {
      id: "simulation", href: `${GATE_URL}/simulation`,
      label: ja ? "エグゼクティブ・シミュレーション" : "Executive simulation",
      title: ja ? "ポートフォリオ会議を練習する" : "Rehearse the portfolio review",
      verb: ja ? "シミュレーションを開く" : "Open the simulation",
      summary: ja ? "5つの架空プロジェクトをCEO、CFO、CIO、CTO、法務の視点で検討。実際のプロジェクトに影響しない12週間の練習です。" : "Five fictional projects. CEO, CFO, CIO, CTO and Legal perspectives. A 12-week practice path separate from live project records.",
      status: ja ? "GATEのアクセス権が必要" : "GATE access required",
    },
    {
      id: "diary", href: "/diary",
      label: ja ? "個人の学習と振り返り" : "Personal learning practice",
      title: "AI Leadership Diary", verb: ja ? "ダイアリーを開く" : "Open the diary",
      summary: ja ? "12週間の学びとリーダーシップの振り返りを記録する個人用スペース。GATEとは別のアカウントで利用します。" : "A personal space for 12 weeks of learning and leadership reflection, with its own sign-in and access approval.",
      status: ja ? "別途ログイン・利用承認が必要" : "Separate sign-in and approval",
    },
  ];
}
