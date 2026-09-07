import { Geist, Geist_Mono } from "next/font/google";
import CampusHome from "@/components/CampusHome";
import { getDatabase } from "@kakehashi/db";
import type {
  EntityMetadata,
  EntityType,
  FullTranslation,
} from "@kakehashi/content-schema";
import type { Metadata } from "next";
import {
  type CopilotDeckItem,
  type CopilotDeckSlide,
} from "@/components/CopilotDeck";
import SiteHeader from "@/components/SiteHeader";
import { formatDateRange } from "@/lib/date-format";
import { getProfileCredentials } from "@/lib/profile-credentials";

const profileSans = Geist({ variable: "--font-profile-sans", subsets: ["latin"] });
const profileMono = Geist_Mono({ variable: "--font-profile-mono", subsets: ["latin"] });

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface LoadedEntity {
  entity: EntityMetadata;
  translation: FullTranslation;
}

const routeByType: Partial<Record<EntityType, string>> = {
  app: "apps",
  education: "education",
  experience: "experience",
  framework: "frameworks",
  insight: "insights",
  venture: "ventures",
};

function stripMarkdown(value: string) {
  return value
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractProofPoints(markdown: string) {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- ") || line.startsWith("◆"))
    .map((line) =>
      stripMarkdown(line.replace(/^-\s*/, "").replace(/^◆\s*/, "")),
    )
    .filter(Boolean)
    .slice(0, 3);
}

function getEntityHref(locale: string, entity: EntityMetadata) {
  const route = routeByType[entity.type];
  return route ? `/${locale}/${route}/${entity.canonical_slug}` : `/${locale}`;
}

function getEntityMeta(entity: EntityMetadata, locale: string) {
  if (entity.type === "experience") {
    const company = entity.company?.official_name || "";
    return [
      company,
      formatDateRange(entity.start_date, entity.end_date, locale),
    ]
      .filter(Boolean)
      .join(" | ");
  }

  if (entity.type === "education") {
    const institution = entity.institution?.official_name || "";
    return [
      institution,
      formatDateRange(entity.start_date, entity.end_date, locale),
    ]
      .filter(Boolean)
      .join(" | ");
  }

  if (entity.type === "venture") {
    return [
      entity.company_name,
      formatDateRange(entity.start_date, entity.end_date, locale),
    ]
      .filter(Boolean)
      .join(" | ");
  }

  return "";
}

function shortenVisualLabel(value: string) {
  return value
    .replace("Stanford University Graduate School of Business", "Stanford GSB")
    .replace("Massachusetts Institute of Technology", "MIT")
    .replace("Capgemini Japan K.K.", "Capgemini Japan")
    .replace("Capgemini Engineering", "Capgemini")
    .replace("Innuir Pte. Ltd.", "Innuir")
    .replace("HCL Technologies", "HCL")
    .replace("Mahindra Satyam", "Pfizer Japan")
    .replace("Dassault Systemes DELMIA", "DELMIA")
    .trim();
}

function getVisualKind(entity: EntityMetadata): CopilotDeckItem["visualKind"] {
  switch (entity.type) {
    case "app":
      return "app";
    case "education":
      return "education";
    case "experience":
      return "experience";
    case "framework":
    case "insight":
      return "insight";
    case "venture":
      return "venture";
    default:
      return "profile";
  }
}

function getEntityVisualLabel(entity: EntityMetadata) {
  if (entity.type === "experience") {
    return shortenVisualLabel(entity.company?.official_name || "Experience");
  }

  if (entity.type === "education") {
    return shortenVisualLabel(entity.institution?.official_name || "Education");
  }

  if (entity.type === "venture") {
    return shortenVisualLabel(entity.company_name || "Venture");
  }

  return shortenVisualLabel(entity.canonical_slug.replace(/-/g, " "));
}

function getCredentialVisualLabel(issuer: string) {
  if (issuer.includes("Stanford")) {
    return "Stanford";
  }
  if (issuer.includes("Massachusetts")) {
    return "MIT";
  }
  if (issuer.includes("AWS")) {
    return "AWS";
  }
  if (issuer.includes("Blockchain")) {
    return "BTA";
  }
  return shortenVisualLabel(issuer);
}

function entityToDeckItem(locale: string, item: LoadedEntity): CopilotDeckItem {
  return {
    href: getEntityHref(locale, item.entity),
    id: item.entity.id,
    meta: getEntityMeta(item.entity, locale),
    proofPoints: extractProofPoints(item.translation.content_markdown),
    summary: item.translation.frontmatter.summary,
    title: item.translation.frontmatter.title,
    visualKind: getVisualKind(item.entity),
    visualLabel: getEntityVisualLabel(item.entity),
  };
}

const capgeminiExperienceIds = new Set([
  "experience.capgemini-apac-delivery-gpo",
  "experience.capgemini-japan",
]);

function getCombinedDateRange(items: LoadedEntity[], locale: string) {
  const starts = items
    .map((item) => item.entity.start_date)
    .filter((value): value is string => Boolean(value))
    .sort();
  const ends = items
    .map((item) => {
      const ent = item.entity;
      if (
        ent.type === "experience" ||
        ent.type === "education" ||
        ent.type === "venture"
      ) {
        return ent.end_date;
      }
      return null;
    })
    .filter((value): value is string => Boolean(value))
    .sort();

  return formatDateRange(starts[0], ends[ends.length - 1], locale);
}

function buildExperienceDeckItems(locale: string, experience: LoadedEntity[]) {
  const isJa = locale === "ja";
  const capgeminiItems = experience.filter((item) =>
    capgeminiExperienceIds.has(item.entity.id),
  );

  if (capgeminiItems.length < 2) {
    return experience.map((item) => entityToDeckItem(locale, item));
  }

  const primary =
    capgeminiItems.find(
      (item) => item.entity.id === "experience.capgemini-apac-delivery-gpo",
    ) || capgeminiItems[0];
  const otherItems = experience.filter(
    (item) => !capgeminiExperienceIds.has(item.entity.id),
  );
  const dateRange = getCombinedDateRange(capgeminiItems, locale);

  const combinedCapgemini: CopilotDeckItem = {
    href: getEntityHref(locale, primary.entity),
    id: "experience.capgemini-enterprise-scale",
    meta: ["Capgemini", dateRange].filter(Boolean).join(" | "),
    proofPoints: isJa
      ? [
          "APACデリバリー、P&L、グローバルPMO",
          "日本市場でのデジタルエンジニアリング",
          "産業IoT、AI変革、Altran統合",
        ]
      : [
          "APAC delivery, P&L, and global PMO",
          "Digital engineering leadership in Japan",
          "Industrial IoT, AI transformation, and Altran integration",
        ],
    summary: isJa
      ? "Capgemini JapanとCapgemini Engineeringを通じ、日本市場のデジタルエンジニアリング、APACデリバリーガバナンス、P&L規律、統合実行を一つの実績として提示します。"
      : "A combined Capgemini story across Japan digital engineering and APAC delivery: portfolio governance, P&L discipline, industrial IoT, AI transformation, and integration execution.",
    title: isJa
      ? "Capgemini: APACデリバリー & デジタルエンジニアリング"
      : "Capgemini: APAC Delivery & Digital Engineering",
    visualKind: "experience",
    visualLabel: "Capgemini",
  };

  return [
    combinedCapgemini,
    ...otherItems.map((item) => entityToDeckItem(locale, item)),
  ];
}

function sortNewestFirst(a: LoadedEntity, b: LoadedEntity) {
  const startA = a.entity.start_date || "";
  const startB = b.entity.start_date || "";
  return startB.localeCompare(startA);
}

async function loadTypedEntities(type: EntityType, locale: string) {
  const db = await getDatabase();
  const entities = await db.listEntities(type);
  const loaded = await Promise.all(
    entities.map(async (entity) => {
      const translation = await db.getTranslation(entity.id, locale);
      return translation ? { entity, translation } : null;
    }),
  );

  return loaded
    .filter((item): item is LoadedEntity => Boolean(item))
    .sort(sortNewestFirst);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "ja"
      ? "ラジクマール・ラジャゴバラン - エグゼクティブプロフィール"
      : "Rajkumar Rajagobalan - Executive Profile";
  const description =
    locale === "ja"
      ? "エンタープライズAI変革のリーダー、ヘルステック創業者、Stanford GSBおよびMITアルムナイ。"
      : "Enterprise AI Transformation Leader, HealthTech Founder, Stanford GSB Alumni, and MIT Alumni.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.rajagobalan.com/${locale}`,
      languages: {
        en: "https://www.rajagobalan.com/en",
        ja: "https://www.rajagobalan.com/ja",
      },
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const isJa = locale === "ja";
  const db = await getDatabase();

  const [aboutTranslation, experience, education, ventures] = await Promise.all(
    [
      db.getTranslation("profile.about", locale),
      loadTypedEntities("experience", locale),
      loadTypedEntities("education", locale),
      loadTypedEntities("venture", locale),
    ],
  );

  const { credentials } = getProfileCredentials(locale);
  const localizedCredentials = credentials.map<CopilotDeckItem>(
    (credential) => ({
      eyebrow: credential.category,
      href: credential.relatedHref
        ? `/${locale}${credential.relatedHref}`
        : `/${locale}/credentials`,
      id: `credential.${credential.title}`,
      meta: `${credential.issuer} | ${credential.year}`,
      proofPoints: credential.items || [credential.category, credential.issuer],
      summary: credential.summary,
      title: credential.title,
      visualKind: "credential",
      visualLabel: getCredentialVisualLabel(credential.issuer),
    }),
  );

  const copy = isJa
    ? {
        footer: "シンガポール | 日本 | AI変革",
        profileEyebrow: "CxO Profile",
        profileTitle: "AI変革を実行へ",
        profileSummary:
          aboutTranslation?.frontmatter.summary ||
          "シンガポールと日本のCxOに向けた、AI変革、ヘルステック創業、事業運営のプロフィール。",
        experienceTitle: "実行実績",
        experienceSummary:
          "APACでのP&L、プログラムガバナンス、エンジニアリングデリバリー。",
        educationTitle: "戦略を支える学び",
        educationSummary:
          "Stanford、MIT、静岡大学、経営大学院で培った戦略・運営・工学の基盤。",
        credentialsTitle: "資格スタック",
        credentialsSummary:
          "リーダーシップ、オペレーション、応用AI、IoT、ブロックチェーン、データサイエンス。",
        venturesTitle: "創業活動",
        venturesSummary:
          "ヘルスインテリジェンス、IoT、AR/VR、デジタルエンジニアリングの事業構築。",
        insightsTitle: "AI実行システム",
        insightsSummary:
          "フレームワーク、ガイド、コマンドセンターで構成するCxO向け実行モデル。",
        facts: [
          { value: "27+", label: "年の変革実績" },
          { value: "APAC", label: "日本・シンガポール" },
          { value: "AI", label: "戦略から実装" },
        ],
      }
    : {
        footer: "Singapore | Japan | AI Transformation",
        profileEyebrow: "CxO Profile",
        profileTitle: "AI Transformation, Delivered",
        profileSummary:
          aboutTranslation?.frontmatter.summary ||
          "A CxO-facing profile for Singapore and Japan: AI transformation, HealthTech founding, and operating leadership.",
        experienceTitle: "Executive Delivery Record",
        experienceSummary:
          "P&L, program governance, and engineering delivery across APAC.",
        educationTitle: "Strategic Education",
        educationSummary:
          "Stanford, MIT, Shizuoka, and management foundations connecting strategy, operations, and engineering.",
        credentialsTitle: "Credential Stack",
        credentialsSummary:
          "Leadership, operations, applied AI, IoT, blockchain, and data science credentials.",
        venturesTitle: "Founder Work",
        venturesSummary:
          "Health intelligence, IoT, AR/VR, and digital engineering ventures.",
        insightsTitle: "AI Transformation System",
        insightsSummary:
          "A framework, guide, and command center for board-to-delivery execution.",
        facts: [
          { value: "27+", label: "Years of delivery" },
          { value: "APAC", label: "Japan and Singapore" },
          { value: "AI", label: "Strategy to execution" },
        ],
      };

  const primaryExperience =
    experience.find(
      (item) => item.entity.id === "experience.capgemini-apac-delivery-gpo",
    ) || experience[0];
  const primaryVenture =
    ventures.find((item) => item.entity.id === "venture.nuvear") || ventures[0];
  const primaryEducation =
    education.find(
      (item) => item.entity.id === "education.stanford-executive-program",
    ) || education[0];

  const profileItems: CopilotDeckItem[] = [
    {
      eyebrow: isJa ? "変革" : "Transformation",
      href: `/${locale}/frameworks/enterprise-ai-transformation`,
      id: "profile.enterprise-ai",
      proofPoints: isJa
        ? ["フレームワーク", "リファレンスガイド", "コマンドセンター"]
        : ["Framework", "Reference guide", "Command center"],
      summary: isJa
        ? "企業AIを技術導入ではなく、意思決定、ガバナンス、実行モデルを変える事業変革として提示します。"
        : "Positions AI as operating-model change: decision systems, governance, execution rhythm, and measurable value.",
      title: isJa ? "AI変革システム" : "AI Transformation System",
      visualKind: "insight",
      visualLabel: "AI",
    },
    {
      eyebrow: isJa ? "規模" : "Scale",
      href: primaryExperience
        ? getEntityHref(locale, primaryExperience.entity)
        : `/${locale}#experience`,
      id: "profile.enterprise-scale",
      proofPoints: isJa
        ? ["APACデリバリー", "日本市場", "デジタルエンジニアリング"]
        : ["APAC delivery", "Japan market", "Digital engineering"],
      summary:
        primaryExperience?.translation.frontmatter.summary ||
        (isJa
          ? "APACと日本でのエンタープライズ規模のデリバリー経験。"
          : "Enterprise-scale delivery experience across APAC and Japan."),
      title: isJa ? "APACデリバリー" : "APAC Delivery Scale",
      visualKind: "experience",
      visualLabel: "APAC",
    },
    {
      eyebrow: isJa ? "創業" : "Founder",
      href: primaryVenture
        ? getEntityHref(locale, primaryVenture.entity)
        : `/${locale}#ventures`,
      id: "profile.founder-dna",
      proofPoints: isJa
        ? ["Innuir", "HealthKitSync", "AAGNAA"]
        : ["Innuir", "HealthKitSync", "AAGNAA"],
      summary:
        primaryVenture?.translation.frontmatter.summary ||
        (isJa
          ? "ヘルステックと応用AIを軸にした創業活動。"
          : "Founder-led work in HealthTech and applied AI."),
      title: isJa
        ? "ヘルスインテリジェンス創業"
        : "Health Intelligence Founder",
      visualKind: "venture",
      visualLabel: "Innuir",
    },
    {
      eyebrow: isJa ? "学術" : "Scholarship",
      href: primaryEducation
        ? getEntityHref(locale, primaryEducation.entity)
        : `/${locale}#education`,
      id: "profile.academic-foundation",
      proofPoints: isJa
        ? ["Stanford GSB", "MIT", "Shizuoka University"]
        : ["Stanford GSB", "MIT", "Shizuoka University"],
      summary:
        primaryEducation?.translation.frontmatter.summary ||
        (isJa
          ? "戦略、オペレーション、工学をつなぐ学術的基盤。"
          : "Academic foundations connecting strategy, operations, and engineering."),
      title: isJa ? "Stanford + MIT Lens" : "Stanford + MIT Lens",
      visualKind: "education",
      visualLabel: "GSB",
    },
    {
      eyebrow: isJa ? "資格" : "Credentials",
      href: `/${locale}/credentials`,
      id: "profile.credentials",
      proofPoints: localizedCredentials
        .slice(0, 3)
        .map((credential) => credential.title),
      summary: copy.credentialsSummary,
      title: copy.credentialsTitle,
      visualKind: "credential",
      visualLabel: "Certs",
    },
  ];

  const insightItems: CopilotDeckItem[] = [
    {
      eyebrow: isJa ? "方法論" : "Framework",
      href: `/${locale}/frameworks/enterprise-ai-transformation`,
      id: "insight.framework",
      proofPoints: isJa
        ? ["6つの柱", "成熟度", "実行モデル"]
        : ["Six pillars", "Maturity model", "Execution model"],
      summary: isJa
        ? "企業AI変革の成熟度を評価し、優先順位を調整し、実行に移すためのインタラクティブなフレームワーク。"
        : "Interactive model to assess maturity, align priorities, and move transformation into execution.",
      title: isJa ? "Transformation Framework" : "Transformation Framework",
      visualKind: "insight",
      visualLabel: "6 Pillars",
    },
    {
      eyebrow: isJa ? "ガイド" : "Guide",
      href: `/${locale}/insights/enterprise-ai-reference-guide`,
      id: "insight.reference-guide",
      proofPoints: isJa
        ? ["アーキテクチャ", "展開", "ガバナンス"]
        : ["Architecture", "Deployment", "Governance"],
      summary: isJa
        ? "大規模な企業AIソリューションを設計、展開、管理するためのリファレンスガイド。"
        : "Architecture, deployment, and governance guidance for AI solutions at scale.",
      title: isJa ? "Reference Guide" : "Reference Guide",
      visualKind: "insight",
      visualLabel: "Guide",
    },
    {
      eyebrow: isJa ? "ツール" : "Command Center",
      href: `/${locale}/apps/ai-transformation-command-center`,
      id: "insight.command-center",
      proofPoints: isJa
        ? ["ポートフォリオ", "リスク", "ガバナンス"]
        : ["Portfolio", "Risk", "Governance"],
      summary: isJa
        ? "組織全体のAIイニシアチブ、リスク、ガバナンスを可視化する実行ダッシュボード。"
        : "Operational dashboard for simulating, tracking, and monitoring initiatives, risk, and governance.",
      title: isJa ? "Command Center" : "Command Center",
      visualKind: "app",
      visualLabel: "Ops",
    },
  ];

  const slides: CopilotDeckSlide[] = [
    {
      eyebrow: copy.profileEyebrow,
      id: "about",
      items: profileItems,
      navLabel: isJa ? "プロフィール" : "Profile",
      summary: copy.profileSummary,
      title: copy.profileTitle,
    },
    {
      eyebrow: isJa ? "APAC Delivery" : "APAC Delivery",
      id: "experience",
      items: buildExperienceDeckItems(locale, experience),
      navLabel: isJa ? "職歴" : "Experience",
      summary: copy.experienceSummary,
      title: copy.experienceTitle,
    },
    {
      eyebrow: isJa ? "Strategy + Operations" : "Strategy + Operations",
      id: "education",
      items: education.map((item) => entityToDeckItem(locale, item)),
      navLabel: isJa ? "学歴" : "Education",
      summary: copy.educationSummary,
      title: copy.educationTitle,
    },
    {
      eyebrow: isJa ? "Credential Stack" : "Credential Stack",
      id: "credentials",
      items: localizedCredentials,
      navLabel: isJa ? "資格" : "Credentials",
      summary: copy.credentialsSummary,
      title: copy.credentialsTitle,
    },
    {
      eyebrow: isJa ? "Founder Work" : "Founder Work",
      id: "ventures",
      items: ventures.map((item) => entityToDeckItem(locale, item)),
      navLabel: isJa ? "ベンチャー" : "Ventures",
      summary: copy.venturesSummary,
      title: copy.venturesTitle,
    },
    {
      eyebrow: isJa ? "Board-to-Delivery System" : "Board-to-Delivery System",
      id: "insights",
      items: insightItems,
      navLabel: isJa ? "知見" : "Insights",
      summary: copy.insightsSummary,
      title: copy.insightsTitle,
    },
  ];

  return (
    <div className={isJa ? undefined : `profile-typography ${profileSans.variable} ${profileMono.variable}`}>
      <SiteHeader locale={locale} active="home" />
      <CampusHome
        locale={locale}
        slides={slides}
        summary={isJa ? copy.profileSummary : "Founder CEO at Innuir. Enterprise AI transformation leader with 27+ years across engineering, venture building, and global delivery. Stanford Executive Program and MIT COO Program."}
      />
    </div>
  );
}
