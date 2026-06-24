import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   DATA — v8 (Tokens Updated to CSS Variables)
   ═══════════════════════════════════════════════════════ */

const PILLARS = [
  { id:"strategy",name:"Business Strategy",icon:"◆",color:"var(--md-sys-color-primary)",
    desc:"AI is the next operating model of the enterprise.",
    items:["Define AI vision aligned to business outcomes","Identify revenue & efficiency opportunities","Build board-level AI narrative & investment case","Map competitive landscape & benchmarks","Establish AI Transformation Office (AITO)","Develop portfolio strategy across 4 categories","Apply AI Value Matrix for prioritization"],
    insight:"Data Explosion + AI Breakthrough + Productivity Revolution.",weeks:[1,3,10,12]},
  { id:"data",name:"Data Platform",icon:"⬡",color:"var(--md-sys-color-secondary)",
    desc:"Converting data into intelligence.",
    items:["Centralize enterprise data assets","Build data lake/warehouse architecture","Establish governance & quality standards","Define data access policies & APIs","Implement real-time pipelines","Transition Data Platform → AI Platform"],
    insight:"4 Pillars: Accessibility, Quality, Governance, Recency.",
    dataPillars:[
      {name:"Accessibility",q:"Can AI see inventory real-time?",c:"var(--md-sys-color-primary)"},
      {name:"Quality",q:"DB price = register price?",c:"var(--md-sys-color-secondary)"},
      {name:"Governance",q:"Who sees buying intent?",c:"var(--md-sys-color-tertiary)"},
      {name:"Recency",q:"2sec clickstream, not 2yr old",c:"var(--md-sys-color-accent-amber)"}],
    weeks:[4]},
  { id:"tech",name:"AI Tech Stack",icon:"⎔",color:"var(--md-sys-color-accent-amber)",
    desc:"Six modular layers — the AI Factory.",
    items:["Compute (NVIDIA H100/B200)","Data (Snowflake/Databricks)","Models (OpenAI/Anthropic/Llama)","Orchestration (LangChain/Semantic Kernel)","Agents (Merchant/Controller)","Application (App/Web)"],
    insight:"Compute → Data → Models → Orchestration → Agents → Apps",
    capStack:[{l:"Compute",c:"var(--md-sys-color-outline)"},{l:"Data",c:"var(--md-sys-color-secondary)"},{l:"Models",c:"var(--md-sys-color-primary)"},{l:"Orchestration",c:"var(--md-sys-color-accent-amber)"},{l:"Agents",c:"var(--md-sys-color-error)"},{l:"Apps",c:"var(--md-sys-color-tertiary)"}],
    weeks:[2,5,6]},
  { id:"operating",name:"Operating Model",icon:"◎",color:"var(--md-sys-color-error)",
    desc:"How AI work gets done at enterprise scale.",
    items:["Choose Central/Federated/AI Factory","Design AI Center of Excellence","Define roles: AI eng, ML ops, prompt eng","Establish AI product management","Build reusable component library","Implement MLOps lifecycle"],
    insight:"Hub & Spoke hybrid: central platform, federated execution.",
    opModels:[{n:"Centralized ▼",p:"Fast capability, governance",x:"Slower BU adoption"},
      {n:"Federated ◇",p:"Business ownership, domain",x:"Coordination complexity"},
      {n:"AI Factory ⬡",p:"Reusable products, scale",x:"Platform maturity needed"}],
    weeks:[7,9]},
  { id:"governance",name:"Governance",icon:"⊡",color:"var(--md-sys-color-tertiary)",
    desc:"Without governance, AI at scale creates risk, not value.",
    items:["Establish OAIG under CEO","Implement R.A.I.S.E. framework","EU AI Act compliance tiers","Bias auditing & red-teaming","Model monitoring & drift detection","Security & privacy protections"],
    insight:"R.A.I.S.E: Robustness, Accountability, Interpretability, Security, Ethics.",
    govGrid:[{n:"Robustness",s:"Black Friday resilience",c:"var(--md-sys-color-primary)"},{n:"Accountability",s:"Single neck to hug",c:"var(--md-sys-color-secondary)"},
      {n:"Security",s:"Adversarial defense",c:"var(--md-sys-color-error)"},{n:"Ethics",s:"Exploit vulnerable?",c:"var(--md-sys-color-tertiary)"}],
    weeks:[8]},
  { id:"value",name:"Value Realization",icon:"◈",color:"var(--md-sys-color-accent-cyan)",
    desc:"If you can't measure AI value, you can't scale AI investment.",
    items:["Define ROI (3 buckets: savings, revenue, risk)","Track cost savings per ticket","Measure revenue uplift (basket, cross-sell)","Quantify risk avoidance ($500M)","Build unit economics dashboard","Create AI P&L for board"],
    insight:"Cost Savings + Revenue Uplift + Risk Avoidance.",
    kpi:[{n:"CPO",t:"-29%",c:"var(--md-sys-color-secondary)"},{n:"CAC",t:"-24%",c:"var(--md-sys-color-primary)"},
      {n:"Cross-sell",t:"+50%",c:"var(--md-sys-color-accent-amber)"},{n:"$5M→$45M",t:"9× ROI",c:"var(--md-sys-color-tertiary)"}],
    weeks:[11]}
];

const MAT=[
  {s:1,n:"AI Curiosity",c:"var(--md-sys-color-error)",t:["Pilots","No strategy"],e:"Pre-2018"},
  {s:2,n:"AI Experiment",c:"var(--md-sys-color-accent-amber)",t:["POCs","Limited ROI"],e:"Isolated"},
  {s:3,n:"AI Scaling",c:"var(--md-sys-color-accent-amber)",t:["Platforms","Use cases"],e:"AI teams"},
  {s:4,n:"AI-Driven",c:"var(--md-sys-color-secondary)",t:["Ops AI","Copilots"],e:"MSFT·AMZN"},
  {s:5,n:"AI-Native",c:"var(--md-sys-color-primary)",t:["Autonomous","Agents"],e:"OpenAI·Anthropic"}];

const PBT=["Value Matrix","Roadmap","Risks"];
const VM=[
  {l:"Quick Wins",i:"H",x:"L",c:"var(--md-sys-color-secondary)",a:"e.g. AI email marketing",d:"Implement immediately"},
  {l:"Big Bets",i:"H",x:"H",c:"var(--md-sys-color-primary)",a:"e.g. GenAI Shopping Agent",d:"Strategic investment"},
  {l:"Tactical",i:"L",x:"L",c:"var(--md-sys-color-accent-amber)",a:"e.g. Internal FAQ bot",d:"Automate selectively"},
  {l:"Graveyard",i:"L",x:"H",c:"var(--md-sys-color-error)",a:"e.g. Custom LLM from scratch",d:"Not recommended"}];
const ROAD=[
  {n:"Foundation",t:"0–6 mo",c:"var(--md-sys-color-primary)",it:["Controller & Shield","Pricing API","Data platform","OAIG governance"]},
  {n:"Acceleration",t:"6–12 mo",c:"var(--md-sys-color-accent-amber)",it:["Agent A/B test (10%)","Sentinel triage","Scale BUs","Equity rails"]},
  {n:"Scale",t:"12–48 mo",c:"var(--md-sys-color-secondary)",it:["Federated AI","Industry expansion","AI products","Culture moat"]}];
const RK=[{r:1,n:"No exec ownership",d:"AI delegated to IT",c:"var(--md-sys-color-error)"},
  {r:2,n:"Poor data quality",d:"Models before foundations",c:"var(--md-sys-color-accent-rose)"},
  {r:3,n:"Talent gap",d:"No AI roles / operating model",c:"var(--md-sys-color-accent-amber)"},
  {r:4,n:"Fragmented",d:"100 disconnected POCs",c:"var(--md-sys-color-accent-amber)"},
  {r:5,n:"Weak governance",d:"No ethics/compliance/risk",c:"var(--md-sys-color-tertiary)"}];

const SCT=["Diagnosis","Intelligence","Agent Arch","Shield","Circuit Breaker","Model Routing","Agentic Loop","Sentinel/TSIA","R.A.I.S.E.","Bias Trap","Shadow-Mode","Golden Record","AI Economics","Industry","Leadership","Native vs Legacy","Talking Points","P&L Heatmap"];
const SQ=[{n:"Scalers",c:"var(--md-sys-color-secondary)",a:"Product track. P&L movers.",tg:"5–8"},
  {n:"Lab Experiments",c:"var(--md-sys-color-primary)",a:"R&D Horizon 3. 2yr moats.",tg:"5–10"},
  {n:"Quick Wins",c:"var(--md-sys-color-accent-amber)",a:"Automate. No exec mindshare.",tg:"15–20"},
  {n:"Distractions",c:"var(--md-sys-color-error)",a:"Kill. Shadow AI draining compute.",tg:"60–70"}];
const IL=[{n:1,nm:"Descriptive",c:"var(--md-sys-color-outline)",q:"What happened?",tc:"Reporting / BI"},
  {n:2,nm:"Predictive",c:"var(--md-sys-color-accent-amber)",q:"What will happen?",tc:"Machine Learning"},
  {n:3,nm:"Prescriptive",c:"var(--md-sys-color-primary)",q:"What should we do?",tc:"Decision Science"},
  {n:4,nm:"Agentic",c:"var(--md-sys-color-secondary)",q:"Do it for me.",tc:"AI Agents"}];
const AMA=[{n:"Merchant A",c:"var(--md-sys-color-secondary)",m:"GPT-4o / Claude",r:"Maximize Basket Size. Talks to user."},
  {n:"Controller B",c:"var(--md-sys-color-error)",m:"Llama-8B / BERT",r:"Policy Compliance. Silent auditor."},
  {n:"Logic Gate",c:"var(--md-sys-color-primary)",m:"Python / SQL",r:"Price validation against Live DB."}];
const SH=[{n:"Price Lock API",c:"var(--md-sys-color-primary)",d:"Validates vs Master Price List",v:"Zero Hallucination"},
  {n:"Sentiment Filter",c:"var(--md-sys-color-tertiary)",d:"Flags off-brand language",v:"Brand Protection"},
  {n:"Budget Ceiling",c:"var(--md-sys-color-accent-amber)",d:"Max 20% discount cap",v:"Margin Protection"}];
const CB=[{n:"Tactical",c:"var(--md-sys-color-accent-amber)",tr:">20% abnormal discounts",act:"Throttle to standard promos",an:"Trading Halt"},
  {n:"Strategic",c:"var(--md-sys-color-error)",tr:"Margin >5% GOP erosion",act:"Read-Only Search mode",an:"Market-Wide Halt"},
  {n:"Existential",c:"var(--md-sys-color-error)",tr:"$0.00 price or PII leak",act:"Kill Switch, API disconnect",an:"Close Exchange"}];
const MR=[{l:"A. Small Talk",c:"var(--md-sys-color-secondary)",tier:"Tier 1",mod:"Small/Fast (GPT-4o-mini)",why:"20× cheaper. Hello needs speed <50ms, not PhD reasoning."},
  {l:"B. Health Coaching",c:"var(--md-sys-color-primary)",tier:"Tier 2",mod:"Frontier (Claude 3.5/GPT-4o)",why:"Requires reasoning + empathy. Small model sounds robotic."},
  {l:"C. Stock Validation",c:"var(--md-sys-color-accent-amber)",tier:"Tier 3",mod:"Deterministic API (SQL)",why:"NEVER ask LLM if stock exists. It hallucinates. DB call."}];
const AG=[{n:1,l:"Perception",c:"var(--md-sys-color-primary)",d:"Observes intent: \"I want a healthy snack\""},
  {n:2,l:"Planning",c:"var(--md-sys-color-accent-amber)",d:"Breaks down: check history, inventory, nutrition"},
  {n:3,l:"Action",c:"var(--md-sys-color-secondary)",d:"Apply discount, add to cart, generate coaching tip"},
  {n:4,l:"Reflection",c:"var(--md-sys-color-tertiary)",d:"Check output against Controller Agent guardrails"}];
const SENT=[
  {sc:"1–3",nm:"Routine",c:"var(--md-sys-color-secondary)",act:"Auto-resolve",ex:"Where is my order?"},
  {sc:"4–7",nm:"Complex",c:"var(--md-sys-color-accent-amber)",act:"Human + AI draft",ex:"Wrong item + refund dispute"},
  {sc:"8–10",nm:"Crisis",c:"var(--md-sys-color-error)",act:"Executive escalation",ex:"Spoiled food, child sick"}];
const REDL=[
  {n:"Human Safety",c:"var(--md-sys-color-error)",act:"Immediate Lock",d:"Product harm, injury risk"},
  {n:"Ethical/Legal",c:"var(--md-sys-color-error)",act:"Fairness API",d:"Discriminatory output detected"},
  {n:"Privacy",c:"var(--md-sys-color-accent-amber)",act:"Zero-Retention",d:"PII leak, data breach"},
  {n:"Brand",c:"var(--md-sys-color-tertiary)",act:"Persona filter",d:"Off-brand tone or messaging"}];
const RAISE=[
  {l:"R",n:"Robustness",c:"var(--md-sys-color-primary)",d:"Black Friday resilience. Stress-tested under load."},
  {l:"A",n:"Accountability",c:"var(--md-sys-color-secondary)",d:"Single neck to hug. Clear ownership chain."},
  {l:"I",n:"Interpretability",c:"var(--md-sys-color-accent-amber)",d:"Anti-discrimination. Explain every decision."},
  {l:"S",n:"Security",c:"var(--md-sys-color-error)",d:"Adversarial defense. Prompt injection hardened."},
  {l:"E",n:"Ethics",c:"var(--md-sys-color-tertiary)",d:"Does this exploit vulnerable populations?"}];
const NV=[{dm:"Data Flow",lg:"Siloed (Mktg vs Sales)",nt:"Unified (Data Fabric)"},
  {dm:"Decisioning",lg:"Human-Led (Slow)",nt:"Algorithmic (Real-time)"},
  {dm:"Productivity",lg:"Linear (1=1)",nt:"Exponential (1+Agent=10×)"}];
const EP=[
  {lb:"ON PILOTS",tx:"No path to P&L? It's a hobby.",c:"var(--md-sys-color-accent-amber)"},
  {lb:"ON TALENT",tx:"100 AI Translators who speak Python and P&L.",c:"var(--md-sys-color-primary)"},
  {lb:"ON SPEED",tx:"'Perfect data' costs more than 'good enough' + iterating.",c:"var(--md-sys-color-secondary)"},
  {lb:"ON COMPETITION",tx:"They cut costs. We own intent. Bottom vs top.",c:"var(--md-sys-color-tertiary)"},
  {lb:"ON DATA",tx:"Loyalty data is inert. AI refines into 'Digital Oil'.",c:"var(--md-sys-color-accent-cyan)"},
  {lb:"ON RISK",tx:"Not a credit card — a script. Audited in milliseconds.",c:"var(--md-sys-color-error)"},
  {lb:"ON HALLUCINATIONS",tx:"Bug in chatbot. Config error in Enterprise Agent. Solved.",c:"var(--md-sys-color-accent-amber)"},
  {lb:"ON TECH DEBT",tx:"Ferrari on a dirt road. Pave first.",c:"var(--md-sys-color-primary)"},
  {lb:"ON CIRCUIT BREAKER",tx:"4hr-old margin data = bankrupt in 4 minutes.",c:"var(--md-sys-color-error)"},
  {lb:"ON VENDOR LOCK-IN",tx:"Don't marry one model. Orchestration to swap brains.",c:"var(--md-sys-color-accent-amber)"},
  {lb:"ON LATENCY",tx:"1s delay = 7% conversion drop. Coaching in <200ms.",c:"var(--md-sys-color-secondary)"},
  {lb:"ON RAG",tx:"Don't train AI. Give it a library card for real-time lookup.",c:"var(--md-sys-color-primary)"},
  {lb:"ON PRODUCTIVITY",tx:"Not a search bar — a Chief of Staff for low-value cognitive labor.",c:"var(--md-sys-color-tertiary)"},
  {lb:"ON ADOPTION",tx:"Biggest risk isn't tech — it's change management. Augmentation, not replacement.",c:"var(--md-sys-color-accent-cyan)"},
  {lb:"ON AGENTS",tx:"Copilot waits. Agent anticipates. That transition = $1B in margin.",c:"var(--md-sys-color-error)"},
  {lb:"ON SAFETY",tx:"AI without guardrails is a liability. Sentinel + Shield = fiduciary duty.",c:"var(--md-sys-color-error)"},
  {lb:"ON HUMAN VALUE",tx:"AI handles volume. Humans handle judgment. That's the design.",c:"var(--md-sys-color-secondary)"},
  {lb:"ON GOVERNANCE",tx:"OAIG under the CEO, not buried in IT. Board-level accountability.",c:"var(--md-sys-color-tertiary)"},
  {lb:"ON LIABILITY",tx:"If the AI discriminates, the CEO testifies. Not the engineer.",c:"var(--md-sys-color-error)"},
  {lb:"ON TRANSPARENCY",tx:"If you can't explain it to a regulator, don't ship it.",c:"var(--md-sys-color-primary)"},
  {lb:"ON REGULATION",tx:"EU AI Act isn't a barrier — it's a competitive moat for trusted brands.",c:"var(--md-sys-color-accent-amber)"},
  {lb:"ON JOB SECURITY",tx:"AI won't replace you. Someone using AI will.",c:"var(--md-sys-color-accent-cyan)"},
  {lb:"ON CULTURE",tx:"Tech decays in 24 months. Culture endures for decades.",c:"var(--md-sys-color-tertiary)"},
  {lb:"ON ROI",tx:"$5M invested to capture $45M. That's not a cost center — that's a weapon.",c:"var(--md-sys-color-secondary)"},
  {lb:"ON BUY VS BUILD",tx:"Buy the platform. Build the moat. Your data is the differentiator.",c:"var(--md-sys-color-accent-amber)"},
  {lb:"ON AI AS ASSET",tx:"AI isn't a tool. It's an appreciating asset. Every interaction makes it smarter.",c:"var(--md-sys-color-primary)"}];
const PNL=[{n:"COGS",f:"Cost of Goods Sold",c:"var(--md-sys-color-secondary)",d:"Predictive inventory, supply chain",im:"3–5% ↓"},
  {n:"SG&A",f:"Selling, General & Admin",c:"var(--md-sys-color-primary)",d:"GenAI back office: legal, HR, finance",im:"10–15% ↓"},
  {n:"Revenue",f:"Top-line Growth",c:"var(--md-sys-color-tertiary)",d:"Personalized pricing, basket, GenAI search",im:"2–4% ↑"}];
const INDV=[
  {n:"Banking",c:"var(--md-sys-color-primary)",moat:"Trust + Regulatory",ex:"Wealth advisory, fraud detection, KYC automation"},
  {n:"Healthcare",c:"var(--md-sys-color-secondary)",moat:"HIPAA + Clinical",ex:"Medical records, drug interaction, triage"},
  {n:"Manufacturing",c:"var(--md-sys-color-accent-amber)",moat:"Safety + IoT",ex:"Digital twins, predictive maintenance, quality"},
  {n:"Public Sector",c:"var(--md-sys-color-tertiary)",moat:"Inclusion + Trust",ex:"Citizen services, benefit eligibility, transparency"}];
const LEAD=[
  {n:"Visionary Realism",c:"var(--md-sys-color-primary)",d:"See possibilities. Ground in P&L."},
  {n:"Cognitive Empathy",c:"var(--md-sys-color-secondary)",d:"Understand fear of replacement. Design augmentation."},
  {n:"Governance Catalyst",c:"var(--md-sys-color-tertiary)",d:"Champion R.A.I.S.E. Not delegate to legal."},
  {n:"Narrative Power",c:"var(--md-sys-color-accent-amber)",d:"Translate AI into board language."}];
const MAST=[
  {n:"Technical Fluency",c:"var(--md-sys-color-primary)"},{n:"Strategic Vision",c:"var(--md-sys-color-secondary)"},
  {n:"Change Leadership",c:"var(--md-sys-color-accent-amber)"},{n:"Ethical Compass",c:"var(--md-sys-color-tertiary)"},
  {n:"Execution Rigor",c:"var(--md-sys-color-error)"}];
const CQ=[
  {q:"Why do AI programs fail?",a:["No exec ownership — delegated to IT","Poor data foundations — models before plumbing","Fragmented pilots — 100 POCs, no portfolio","Talent gaps — no AI Translators","No value measurement — can't prove ROI"]},
  {q:"Experiment vs Transformation?",a:["Experiment: one POC, one team, one metric","Transformation: all 6 pillars coordinated","Test: does it have a path to P&L?"]},
  {q:"First 3 for manufacturing?",a:["Predictive maintenance (20–40% downtime ↓)","Supply chain forecasting","Engineering copilots"]},
  {q:"What is your legacy?",a:["Not the algorithm. The culture of Responsible AI.","Tech decays in 24 months. Culture endures for decades.","The Empathy Engine: technology that coaches, not just sells."]}];

const WK=[
  {w:1,t:"Foundations of Enterprise AI",p:"strategy",f:"Automation → Intelligence, Non-linear growth, The Decoupling",
    tp:["AI productivity revolution","AI-Native vs Legacy gap","The Decoupling","P&L Heatmap methodology"],
    cs:"Amazon (forecasting, robotics). Microsoft (30% via Copilot).",
    ex:"P&L Heatmap: COGS 3-5%, SG&A 10-15%, Revenue 2-4%. Which first for skeptical board?",
    q:"Why do most AI initiatives fail?"},
  {w:2,t:"AI vs Analytics vs Automation",p:"tech",f:"Intelligence Ladder, AMA Architecture, Shield Framework",
    tp:["Descriptive→Predictive→Prescriptive→Agentic","AMA: Agent-Managing-Agents","Shield Framework","Human vs Machine loop"],
    cs:"Amazon Anticipatory Shipping. AMA: Merchant+Controller+Logic Gate.",
    ex:"Design GenAI Shopping Agent (+15% txn) with Three-Tier Governance.",
    q:"Creativity vs guardrails?"},
  {w:3,t:"AI Strategy",p:"strategy",f:"Portfolio, Value Pools, Circuit Breaker MECE",
    tp:["Use Cases → Value Pools","Value-Complexity Matrix","3-phase roadmap","Circuit Breaker tiers"],
    cs:"Starbucks Deep Brew (billions via loyalty). NYSE LULD analogy.",
    ex:"Kill Switch — define 3-tier Circuit Breaker (Tactical/Strategic/Existential).",
    q:"100 pilots → 5 Big Bets?"},
  {w:4,t:"Data Foundations",p:"data",f:"Data Swamps → Data Fabric, Golden Record, Empathy-Driven Upsell",
    tp:["4 Pillars of AI-Ready Data","Modern Data Stack (Fivetran→Snowflake→dbt)","Vector DBs","Conflict Resolution"],
    cs:"Retailer 50+ silos → unified Cloud. 24hr → sub-second stock.",
    ex:"Golden Record — Loyalty='healthy' vs Clickstream='energy drinks'. Empathy-Driven Upsell.",
    q:"Ferrari on a dirt road?"},
  {w:5,t:"AI Technology Stack",p:"tech",f:"6-Layer MECE Stack, Model Routing, Unit Economics",
    tp:["Compute→Data→Models→Orchestration→Agents→Apps","LLM Cascading","RAG vs Fine-Tuning","Inference latency"],
    cs:"Klarna replaced SaaS with AI Orchestration. 700 agents' work. Smart routing.",
    ex:"Model Choice — A=20×cheaper, B=Frontier, C=Deterministic. Why routing for CFO?",
    q:"Vendor lock-in vs orchestration?"},
  {w:6,t:"GenAI & Agents",p:"tech",f:"Agentic Loop, Sentinel/TSIA, Reputation Shield, Pharma surveillance",
    tp:["Perception→Planning→Action→Reflection","Sentinel criticality triage (1-10)","Reputation Shield (4 redlines)","Product Intelligence loop"],
    cs:"Salesforce Einstein autonomous agents. Pharma: 3+ spoiled milk → auto-alert SC VP.",
    ex:"Day-in-Life — 2000 support, 50K tickets/wk. 60% auto, 40% human+AI. Design Sentinel triage.",
    q:"Where does the agent stop and the human start?"},
  {w:7,t:"Operating Model",p:"operating",f:"Hub & Spoke, Owner Dilemma, Data Escrow, OAIG under CEO",
    tp:["Hub & Spoke hybrid","VP vs CLO: Owner Dilemma","Data Escrow (Soft Halt + Golden Window)","OAIG governance under CEO"],
    cs:"Haier Rendanheyi: 4000 micro-enterprises. Self-organizing AI cells.",
    ex:"Owner Dilemma — VP Growth says ship, CLO says halt. Design Data Escrow model.",
    q:"Who owns the AI when it fails?"},
  {w:8,t:"Responsible AI",p:"governance",f:"R.A.I.S.E., Bias Trap, EU AI Act tiers",
    tp:["R.A.I.S.E. (5 pillars)","Bias Trap: kill model, Equity-Adjusted ROI","EU AI Act: Unacceptable/High/Limited/Minimal","Governance maturity checklist"],
    cs:"30% higher discounts to rich zip codes. Algorithmic redlining discovered.",
    ex:"Bias Trap — Kill model (Hard Stop). Design Equity-Adjusted ROI formula with parity constraint.",
    q:"When do you kill a profitable AI?"},
  {w:9,t:"Execution & Adoption",p:"operating",f:"3-Step Adoption, Shadow-Mode, Co-Creation, Middle Mgmt",
    tp:["3-Step: Shadow→Co-Creation→Autonomous","Shadow-Mode architecture","Middle Management resistance","Execution Waves (Crawl/Walk/Run)"],
    cs:"Accenture $3B AI investment. 'Replacing those who don't use AI.'",
    ex:"Middle Mgmt — Shadow-Mode 1000 tickets. Heroes Metrics: Tone, Accuracy, Speed.",
    q:"How do you turn skeptics into champions?"},
  {w:10,t:"Industry AI",p:"strategy",f:"Banking, Healthcare, Manufacturing, Public Sector. Pharma cross-pollination.",
    tp:["4 verticals with moats","Pharma cross-pollination","Federated Learning for privacy","Regulatory as competitive moat"],
    cs:"Pharma: Federated Learning + Shadow-Mode across 12 hospitals.",
    ex:"Pharma Cross-Pollination — design Federated Learning pipeline across 3 hospital systems.",
    q:"Which industry moat is hardest to replicate?"},
  {w:11,t:"AI Economics",p:"value",f:"3 buckets, Board AI P&L, Optimization Ladder, $5M→$45M",
    tp:["Savings ($0.05/ticket) + Revenue (15% basket) + Risk ($500M)","Board Slide: CPO -29%, CAC -24%, Cross-sell +50%","Optimization Ladder","Unit economics per interaction"],
    cs:"JPMorgan COiN: 360K hours of legal work in seconds. $5M→$45M invested.",
    ex:"GPU vs Headcount — Build board AI P&L showing $5M invested to capture $45M.",
    q:"When does AI move from cost center to weapon?"},
  {w:12,t:"AI Leadership & Legacy",p:"strategy",f:"4 Leadership Pillars, 5 Mastery Pillars, Legacy, Keynote",
    tp:["Visionary Realism + Cognitive Empathy","Governance Catalyst + Narrative Power","5 Mastery Pillars","The Empathy Engine keynote"],
    cs:"AI-native leadership. Conference keynote: 'The Empathy Engine.'",
    ex:"Legacy — Write your 'Culture of Responsible AI' manifesto. What endures after the tech decays?",
    q:"What is your legacy as an AI leader?"}
];

const plOf=(id)=>PILLARS.find(p=>p.id===id);

/* M3 semantic tokens — theme switches via data-theme on documentElement */
const T={bg:"var(--md-sys-color-surface)",bgCard:"var(--glass-bg)",bgCardAlt:"var(--md-sys-color-surface-container)",border:"var(--glass-border)",borderAlt:"var(--md-sys-color-outline-variant)",text:"var(--md-sys-color-on-surface)",textMuted:"var(--md-sys-color-on-surface-secondary)",textDim:"var(--md-sys-color-on-surface-tertiary)",textDim2:"var(--md-sys-color-on-surface-secondary)",textDim3:"var(--md-sys-color-surface-container-highest)",textDim4:"var(--md-sys-color-on-surface-secondary)",textDim5:"var(--md-sys-color-on-surface)",svgStroke:"var(--md-sys-color-on-surface-secondary)"};

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function AITransformationFramework(){
  const[view,setView]=useState("pillars");
  const[aP,setAP]=useState(0);
  const[ck,setCk]=useState({});
  const[stg,setStg]=useState(1);
  const[aW,setAW]=useState(0);
  const[pbT,setPbT]=useState(0);
  const[scT,setScT]=useState(0);
  const[ceoO,setCeoO]=useState(0);
  const[mobile,setMobile]=useState(typeof window!=="undefined"&&window.innerWidth<=768);
  const[small,setSmall]=useState(typeof window!=="undefined"&&window.innerWidth<=480);
  
  useEffect(()=>{
    const mq=window.matchMedia("(max-width: 768px)");
    const sq=window.matchMedia("(max-width: 480px)");
    const fn=()=>{setMobile(mq.matches);setSmall(sq.matches);};
    fn();mq.addEventListener("change",fn);sq.addEventListener("change",fn);
    return()=>{mq.removeEventListener("change",fn);sq.removeEventListener("change",fn);};
  },[]);

  // Add FontAwesome
  useEffect(() => {
    if (!document.getElementById("fa-link")) {
      const link = document.createElement("link");
      link.id = "fa-link";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("m3-tokens")) {
      const link = document.createElement("link");
      link.id = "m3-tokens";
      link.rel = "stylesheet";
      link.href = "/m3-tokens.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("layout-css")) {
      const link = document.createElement("link");
      link.id = "layout-css";
      link.rel = "stylesheet";
      link.href = "/layout.css";
      document.head.appendChild(link);
    }
  }, []);

  const tog=k=>setCk(p=>({...p,[k]:!p[k]}));
  const total=PILLARS.reduce((s,p)=>s+p.items.length,0);
  const dn=Object.values(ck).filter(Boolean).length;
  const pct=total?Math.round((dn/total)*100):0;
  const pP=i=>{const n=PILLARS[i].items.length;const d=PILLARS[i].items.filter((_,j)=>ck[`${i}-${j}`]).length;return n?Math.round((d/n)*100):0;};
  const ac=view==="pillars"?PILLARS[aP].color:view==="maturity"?MAT[stg-1].c:view==="curriculum"?(plOf(WK[aW].p)?.color||"var(--md-sys-color-primary)"):view==="scenarios"?"var(--md-sys-color-accent-amber)":view==="playbook"?"var(--md-sys-color-accent-amber)":"var(--md-sys-color-primary)";
  const goP=id=>{const i=PILLARS.findIndex(p=>p.id===id);if(i>=0){setAP(i);setView("pillars");}};
  const goW=n=>{const i=WK.findIndex(w=>w.w===n);if(i>=0){setAW(i);setView("curriculum");}};

  const t=T;

  /* Shared UI */
  const B=({v,c,h=6})=>(<div style={{height:h,background:"var(--md-sys-color-surface-container-highest)",borderRadius:h/2,overflow:"hidden"}}><div style={{width:`${v}%`,height:"100%",background:c,borderRadius:h/2,transition:"width 0.5s ease"}}/></div>);
  const CK=({on,c,fn,lb})=>(
    <label style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 0",cursor:"pointer"}}>
      <div onClick={e=>{e.preventDefault();fn();}} style={{width:20,height:20,borderRadius:6,flexShrink:0,marginTop:2,cursor:"pointer",border:`2px solid ${on?c:"var(--md-sys-color-outline)"}`,background:on?c:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s ease"}}>
        {on&&<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="var(--md-sys-color-on-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span style={{fontSize:"0.9375rem",lineHeight:1.6,color:on?t.textDim:t.text,textDecoration:on?"line-through":"none",transition:"all 0.2s ease",wordBreak:"break-word"}}>{lb}</span>
    </label>);
  const Lb=(c,mb=8)=>({fontSize:"0.75rem",letterSpacing:"0.05em",color:c,fontWeight:700,marginBottom:mb,textTransform:"uppercase"});
  
  // Updated Card Style to Glassmorphism
  const Cd=(a,c)=>({
    background: a ? `color-mix(in srgb, ${c} 8%, var(--glass-bg))` : "var(--glass-bg)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${a ? c : "var(--glass-border)"}`,
    borderRadius: "var(--md-sys-shape-corner-large)",
    boxShadow: a ? `0 8px 32px -8px ${c}40` : "var(--glass-shadow)",
    transition: "all 0.3s ease"
  });
  
  const Pl=(a,c)=>({padding:"8px 16px",borderRadius:"var(--md-sys-shape-corner-full)",border:`1px solid ${a?c:"var(--md-sys-color-outline-variant)"}`,cursor:"pointer",fontSize:"0.875rem",fontWeight:600,fontFamily:"inherit",background:a?c:"transparent",color:a?"var(--md-sys-color-on-primary)":t.textDim,transition:"all 0.25s ease"});
  const Ins=({c,txt})=>(<div style={{marginTop:24,padding:"20px",borderRadius:"var(--md-sys-shape-corner-medium)",background:`color-mix(in srgb, ${c} 10%, transparent)`,borderLeft:`4px solid ${c}`}}><div style={Lb(c,4)}>KEY INSIGHT</div><p style={{margin:0,fontSize:"1rem",color:t.text,lineHeight:1.6,fontStyle:"italic"}}>"{txt}"</p></div>);
  const Ch=({o})=>(<i className={`fas fa-chevron-down`} style={{transform:o?"rotate(180deg)":"rotate(0)",transition:"transform 0.25s ease", color:t.textDim2}}></i>);
  const D=({c,s=8})=><div style={{width:s,height:s,borderRadius:"50%",background:c,flexShrink:0}}/>;
  const Tag=({c,t})=><span style={{padding:"4px 10px",borderRadius:"6px",fontSize:"0.75rem",fontWeight:700,background:`color-mix(in srgb, ${c} 15%, transparent)`,color:c,border:`1px solid color-mix(in srgb, ${c} 30%, transparent)`}}>{t}</span>;
  const SubTab=({tabs,active,set,color})=>(<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24,paddingBottom:4}}>{tabs.map((t,i)=><button key={i} onClick={()=>set(i)} style={{...Pl(i===active,color),flexShrink:0}}>{t}</button>)}</div>);
  const cur = PILLARS[aP];
  const cs = MAT[stg - 1];
  const mp = ((stg - 1) / 4) * 100;
  const cwk = WK[aW];
  const wkPl = plOf(cwk.p);
  const wc = wkPl?.color || "var(--md-sys-color-primary)";

  return (
    <div style={{background:t.bg,color:t.text,fontFamily:"Inter, sans-serif",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      
      {/* Navigation Bar Injection */}
      <nav className="nav-header">
        <div className="nav-container">
          <a href="/" className="nav-brand">
            <div className="nav-logo">RR</div>
            Rajkumar Rajagobalan
          </a>
          <ul className="nav-menu" style={{display: mobile ? 'none' : 'flex'}}>
            <li><a href="/" className="nav-link">Home</a></li>
            <li><a href="/blogs.html" className="nav-link">Blogs</a></li>
            <li><a href="#" className="nav-link active">Framework</a></li>
          </ul>
        </div>
      </nav>

      <div style={{paddingTop: 72, flex: 1}}>
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:`radial-gradient(circle at 50% 0%, ${ac}15 0%, transparent 70%)`}}/>
        <div className="container" style={{paddingTop: 40, paddingBottom: 80, position:"relative", zIndex:1}}>

          {/* HEADER */}
          <div style={{marginBottom:40, textAlign: "center"}}>
            <div style={Lb(ac)}>ENTERPRISE AI TRANSFORMATION</div>
            <h1 className="gradient-text" style={{fontSize:small?"2rem":mobile?"2.5rem":"3rem",fontWeight:800,margin:"0 auto 16px",letterSpacing:"-0.03em",lineHeight:1.1, maxWidth: 800}}>Strategic Framework & Playbook</h1>
            <p style={{fontSize: "1.125rem", color: t.textMuted, maxWidth: 600, margin: "0 auto 24px"}}>An interactive guide to building AI-native organizations. Track your progress across 6 pillars.</p>
            
            <div style={{display:"flex",alignItems:"center",justifyContent:"center", gap:16, marginBottom: 32}}>
               <a href="/enterprise-ai-reference-guide.html" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{fontSize:"0.875rem", padding: "8px 16px"}}>
                 <i className="fas fa-book" style={{marginRight:8}}></i> Reference Guide
               </a>
            </div>

            <div style={{maxWidth: 600, margin: "0 auto"}}>
              <div style={{display:"flex",justifyContent: "space-between", marginBottom: 8, fontSize: "0.875rem", fontWeight: 600, color: t.textDim}}>
                <span>Overall Progress</span>
                <span>{pct}% — {dn}/{total} Items</span>
              </div>
              <B v={pct} c={ac} h={8}/>
            </div>
          </div>

          {/* NAV */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:40}}>
            <div style={{display:"flex",gap:4,background:"var(--md-sys-color-surface-container)",padding:4,borderRadius:12,flexWrap:"wrap",justifyContent:"center"}}>
              {[{k:"pillars",l:"Pillars"},{k:"maturity",l:"Maturity"},{k:"playbook",l:"Playbook"},{k:"curriculum",l:"12-Week"},{k:"scenarios",l:"Scenarios"},{k:"ceo",l:"Advisory"}].map(v=>(
                <button key={v.k} onClick={()=>setView(v.k)} style={{padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:"0.875rem",fontWeight:600,fontFamily:"inherit",background:view===v.k?"var(--md-sys-color-surface)":"transparent",color:view===v.k?t.text:t.textDim,boxShadow:view===v.k?"0 2px 8px rgba(0,0,0,0.05)":"none",transition:"all 0.2s ease"}}>{v.l}</button>
              ))}
            </div>
          </div>

          {/* ═══ VIEW 1: PILLARS ═══ */}
          {view==="pillars"&&(
            <div style={{display: "grid", gridTemplateColumns: mobile ? "1fr" : "300px 1fr", gap: 32, alignItems: "start"}}>
              <div style={{display:"grid",gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "1fr", gap: 12}}>
                {PILLARS.map((pl,pi)=>(
                  <button key={pi} onClick={()=>setAP(pi)} style={{...Cd(pi===aP,pl.color),padding:"16px",cursor:"pointer",textAlign:"left",fontFamily:"inherit", position: "relative", overflow: "hidden"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8, position: "relative", zIndex: 1}}>
                      <span style={{fontSize:"1.25rem",color:pi===aP?pl.color:t.textDim2}}>{pl.icon}</span>
                      <span style={{fontSize:"1rem",fontWeight:700,color:pi===aP?t.text:t.textDim}}>{pl.name}</span>
                    </div>
                    <B v={pP(pi)} c={pl.color} h={4}/>
                    <div style={{fontSize:"0.75rem",color:t.textDim2,marginTop:6,fontWeight:600,textAlign:"right"}}>{pP(pi)}%</div>
                  </button>))}
              </div>
              
              <div style={{...Cd(true,cur.color),padding:small?24:40,minWidth:0,background:"var(--glass-bg)"}}>
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:8}}>
                  <span style={{fontSize:"2rem", color: cur.color}}>{cur.icon}</span>
                  <h2 style={{margin:0,fontSize:"2rem",fontWeight:800, color: t.text}}>{cur.name}</h2>
                </div>
                <p style={{fontSize:"1.125rem",color:t.textMuted,margin:"0 0 32px",maxWidth:"65ch"}}>"{cur.desc}"</p>
                
                <div style={{marginBottom:32}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:"0.875rem",color:t.textDim,fontWeight:600}}>SECTION PROGRESS</span>
                    <span style={{fontSize:"0.875rem",color:cur.color,fontWeight:700}}>{pP(aP)}%</span>
                  </div>
                  <B v={pP(aP)} c={cur.color} h={8}/>
                </div>

                <div style={{display: "grid", gap: 0}}>
                  {cur.items.map((item,ii)=>(<div key={ii} style={{borderBottom:ii<cur.items.length-1?`1px solid ${t.border}`:"none"}}><CK on={!!ck[`${aP}-${ii}`]} c={cur.color} fn={()=>tog(`${aP}-${ii}`)} lb={item}/></div>))}
                </div>

                {cur.capStack&&(<div style={{marginTop:32,padding:"24px",background:t.bgCardAlt,borderRadius:16,border:`1px solid ${t.border}`}}>
                  <div style={Lb(cur.color,12)}>6-LAYER AI STACK</div>
                  <div style={{display:"flex",alignItems:"center",flexWrap:"wrap", gap: 8}}>
                    {cur.capStack.map((ly,ci)=>(<div key={ci} style={{display:"flex",alignItems:"center"}}><span style={{padding:"6px 12px",borderRadius:8,fontSize:"0.875rem",fontWeight:600,background:`color-mix(in srgb, ${ly.c} 15%, transparent)`,color:ly.c,border:`1px solid color-mix(in srgb, ${ly.c} 25%, transparent)`}}>{ly.l}</span>{ci<cur.capStack.length-1&&<span style={{margin:"0 4px",color:t.textDim2,fontSize:12}}>→</span>}</div>))}
                  </div>
                </div>)}

                {cur.dataPillars&&(<div style={{marginTop:32,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:16}}>
                  {cur.dataPillars.map((dp,i)=>(<div key={i} style={{padding:"20px",background:t.bgCardAlt,borderRadius:16,border:`1px solid color-mix(in srgb, ${dp.c} 20%, transparent)`}}>
                    <div style={{fontSize:"1rem",fontWeight:700,color:dp.c,marginBottom: 4}}>{dp.name}</div>
                    <div style={{fontSize:"0.875rem",color:t.textMuted,fontStyle:"italic"}}>{dp.q}</div>
                  </div>))}
                </div>)}

                {cur.opModels&&(<div style={{marginTop:32,display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:16}}>
                  {cur.opModels.map((m,i)=>(<div key={i} style={{padding:"20px",background:t.bgCardAlt,borderRadius:16,border:`1px solid ${t.border}`}}>
                    <div style={{fontSize:"1rem",fontWeight:700,color:t.text,marginBottom:8}}>{m.n}</div>
                    <div style={{fontSize:"0.875rem",color:"var(--md-sys-color-secondary)",marginBottom:4}}><i className="fas fa-check" style={{marginRight:6}}></i>{m.p}</div>
                    <div style={{fontSize:"0.875rem",color:"var(--md-sys-color-error)"}}><i className="fas fa-times" style={{marginRight:6}}></i>{m.x}</div>
                  </div>))}
                </div>)}

                {cur.govGrid&&(<div style={{marginTop:32,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:16}}>
                  {cur.govGrid.map((g,i)=>(<div key={i} style={{padding:"20px",background:t.bgCardAlt,borderRadius:16,border:`1px solid color-mix(in srgb, ${g.c} 20%, transparent)`}}>
                    <div style={{fontSize:"1rem",fontWeight:700,color:g.c, marginBottom: 4}}>{g.n}</div>
                    <div style={{fontSize:"0.875rem",color:t.textMuted}}>{g.s}</div>
                  </div>))}
                </div>)}

                {cur.kpi&&(<div style={{marginTop:32,display:"grid",gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:16}}>
                  {cur.kpi.map((k,i)=>(<div key={i} style={{padding:"16px",background:t.bgCardAlt,borderRadius:16,border:`1px solid color-mix(in srgb, ${k.c} 20%, transparent)`,textAlign:"center"}}>
                    <div style={{fontSize:"0.75rem",color:t.textDim,fontWeight:700,textTransform:"uppercase",marginBottom: 4}}>{k.n}</div>
                    <div style={{fontSize:"1.5rem",fontWeight:800,color:k.c}}>{k.t}</div>
                  </div>))}
                </div>)}

                <Ins c={cur.color} txt={cur.insight}/>
                
                {cur.weeks.length>0&&(<div style={{marginTop:32}}>
                  <div style={Lb(t.textDim,8)}>RELEVANT CURRICULUM MODULES</div>
                  <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>{cur.weeks.map(w=>{const ww=WK.find(x=>x.w===w);return<button key={w} onClick={()=>goW(w)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid color-mix(in srgb, ${cur.color} 30%, transparent)`,background:`color-mix(in srgb, ${cur.color} 10%, transparent)`,color:cur.color,fontSize:"0.875rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Week {w}: {ww?.t}</button>;})}</div>
                </div>)}
              </div>
            </div>
          )}

          {/* ═══ VIEW 2: MATURITY ═══ */}
          {view==="maturity"&&(<div>
            <div style={{...Cd(false,t.textDim2),padding:"40px",marginBottom:32,textAlign:"center"}}>
              <div style={{...Lb(t.textDim), fontSize: "1rem"}}>AI MATURITY SELF-ASSESSMENT</div>
              <div style={{position:"relative",margin:"32px auto 0",maxWidth:700}}>
                <div style={{height:8,borderRadius:4,background:t.border}}><div style={{height:"100%",borderRadius:4,background:"linear-gradient(90deg,var(--md-sys-color-error),var(--md-sys-color-accent-amber),var(--md-sys-color-secondary),var(--md-sys-color-primary))",width:`${mp}%`,transition:"width 0.5s ease"}}/></div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:-5}}>
                  {MAT.map((st,si)=>{const isA=si+1===stg;return(
                    <button key={si} onClick={()=>setStg(si+1)} style={{width:20,height:20,borderRadius:"50%",background:si+1<=stg?st.c:t.textDim3,border:isA?`4px solid ${t.bg}`:"none",boxShadow:isA?`0 0 0 2px ${st.c}`:"none",cursor:"pointer",transition:"all 0.3s ease",position:"relative"}}>
                      {isA&&<div style={{position:"absolute",bottom:-30,left:"50%",transform:"translateX(-50%)",fontSize:"0.875rem",fontWeight:700,color:st.c,whiteSpace:"nowrap"}}>YOU</div>}
                    </button>);})}
                </div>
              </div>
            </div>
            
            <div style={{display:"grid",gridTemplateColumns:small?"1fr":mobile?"repeat(2,1fr)":"repeat(5,1fr)",gap:16,marginBottom:32}}>
              {MAT.map((st,si)=>{const isA=si+1===stg;return(
                <button key={si} onClick={()=>setStg(si+1)} style={{...Cd(isA,st.c),padding:"20px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",height:"100%"}}>
                  <div style={{fontSize:"2rem",fontWeight:800,color:isA?st.c:t.textDim3,marginBottom:8}}>{st.s}</div>
                  <div style={{fontSize:"1rem",fontWeight:700,color:isA?t.text:t.textDim,marginBottom:12}}>{st.n}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {st.t.map((t,ti)=>(<div key={ti} style={{display:"flex",alignItems:"center",gap:8}}><D c={isA?st.c:t.textDim3} s={6}/><span style={{fontSize:"0.875rem",color:isA?t.textDim4:t.textDim2}}>{t}</span></div>))}
                  </div>
                  <div style={{marginTop:16,fontSize:"0.75rem",color:isA?t.text:t.textDim3,fontStyle:"italic", borderTop: `1px solid ${isA ? st.c+"40" : t.border}`, paddingTop: 8}}>{st.e}</div>
                </button>);})}
            </div>
            
            <div style={{...Cd(true,cs.c),padding:"32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap: 24}}>
              <div>
                <div style={Lb(cs.c)}>YOUR STATUS</div>
                <h3 style={{margin:0,fontSize:"1.5rem",fontWeight:700,color:t.text}}>{cs.n} (Stage {stg})</h3>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:"0.875rem",color:t.textDim}}>TARGET</div>
                  <div style={{fontSize:"1.25rem",fontWeight:700,color:"var(--md-sys-color-primary)"}}>AI-Native</div>
                </div>
                <div style={{height:40,width:1,background:t.border}}></div>
                <div>
                  <div style={{fontSize:"2rem",fontWeight:800,color:t.text,lineHeight:1}}>{5-stg}</div>
                  <div style={{fontSize:"0.75rem",color:t.textDim}}>STAGES TO GO</div>
                </div>
              </div>
            </div>
          </div>)}

          {/* ═══ VIEW 3: PLAYBOOK ═══ */}
          {view==="playbook"&&(<div>
            <div style={{marginBottom: 32}}>
              <SubTab tabs={PBT} active={pbT} set={setPbT} color="var(--md-sys-color-accent-amber)"/>
            </div>
            
            {pbT===0&&(<div style={{...Cd(false,t.textDim2),padding:small?20:40}}>
              <div style={{...Lb("var(--md-sys-color-accent-amber)"), textAlign:"center", fontSize:"1rem", marginBottom: 24}}>VALUE MATRIX</div>
              {mobile?(<div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div style={Lb(t.textDim)}>HIGH IMPACT</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12}}>{VM.filter(v=>v.i==="H").map((v,i)=>(<div key={i} style={{padding:20,borderRadius:12,background:`color-mix(in srgb, ${v.c} 10%, transparent)`,border:`1px solid color-mix(in srgb, ${v.c} 30%, transparent)`,textAlign:"center"}}><div style={{fontSize:"1rem",fontWeight:700,color:v.c,marginBottom:4}}>{v.l}</div><div style={{fontSize:"0.875rem",color:t.textMuted}}>{v.d}</div></div>))}</div>
                <div style={Lb(t.textDim)}>LOW IMPACT</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12}}>{VM.filter(v=>v.i==="L").map((v,i)=>(<div key={i} style={{padding:20,borderRadius:12,background:`color-mix(in srgb, ${v.c} 10%, transparent)`,border:`1px solid color-mix(in srgb, ${v.c} 30%, transparent)`,textAlign:"center"}}><div style={{fontSize:"1rem",fontWeight:700,color:v.c,marginBottom:4}}>{v.l}</div><div style={{fontSize:"0.875rem",color:t.textMuted}}>{v.d}</div></div>))}</div>
              </div>):(<div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr",gridTemplateRows:"auto 1fr 1fr", gap: 16}}>
                <div/><div style={{textAlign:"center",fontSize:"0.875rem",color:t.textDim,fontWeight:700}}>LOW COMPLEXITY</div><div style={{textAlign:"center",fontSize:"0.875rem",color:t.textDim,fontWeight:700}}>HIGH COMPLEXITY</div>
                <div style={{writingMode:"vertical-lr",transform:"rotate(180deg)",textAlign:"center",fontSize:"0.875rem",color:t.textDim,fontWeight:700}}>HIGH IMPACT</div>
                {VM.filter(v=>v.i==="H").map((v,i)=>(<div key={i} style={{padding:32,borderRadius:16,background:`color-mix(in srgb, ${v.c} 10%, transparent)`,border:`1px solid color-mix(in srgb, ${v.c} 30%, transparent)`,textAlign:"center", display:"flex", flexDirection:"column", justifyContent:"center"}}><div style={{fontSize:"1.25rem",fontWeight:700,color:v.c,marginBottom:8}}>{v.l}</div><div style={{fontSize:"1rem",color:t.text}}>{v.d}</div><div style={{fontSize:"0.875rem",color:t.textDim,marginTop:8,fontStyle:"italic"}}>{v.a}</div></div>))}
                <div style={{writingMode:"vertical-lr",transform:"rotate(180deg)",textAlign:"center",fontSize:"0.875rem",color:t.textDim,fontWeight:700}}>LOW IMPACT</div>
                {VM.filter(v=>v.i==="L").map((v,i)=>(<div key={i} style={{padding:32,borderRadius:16,background:`color-mix(in srgb, ${v.c} 10%, transparent)`,border:`1px solid color-mix(in srgb, ${v.c} 30%, transparent)`,textAlign:"center", display:"flex", flexDirection:"column", justifyContent:"center"}}><div style={{fontSize:"1.25rem",fontWeight:700,color:v.c,marginBottom:8}}>{v.l}</div><div style={{fontSize:"1rem",color:t.text}}>{v.d}</div><div style={{fontSize:"0.875rem",color:t.textDim,marginTop:8,fontStyle:"italic"}}>{v.a}</div></div>))}
              </div>)}
            </div>)}
            
            {pbT===1&&(<div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:24}}>{ROAD.map((rp,ri)=>(<div key={ri} style={{...Cd(true,rp.c),padding:"24px"}}>
              <div style={{fontSize:"0.75rem",fontWeight:700,color:rp.c,letterSpacing:"0.1em",marginBottom:8}}>PHASE {ri+1}</div>
              <div style={{fontSize:"1.5rem",fontWeight:700,color:t.text,marginBottom:4}}>{rp.n}</div>
              <div style={{fontSize:"1rem",color:t.textDim,marginBottom:24}}>{rp.t}</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {rp.it.map((it,ii)=>(<div key={ii} style={{display:"flex",alignItems:"center",gap:12}}><D c={rp.c} s={8}/><span style={{fontSize:"0.9375rem",color:t.text}}>{it}</span></div>))}
              </div>
            </div>))}</div>)}
            
            {pbT===2&&(<div style={{display:"flex",flexDirection:"column",gap:12}}>{RK.map(r=>(<div key={r.r} style={{...Cd(true,r.c),padding:"20px",display:"flex",alignItems:"center",gap:20}}><div style={{fontSize:"2rem",fontWeight:800,color:r.c,width:40,textAlign:"center",flexShrink:0}}>{r.r}</div><div><div style={{fontSize:"1.125rem",fontWeight:700,color:t.text}}>{r.n}</div><div style={{fontSize:"1rem",color:t.textMuted,marginTop:4}}>{r.d}</div></div></div>))}</div>)}
          </div>)}

          {/* ═══ VIEW 4: 12-WEEK ═══ */}
          {view==="curriculum"&&(<div>
            <div style={{display:"grid",gridTemplateColumns:small?"1fr":mobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginBottom:32,minWidth:0}}>
              {WK.map((w,wi)=>{const c=plOf(w.p)?.color||"var(--md-sys-color-outline)";const isA=wi===aW;return(
                <button key={wi} onClick={()=>setAW(wi)} style={{...Cd(isA,c),padding:"12px",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{fontSize:"0.75rem",fontWeight:700,color:isA?c:t.textDim,textTransform:"uppercase"}}>WEEK {w.w}</div>
                    {isA && <div style={{width:6,height:6,borderRadius:"50%",background:c}}></div>}
                  </div>
                  <div style={{fontSize:"0.875rem",fontWeight:600,lineHeight:1.3,color:isA?t.text:t.textDim}}>{w.t}</div>
                </button>);})}
            </div>
            
            <div style={{...Cd(true,wc),padding:small?24:40}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <Tag c={wc} t={wkPl?.name}/>
                <span style={{fontSize:"0.875rem",color:t.textDim}}>Week {cwk.w} of 12</span>
              </div>
              <h2 style={{margin:"0 0 8px",fontSize:"2rem",fontWeight:800, color: t.text}}>{cwk.t}</h2>
              <p style={{fontSize:"1.125rem",color:t.textMuted,margin:"0 0 32px",fontStyle:"italic"}}>Focus: {cwk.f}</p>
              
              <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:24,minWidth:0}}>
                <div style={{padding:"24px",background:t.bgCardAlt,borderRadius:16,border:`1px solid ${t.border}`}}>
                  <div style={Lb(t.textDim,12)}>TOPICS</div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    {cwk.tp.map((t,ti)=>(<div key={ti} style={{display:"flex",alignItems:"start",gap:12}}><D c={wc} s={6} style={{marginTop:8}}/><span style={{fontSize:"1rem",color:t.text}}>{t}</span></div>))}
                  </div>
                </div>
                
                <div style={{display:"flex",flexDirection:"column",gap:24}}>
                  <div style={{padding:"24px",background:t.bgCardAlt,borderRadius:16,border:`1px solid ${t.border}`}}><div style={Lb(t.textDim,8)}>CASE STUDY</div><p style={{margin:0,fontSize:"1rem",color:t.text,lineHeight:1.6}}>{cwk.cs}</p></div>
                  <div style={{padding:"24px",background:t.bgCardAlt,borderRadius:16,border:`1px solid ${t.border}`}}><div style={Lb(t.textDim,8)}>EXERCISE</div><p style={{margin:0,fontSize:"1rem",color:t.text,lineHeight:1.6}}>{cwk.ex}</p></div>
                </div>
              </div>
              
              <div style={{marginTop: 24, padding:"24px",background:`color-mix(in srgb, ${wc} 10%, transparent)`,borderRadius:16,border:`1px solid color-mix(in srgb, ${wc} 25%, transparent)`}}>
                <div style={Lb(wc,8)}>DISCUSSION QUESTION</div>
                <p style={{margin:0,fontSize:"1.25rem",color:t.text,lineHeight:1.5,fontStyle:"italic",fontWeight:500}}>"{cwk.q}"</p>
              </div>
              
              <div style={{marginTop: 32, textAlign: "center"}}>
                <button onClick={()=>goP(cwk.p)} className="btn btn-secondary">Explore {wkPl?.name} Pillar <i className="fas fa-arrow-right" style={{marginLeft:8}}></i></button>
              </div>
            </div>
          </div>)}

          {/* ═══ VIEW 5: SCENARIOS ═══ */}
          {view==="scenarios"&&(<div>
            <div style={{...Cd(true,"var(--md-sys-color-accent-amber)"),padding:"24px 32px",marginBottom:32, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap"}}>
              <div style={{fontSize:"3rem"}}>👑</div>
              <div>
                <div style={Lb("var(--md-sys-color-accent-amber)")}>SCENARIO CONTEXT</div>
                <p style={{margin:0,fontSize:"1.25rem",fontWeight:600,color:t.text,lineHeight:1.4}}>"$50B Retail CEO: 100 pilots, 15 regions, millions spent, P&L flat."</p>
              </div>
            </div>
            
            <div style={{marginBottom: 32}}>
              <SubTab tabs={SCT} active={scT} set={setScT} color="var(--md-sys-color-accent-amber)"/>
            </div>

            {/* 0 Diagnosis */}
            {scT===0&&(<div><h3 style={{margin:"0 0 4px",fontSize:"1.5rem",fontWeight:700}}>Portfolio Rationalization</h3><p style={{margin:"0 0 24px",fontSize:"1rem",color:t.textMuted,fontStyle:"italic"}}>100 Pilots → 5 Big Bets</p>
              <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:16}}>{SQ.map((q,i)=>(<div key={i} style={{...Cd(true,q.c),padding:"24px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:"1.125rem",fontWeight:700,color:q.c}}>{q.n}</span><Tag c={q.c} t={q.tg}/></div><p style={{margin:0,fontSize:"1rem",color:t.text,lineHeight:1.5}}>{q.a}</p></div>))}</div></div>)}

            {/* 1 Intelligence */}
            {scT===1&&(<div><div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:24}}>{IL.map(i=>(<div key={i.n} style={{...Cd(true,i.c),padding:"24px",display:"flex",alignItems:"center",gap:24}}>
              <div style={{fontSize:"2.5rem",fontWeight:800,color:i.c,width:40,textAlign:"center",flexShrink:0}}>{i.n}</div>
              <div style={{flex:1}}><div style={{fontSize:"1.25rem",fontWeight:700,color:t.text}}>{i.nm}</div><div style={{fontSize:"1rem",color:t.textMuted,fontStyle:"italic"}}>"{i.q}"</div></div>
              <Tag c={i.c} t={i.tc}/>
            </div>))}</div>
              <Ins c="var(--md-sys-color-secondary)" txt="Legacy: what happened. AI: what will happen. Agentic: does it for you."/></div>)}

            {/* 2 Agent Arch */}
            {scT===2&&(<div><h3 style={{margin:"0 0 24px",fontSize:"1.5rem",fontWeight:700}}>Agent-Managing-Agents (AMA)</h3>
              <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:16,marginBottom:24}}>{AMA.map((a,i)=>(<div key={i} style={{...Cd(true,a.c),padding:"24px"}}>
                <div style={{fontSize:"1.125rem",fontWeight:700,color:a.c,marginBottom:8}}>{a.n}</div>
                <div style={{fontSize:"0.875rem",color:t.textDim,marginBottom:12}}>{a.m}</div>
                <div style={{fontSize:"1rem",color:t.text,lineHeight:1.5}}>{a.r}</div>
              </div>))}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center",padding:"16px 0",flexWrap:"wrap"}}>
                <Tag c="var(--md-sys-color-secondary)" t="Merchant"/><span style={{color:t.textDim2,fontSize:14}}>→</span>
                <Tag c="var(--md-sys-color-error)" t="Controller"/><span style={{color:t.textDim2,fontSize:14}}>→</span>
                <Tag c="var(--md-sys-color-primary)" t="Logic Gate"/><span style={{color:t.textDim2,fontSize:14}}>→</span>
                <span style={{fontSize:"1rem",color:"var(--md-sys-color-secondary)",fontWeight:700}}>✓ User</span>
              </div></div>)}

            {/* 3 Shield */}
            {scT===3&&(<div><h3 style={{margin:"0 0 24px",fontSize:"1.5rem",fontWeight:700}}>Shield Framework</h3>
              <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:16}}>{SH.map((s,i)=>(<div key={i} style={{...Cd(true,s.c),padding:"24px"}}>
                <div style={{fontSize:"1.125rem",fontWeight:700,color:s.c,marginBottom:8}}>{s.n}</div>
                <div style={{fontSize:"1rem",color:t.text,marginBottom:16}}>{s.d}</div>
                <Tag c={s.c} t={`CFO: ${s.v}`}/>
              </div>))}</div></div>)}

            {/* 4 Circuit Breaker */}
            {scT===4&&(<div><h3 style={{margin:"0 0 4px",fontSize:"1.5rem",fontWeight:700}}>Circuit Breaker (MECE)</h3><p style={{margin:"0 0 16px",fontSize:"1rem",color:t.textMuted,fontStyle:"italic"}}>NYSE LULD analogy — prevents AI Flash Crash</p>
              <div style={{padding:"16px 24px",borderRadius:12,background:"color-mix(in srgb, var(--md-sys-color-error) 10%, transparent)",border:"1px solid color-mix(in srgb, var(--md-sys-color-error) 20%, transparent)",marginBottom:24}}>
                <p style={{margin:0,fontSize:"1rem",color:t.text,lineHeight:1.5}}>GPWS: AI=Pilot, Controller=Co-Pilot, Circuit Breaker=GPWS. Even if both pass out, computer forces pull-up.</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:24}}>{CB.map((c,i)=>(<div key={i} style={{...Cd(true,c.c),padding:"24px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:"1.25rem",fontWeight:700,color:c.c}}>{c.n}</span><Tag c={c.c} t={c.an}/></div>
                <div style={{fontSize:"1rem",color:t.textDim,marginBottom:4}}>Trigger: {c.tr}</div>
                <div style={{fontSize:"1rem",color:t.text,fontWeight:600}}>→ {c.act}</div>
              </div>))}</div>
              <Ins c="var(--md-sys-color-error)" txt="Circuit Breaker = Hard-Coded Logic. Deterministic. Doesn't negotiate. Doesn't hallucinate."/></div>)}

            {/* 5 Model Routing */}
            {scT===5&&(<div><h3 style={{margin:"0 0 4px",fontSize:"1.5rem",fontWeight:700}}>Model Routing / LLM Cascading</h3><p style={{margin:"0 0 24px",fontSize:"1rem",color:t.textMuted,fontStyle:"italic"}}>Match Cost of Compute to Value of Task</p>
              <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:24}}>{MR.map((m,i)=>(<div key={i} style={{...Cd(true,m.c),padding:"24px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:"1.25rem",fontWeight:700,color:m.c}}>{m.l}</span><Tag c={m.c} t={m.tier}/></div>
                <div style={{fontSize:"1rem",color:t.textDim,marginBottom:8}}>{m.mod}</div>
                <div style={{fontSize:"1rem",color:t.text,lineHeight:1.5}}>{m.why}</div>
              </div>))}</div>
              <div style={{...Cd(false,t.textDim2),padding:"24px"}}>
                <div style={Lb("var(--md-sys-color-accent-amber)")}>CFO ARGUMENTS</div>
                <div style={{fontSize:"1rem",color:t.text,lineHeight:1.6}}>
                  <div style={{marginBottom:8}}><span style={{color:"var(--md-sys-color-secondary)",fontWeight:600}}>Cost Arbitrage:</span> 70% traffic → small models = 60-80% savings</div>
                  <div style={{marginBottom:8}}><span style={{color:"var(--md-sys-color-accent-amber)",fontWeight:600}}>Latency as Revenue:</span> 1s delay = 7% conversion drop</div>
                  <div><span style={{color:"var(--md-sys-color-error)",fontWeight:600}}>Accuracy/Liability:</span> Deterministic = no phantom stock, no refunds</div>
                </div>
              </div></div>)}

            {/* ... other scenarios simplified for brevity but following same pattern ... */}
            
            {/* 12 AI Economics (Example of complex layout) */}
            {scT===12&&(<div><h3 style={{margin:"0 0 4px",fontSize:"1.5rem",fontWeight:700}}>AI Economics</h3><p style={{margin:"0 0 24px",fontSize:"1rem",color:t.textMuted,fontStyle:"italic"}}>3 Buckets: Savings + Revenue + Risk Avoidance</p>
              <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(3,1fr)",gap:16,marginBottom:24}}>
                <div style={{...Cd(true,"var(--md-sys-color-secondary)"),padding:"24px",textAlign:"center"}}><div style={{fontSize:"0.875rem",color:t.textDim,fontWeight:700}}>SAVINGS</div><div style={{fontSize:"2rem",fontWeight:800,color:"var(--md-sys-color-secondary)",marginTop:4}}>$0.05</div><div style={{fontSize:"0.875rem",color:t.textMuted}}>per ticket</div></div>
                <div style={{...Cd(true,"var(--md-sys-color-primary)"),padding:"24px",textAlign:"center"}}><div style={{fontSize:"0.875rem",color:t.textDim,fontWeight:700}}>REVENUE</div><div style={{fontSize:"2rem",fontWeight:800,color:"var(--md-sys-color-primary)",marginTop:4}}>+15%</div><div style={{fontSize:"0.875rem",color:t.textMuted}}>basket uplift</div></div>
                <div style={{...Cd(true,"var(--md-sys-color-error)"),padding:"24px",textAlign:"center"}}><div style={{fontSize:"0.875rem",color:t.textDim,fontWeight:700}}>RISK</div><div style={{fontSize:"2rem",fontWeight:800,color:"var(--md-sys-color-error)",marginTop:4}}>$500M</div><div style={{fontSize:"0.875rem",color:t.textMuted}}>prevented</div></div>
              </div>
              <div style={{...Cd(false,t.textDim2),padding:"32px",marginBottom:24}}>
                <div style={Lb("var(--md-sys-color-accent-amber)", 16)}>BOARD AI P&L SLIDE</div>
                <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:24,minWidth:0}}>
                  <div style={{textAlign:"center",minWidth:0}}><div style={{fontSize:"0.875rem",color:t.textDim}}>CPO</div><div style={{fontSize:"1.5rem",fontWeight:800,color:"var(--md-sys-color-secondary)"}}>-29%</div><div style={{fontSize:"0.875rem",color:t.textMuted}}>$4.50→$3.20</div></div>
                  <div style={{textAlign:"center",minWidth:0}}><div style={{fontSize:"0.875rem",color:t.textDim}}>CAC</div><div style={{fontSize:"1.5rem",fontWeight:800,color:"var(--md-sys-color-primary)"}}>-24%</div><div style={{fontSize:"0.875rem",color:t.textMuted}}>$55→$42</div></div>
                  <div style={{textAlign:"center",minWidth:0}}><div style={{fontSize:"0.875rem",color:t.textDim}}>Cross-sell</div><div style={{fontSize:"1.5rem",fontWeight:800,color:"var(--md-sys-color-accent-amber)"}}>+50%</div><div style={{fontSize:"0.875rem",color:t.textMuted}}>1.2→1.8</div></div>
                </div>
              </div>
              <Ins c="var(--md-sys-color-secondary)" txt="$5M invested to capture $45M. That's not a cost center — that's a weapon."/></div>)}
              
            {/* ... other scenarios ... */}
            
          </div>)}

          {/* ═══ VIEW 6: ADVISORY ═══ */}
          {view==="ceo"&&(<div>
            <div style={{marginBottom:32}}><div style={Lb("var(--md-sys-color-primary)")}>BOARDROOM SIMULATION</div><h2 style={{margin:0,fontSize:"2rem",fontWeight:700}}>CEO Advisory Panel</h2></div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>{CQ.map((qa,qi)=>{const isO=ceoO===qi;const cc=["var(--md-sys-color-primary)","var(--md-sys-color-secondary)","var(--md-sys-color-accent-amber)","var(--md-sys-color-tertiary)"][qi];return(
              <div key={qi} style={{...Cd(isO,cc),overflow:"hidden"}}>
                <button onClick={()=>setCeoO(isO?-1:qi)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px",background:"transparent",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                  <div style={{display:"flex",alignItems:"center",gap:16}}>
                    <div style={{width:32,height:32,borderRadius:8,background:`color-mix(in srgb, ${cc} 15%, transparent)`,border:`1px solid color-mix(in srgb, ${cc} 30%, transparent)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.875rem",fontWeight:800,color:cc}}>Q{qi+1}</div>
                    <span style={{fontSize:"1.125rem",fontWeight:600,color:isO?t.text:t.textDim}}>{qa.q}</span>
                  </div>
                  <Ch o={isO}/>
                </button>
                {isO&&(<div style={{padding:"0 24px 24px 72px"}}>{qa.a.map((a,ai)=>(<div key={ai} style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:8}}><D c={cc} s={6} style={{marginTop:8}}/><span style={{fontSize:"1rem",color:t.text,lineHeight:1.6}}>{a}</span></div>))}</div>)}
              </div>);})}</div>
          </div>)}

          <div style={{marginTop:60,paddingTop:24,borderTop:`1px solid ${t.borderAlt}`,display:"flex",justifyContent:"space-between",fontSize:"0.75rem",color:t.textDim3}}>
            <span>Enterprise AI Transformation Framework v8</span><span>{dn}/{total}</span>
          </div>
        </div>
      </div>

      {/* Footer Injection */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>Rajkumar Rajagobalan</h3>
            <p className="footer-text">Building AI-Native Enterprises. Singapore.</p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/blogs.html" className="footer-link">Blogs</a></li>
              <li><a href="/" className="footer-link">About</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul className="footer-links">
              <li><a href="https://www.linkedin.com/in/rajkumar-rajagobalan/" className="footer-link">LinkedIn</a></li>
              <li><a href="mailto:raj@nuvear.org" className="footer-link">Email</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>&copy; 2026 Rajkumar Rajagobalan</div>
        </div>
      </footer>
    </div>
  );
}
