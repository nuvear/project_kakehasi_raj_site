"use client";

import React, { useState } from "react";

interface CommandCenterDashboardProps {
  locale: string;
}

export default function CommandCenterDashboard({ locale }: CommandCenterDashboardProps) {
  const isJa = locale === "ja";
  const [activeTab, setActiveTab] = useState<"dashboard" | "maturity" | "roi" | "discovery">("dashboard");

  // --- TAB 1: EXECUTIVE DASHBOARD STATE ---
  const [demoProjects] = useState([
    { id: 1, name: isJa ? "カスタマーサービス自動化" : "Customer Service Automation", status: "Active", roi: "240%", spend: 120000 },
    { id: 2, name: isJa ? "予測需要サプライチェーン" : "Predictive Demand Supply Chain", status: "Planning", roi: "310%", spend: 250000 },
    { id: 3, name: isJa ? "パーソナライズ製品提案" : "Personalized Product Recommendation", status: "Active", roi: "190%", spend: 85000 },
    { id: 4, name: isJa ? "AI契約書セキュリティレビュー" : "AI Contract Security Review", status: "Completed", roi: "280%", spend: 60000 }
  ]);

  // --- TAB 2: MATURITY STATE ---
  const [maturityScores, setMaturityScores] = useState({
    strategy: 3,
    data: 2,
    technology: 3,
    people: 2,
    governance: 2
  });

  const getMaturityLevel = () => {
    const avg = (maturityScores.strategy + maturityScores.data + maturityScores.technology + maturityScores.people + maturityScores.governance) / 5;
    if (avg < 1.5) return { name: isJa ? "初期段階 (Ad-Hoc)" : "Initial (Ad-Hoc)", color: "#ef4444" };
    if (avg < 2.5) return { name: isJa ? "個別的 (Opportunistic)" : "Opportunistic", color: "#f97316" };
    if (avg < 3.5) return { name: isJa ? "体系的 (Systemic)" : "Systemic", color: "#3b82f6" };
    return { name: isJa ? "AIネイティブ (AI-Native)" : "AI-Native", color: "#10b981" };
  };

  // --- TAB 3: ROI STATE ---
  const [currentRevenue, setCurrentRevenue] = useState(10000000);
  const [currentCost, setCurrentCost] = useState(8000000);
  const [revenueIncreasePct, setRevenueIncreasePct] = useState(15);
  const [costReductionPct, setCostReductionPct] = useState(10);
  const [implementationCost, setImplementationCost] = useState(500000);

  const calculateROI = () => {
    const revBenefit = currentRevenue * (revenueIncreasePct / 100);
    const costBenefit = currentCost * (costReductionPct / 100);
    const totalBenefit = revBenefit + costBenefit;
    const netBenefit = totalBenefit - implementationCost;
    const roi = (totalBenefit / implementationCost) * 100;
    const payback = implementationCost / totalBenefit; // in years
    return { revBenefit, costBenefit, totalBenefit, netBenefit, roi, payback };
  };

  const roiMetrics = calculateROI();

  // --- TAB 4: DISCOVERY STATE ---
  const [selectedIndustry, setSelectedIndustry] = useState<"healthcare" | "finance" | "manufacturing" | "retail">("healthcare");

  const useCases = {
    healthcare: [
      { title: isJa ? "予測的患者再入院防止" : "Predictive Patient Readmission Prevention", impact: "High", feasibility: "Medium", roi: "240%" },
      { title: isJa ? "AI搭載医療コーディング自動化" : "AI-Powered Medical Coding Automation", impact: "High", feasibility: "High", roi: "310%" },
      { title: isJa ? "臨床試験被験者最適化" : "Clinical Trial Cohort Optimization", impact: "Medium", feasibility: "Low", roi: "180%" }
    ],
    finance: [
      { title: isJa ? "リアルタイムAI不正検出" : "Real-Time AI Fraud Detection", impact: "Critical", feasibility: "Medium", roi: "420%" },
      { title: isJa ? "自動ローン引受アシスタント" : "Automated Loan Underwriting Assistant", impact: "High", feasibility: "High", roi: "280%" },
      { title: isJa ? "対話型AI資産アドバイザー" : "Conversational AI Wealth Advisor", impact: "Medium", feasibility: "High", roi: "190%" }
    ],
    manufacturing: [
      { title: isJa ? "製造業における予知保全" : "Predictive Maintenance in Manufacturing", impact: "High", feasibility: "Medium", roi: "340%" },
      { title: isJa ? "AI外観自動品質検査" : "AI Automated Visual Quality Inspection", impact: "High", feasibility: "High", roi: "270%" },
      { title: isJa ? "サプライチェーン在庫インテリジェント最適化" : "Supply Chain Intelligent Inventory Optimization", impact: "Medium", feasibility: "Medium", roi: "220%" }
    ],
    retail: [
      { title: isJa ? "AI自動ダイナミックプライシング" : "AI Dynamic Pricing Optimization", impact: "High", feasibility: "Medium", roi: "290%" },
      { title: isJa ? "自動在庫補充エンジニアリング" : "Automated Inventory Replenishment Engineering", impact: "High", feasibility: "High", roi: "250%" },
      { title: isJa ? "ハイパーパーソナライズプロモーション" : "Hyper-Personalized Promotion Engine", impact: "Medium", feasibility: "High", roi: "210%" }
    ]
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(isJa ? "ja-JP" : "en-US", {
      style: "currency",
      currency: isJa ? "JPY" : "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="glass-panel command-center-container" style={{
      marginTop: "2rem",
      padding: "2rem",
      borderRadius: "1.5rem",
      border: "1px solid var(--color-outline-variant)",
      background: "var(--glass-bg)"
    }}>
      <style>{`
        .tab-btn {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm, 8px);
          border: 1px solid var(--color-outline-variant);
          background: transparent;
          color: var(--color-on-background);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-btn.active {
          background: var(--color-primary);
          color: var(--color-on-primary);
          border-color: var(--color-primary);
        }
        .tab-btn:hover:not(.active) {
          border-color: var(--color-primary);
          background: var(--color-surface-variant);
        }
        .slider-group {
          margin-bottom: 1.25rem;
        }
        .slider-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 0.4rem;
          font-weight: 500;
        }
        .custom-slider {
          width: 100%;
          accent-color: var(--color-primary);
        }
        .metric-card {
          padding: 1.25rem;
          border-radius: var(--radius-md, 12px);
          border: 1px solid var(--color-outline-variant);
          background: rgba(255, 255, 255, 0.4);
          text-align: center;
        }
        .metric-title {
          font-size: 0.85rem;
          color: var(--color-on-surface-variant);
          margin-bottom: 0.5rem;
        }
        .metric-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-primary);
        }
      `}</style>

      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--color-outline-variant)", paddingBottom: "1rem" }}>
        <div>
          <span style={{
            display: "inline-block",
            padding: "0.25rem 0.6rem",
            borderRadius: "9999px",
            backgroundColor: "var(--color-secondary-container)",
            color: "var(--color-on-secondary-container)",
            fontSize: "0.75rem",
            fontWeight: 700,
            marginBottom: "0.5rem"
          }}>
            {isJa ? "デモアプリケーション" : "Interactive Demo"}
          </span>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}>
            {isJa ? "AI変革コマンドセンター" : "AI Transformation Command Center"}
          </h2>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <button className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
            {isJa ? "ポートフォリオ" : "Portfolio"}
          </button>
          <button className={`tab-btn ${activeTab === "maturity" ? "active" : ""}`} onClick={() => setActiveTab("maturity")}>
            {isJa ? "成熟度評価" : "Maturity"}
          </button>
          <button className={`tab-btn ${activeTab === "roi" ? "active" : ""}`} onClick={() => setActiveTab("roi")}>
            {isJa ? "ROIシミュレーター" : "ROI Simulator"}
          </button>
          <button className={`tab-btn ${activeTab === "discovery" ? "active" : ""}`} onClick={() => setActiveTab("discovery")}>
            {isJa ? "アイディア検出" : "Discovery"}
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "dashboard" && (
        <div>
          <p style={{ fontSize: "0.9rem", color: "var(--color-on-surface-variant)", marginBottom: "1.5rem" }}>
            {isJa 
              ? "企業全体のAIプロジェクト状況、投資予算、および推定ROI状況を一覧で管理するエグゼクティブ・ポートフォリオ画面です。" 
              : "Executive view of all corporate AI project phases, investment budgets, and estimated returns across the organization."}
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-outline-variant)", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{isJa ? "プロジェクト名" : "Project Name"}</th>
                  <th style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{isJa ? "ステータス" : "Status"}</th>
                  <th style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{isJa ? "投資額" : "Spend"}</th>
                  <th style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{isJa ? "推定ROI" : "Est. ROI"}</th>
                </tr>
              </thead>
              <tbody>
                {demoProjects.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      <span style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: p.status === "Active" ? "var(--color-primary-container)" : p.status === "Completed" ? "rgba(16, 185, 129, 0.15)" : "var(--color-surface-variant)",
                        color: p.status === "Active" ? "var(--color-on-primary-container)" : p.status === "Completed" ? "#10b981" : "var(--color-on-surface-variant)"
                      }}>{p.status}</span>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>{formatCurrency(p.spend)}</td>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600, color: "var(--color-secondary)" }}>{p.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "maturity" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", color: "var(--color-primary)" }}>
              {isJa ? "成熟度アセスメント入力" : "Maturity Self-Assessment"}
            </h3>
            
            <div className="slider-group">
              <div className="slider-label">
                <span>{isJa ? "戦略 (Strategy)" : "Strategy"}</span>
                <span>{maturityScores.strategy}/4</span>
              </div>
              <input type="range" min="1" max="4" value={maturityScores.strategy} className="custom-slider" onChange={(e) => setMaturityScores({...maturityScores, strategy: parseInt(e.target.value)})} />
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>{isJa ? "データ資産 (Data Assets)" : "Data Assets"}</span>
                <span>{maturityScores.data}/4</span>
              </div>
              <input type="range" min="1" max="4" value={maturityScores.data} className="custom-slider" onChange={(e) => setMaturityScores({...maturityScores, data: parseInt(e.target.value)})} />
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>{isJa ? "技術基盤 (Technology)" : "Technology"}</span>
                <span>{maturityScores.technology}/4</span>
              </div>
              <input type="range" min="1" max="4" value={maturityScores.technology} className="custom-slider" onChange={(e) => setMaturityScores({...maturityScores, technology: parseInt(e.target.value)})} />
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>{isJa ? "組織・人材 (People & Culture)" : "People & Culture"}</span>
                <span>{maturityScores.people}/4</span>
              </div>
              <input type="range" min="1" max="4" value={maturityScores.people} className="custom-slider" onChange={(e) => setMaturityScores({...maturityScores, people: parseInt(e.target.value)})} />
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>{isJa ? "ガバナンス (Governance)" : "Governance"}</span>
                <span>{maturityScores.governance}/4</span>
              </div>
              <input type="range" min="1" max="4" value={maturityScores.governance} className="custom-slider" onChange={(e) => setMaturityScores({...maturityScores, governance: parseInt(e.target.value)})} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1.5rem", borderRadius: "1rem", backgroundColor: "var(--color-surface-variant)" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              {isJa ? "総合AI変革成熟度" : "Overall AI Maturity Level"}
            </h4>
            <div style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: getMaturityLevel().color,
              marginBottom: "1rem",
              textAlign: "center"
            }}>
              {getMaturityLevel().name}
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--color-on-surface-variant)", textAlign: "center", lineHeight: 1.5 }}>
              {isJa 
                ? "アセスメントの回答を統合評価し、組織が現在どの推進ステージにいるかをリアルタイムで推定します。" 
                : "Real-time consolidated benchmark estimation of your organizational capacity to scale AI based on assessment input."}
            </p>
          </div>
        </div>
      )}

      {activeTab === "roi" && (
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem", color: "var(--color-primary)" }}>
            {isJa ? "AI投資ROIシミュレーター" : "AI ROI & Financial Projections"}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <div>
              <div className="slider-group">
                <div className="slider-label">
                  <span>{isJa ? "年間売上高 (Current Revenue)" : "Current Revenue"}</span>
                  <span>{formatCurrency(currentRevenue)}</span>
                </div>
                <input type="range" min="1000000" max="50000000" step="500000" value={currentRevenue} className="custom-slider" onChange={(e) => setCurrentRevenue(parseInt(e.target.value))} />
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span>{isJa ? "年間コスト (Current Cost)" : "Current Cost"}</span>
                  <span>{formatCurrency(currentCost)}</span>
                </div>
                <input type="range" min="500000" max="40000000" step="500000" value={currentCost} className="custom-slider" onChange={(e) => setCurrentCost(parseInt(e.target.value))} />
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span>{isJa ? "導入予算 (Implementation Spend)" : "Implementation Spend"}</span>
                  <span>{formatCurrency(implementationCost)}</span>
                </div>
                <input type="range" min="50000" max="2000000" step="50000" value={implementationCost} className="custom-slider" onChange={(e) => setImplementationCost(parseInt(e.target.value))} />
              </div>
            </div>

            <div>
              <div className="slider-group">
                <div className="slider-label">
                  <span>{isJa ? "AI売上成長効果 (Revenue Growth %)" : "Revenue Growth %"}</span>
                  <span>{revenueIncreasePct}%</span>
                </div>
                <input type="range" min="0" max="30" value={revenueIncreasePct} className="custom-slider" onChange={(e) => setRevenueIncreasePct(parseInt(e.target.value))} />
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span>{isJa ? "AI運用効率化コスト削減 (Operational Savings %)" : "Operational Savings %"}</span>
                  <span>{costReductionPct}%</span>
                </div>
                <input type="range" min="0" max="30" value={costReductionPct} className="custom-slider" onChange={(e) => setCostReductionPct(parseInt(e.target.value))} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
            <div className="metric-card">
              <div className="metric-title">{isJa ? "売上増加益" : "Revenue Uplift"}</div>
              <div className="metric-value">{formatCurrency(currentRevenue * (revenueIncreasePct / 100))}</div>
            </div>
            <div className="metric-card">
              <div className="metric-title">{isJa ? "コスト削減額" : "Cost Savings"}</div>
              <div className="metric-value">{formatCurrency(currentCost * (costReductionPct / 100))}</div>
            </div>
            <div className="metric-card">
              <div className="metric-title">{isJa ? "年間総利益 (年)" : "Total Annual Benefit"}</div>
              <div className="metric-value">{formatCurrency(roiMetrics.totalBenefit)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-title">{isJa ? "純現在便益 (1年次)" : "Net Benefit (Yr 1)"}</div>
              <div className="metric-value" style={{ color: roiMetrics.netBenefit >= 0 ? "#10b981" : "#ef4444" }}>
                {formatCurrency(roiMetrics.netBenefit)}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-title">{isJa ? "推定投資ROI" : "Estimated ROI"}</div>
              <div className="metric-value" style={{ color: "var(--color-secondary)" }}>{roiMetrics.roi.toFixed(0)}%</div>
            </div>
            <div className="metric-card">
              <div className="metric-title">{isJa ? "回収期間" : "Payback Period"}</div>
              <div className="metric-value">
                {roiMetrics.payback < 0.1 
                  ? (isJa ? "即時" : "Immediate") 
                  : `${(roiMetrics.payback * 12).toFixed(1)} ${isJa ? "ヶ月" : "mo"}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "discovery" && (
        <div>
          <p style={{ fontSize: "0.9rem", color: "var(--color-on-surface-variant)", marginBottom: "1.5rem" }}>
            {isJa 
              ? "選択した業種で最もROIや実現可能性の高い優先AI活用ユースケースを提案する検出機能です。" 
              : "Generate and rank high-priority AI application use cases based on industry-specific complexity and business impact."}
          </p>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
              {isJa ? "対象業界を選択" : "Select Target Industry"}
            </label>
            <select 
              value={selectedIndustry} 
              onChange={(e) => setSelectedIndustry(e.target.value as "healthcare" | "finance" | "manufacturing" | "retail")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1px solid var(--color-outline)",
                background: "var(--color-surface)",
                color: "var(--color-on-surface)",
                fontWeight: 500,
                outline: "none"
              }}
            >
              <option value="healthcare">{isJa ? "ヘルスケア (Healthcare)" : "Healthcare"}</option>
              <option value="finance">{isJa ? "金融・ファイナンス (Finance)" : "Finance"}</option>
              <option value="manufacturing">{isJa ? "製造・サプライチェーン (Manufacturing)" : "Manufacturing"}</option>
              <option value="retail">{isJa ? "流通・小売 (Retail)" : "Retail"}</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {useCases[selectedIndustry].map((u, i) => (
              <div key={i} className="glass-card" style={{ padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--color-outline-variant)" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-primary)", marginBottom: "0.75rem" }}>{u.title}</h4>
                <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", marginBottom: "0.75rem" }}>
                  <span style={{ padding: "0.2rem 0.5rem", borderRadius: "4px", backgroundColor: "var(--color-primary-container)", color: "var(--color-on-primary-container)", fontWeight: 600 }}>
                    {isJa ? `インパクト: ${u.impact}` : `Impact: ${u.impact}`}
                  </span>
                  <span style={{ padding: "0.2rem 0.5rem", borderRadius: "4px", backgroundColor: "var(--color-surface-variant)", color: "var(--color-on-surface-variant)", fontWeight: 600 }}>
                    {isJa ? `実現性: ${u.feasibility}` : `Feasibility: ${u.feasibility}`}
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-secondary)" }}>
                  {isJa ? `推定効果(ROI): ${u.roi}` : `Est. ROI: ${u.roi}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
