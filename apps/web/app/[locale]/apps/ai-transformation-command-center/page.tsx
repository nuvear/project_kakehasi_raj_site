import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { GATE_URL, PILOT_CONTACT, gatePitch } from "@/lib/gate-pitch";
import styles from "./page.module.css";

type Props = { params: Promise<{ locale: string }> };
const slug = "ai-transformation-command-center";

function copyFor(locale: string) {
  if (locale !== "en" && locale !== "ja") notFound();
  return gatePitch[locale];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = copyFor(locale);
  return {
    title: `${copy.title} | Rajkumar Rajagobalan`,
    description: copy.summary,
    alternates: {
      canonical: `https://www.rajagobalan.com/${locale}/apps/${slug}`,
      languages: { en: `https://www.rajagobalan.com/en/apps/${slug}`, ja: `https://www.rajagobalan.com/ja/apps/${slug}` },
    },
    openGraph: { title: copy.title, description: copy.summary, type: "website" },
  };
}

export default async function GateCommandCenterPage({ params }: Props) {
  const { locale } = await params;
  const c = copyFor(locale);
  const isJa = locale === "ja";
  return (
    <>
      <SiteHeader locale={locale} active="insights" languageHref={`/${isJa ? "en" : "ja"}/apps/${slug}`} />
      <div className={styles.page}>
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="gate-title">
          <div>
            <p className={styles.eyebrow}>{c.eyebrow}</p>
            <div className={styles.wordmark}>GATE<span>™</span></div>
            <p className={styles.expansion}>{c.expansion}</p>
            <h1 id="gate-title">{c.headline}</h1>
            <p className={styles.lead}>{c.lead}</p>
            <div className={styles.actions}>
              <a className={styles.primary} href={PILOT_CONTACT}>{c.contact} <span aria-hidden="true">↗</span></a>
              <a className={styles.secondary} href={GATE_URL}>{c.open} <span aria-hidden="true">→</span></a>
            </div>
            <p className={styles.access}><span aria-hidden="true">●</span> {c.access}</p>
            <p className={styles.accessNote}>{c.accessNote}</p>
          </div>
          <aside className={styles.cycle} aria-label={c.visualTitle}>
            <p className={styles.eyebrow}>{c.visualLabel}</p>
            <h2>{c.visualTitle}</h2>
            <ol>{c.flow.map((step, i) => <li key={step}><span aria-hidden="true">0{i + 1}</span>{step}</li>)}</ol>
            <p className={styles.cycleNote}>{c.visualNote}</p>
          </aside>
        </section>
        <section className={styles.intro}>
          <div><p className={styles.eyebrow}>{c.problemLabel}</p><h2>{c.problemTitle}</h2></div>
          <p>{c.problem}</p>
        </section>
        <section className={styles.section} aria-labelledby="capabilities-title">
          <p className={styles.eyebrow}>{c.capabilitiesLabel}</p>
          <h2 id="capabilities-title">{c.capabilitiesTitle}</h2>
          <div className={styles.capabilities}>{c.capabilities.map(([title, text], i) => <article key={title}>
            <span className={styles.number}>0{i + 1}</span><h3>{title}</h3><p>{text}</p>
          </article>)}</div>
        </section>
        <section className={`${styles.section} ${styles.perspectives}`} aria-labelledby="perspectives-title">
          <p className={styles.eyebrow}>{c.personasLabel}</p>
          <h2 id="perspectives-title">{c.personasTitle}</h2>
          <div className={styles.personas}>{c.personas.map(([role, question, text]) => <article key={role}>
            <span className={styles.role}>{role}</span><h3>{question}</h3><p>{text}</p>
          </article>)}</div>
          <p className={styles.note}>{c.personasNote}</p>
        </section>
        <section className={`${styles.section} ${styles.training}`}>
          <div><p className={styles.eyebrow}>{c.trainingLabel}</p><h2>{c.trainingTitle}</h2></div>
          <div><p>{c.training}</p><div className={styles.actions}>
            <a className={styles.lightButton} href={`${GATE_URL}/simulation`}>{c.simulation} <span aria-hidden="true">→</span></a>
            <a className={styles.lightLink} href={`${GATE_URL}/guide`}>{c.manual} <span aria-hidden="true">→</span></a>
          </div><p className={styles.note}>{c.learningAccess}</p></div>
        </section>
        <section className={styles.section} aria-labelledby="readiness-title">
          <p className={styles.eyebrow}>{c.statusLabel}</p><h2 id="readiness-title">{c.statusTitle}</h2>
          <div className={styles.readiness}>
            <article><h3>{c.todayTitle}</h3><p>{c.today}</p></article>
            <article><h3>{c.nextTitle}</h3><p>{c.next}</p></article>
          </div>
          <details className={styles.boundaries} open><summary>{c.boundariesTitle}</summary><p>{c.boundaries}</p><p>{c.roadmap}</p></details>
        </section>
        <section className={styles.close}>
          <h2>{c.closeTitle}</h2><p>{c.close}</p>
          <a className={styles.primary} href={PILOT_CONTACT}>{c.contact} <span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <div className={styles.footer}><p>{c.attribution}</p><p>{c.edition}</p></div>
      </div>
      <SiteFooter locale={locale} />
    </>
  );
}
