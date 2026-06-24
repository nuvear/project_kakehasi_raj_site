import Link from "next/link";
import { getDatabase } from "@kakehashi/db";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ja" ? "ラジクマール・ラジャゴバラン — AIネイティブエンタープライズの構築" : "Rajkumar Rajagobalan — Building AI-Native Enterprises";
  const description = locale === "ja" ? "エンタープライズAI変革のリーダー、ヘルステック創業者（Nuvear）、スタンフォード大学経営大学院修了生、MIT修了生。" : "Enterprise AI Transformation Leader, HealthTech Founder (Nuvear), Stanford SEP Alumni, MIT Alumni.";
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
  const db = await getDatabase();

  // Load dynamic content from database layer
  const aboutTranslation = await db.getTranslation("profile.about", locale);

  const educationEntities = await db.listEntities("education");
  const experienceEntities = await db.listEntities("experience");
  const ventureEntities = await db.listEntities("venture");

  // Fetch translations for lists
  const educationList = await Promise.all(
    educationEntities.map(async (e) => ({
      entity: e,
      translation: await db.getTranslation(e.id, locale)
    }))
  );

  const experienceList = await Promise.all(
    experienceEntities.map(async (e) => ({
      entity: e,
      translation: await db.getTranslation(e.id, locale)
    }))
  );

  const ventureList = await Promise.all(
    ventureEntities.map(async (e) => ({
      entity: e,
      translation: await db.getTranslation(e.id, locale)
    }))
  );

  // Sorting helper: newest first
  const sortTimeline = (
    a: { entity: Record<string, unknown> },
    b: { entity: Record<string, unknown> }
  ) => {
    const startA = (a.entity.start_date as string) || "";
    const startB = (b.entity.start_date as string) || "";
    return startB.localeCompare(startA);
  };

  const sortedEducation = educationList.filter(item => item.translation).sort(sortTimeline);
  const sortedExperience = experienceList.filter(item => item.translation).sort(sortTimeline);
  const sortedVentures = ventureList.filter(item => item.translation).sort(sortTimeline);

  // Localization resources
  const i18nMap = {
    en: {
      siteTitle: "Rajkumar Rajagobalan",
      aboutTitle: "About Me",
      educationTitle: "Education",
      experienceTitle: "Professional Experience",
      venturesTitle: "Ventures & Labs",
      agentSandboxTitle: "Agent 'Rajagobalan'",
      agentSandboxDesc: "Ask the grounded agent a question about my profile, background, or insights. Grounded with Firestore Vector Search.",
      agentPlaceholder: "Ask about Stanford, Capgemini, or HealthKitSync...",
      agentBtn: "Ask Agent",
      navAbout: "About",
      navExperience: "Experience",
      navEducation: "Education",
      navVentures: "Ventures",
      switchLang: "日本語",
      switchPath: "/ja",
      to: "to",
      current: "Present"
    },
    ja: {
      siteTitle: "ラジクマール・ラジャゴバラン",
      aboutTitle: "略歴",
      educationTitle: "学歴・修了歴",
      experienceTitle: "職歴・プロジェクト",
      venturesTitle: "起業・ラボ",
      agentSandboxTitle: "エージェント「Rajagobalan」",
      agentSandboxDesc: "私の経歴、実績、考察に関する質問をエージェントに投げかけることができます。Firestoreのネイティブベクトル検索でグラウンディングされています。",
      agentPlaceholder: "スタンフォード、キャップジェミニ、HealthKitSyncについて尋ねる...",
      agentBtn: "送信",
      navAbout: "略歴",
      navExperience: "職歴",
      navEducation: "学歴",
      navVentures: "ベンチャー",
      switchLang: "English",
      switchPath: "/en",
      to: "〜",
      current: "現在"
    }
  };
  const i18n = i18nMap[locale as "en" | "ja"] || i18nMap.en;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const monthNames = {
      en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      ja: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
    }[locale as "en" | "ja"] || [];
    const monthIdx = parseInt(month, 10) - 1;
    return locale === "ja" ? `${year}年${monthNames[monthIdx]}` : `${monthNames[monthIdx]} ${year}`;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background)" }}>
      {/* Navigation Bar */}
      <header className="glass-panel" style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--color-primary)" }}>
          {i18n.siteTitle}
        </div>
        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="#about" style={{ fontWeight: 500, fontSize: "0.95rem" }}>{i18n.navAbout}</a>
          <a href="#experience" style={{ fontWeight: 500, fontSize: "0.95rem" }}>{i18n.navExperience}</a>
          <a href="#education" style={{ fontWeight: 500, fontSize: "0.95rem" }}>{i18n.navEducation}</a>
          <a href="#ventures" style={{ fontWeight: 500, fontSize: "0.95rem" }}>{i18n.navVentures}</a>
          <Link 
            href={i18n.switchPath} 
            aria-label={locale === "ja" ? "Switch language to English" : "日本語に切り替える"}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "9999px",
              border: "1px solid var(--color-outline)",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--color-primary)"
            }}
          >
            {i18n.switchLang}
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="about" style={{
        padding: "4rem 2rem",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "2rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div className="glass-panel" style={{
          padding: "2.5rem",
          borderRadius: "1.5rem",
          border: "1px solid var(--color-outline-variant)"
        }}>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            color: "var(--color-primary)",
            marginBottom: "1rem"
          }}>
            {aboutTranslation?.frontmatter.title}
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: "var(--color-on-surface-variant)",
            marginBottom: "1.5rem",
            lineHeight: 1.6
          }}>
            {aboutTranslation?.frontmatter.summary}
          </p>
          <div style={{
            lineHeight: 1.7,
            fontSize: "1rem",
            whiteSpace: "pre-line"
          }}>
            {aboutTranslation?.content_markdown.split("---").pop()?.trim()}
          </div>
        </div>
      </section>

      {/* Two-Column Main Content & Sandbox Grid */}
      <section style={{
        padding: "0 2rem 4rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "2.5rem"
      }}>
        {/* Left Column: Timeline Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {/* Experience */}
          <div id="experience">
            <h3 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              color: "var(--color-primary)",
              marginBottom: "1.5rem"
            }}>
              {i18n.experienceTitle}
            </h3>
            <div style={{
              borderLeft: "2px solid var(--color-outline-variant)",
              paddingLeft: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem"
            }}>
              {sortedExperience.map(({ entity, translation }) => (
                <div key={entity.id} style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    left: "-1.9rem",
                    top: "0.2rem",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-primary)",
                    border: "2px solid var(--color-background)"
                  }} />
                  <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                    <Link href={`/${locale}/experience/${entity.canonical_slug}`} style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                      {translation?.frontmatter.title}
                    </Link>
                  </div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "var(--color-on-surface-variant)",
                    marginBottom: "0.5rem"
                  }}>
                    {formatDate((entity as { start_date: string }).start_date)} {i18n.to} {(entity as { end_date: string | null }).end_date ? formatDate((entity as { end_date: string }).end_date) : i18n.current}
                  </div>
                  <div style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
                    {translation?.frontmatter.summary}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div id="education">
            <h3 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              color: "var(--color-primary)",
              marginBottom: "1.5rem"
            }}>
              {i18n.educationTitle}
            </h3>
            <div style={{
              borderLeft: "2px solid var(--color-outline-variant)",
              paddingLeft: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem"
            }}>
              {sortedEducation.map(({ entity, translation }) => (
                <div key={entity.id} style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    left: "-1.9rem",
                    top: "0.2rem",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-secondary)",
                    border: "2px solid var(--color-background)"
                  }} />
                  <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                    <Link href={`/${locale}/education/${entity.canonical_slug}`} style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                      {translation?.frontmatter.title}
                    </Link>
                  </div>
                  <div style={{
                    fontSize: "0.85rem",
                    color: "var(--color-on-surface-variant)",
                    marginBottom: "0.5rem"
                  }}>
                    {formatDate((entity as { start_date: string }).start_date)} {i18n.to} {(entity as { end_date: string | null }).end_date ? formatDate((entity as { end_date: string }).end_date) : i18n.current}
                  </div>
                  <div style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
                    {translation?.frontmatter.summary}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ventures */}
          <div id="ventures">
            <h3 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              color: "var(--color-primary)",
              marginBottom: "1.5rem"
            }}>
              {i18n.venturesTitle}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
              {sortedVentures.map(({ entity, translation }) => (
                <div key={entity.id} className="glass-card" style={{
                  padding: "1.5rem"
                }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                    <Link href={`/${locale}/ventures/${entity.canonical_slug}`} style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                      {translation?.frontmatter.title}
                    </Link>
                  </div>
                  <div style={{
                    fontSize: "0.8rem",
                    color: "var(--color-on-surface-variant)",
                    marginBottom: "0.75rem"
                  }}>
                    {formatDate((entity as { start_date: string }).start_date)} {i18n.to} {(entity as { end_date: string | null }).end_date ? formatDate((entity as { end_date: string }).end_date) : i18n.current}
                  </div>
                  <div style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
                    {translation?.frontmatter.summary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Agent Sandbox */}
        <div>
          <div className="glass-panel" style={{
            position: "sticky",
            top: "6rem",
            padding: "2rem",
            borderRadius: "1.5rem",
            border: "1px solid var(--color-outline-variant)",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                boxShadow: "0 0 8px #22c55e"
              }} />
              <h4 style={{ fontWeight: 700, fontSize: "1.15rem", margin: 0 }}>
                {i18n.agentSandboxTitle}
              </h4>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.5, color: "var(--color-on-surface-variant)" }}>
              {i18n.agentSandboxDesc}
            </p>
            <div style={{
              flexGrow: 1,
              minHeight: "150px",
              backgroundColor: "var(--color-surface-variant)",
              borderRadius: "0.75rem",
              padding: "1rem",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-on-surface-variant)",
              border: "1px solid var(--color-outline-variant)"
            }}>
              Agent offline (Ready for Phase 3)
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                disabled
                placeholder={i18n.agentPlaceholder}
                style={{
                  flexGrow: 1,
                  padding: "0.75rem 1rem",
                  borderRadius: "2rem",
                  border: "1px solid var(--color-outline)",
                  fontSize: "0.9rem",
                  backgroundColor: "var(--color-surface-variant)"
                }}
              />
              <button disabled style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "2rem",
                backgroundColor: "var(--color-primary)",
                color: "#ffffff",
                border: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                opacity: 0.6
              }}>
                {i18n.agentBtn}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
