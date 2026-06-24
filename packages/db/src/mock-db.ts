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
