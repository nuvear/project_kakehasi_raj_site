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
        summary: "At Capgemini Engineering, I was responsible for a €160M delivery portfolio across APAC and Japan. I worked with teams on more than 320 projects, including the integration of Altran Engineering and the use of AI in predictive maintenance." };
      if (item.href.includes("eli-lilly")) return { ...item,
        summary: "I led the HCL and Eli Lilly Co-Innovation Lab, where our teams explored 42 initiatives and brought nine into production within 18 months." };
      if (item.href.includes("mahindra-satyam")) return { ...item,
        summary: "I worked with Pfizer Japan and Mahindra Satyam to build and grow the team supporting Pfizer’s business applications." };
      if (item.href.includes("dassault")) return { ...item,
        summary: "At Dassault Systèmes DELMIA, I worked on digital manufacturing projects with Toyota and other industrial clients in Japan." };
      if (item.href.includes("ys-inc")) return { ...item,
        summary: "My work at Y.S Inc involved designing and programming factory automation systems for electro-ceramics manufacturing in Japan." };
      return item;
    });
    ventures.items = ventures.items.map((item) => {
      if (item.href.includes("nuvear") || item.href.includes("innuir")) return { ...item,
        title: "Innuir", visualLabel: "Founder CEO · October 2025–present · Singapore",
        summary: "I’m building Innuir to help people maintain a connected health history as they move between care providers. The work brings together patient identity, consent, and AI, with privacy and responsible data sharing built into the approach." };
      if (item.href.includes("aagnaa")) return { ...item,
        summary: "I founded AAGNAA to explore how IoT and AR/VR could make retail experiences more personal. The venture raised $700K and secured patents for its work." };
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
                : "Engineer · Founder · Learner"}
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
                  Learning, building,
                  <br />
                  and <em>working together.</em>
                </>
              )}
            </h1>
            <p className="campus-intro">
              {ja ? "ラジクマール・ラジャゴバラン" : "Rajkumar Rajagobalan"}
            </p>
            <p className="campus-hero-summary">{summary}</p>
            <div className="campus-actions">
              <a className="campus-button" href="#insights">
                {ja ? "AI変革を探る" : "Explore this page"}
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
                  : "Singapore and Japan have shaped much of my working life."}
              </span>
            </figcaption>
          </figure>
        </section>
        <div className="campus-context">
          <span>{ja ? "戦略と実践の接点" : "Areas I work in"}</span>
          <strong>{ja ? "エンタープライズAI" : "Enterprise AI"}</strong>
          <i />
          <strong>{ja ? "APACリーダーシップ" : "Working across cultures"}</strong>
          <i />
          <strong>
            {ja ? "ヘルスインテリジェンス" : "Connected healthcare"}
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
                : "Engineering, enterprise, and a continuing education."}
            </span>
          </div>
          <div>
            <p className="campus-eyebrow">
              {ja ? "私の視点" : "A little about me"}
            </p>
            <h2 id="perspective-title">
              {ja
                ? "戦略を描き、人と事業を動かす。"
                : "What has shaped my work."}
            </h2>
            <p className="campus-lead">
              {ja
                ? "企業の変革には、技術だけでなく、人、意思決定、そして実行の仕組みが必要です。"
                : "My work has taken me from factory automation and digital manufacturing to enterprise AI and healthcare."}
            </p>
            <p>
              {ja
                ? "APACのエンタープライズデリバリーからヘルステックの創業まで。StanfordとMITでの学びを、事業の現場での実践につなげています。"
                : "Over 27 years, I’ve worked with colleagues and clients across Japan and APAC, led delivery teams, and started businesses. These experiences continue to inform how I think about technology and the people who use it. My studies at Stanford and MIT added perspectives that I’m still putting into practice."}
            </p>
            <a className="campus-text-link" href="#experience">
              {ja ? "これまでの歩み" : "Read about my work"}
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
                02 / {ja ? "アイデアから実行へ" : "Notes and resources"}
              </p>
              <h2 id="work-title">
                {ja ? "AI変革のための道具。" : "Ideas and tools to share."}
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
                  : "Time to reflect"}
              </p>
              <h3>AI Leadership Diary</h3>
              <p>
                {ja
                  ? "12週間の振り返りで、AI変革への視点を深める。"
                  : "A twelve-week space for reflection on AI, decisions, and leadership."}
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
                03 / {ja ? "実行実績" : "Along the way"}
              </p>
              <h2 id="experience-title">
                {ja ? "実践が築いた視点。" : "People, places, and work."}
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
                  04 / {ja ? "創業活動" : "Building ventures"}
                </p>
                <h2>
                  {ja ? "可能性を、事業に。" : "What I’m building—and have built."}
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
                    {ja ? "ベンチャーを見る" : "Read about the venture"}
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
                05 / {ja ? "学びの基盤" : "Education"}
              </p>
              <h2 id="education-title">
                {ja ? "学び続ける、という原動力。" : "Places I’ve learned."}
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
                {ja ? "知識を、実践につなぐ。" : "Continuing to learn."}
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
      <SiteFooter locale={locale} heading={ja ? undefined : "Always glad to connect."} />
    </>
  );
}
