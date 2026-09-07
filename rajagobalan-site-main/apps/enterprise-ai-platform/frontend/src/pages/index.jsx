import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import {
  BarChart3,
  Search,
  Grid2X2,
  Radar,
  TrendingUp,
  Network,
  Map,
  Route,
  Presentation,
} from "lucide-react";
const features = [
  [
    "/dashboard",
    "Executive dashboard",
    "See portfolio health, projected value, and transformation progress in one place.",
    BarChart3,
  ],
  [
    "/discovery",
    "Opportunity discovery",
    "Explore business challenges and identify potential AI use cases.",
    Search,
  ],
  [
    "/portfolio",
    "Portfolio priorities",
    "Compare value and feasibility to focus on the opportunities that matter.",
    Grid2X2,
  ],
  [
    "/maturity",
    "Maturity assessment",
    "Assess organizational capabilities and identify the next areas for development.",
    Radar,
  ],
  [
    "/roi",
    "Value & investment",
    "Model costs, benefits, and scenarios before committing resources.",
    TrendingUp,
  ],
  [
    "/architecture",
    "Solution architecture",
    "Connect business priorities with the components of an AI solution.",
    Network,
  ],
  [
    "/wardley",
    "Wardley mapping",
    "Explore dependencies and the evolution of your technology landscape.",
    Map,
  ],
  [
    "/roadmap",
    "Transformation roadmap",
    "Sequence initiatives and turn strategic priorities into a delivery plan.",
    Route,
  ],
  [
    "/slides",
    "Executive presentation",
    "Bring the transformation story together for your stakeholders.",
    Presentation,
  ],
];
export default function Home() {
  return (
    <Layout>
      <section className="coast-hero">
        <p className="coast-kicker">FROM AMBITION TO ACTION</p>
        <h1>
          A clearer view of
          <br />
          your <em>AI transformation.</em>
        </h1>
        <p>
          A working space for discovery, investment decisions, and delivery
          planning. Connect the strategy to the work that moves it forward.
        </p>
        <div className="coast-hero-actions">
          <Link href="/dashboard" className="coast-primary">
            Open dashboard <span>↗</span>
          </Link>
          <a href="https://www.rajagobalan.com/en/frameworks/enterprise-ai-transformation">
            Explore the framework →
          </a>
        </div>
        <div className="coast-sequence">
          <span>01 / Discover</span>
          <span>02 / Evaluate</span>
          <span>03 / Design</span>
          <span>04 / Deliver</span>
        </div>
      </section>
      <section aria-labelledby="tools-title">
        <div className="coast-section-title">
          <h2 id="tools-title">Your transformation toolkit</h2>
          <span>9 connected perspectives</span>
        </div>
        <div className="coast-tools">
          {features.map(([href, title, description, Icon], i) => (
            <Link href={href} key={href}>
              <div className="coast-tool-top">
                <Icon size={25} strokeWidth={1.5} />
                <span>{String(i + 1).padStart(2, "0")} ↗</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </Link>
          ))}
        </div>
      </section>
      <div className="coast-note">
        <strong>A space for exploration.</strong> This showcase uses
        demonstration data. Treat projections as planning inputs and export work
        you want to retain.
      </div>
    </Layout>
  );
}
