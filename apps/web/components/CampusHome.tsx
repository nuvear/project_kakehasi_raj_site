import EducationSlideshow from "./EducationSlideshow";
import Link from "next/link";
import Image from "next/image";
import type { CopilotDeckSlide } from "./CopilotDeck";
import SiteFooter from "./SiteFooter";

export default function CampusHome({
  locale,
  slides,
  summary,
}: {
  locale: string;
  slides: CopilotDeckSlide[];
  summary: string;
}) {
  const ja = locale === "ja";
  const section = (id: string) => {
    const slide = slides.find((s) => s.id === id)!;
    return {
      ...slide,
      items: slide.items.filter(
        (item): item is typeof item & { href: string } => Boolean(item.href),
      ),
    };
  };
  const experience = section("experience"),
    education = section("education"),
    ventures = section("ventures"),
    credentials = section("credentials"),
    insights = section("insights");
  if (!ja) {
    experience.items = experience.items.map((item) => {
      if (item.href.includes("capgemini")) return { ...item,
        summary: "Led a €160M delivery portfolio across APAC and Japan: 320+ projects, 35.4% profit margins, and client satisfaction of 4.5/5. Drove Altran Engineering’s post-acquisition integration, predictive-maintenance AI, and expansion into aerospace, healthcare, and heavy industries." };
      if (item.href.includes("eli-lilly")) return { ...item,
        summary: "Led the Eli Lilly Co-Innovation Lab, delivering 42 innovation initiatives and transitioning nine into production within 18 months." };
      return item;
    });
    ventures.items = ventures.items.map((item) => {
      if (item.href.includes("nuvear") || item.href.includes("innuir")) return { ...item,
        title: "Innuir", visualLabel: "Founder CEO · October 2025–present · Singapore",
        summary: "Building a longitudinal patient identity platform for continuity across healthcare providers. Leading strategy, product roadmap, and go-to-market, with privacy-first consent, auditable data sharing, and AI-enabled connected care." };
      if (item.href.includes("aagnaa")) return { ...item,
        summary: "Founded an IoT and AR/VR retail venture, raised $700K, secured patents, and pioneered real-time personalization." };
      return item;
    });
  }
  return (
    <>
      <main id="main-content" className="campus-home">
        <section
          className="campus-hero"
          id="about"
          aria-labelledby="hero-title"
        >
          <div className="campus-hero-copy">
            <p className="campus-eyebrow">
              {ja
                ? "リーダーシップ・テクノロジー・変革"
                : "Leadership · Technology · Transformation"}
            </p>
            <h1 id="hero-title">
              {ja ? (
                <>
                  構想を、
                  <br />
                  <em>確かな実行へ。</em>
                </>
              ) : (
                <>
                  Bridging vision
                  <br />
                  and <em>execution.</em>
                </>
              )}
            </h1>
            <p className="campus-intro">
              {ja ? "ラジクマール・ラジャゴバラン" : "Rajkumar Rajagobalan"}
            </p>
            <p className="campus-hero-summary">{summary}</p>
            <div className="campus-actions">
              <a className="campus-button" href="#insights">
                {ja ? "AI変革を探る" : "Explore the work"}
                <span aria-hidden="true">↗</span>
              </a>
              <a className="campus-text-link" href="mailto:raj@innuir.com">
                {ja ? "お問い合わせ" : "Get in touch"}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="campus-location">
              <span />
              {ja ? "シンガポールと日本をつなぐ" : "Across Singapore & Japan"}
            </div>
          </div>
          <figure className="campus-hero-image">
            <Image
              src="/images/golden-gate.jpg"
              alt={
                ja
                  ? "霧に包まれたゴールデンゲートブリッジ"
                  : "The Golden Gate Bridge rising above the coastal fog"
              }
              width="1400"
              height="2100"
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <figcaption>
              <span>01 / CAMPUS & COAST</span>
              <span>
                {ja
                  ? "視点をつなぐ。可能性を広げる。"
                  : "Connecting perspectives. Creating possibility."}
              </span>
            </figcaption>
          </figure>
        </section>
        <div className="campus-context">
          <span>{ja ? "戦略と実践の接点" : "At the intersection of"}</span>
          <strong>{ja ? "エンタープライズAI" : "Enterprise AI"}</strong>
          <i />
          <strong>{ja ? "APACリーダーシップ" : "APAC Leadership"}</strong>
          <i />
          <strong>
            {ja ? "ヘルスインテリジェンス" : "Health Intelligence"}
          </strong>
        </div>
        <section
          className="campus-section campus-perspective"
          aria-labelledby="perspective-title"
        >
          <div className="campus-portrait">
            <Image
              src="/raj-headshot.png"
              alt={ja ? "ラジクマール・ラジャゴバラン" : "Rajkumar Rajagobalan"}
              width="440"
              height="440"
              sizes="340px"
            />
            <span>
              {ja
                ? "リーダー・創業者・学び続ける人"
                : "Leader. Founder. Lifelong learner."}
            </span>
          </div>
          <div>
            <p className="campus-eyebrow">
              {ja ? "私の視点" : "A practical perspective"}
            </p>
            <h2 id="perspective-title">
              {ja
                ? "戦略を描き、人と事業を動かす。"
                : "Strategy is only the beginning."}
            </h2>
            <p className="campus-lead">
              {ja
                ? "企業の変革には、技術だけでなく、人、意思決定、そして実行の仕組みが必要です。"
                : "Enterprise AI transformation changes how organizations make decisions, operate, and compete."}
            </p>
            <p>
              {ja
                ? "APACのエンタープライズデリバリーからヘルステックの創業まで。StanfordとMITでの学びを、事業の現場での実践につなげています。"
                : "I’ve spent 27+ years at the intersection of engineering, AI, and enterprise transformation. My perspective combines building ventures from zero with leading global delivery programs, sharpened through the Stanford Executive Program and MIT’s COO Program."}
            </p>
            <a className="campus-text-link" href="#experience">
              {ja ? "これまでの歩み" : "Discover my journey"}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
        <section
          id="insights"
          className="campus-section campus-work"
          aria-labelledby="work-title"
        >
          <div className="campus-section-heading">
            <div>
              <p className="campus-eyebrow">
                02 / {ja ? "アイデアから実行へ" : "Ideas into practice"}
              </p>
              <h2 id="work-title">
                {ja ? "AI変革のための道具。" : "A toolkit for transformation."}
              </h2>
            </div>
            <Link className="campus-text-link" href={`/${locale}/insights`}>
              {ja ? "すべての知見" : "All insights"}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="campus-tool-grid">
            {insights.items.map((item, i) => (
              <Link
                href={item.href}
                className={`campus-tool campus-tool-${i}`}
                key={item.id}
              >
                <div className="campus-tool-top">
                  <span>{item.eyebrow}</span>
                  <span aria-hidden="true">↗</span>
                </div>
                <div className="campus-tool-art" aria-hidden="true">
                  {i === 0 ? (
                    <div className="campus-pillars">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <i key={n} />
                      ))}
                    </div>
                  ) : i === 1 ? (
                    <div className="campus-book">
                      <span>
                        ENTERPRISE
                        <br />
                        AI
                      </span>
                      <b>Reference Guide</b>
                    </div>
                  ) : (
                    <div className="campus-chart">
                      {[30, 55, 42, 72, 65, 94].map((n, j) => (
                        <i key={j} style={{ height: `${n}%` }} />
                      ))}
                    </div>
                  )}
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <span className="campus-tool-bottom">
                  {ja ? "詳しく見る" : "Explore"}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
          <Link className="campus-diary" href="/diary">
            <span className="campus-diary-icon" aria-hidden="true">
              ↗
            </span>
            <div>
              <p className="campus-eyebrow">
                {ja
                  ? "リーダーシップを、日々の習慣に"
                  : "Make leadership a daily practice"}
              </p>
              <h3>AI Leadership Diary</h3>
              <p>
                {ja
                  ? "12週間の振り返りで、AI変革への視点を深める。"
                  : "A personal space to reflect, build perspective, and shape your next 12 weeks."}
              </p>
            </div>
            <span className="campus-button">
              {ja ? "ダイアリーを開く" : "Open the diary"}
              <span aria-hidden="true">↗</span>
            </span>
          </Link>
        </section>
        <section
          id="experience"
          className="campus-section campus-experience"
          aria-labelledby="experience-title"
        >
          <div className="campus-section-heading">
            <div>
              <p className="campus-eyebrow">
                03 / {ja ? "実行実績" : "Experience & impact"}
              </p>
              <h2 id="experience-title">
                {ja ? "実践が築いた視点。" : "Leadership, in practice."}
              </h2>
            </div>
            <p>{experience.summary}</p>
          </div>
          <div className="campus-career-list">
            {experience.items.map((item, i) => (
              <Link href={item.href} key={item.id} className="campus-career">
                <span className="campus-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="campus-eyebrow">{item.meta}</p>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
                <span className="campus-round-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section id="ventures" className="campus-venture-band">
          <div className="campus-section">
            <div className="campus-section-heading">
              <div>
                <p className="campus-eyebrow">
                  04 / {ja ? "創業活動" : "The founder’s perspective"}
                </p>
                <h2>
                  {ja ? "可能性を、事業に。" : "Building what comes next."}
                </h2>
              </div>
              <p>{ventures.summary}</p>
            </div>
            <div className="campus-ventures">
              {ventures.items.map((item) => (
                <Link href={item.href} key={item.id}>
                  <span className="campus-eyebrow">{item.visualLabel}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <span className="campus-text-link">
                    {ja ? "ベンチャーを見る" : "Discover the venture"}
                    <span aria-hidden="true">↗</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section
          id="education"
          className="campus-section"
          aria-labelledby="education-title"
        >
          <div className="campus-section-heading">
            <div>
              <p className="campus-eyebrow">
                05 / {ja ? "学びの基盤" : "Foundations & perspective"}
              </p>
              <h2 id="education-title">
                {ja ? "学び続ける、という原動力。" : "Always a student."}
              </h2>
            </div>
            <p>{education.summary}</p>
          </div>
          <EducationSlideshow locale={locale} />
          <div className="campus-education">
            {education.items.map((item, i) => (
              <Link
                href={item.href}
                key={item.id}
                className={i < 2 ? "campus-school featured" : "campus-school"}
              >
                <span className="campus-school-label">{item.visualLabel}</span>
                <h3>{item.title}</h3>
                <p>{item.meta}</p>
                <span className="campus-text-link">
                  {ja ? "プログラムを見る" : "View programme"}
                  <span aria-hidden="true">↗</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section id="credentials" className="campus-section campus-credentials">
          <div className="campus-section-heading">
            <div>
              <p className="campus-eyebrow">
                06 / {ja ? "専門性" : "Continuing development"}
              </p>
              <h2>
                {ja ? "知識を、実践につなぐ。" : "Knowledge with purpose."}
              </h2>
            </div>
            <Link href={`/${locale}/credentials`} className="campus-text-link">
              {ja ? "資格をすべて見る" : "View all credentials"}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="campus-credential-grid">
            {credentials.items.map((item) => (
              <Link href={item.href} key={item.id}>
                <span className="campus-eyebrow">{item.visualLabel}</span>
                <h3>{item.title}</h3>
                <p>{item.meta}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
