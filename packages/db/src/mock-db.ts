import { DatabaseProvider } from "./index";
import {
  EntityMetadata,
  FullTranslation,
  MediaCatalog,
  EntityType
} from "@kakehashi/content-schema";

// Mock Fixtures for Stanford, MIT, Capgemini, Nuvear, AAGNAA, and Profile About
const mockEntities: Record<string, EntityMetadata> = {
  "profile.about": {
    id: "profile.about",
    type: "profile",
    canonical_slug: "about",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["profile_hero", "reflection_cards"]
  },
  "education.stanford-executive-program": {
    id: "education.stanford-executive-program",
    type: "education",
    canonical_slug: "stanford-executive-program",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["institution_hero", "media_gallery", "timeline", "reflection_cards"],
    institution: {
      id: "institution.stanford-gsb",
      official_name: "Stanford University Graduate School of Business"
    },
    programme: {
      official_name: "Stanford Executive Program"
    },
    start_date: "2025-10",
    end_date: "2026-02"
  },
  "education.mit-coo-program": {
    id: "education.mit-coo-program",
    type: "education",
    canonical_slug: "mit-coo-program",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["institution_hero", "timeline", "reflection_cards"],
    institution: {
      id: "institution.mit",
      official_name: "Massachusetts Institute of Technology"
    },
    programme: {
      official_name: "Advanced Certificate for Executives (MIT Sloan)"
    },
    start_date: "2023-01",
    end_date: "2023-12"
  },
  "experience.capgemini-japan": {
    id: "experience.capgemini-japan",
    type: "experience",
    canonical_slug: "capgemini-japan",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["company_hero", "timeline", "related_experience"],
    company: {
      id: "company.capgemini",
      official_name: "Capgemini Japan K.K."
    },
    role: "VP & Head of Digital Engineering (APAC & Japan)",
    start_date: "2020-03",
    end_date: "2024-05"
  },
  "venture.nuvear": {
    id: "venture.nuvear",
    type: "venture",
    canonical_slug: "nuvear",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["venture_dashboard", "media_gallery", "product_cards"],
    company_name: "Nuvear Tech Pte Ltd",
    role: "Founder & CEO",
    start_date: "2024-06",
    end_date: null
  },
  "venture.aagnaa": {
    id: "venture.aagnaa",
    type: "venture",
    canonical_slug: "aagnaa",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["company_hero", "timeline"],
    company_name: "Aagnaa India / Aagnaa Singapore",
    role: "Co-Founder & Director",
    start_date: "2011-09",
    end_date: "2020-02"
  },
  "insight.enterprise-ai-reference-guide": {
    id: "insight.enterprise-ai-reference-guide",
    type: "insight",
    canonical_slug: "enterprise-ai-reference-guide",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    category: "Enterprise AI",
    tags: ["AI Strategy", "Enterprise", "Reference Guide"],
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: []
  },
  "insight.singapore-ai-strategy": {
    id: "insight.singapore-ai-strategy",
    type: "insight",
    canonical_slug: "singapore-ai-strategy",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    category: "AI Strategy",
    tags: ["Singapore", "AI Strategy", "National Strategy"],
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: []
  },
  "insight.responsible-ai-governance": {
    id: "insight.responsible-ai-governance",
    type: "insight",
    canonical_slug: "responsible-ai-governance",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    category: "AI Governance",
    tags: ["Governance", "Responsible AI", "Adoption"],
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: []
  },
  "insight.ai-executive-talking-points": {
    id: "insight.ai-executive-talking-points",
    type: "insight",
    canonical_slug: "ai-executive-talking-points",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    category: "AI Leadership",
    tags: ["Leadership", "Talking Points", "Executive"],
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: []
  },
  "insight.blood-pressure-app-design": {
    id: "insight.blood-pressure-app-design",
    type: "insight",
    canonical_slug: "blood-pressure-app-design",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    category: "HealthTech",
    tags: ["UX Design", "HealthTech", "Mobile App"],
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: []
  },
  "framework.enterprise-ai-transformation": {
    id: "framework.enterprise-ai-transformation",
    type: "framework",
    canonical_slug: "enterprise-ai-transformation",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    version: "1.2.0",
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: []
  },
  "app.ai-transformation-command-center": {
    id: "app.ai-transformation-command-center",
    type: "app",
    canonical_slug: "ai-transformation-command-center",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    app_url: "/apps/ai-transformation-command-center",
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: []
  },
  "app.foodie": {
    id: "app.foodie",
    type: "app",
    canonical_slug: "foodie",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    app_url: "/apps/foodie",
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: []
  },
  "guide.crewai": {
    id: "guide.crewai",
    type: "guide",
    canonical_slug: "crewai",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    category: "Agentic AI",
    tags: ["CrewAI", "Agents", "Developer Guide"],
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: []
  }
};

const mockTranslations: Record<string, Record<string, FullTranslation>> = {
  "profile.about": {
    en: {
      entity_id: "profile.about",
      frontmatter: {
        locale: "en",
        title: "About Rajkumar Rajagobalan",
        summary: "Enterprise AI Transformation Leader, HealthTech Founder (Nuvear), Stanford GSB Alumni, MIT Alumni.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Executive Profile

Rajkumar is an Enterprise AI Transformation Leader and HealthTech Founder with over 27 years of experience scaling digital engineering, industrial IoT, and enterprise AI transformation initiatives across APAC and Japan.
- Founder & CEO of **Nuvear**, building **HealthKitSync**.
- Former VP & Head of Digital Engineering at **Capgemini Japan**.
- Alumnus of **Stanford GSB** (Stanford Executive Program) and **MIT Sloan**.
`
    },
    ja: {
      entity_id: "profile.about",
      frontmatter: {
        locale: "ja",
        title: "ラジクマール・ラジャゴバランについて",
        summary: "エンタープライズAI変革のリーダー、ヘルステック創業者（Nuvear）、スタンフォード大学経営大学院修了生、MIT修了生。",
        translation_status: "approved",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## 略歴

ラジクマール・ラジャゴバランは、エンタープライズAI変革のリーダーであり、ヘルステックの創業者です。APACおよび日本全域において、デジタルエンジニアリング、産業用IoT、エンタープライズAI変革イニシアチブの拡大で27年以上の経験を持っています。
- **Nuvear**の創業者兼CEOであり、**HealthKitSync**を構築。
- 元**キャップジェミニ日本法人**のバイスプレジデント兼デジタルエンジニアリング責任者。
- **スタンフォード大学経営大学院**（エグゼクティブ・プログラム）および**MITスローン**の修了生。
`
    }
  },
  "education.stanford-executive-program": {
    en: {
      entity_id: "education.stanford-executive-program",
      frontmatter: {
        locale: "en",
        title: "Stanford Executive Program",
        summary: "Leadership, strategy, and global business frameworks at Stanford Graduate School of Business.",
        translation_status: "published",
        last_editorial_review: "2026-06-24",
        seo: {
          title: "Stanford Executive Program (SEP) | Rajkumar Rajagobalan",
          description: "Details on Rajkumar Rajagobalan's executive education at Stanford GSB.",
          keywords: ["Stanford", "Executive Education", "Leadership", "GSB"]
        }
      },
      content_markdown: `
## Core Experience

Participated in the flagship Stanford Executive Program (SEP) at the Stanford Graduate School of Business. The curriculum covers advanced global management, corporate strategy, executive leadership, organizational design, and financial decision-making under uncertainty.

### Key Takeaways
- **Global Strategy**: Adapting business models to rapid digital disruption.
- **Leadership**: Authentic leadership structures and high-performance organization management.
- **Innovation Ecosystems**: Practical exploration of Silicon Valley innovation models.
`
    },
    ja: {
      entity_id: "education.stanford-executive-program",
      frontmatter: {
        locale: "ja",
        title: "スタンフォード・エグゼクティブ・プログラム",
        summary: "スタンフォード大学経営大学院におけるリーダーシップ、戦略、グローバルビジネスのフレームワーク。",
        translation_status: "approved",
        last_editorial_review: "2026-06-24",
        seo: {
          title: "スタンフォード・エグゼクティブ・プログラム | ラジクマール・ラジャゴバラン",
          description: "ラジクマール・ラジャゴバランのスタンフォード大学経営大学院におけるエグゼクティブ教育の詳細。",
          keywords: ["スタンフォード", "エグゼクティブ教育", "リーダーシップ", "経営大学院"]
        }
      },
      content_markdown: `
## 主な経験

スタンフォード大学経営大学院（Stanford GSB）のフラッグシッププログラムであるスタンフォード・エグゼクティブ・プログラム（SEP）に参加しました。このカリキュラムは、高度なグローバル経営、企業戦略、エグゼクティブ・リーダーシップ、組織設計、および不確実性下での財務意思決定をカバーしています。

### 主な学習成果
- **グローバル戦略**: 急激なデジタル破壊に対するビジネスモデルの適応。
- **リーダーシップ**: オーセンティックなリーダーシップ構造と高パフォーマンス組織の管理。
- **イノベーション・エコシステム**: シリコンバレーのイノベーション・モデルの実践的な探求。
`
    }
  },
  "education.mit-coo-program": {
    en: {
      entity_id: "education.mit-coo-program",
      frontmatter: {
        locale: "en",
        title: "MIT Advanced Certificate for Executives",
        summary: "Systems thinking, operations, and technology management at MIT Sloan School of Management.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## MIT Sloan Program

Completed the Advanced Certificate for Executives (ACE) at MIT Sloan, focusing on operations, supply chain, system dynamics, and product design.

### Focus Areas
- **System Dynamics**: Modeling complex organization dynamics.
- **Operations & Tech**: Executing digital transformations in manufacturing and engineering workflows.
`
    },
    ja: {
      entity_id: "education.mit-coo-program",
      frontmatter: {
        locale: "ja",
        title: "MIT エグゼクティブ向けアドバンスド証明書",
        summary: "MITスローン経営大学院におけるシステム思考、オペレーション、および技術管理。",
        translation_status: "approved",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## MITスローンプログラム

MITスローン経営大学院で、オペレーション、サプライチェーン、システムダイナミクス、製品設計に焦点を当てたエグゼクティブ向けアドバンスド証明書（ACE）を修了しました。

### 重点分野
- **システムダイナミクス**: 複雑な組織ダイナミクスのモデル化。
- **オペレーションと技術**: 製造業およびエンジニアリングのワークフローにおけるデジタル変革の実行。
`
    }
  },
  "experience.capgemini-japan": {
    en: {
      entity_id: "experience.capgemini-japan",
      frontmatter: {
        locale: "en",
        title: "VP & Head of Digital Engineering at Capgemini Japan",
        summary: "Leading digital engineering, product development, and industrial IoT solutions across Japan and APAC.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Role & Impact

Served as Vice President and Head of Digital Engineering for Capgemini Japan, scaling engineering capability, managing APAC delivery networks, and advising Japanese enterprise clients on digital and AI transformations.

### Highlights
- Scaled agile product development squads.
- Spearheaded industrial IoT solutions for manufacturing and automotive leaders.
`
    },
    ja: {
      entity_id: "experience.capgemini-japan",
      frontmatter: {
        locale: "ja",
        title: "キャップジェミニ日本法人 デジタルエンジニアリング責任者 & VP",
        summary: "日本およびアジア太平洋地域（APAC）におけるデジタルエンジニアリング、製品開発、および産業用IoTソリューションの統括。",
        translation_status: "approved",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## 役割と成果

キャップジェミニ日本法人のバイスプレジデント兼デジタルエンジニアリング責任者として、エンジニアリング能力を拡大し、APACのデリバリーネットワークを管理し、日本の主要企業向けにデジタルおよびAI変革のアドバイザリーを務めました。

### 主な実績
- アジャイルな製品開発体制を拡大。
- 製造業および自動車大手に向けた産業用IoTソリューションの展開を主導。
`
    }
  },
  "venture.nuvear": {
    en: {
      entity_id: "venture.nuvear",
      frontmatter: {
        locale: "en",
        title: "Nuvear Tech",
        summary: "Bilingual health analytics and synchronized wearable intelligence platform.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## HealthKitSync & Nuvear

Founded Nuvear to develop HealthKitSync, a next-generation decentralized health intelligence platform that correlates wearable data (Apple Health, Garmin, Fitbit) into actionable personalized health indicators.

### Key Milestones
- Established clean API adapters for syncing iOS HealthKit data safely.
- Built a private dashboard highlighting biometric metrics.
`
    },
    ja: {
      entity_id: "venture.nuvear",
      frontmatter: {
        locale: "ja",
        title: "ヌヴィア・テック (Nuvear Tech)",
        summary: "バイリンガルの健康分析と同期型ウェアラブルインテリジェンス・プラットフォーム。",
        translation_status: "approved",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## HealthKitSync と ヌヴィア

ウェアラブルデータ（Apple Health、Garmin、Fitbit）を実行可能な実用的パーソナライズ健康指標へと相関させる、次世代の分散型ヘルス・インテリジェンス・プラットフォーム「HealthKitSync」を開発するためにNuvearを設立しました。

### 主なマイルストーン
- iOS HealthKitデータを安全に同期するためのクリーンなAPIアダプターを確立。
- 生体情報の指標を視覚化するプライベート・ダッシュボードを構築。
`
    }
  },
  "venture.aagnaa": {
    en: {
      entity_id: "venture.aagnaa",
      frontmatter: {
        locale: "en",
        title: "AAGNAA",
        summary: "Enterprise digital engineering and cloud integration ventures in India and Singapore.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Co-Founder & Director

Co-founded AAGNAA, scaling custom software systems development, mobile apps engineering, and system architectures for client enterprises.

### Focus Areas
- Scaled digital platforms across India and Singapore.
- Developed early mobile banking and SaaS integrations.
`
    },
    ja: {
      entity_id: "venture.aagnaa",
      frontmatter: {
        locale: "ja",
        title: "アーグナー (AAGNAA)",
        summary: "インドおよびシンガポールにおけるエンタープライズ・デジタルエンジニアリングおよびクラウド統合ベンチャー。",
        translation_status: "approved",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## 共同創業者 & 取締役

AAGNAAを共同設立し、企業クライアント向けのカスタムソフトウェアシステム開発、モバイルアプリエンジニアリング、およびシステムアーキテクチャの構築を拡大しました。

### 重点分野
- インドおよびシンガポール全域でのデジタルプラットフォームの拡大。
- 初期のモバイルバンキングおよびSaaS統合の開発。
`
    }
  },
  "insight.enterprise-ai-reference-guide": {
    en: {
      entity_id: "insight.enterprise-ai-reference-guide",
      frontmatter: {
        locale: "en",
        title: "Enterprise AI Reference Guide",
        summary: "A comprehensive reference guide for architecting, deploying, and governing enterprise AI solutions at scale.",
        translation_status: "published",
        last_editorial_review: "2026-06-20",
        seo: {
          title: "Enterprise AI Reference Guide | Rajkumar Rajagobalan",
          description: "Architecting, deploying, and governing enterprise AI solutions at scale.",
          keywords: ["Enterprise AI", "AI Strategy", "AI Governance"]
        }
      },
      content_markdown: "This is the Enterprise AI Reference Guide."
    },
    ja: {
      entity_id: "insight.enterprise-ai-reference-guide",
      frontmatter: {
        locale: "ja",
        title: "エンタープライズAIリファレンスガイド",
        summary: "エンタープライズAIソリューションを大規模に設計、展開、管理するための包括的なリファレンスガイド。",
        translation_status: "approved",
        last_editorial_review: "2026-06-20",
        seo: {
          title: "エンタープライズAIリファレンスガイド | ラジクマール・ラジャゴバラン",
          description: "エンタープライズAIソリューションを大規模に設計、展開、管理するためのリファレンスガイド。",
          keywords: ["エンタープライズAI", "AI戦略", "AIガバナンス"]
        }
      },
      content_markdown: "これはエンタープライズAIリファレンスガイドです。"
    }
  },
  "insight.singapore-ai-strategy": {
    en: {
      entity_id: "insight.singapore-ai-strategy",
      frontmatter: {
        locale: "en",
        title: "Singapore's National AI Strategy",
        summary: "An analytical review of Singapore's strategic goals, implementation status, and ecosystem growth in national artificial intelligence.",
        translation_status: "published",
        last_editorial_review: "2026-06-15",
        seo: {
          title: "Singapore's National AI Strategy | Rajkumar Rajagobalan",
          description: "Singapore's strategic goals, implementation status, and ecosystem growth in AI.",
          keywords: ["Singapore", "AI Strategy", "National AI"]
        }
      },
      content_markdown: "Singapore's National AI Strategy analysis."
    },
    ja: {
      entity_id: "insight.singapore-ai-strategy",
      frontmatter: {
        locale: "ja",
        title: "シンガポールの国家AI戦略と現状",
        summary: "人工知能国家戦略におけるシンガポールの戦略的目標、実施状況、およびエコシステムの成長に関する分析レビュー。",
        translation_status: "approved",
        last_editorial_review: "2026-06-15",
        seo: {
          title: "シンガポールの国家AI戦略 | ラジクマール・ラジャゴバラン",
          description: "シンガポールの国家AI戦略と実装状況に関する分析レビュー。",
          keywords: ["シンガポール", "AI戦略", "国家AI戦略"]
        }
      },
      content_markdown: "シンガポールの国家AI戦略に関する分析。"
    }
  },
  "insight.responsible-ai-governance": {
    en: {
      entity_id: "insight.responsible-ai-governance",
      frontmatter: {
        locale: "en",
        title: "Responsible AI Governance & Adoption",
        summary: "Key frameworks, risk mitigation policies, and adoption principles for deploying trustworthy artificial intelligence.",
        translation_status: "published",
        last_editorial_review: "2026-06-10",
        seo: {
          title: "Responsible AI Governance & Adoption | Rajkumar Rajagobalan",
          description: "Frameworks, risk mitigation, and adoption principles for trustworthy AI.",
          keywords: ["Responsible AI", "AI Governance", "Ethics"]
        }
      },
      content_markdown: "Responsible AI Governance analysis."
    },
    ja: {
      entity_id: "insight.responsible-ai-governance",
      frontmatter: {
        locale: "ja",
        title: "責任あるAIのガバナンスと導入",
        summary: "信頼できる人工知能を展開するための主要なフレームワーク、リスク軽減ポリシー、および導入原則。",
        translation_status: "approved",
        last_editorial_review: "2026-06-10",
        seo: {
          title: "責任あるAIのガバナンスと導入 | ラジクマール・ラジャゴバラン",
          description: "信頼できるAI導入のためのガバナンスフレームワークとリスク管理。",
          keywords: ["責任あるAI", "AIガバナンス", "AI倫理"]
        }
      },
      content_markdown: "責任あるAIガバナンスに関する分析。"
    }
  },
  "insight.ai-executive-talking-points": {
    en: {
      entity_id: "insight.ai-executive-talking-points",
      frontmatter: {
        locale: "en",
        title: "AI Strategy Executive Talking Points",
        summary: "Critical discussion points and framework alignments for board-level and executive presentations on AI capabilities.",
        translation_status: "published",
        last_editorial_review: "2026-06-05",
        seo: {
          title: "AI Executive Talking Points | Rajkumar Rajagobalan",
          description: "Critical talking points and framework alignments on AI for executives.",
          keywords: ["AI Strategy", "Executive Talking Points", "AI Leadership"]
        }
      },
      content_markdown: "Executive Talking Points content."
    },
    ja: {
      entity_id: "insight.ai-executive-talking-points",
      frontmatter: {
        locale: "ja",
        title: "AI戦略エグゼクティブ向けトークポイント",
        summary: "取締役会および経営陣向けのAI能力に関するプレゼンテーションにおける重要な論点とフレームワークの調整。",
        translation_status: "approved",
        last_editorial_review: "2026-06-05",
        seo: {
          title: "エグゼクティブ向けAIトークポイント | ラジクマール・ラジャゴバラン",
          description: "取締役会および経営陣向けAI戦略の重要トークポイント。",
          keywords: ["AI戦略", "経営陣向けトークポイント", "AIリーダーシップ"]
        }
      },
      content_markdown: "エグゼクティブ向けAI戦略トークポイント。"
    }
  },
  "insight.blood-pressure-app-design": {
    en: {
      entity_id: "insight.blood-pressure-app-design",
      frontmatter: {
        locale: "en",
        title: "Wearable UX Design: Blood Pressure Analytics",
        summary: "A user experience study on designing clear, actionable medical and wellness visualizers for consumer wearables.",
        translation_status: "published",
        last_editorial_review: "2026-05-25",
        seo: {
          title: "Wearable UX Design: Blood Pressure | Rajkumar Rajagobalan",
          description: "UX design study for consumer wearable blood pressure tracking.",
          keywords: ["Wearable UX", "Blood Pressure", "HealthTech"]
        }
      },
      content_markdown: "Wearable UX Design: Blood Pressure Analytics."
    },
    ja: {
      entity_id: "insight.blood-pressure-app-design",
      frontmatter: {
        locale: "ja",
        title: "ウェアラブルUXデザイン：血圧分析",
        summary: "消費者向けウェアラブル向けに、明確で実用的な医療およびウェルネスビジュアライザーを設計することに関するユーザーエクスペリエンス研究。",
        translation_status: "approved",
        last_editorial_review: "2026-05-25",
        seo: {
          title: "ウェアラブルUXデザイン：血圧分析 | ラジクマール・ラジャゴバラン",
          description: "消費者向けウェアラブルにおける血圧測定UXデザイン研究。",
          keywords: ["ウェアラブルUX", "血圧分析", "ヘルステック"]
        }
      },
      content_markdown: "ウェアラブルUXデザイン：血圧分析。"
    }
  },
  "framework.enterprise-ai-transformation": {
    en: {
      entity_id: "framework.enterprise-ai-transformation",
      frontmatter: {
        locale: "en",
        title: "Enterprise AI Transformation Framework",
        summary: "An interactive, multi-dimensional framework to assess, align, and accelerate corporate AI transformation maturity.",
        translation_status: "published",
        last_editorial_review: "2026-06-18"
      },
      content_markdown: "Enterprise AI Transformation Framework v1.2.0."
    },
    ja: {
      entity_id: "framework.enterprise-ai-transformation",
      frontmatter: {
        locale: "ja",
        title: "エンタープライズAI変革フレームワーク",
        summary: "企業のAI変革の成熟度を評価、調整、および加速するための、インタラクティブで多次元のフレームワーク。",
        translation_status: "approved",
        last_editorial_review: "2026-06-18"
      },
      content_markdown: "エンタープライズAI変革フレームワーク v1.2.0。"
    }
  },
  "app.ai-transformation-command-center": {
    en: {
      entity_id: "app.ai-transformation-command-center",
      frontmatter: {
        locale: "en",
        title: "AI Transformation Command Center",
        summary: "An interactive operational dashboard to simulate, track, and monitor organization-wide AI initiatives and governance.",
        translation_status: "published",
        last_editorial_review: "2026-06-22"
      },
      content_markdown: "AI Transformation Command Center dashboard."
    },
    ja: {
      entity_id: "app.ai-transformation-command-center",
      frontmatter: {
        locale: "ja",
        title: "AI変革コマンドセンター",
        summary: "組織全体のAIイニシアチブとガバナンスをシミュレート、追跡、および監視するためのインタラクティブなオペレーショナルダッシュボード。",
        translation_status: "approved",
        last_editorial_review: "2026-06-22"
      },
      content_markdown: "AI変革コマンドセンター ダッシュボード。"
    }
  },
  "app.foodie": {
    en: {
      entity_id: "app.foodie",
      frontmatter: {
        locale: "en",
        title: "Foodie PWA",
        summary: "A mobile-first recipe generator and nutritional assistant utilizing local-first client database and Gemini API.",
        translation_status: "published",
        last_editorial_review: "2026-05-30"
      },
      content_markdown: "Foodie recipe assistant."
    },
    ja: {
      entity_id: "app.foodie",
      frontmatter: {
        locale: "ja",
        title: "Foodie PWA",
        summary: "ローカルファーストのクライアントデータベースとGemini APIを活用した、モバイルファーストのレシピジェネレーターおよび栄養アシスタント。",
        translation_status: "approved",
        last_editorial_review: "2026-05-30"
      },
      content_markdown: "Foodie レシピ アシスタント。"
    }
  },
  "guide.crewai": {
    en: {
      entity_id: "guide.crewai",
      frontmatter: {
        locale: "en",
        title: "CrewAI Developer Guide",
        summary: "A comprehensive handbook for building multi-agent systems, task hierarchies, and custom tool adapters using CrewAI.",
        translation_status: "published",
        last_editorial_review: "2026-06-08"
      },
      content_markdown: "CrewAI Developer Guide handbook."
    },
    ja: {
      entity_id: "guide.crewai",
      frontmatter: {
        locale: "ja",
        title: "CrewAI 開発者ガイド",
        summary: "CrewAIを使用してマルチエージェントシステム、タスク階層、およびカスタムツールアダプターを構築するための包括的なハンドブック。",
        translation_status: "approved",
        last_editorial_review: "2026-06-08"
      },
      content_markdown: "CrewAI 開発者ガイド ハンドブック。"
    }
  }
};

const mockMedia: Record<string, MediaCatalog> = {
  "education.stanford-executive-program": {
    entity_id: "education.stanford-executive-program",
    media: [
      {
        id: "img.stanford-campus",
        type: "image",
        url: "/images/stanford-campus.jpg",
        mime_type: "image/jpeg",
        locale: "all",
        permissions: "public",
        alt_text: {
          en: "Stanford GSB Campus",
          ja: "スタンフォード大学GSBキャンパス"
        }
      }
    ]
  }
};

export class MockDatabaseProvider implements DatabaseProvider {
  async getEntity(id: string): Promise<EntityMetadata | null> {
    return mockEntities[id] || null;
  }

  async getTranslation(entityId: string, locale: string): Promise<FullTranslation | null> {
    return mockTranslations[entityId]?.[locale] || null;
  }

  async listEntities(type?: EntityType): Promise<EntityMetadata[]> {
    const list = Object.values(mockEntities);
    if (type) {
      return list.filter((e) => e.type === type);
    }
    return list;
  }

  async getMediaCatalog(entityId: string): Promise<MediaCatalog | null> {
    return mockMedia[entityId] || null;
  }

  async searchSimilarContent(
    embedding: number[],
    limit: number = 3
  ): Promise<Array<{ entity_id: string; locale: string; title: string; content: string; score: number }>> {
    return [
      {
        entity_id: "education.stanford-executive-program",
        locale: "en",
        title: "Stanford Executive Program",
        content: "Stanford GSB Executive Education. Covers global strategy and organization management.",
        score: 0.89
      },
      {
        entity_id: "venture.nuvear",
        locale: "en",
        title: "Nuvear Tech",
        content: "Nuvear Tech Pte Ltd. Wearable health analytics integration using HealthKitSync.",
        score: 0.82
      }
    ].slice(0, limit);
  }
}
