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
  "framework.enterprise-ai-transformation": {
    id: "framework.enterprise-ai-transformation",
    type: "framework",
    canonical_slug: "enterprise-ai-transformation",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["framework_hero", "component_grid"],
    version: "1.0.0",
    start_date: "2026-06"
  },
  "app.foodie": {
    id: "app.foodie",
    type: "app",
    canonical_slug: "foodie",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["app_dashboard"],
    app_url: "https://foodie.rajagobalan.com",
    start_date: "2026-06"
  },
  "insight.singapore-ai-strategy": {
    id: "insight.singapore-ai-strategy",
    type: "insight",
    canonical_slug: "singapore-ai-strategy",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["article_section", "related_entities"],
    category: "AI Strategy",
    tags: ["AI", "Singapore", "Strategy"],
    start_date: "2026-06"
  },
  "insight.responsible-ai-governance": {
    id: "insight.responsible-ai-governance",
    type: "insight",
    canonical_slug: "responsible-ai-governance",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["article_section", "related_entities"],
    category: "AI Governance",
    tags: ["Governance", "Responsible AI", "AI"],
    start_date: "2026-06"
  },
  "insight.ai-executive-talking-points": {
    id: "insight.ai-executive-talking-points",
    type: "insight",
    canonical_slug: "ai-executive-talking-points",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["article_section", "related_entities"],
    category: "Enterprise AI",
    tags: ["Executive", "Talking Points", "AI"],
    start_date: "2026-06"
  },
  "insight.blood-pressure-app-design": {
    id: "insight.blood-pressure-app-design",
    type: "insight",
    canonical_slug: "blood-pressure-app-design",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["article_section", "related_entities"],
    category: "HealthTech",
    tags: ["HealthTech", "UX", "Blood Pressure", "App Design"],
    start_date: "2026-06"
  },
  "app.bp-chart": {
    id: "app.bp-chart",
    type: "app",
    canonical_slug: "bp-chart",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["app_dashboard"],
    app_url: "https://bp.rajagobalan.com",
    start_date: "2026-06"
  },
  "app.ai-transformation-command-center": {
    id: "app.ai-transformation-command-center",
    type: "app",
    canonical_slug: "ai-transformation-command-center",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["app_dashboard"],
    app_url: "https://commandcenter.rajagobalan.com",
    start_date: "2026-06"
  },
  "guide.platform-deployment-guide": {
    id: "guide.platform-deployment-guide",
    type: "guide",
    canonical_slug: "platform-deployment-guide",
    visibility: "public",
    publish_status: "published",
    sensitivity: "public",
    agent_use: true,
    claims_policy: {
      may_summarize: true,
      may_infer_relationships: true,
      may_change_credential_wording: false
    },
    ui_capabilities: ["article_section", "related_entities"],
    category: "Deployment",
    tags: ["Deployment", "Guide", "Command Center"],
    start_date: "2026-06"
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
  "framework.enterprise-ai-transformation": {
    en: {
      entity_id: "framework.enterprise-ai-transformation",
      frontmatter: {
        locale: "en",
        title: "Enterprise AI Transformation Framework",
        summary: "A comprehensive framework for driving enterprise AI adoption, governance, and technology transformation.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Framework Overview

This framework establishes the operational structure for scaling AI across the enterprise.

### Core Pillars
1. **AI Strategy & Alignment**: Defining clear, value-driven use cases.
2. **Responsible AI Governance**: Safe, secure, and compliance-oriented execution.
3. **Data & Infrastructure**: Readying platforms and data loops.
`
    },
    ja: {
      entity_id: "framework.enterprise-ai-transformation",
      frontmatter: {
        locale: "ja",
        title: "エンタープライズAI変革フレームワーク",
        summary: "エンタープライズAIの導入、ガバナンス、および技術変革を推進するための包括的なフレームワーク。",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## フレームワークの概要

このフレームワークは、企業全体でAIをスケールさせるための運用構造を確立します。

### 主要な柱
1. **AI戦略とアライメント**: 明確で価値重視のユースケースの定義。
2. **責任あるAIガバナンス**: 安全、確実、かつコンプライアンスを重視した実行。
3. **データとインフラストラクチャ**: プラットフォームとデータループの整備。
`
    }
  },
  "app.foodie": {
    en: {
      entity_id: "app.foodie",
      frontmatter: {
        locale: "en",
        title: "Foodie App",
        summary: "A smart, Gemini-powered culinary assistant and meal planning application.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Foodie Culinary Assistant

A generative AI culinary helper built with Gemini API.

### Features
- Ingredient-based recipe generation.
- Dynamic shopping list conversion.
- Automated diet plan checks.
`
    },
    ja: {
      entity_id: "app.foodie",
      frontmatter: {
        locale: "ja",
        title: "Foodie アプリ",
        summary: "スマートなGemini搭載の料理アシスタントおよび食事計画アプリケーション。",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Foodie 料理アシスタント

Gemini APIを使用して構築された生成AI料理ヘルパー。

### 特徴
- 食材ベースのレシピ生成。
- 動的なショッピングリスト変換。
- 自動化された食事プランのチェック。
`
    }
  },
  "insight.singapore-ai-strategy": {
    en: {
      entity_id: "insight.singapore-ai-strategy",
      frontmatter: {
        locale: "en",
        title: "Singapore's National AI Strategy 2.0",
        summary: "An analysis of Singapore's National AI Strategy 2.0 and its implications for enterprise transformation.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## National AI Strategy 2.0 (NAIS 2.0)

Singapore's updated AI strategy aims to anchor the country as a global AI hub by fostering innovation, talent development, and responsible AI guardrails.

### Strategic Thrusts
- **Talent Development**: Up-skilling the local workforce.
- **Trusted Ecosystem**: Standardizing model safety assessments.
`
    },
    ja: {
      entity_id: "insight.singapore-ai-strategy",
      frontmatter: {
        locale: "ja",
        title: "シンガポール国家AI戦略 2.0",
        summary: "シンガポールの国家AI戦略2.0の分析と、エンタープライズ変革への影響。",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## 国家AI戦略 2.0 (NAIS 2.0)

シンガポールの更新されたAI戦略は、イノベーション、人材育成、および責任あるAIガードレールを育成することにより、同国をグローバルAIハブとして固定することを目指しています。

### 戦略的重点
- **人材開発**: ローカルの労働力のスキル向上。
- **信頼できるエコシステム**: モデルの安全性評価の標準化。
`
    }
  },
  "insight.responsible-ai-governance": {
    en: {
      entity_id: "insight.responsible-ai-governance",
      frontmatter: {
        locale: "en",
        title: "Responsible AI Governance in the Enterprise",
        summary: "Frameworks and adoption pathways for responsible and ethical AI deployment in enterprise settings.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Responsible AI Principles

Implementing ethical governance processes around AI deployment is critical for enterprise trust.

### Governance Checklist
- Transparency and Explainability
- Fairness and Bias mitigation
- Data privacy and robust protection
`
    },
    ja: {
      entity_id: "insight.responsible-ai-governance",
      frontmatter: {
        locale: "ja",
        title: "企業における責任あるAIガバナンス",
        summary: "企業環境における責任ある倫理的なAI導入のためのフレームワークと導入プロセス。",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## 責任あるAI原則

AI導入における倫理的なガバナンスプロセスの実装は、企業の信頼性にとって不可欠です。

### ガバナンスチェックリスト
- 透明性と説明可能性
- 公平性とバイアスの軽減
- データのプライバシーと堅牢な保護
`
    }
  },
  "insight.ai-executive-talking-points": {
    en: {
      entity_id: "insight.ai-executive-talking-points",
      frontmatter: {
        locale: "en",
        title: "AI Executive Talking Points",
        summary: "Key talking points and strategic insights for executives leading AI transformations.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Executive Talking Points

Important takeaways for board members and executive stakeholders.

### Priorities
- Balancing innovation speed with governance risk.
- Workforce reallocation and structural transition.
`
    },
    ja: {
      entity_id: "insight.ai-executive-talking-points",
      frontmatter: {
        locale: "ja",
        title: "AIエグゼクティブ向けトーキングポイント",
        summary: "AI変革を主導するエグゼクティブ向けの主要な議論ポイントと戦略的洞察。",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## エグゼクティブ向けトーキングポイント

取締役や経営陣のステークホルダー向けの重要な要点。

### 優先事項
- イノベーションの速度とガバナンスリスクのバランス。
- 人材の再配置と構造的移行。
`
    }
  },
  "insight.blood-pressure-app-design": {
    en: {
      entity_id: "insight.blood-pressure-app-design",
      frontmatter: {
        locale: "en",
        title: "Blood Pressure App UX Design Case Study",
        summary: "A case study on the user experience and design considerations for a blood pressure monitoring app.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## UX Case Study: Blood Pressure Monitoring

Designing for patient compliance and accuracy in digital health records.

### UX Design Goals
- High legibility and simple input forms.
- Dynamic visual feedback loops.
`
    },
    ja: {
      entity_id: "insight.blood-pressure-app-design",
      frontmatter: {
        locale: "ja",
        title: "血圧管理アプリのUX設計ケーススタディ",
        summary: "血圧モニタリングアプリのユーザーエクスペリエンスと設計上の考慮事項に関するケーススタディ。",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## UXケーススタディ: 血圧管理

デジタル健康記録における患者のコンプライアンスと正確性のための設計。

### UX設計の目標
- 高い視認性とシンプルな入力フォーム。
- 動的なビジュアルフィードバックループ。
`
    }
  },
  "app.bp-chart": {
    en: {
      entity_id: "app.bp-chart",
      frontmatter: {
        locale: "en",
        title: "Blood Pressure Chart Workspace",
        summary: "An interactive blood pressure tracking and charting dashboard.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Blood Pressure Tracking Workspace

Interactive visualization tools for medical metrics tracking.

### Modules
- Time-series systolic/diastolic chart.
- Custom CSV export.
`
    },
    ja: {
      entity_id: "app.bp-chart",
      frontmatter: {
        locale: "ja",
        title: "血圧チャート・ワークスペース",
        summary: "インタラクティブな血圧トラッキングおよびチャートダッシュボード。",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## 血圧追跡ワークスペース

医療指標の追跡のためのインタラクティブな視覚化ツール。

### モジュール
- 時系列の収縮期/拡張期血圧チャート。
- カスタムCSVエクスポート。
`
    }
  },
  "app.ai-transformation-command-center": {
    en: {
      entity_id: "app.ai-transformation-command-center",
      frontmatter: {
        locale: "en",
        title: "AI Transformation Command Center",
        summary: "A centralized control center and dashboard for monitoring enterprise AI transformations.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Command Center Console

Tracking transformation initiatives, deployment cycles, and value metrics in real-time.

### Consoles
- Project KPI dashboard.
- Safe LLM token usage tracking.
`
    },
    ja: {
      entity_id: "app.ai-transformation-command-center",
      frontmatter: {
        locale: "ja",
        title: "AI変革コマンドセンター",
        summary: "エンタープライズAI変革の進捗状況を監視するための一元化されたコントロールセンターとダッシュボード。",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## コマンドセンター・コンソール

変革イニシアチブ、デプロイサイクル、および価値指標をリアルタイムで追跡します。

### コンソール
- プロジェクトKPIダッシュボード。
- 安全なLLMトークン使用量の追跡。
`
    }
  },
  "guide.platform-deployment-guide": {
    en: {
      entity_id: "guide.platform-deployment-guide",
      frontmatter: {
        locale: "en",
        title: "Platform Deployment Guide",
        summary: "A step-by-step deployment guide for the AI Transformation Command Center.",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## Platform Deployment Manual

Deploying enterprise-grade dashboard orchestration on cloud instances.

### Prerequisites
- Node.js version 18 or above.
- Secure API endpoints configurations.
`
    },
    ja: {
      entity_id: "guide.platform-deployment-guide",
      frontmatter: {
        locale: "ja",
        title: "プラットフォームデプロポイガイド",
        summary: "AI変革コマンドセンターのステップバイステップのデプロイガイド。",
        translation_status: "published",
        last_editorial_review: "2026-06-24"
      },
      content_markdown: `
## プラットフォームデプロイマニュアル

クラウドインスタンス上にエンタープライズグレードのダッシュボードオーケストレーションをデプロイします。

### 前提条件
- Node.js バージョン18以上。
- 安全なAPIエンドポイント設定。
`
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
