"use client";

import { useMemo, useState } from "react";

type Locale = "en" | "ja";
type PillarId = "strategy" | "data" | "tech" | "operating" | "governance" | "value";
type ViewId = "pillars" | "maturity" | "playbook" | "curriculum";

interface EnterpriseAIFrameworkInteractiveProps {
  locale: Locale;
}

const pillars: Array<{
  id: PillarId;
  title: string;
  description: string;
  insight: string;
  items: string[];
  accent: string;
}> = [
  {
    id: "strategy",
    title: "Business Strategy",
    description: "AI is the next operating model of the enterprise.",
    insight: "Move from disconnected use cases to a portfolio of business capabilities.",
    accent: "var(--color-primary)",
    items: [
      "Define AI vision aligned to business outcomes",
      "Identify revenue and efficiency opportunities",
      "Build board-level AI narrative and investment case",
      "Map competitive landscape and benchmarks",
      "Establish AI Transformation Office",
      "Develop portfolio strategy across four AI categories",
      "Apply the AI Value Matrix for prioritization"
    ]
  },
  {
    id: "data",
    title: "Data Platform",
    description: "Converting enterprise data into intelligence.",
    insight: "AI-ready data needs accessibility, quality, governance, and recency.",
    accent: "var(--color-secondary)",
    items: [
      "Centralize enterprise data assets",
      "Build data lake or warehouse architecture",
      "Establish data quality standards",
      "Define data access policies and APIs",
      "Implement real-time pipelines",
      "Transition data platform into AI platform"
    ]
  },
  {
    id: "tech",
    title: "AI Technology Stack",
    description: "Six modular layers form the AI factory.",
    insight: "Compute, data, models, orchestration, agents, and apps must be designed as one stack.",
    accent: "var(--color-tertiary)",
    items: [
      "Plan compute and inference infrastructure",
      "Connect warehouse, lakehouse, feature store, and vector store",
      "Route work across frontier, small, and deterministic systems",
      "Implement orchestration and tool control",
      "Separate creative agents from controller agents",
      "Expose outcomes through workflow applications"
    ]
  },
  {
    id: "operating",
    title: "Operating Model",
    description: "How AI work gets done at enterprise scale.",
    insight: "The durable pattern is hub-and-spoke: central platform, federated business ownership.",
    accent: "var(--color-primary)",
    items: [
      "Choose centralized, federated, or AI factory model",
      "Define AI center of excellence responsibilities",
      "Create AI product management roles",
      "Build reusable capability libraries",
      "Implement MLOps lifecycle ownership",
      "Clarify business accountability for outcomes"
    ]
  },
  {
    id: "governance",
    title: "Governance",
    description: "Without governance, AI at scale creates risk instead of value.",
    insight: "R.A.I.S.E. governs robustness, accountability, interpretability, security, and ethics.",
    accent: "var(--color-secondary)",
    items: [
      "Establish Office of AI Governance under executive ownership",
      "Implement R.A.I.S.E. policy model",
      "Map EU AI Act and market-specific obligations",
      "Run bias audits and red-team exercises",
      "Monitor drift, incidents, and exceptions",
      "Protect privacy, security, and brand integrity"
    ]
  },
  {
    id: "value",
    title: "Value Realization",
    description: "If AI value cannot be measured, AI investment cannot scale.",
    insight: "Track cost savings, revenue uplift, and risk avoidance as separate value buckets.",
    accent: "var(--color-tertiary)",
    items: [
      "Define savings, revenue, and risk value cases",
      "Track unit economics per interaction",
      "Measure revenue uplift and basket expansion",
      "Quantify risk avoidance and resilience",
      "Build board-level AI P&L view",
      "Create value review cadence"
    ]
  }
];

const maturityStages = [
  { level: 1, title: "AI Curiosity", summary: "Small pilots, no strategy" },
  { level: 2, title: "AI Experimentation", summary: "POCs with limited ROI" },
  { level: 3, title: "AI Scaling", summary: "Platforms and dedicated AI teams" },
  { level: 4, title: "AI-Driven", summary: "AI embedded in operations" },
  { level: 5, title: "AI-Native", summary: "Autonomous agents and AI-native processes" }
];

const roadmap = [
  {
    phase: "Foundation",
    timing: "0-6 months",
    items: ["Controller and Shield", "Pricing API", "Data platform", "OAIG governance"]
  },
  {
    phase: "Acceleration",
    timing: "6-12 months",
    items: ["Agent A/B test", "Sentinel triage", "Business-unit scaling", "Equity guardrails"]
  },
  {
    phase: "Scale",
    timing: "12-48 months",
    items: ["Federated AI", "Industry expansion", "AI products", "Culture moat"]
  }
];

const curriculum = [
  "Foundations of Enterprise AI",
  "AI vs Analytics vs Automation",
  "AI Strategy",
  "Data Foundations",
  "AI Technology Stack",
  "GenAI and Agents",
  "Operating Model",
  "Responsible AI",
  "Execution and Adoption",
  "Industry AI",
  "AI Economics",
  "AI Leadership and Legacy"
];

const labels = {
  en: {
    title: "Interactive Framework",
    subtitle: "Track readiness across the six pillars and explore the v8 playbook structure.",
    pillars: "Pillars",
    maturity: "Maturity",
    playbook: "Playbook",
    curriculum: "12-Week",
    progress: "Overall Progress",
    complete: "complete",
    stage: "Selected Stage",
    readiness: "Readiness",
    roadmap: "Transformation Roadmap",
    checklist: "Checklist"
  },
  ja: {
    title: "インタラクティブ・フレームワーク",
    subtitle: "6つの柱に沿って準備状況を確認し、v8プレイブックの構成を探索します。",
    pillars: "柱",
    maturity: "成熟度",
    playbook: "プレイブック",
    curriculum: "12週間",
    progress: "全体進捗",
    complete: "完了",
    stage: "選択中の段階",
    readiness: "準備状況",
    roadmap: "変革ロードマップ",
    checklist: "チェックリスト"
  }
} as const;

export default function EnterpriseAIFrameworkInteractive({ locale }: EnterpriseAIFrameworkInteractiveProps) {
  const copy = locale === "ja" ? labels.ja : labels.en;
  const [view, setView] = useState<ViewId>("pillars");
  const [selectedPillar, setSelectedPillar] = useState<PillarId>("strategy");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [maturity, setMaturity] = useState(3);

  const activePillar = pillars.find((pillar) => pillar.id === selectedPillar) || pillars[0];
  const totalItems = pillars.reduce((sum, pillar) => sum + pillar.items.length, 0);
  const completedItems = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);
  const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  function toggleItem(key: string) {
    setChecked((current) => ({
      ...current,
      [key]: !current[key]
    }));
  }

  const viewButtons: Array<{ id: ViewId; label: string }> = [
    { id: "pillars", label: copy.pillars },
    { id: "maturity", label: copy.maturity },
    { id: "playbook", label: copy.playbook },
    { id: "curriculum", label: copy.curriculum }
  ];

  return (
    <section
      className="framework-interactive"
      aria-label={copy.title}
    >
      <div className="tool-surface-header">
        <div className="framework-heading-copy">
          <span className="tool-badge">{copy.title}</span>
          <h2 className="tool-title">
            {copy.title}
          </h2>
          <p className="tool-copy">
            {copy.subtitle}
          </p>
        </div>

        <div className="framework-progress-card">
          <div className="framework-progress-label">
            {copy.progress}
          </div>
          <div className="framework-progress-track">
            <div className="framework-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="framework-progress-value">
            {progress}% {copy.complete}
          </div>
        </div>
      </div>

      <div className="tool-tab-list framework-tabs" role="group" aria-label={copy.title}>
        {viewButtons.map((button) => (
          <button
            key={button.id}
            type="button"
            onClick={() => setView(button.id)}
            aria-pressed={view === button.id}
            className={`tool-tab-button ${view === button.id ? "active" : ""}`}
          >
            {button.label}
          </button>
        ))}
      </div>

      {view === "pillars" && (
        <div className="framework-interactive-grid">
          <div className="framework-pillar-list">
            {pillars.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setSelectedPillar(pillar.id)}
                className={`framework-pillar-button ${pillar.id === selectedPillar ? "active" : ""}`}
              >
                <div className="framework-pillar-title">{pillar.title}</div>
                <div className="framework-pillar-description">{pillar.description}</div>
              </button>
            ))}
          </div>

          <div className="framework-detail-card">
            <h3>{activePillar.title}</h3>
            <p>{activePillar.insight}</p>
            <div className="framework-section-kicker">
              {copy.checklist}
            </div>
            <div className="framework-check-list">
              {activePillar.items.map((item, index) => {
                const key = `${activePillar.id}-${index}`;
                return (
                  <label key={key} className="framework-check-item">
                    <input
                      type="checkbox"
                      checked={!!checked[key]}
                      onChange={() => toggleItem(key)}
                    />
                    <span data-checked={checked[key] ? "true" : "false"}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === "maturity" && (
        <div className="framework-panel-stack">
          <label className="framework-range-label">
            <span>{copy.readiness}</span>
            <input
              type="range"
              min="1"
              max="5"
              value={maturity}
              onChange={(event) => setMaturity(Number(event.target.value))}
            />
          </label>
          <div className="framework-stage-grid">
            {maturityStages.map((stage) => (
              <div
                key={stage.level}
                className="framework-stage-card"
                data-active={stage.level === maturity ? "true" : "false"}
              >
                <div className="framework-stage-level">{stage.level}</div>
                <h3>{stage.title}</h3>
                <p>{stage.summary}</p>
              </div>
            ))}
          </div>
          <p className="framework-selected-stage">
            {copy.stage}: {maturityStages[maturity - 1].title}
          </p>
        </div>
      )}

      {view === "playbook" && (
        <div>
          <h3 className="tool-section-title">{copy.roadmap}</h3>
          <div className="framework-phase-grid">
            {roadmap.map((phase, index) => (
              <div key={phase.phase} className="framework-phase-card">
                <div className="framework-section-kicker">
                  Phase {index + 1}
                </div>
                <h3>{phase.phase}</h3>
                <div className="framework-phase-timing">{phase.timing}</div>
                <ul>
                  {phase.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "curriculum" && (
        <div className="framework-curriculum-grid">
          {curriculum.map((week, index) => (
            <div key={week} className="framework-curriculum-card">
              <div className="framework-section-kicker">
                Week {index + 1}
              </div>
              <div>{week}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
