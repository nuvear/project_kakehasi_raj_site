export interface ProfileCredential {
  category: string;
  issuer: string;
  items?: string[];
  relatedHref?: string;
  summary: string;
  title: string;
  year: string;
}

const credentials: ProfileCredential[] = [
  {
    category: "Executive Leadership",
    issuer: "Stanford Graduate School of Business",
    relatedHref: "/education/stanford-executive-program",
    summary: "Professional certificate associated with the Stanford Executive Program.",
    title: "Stanford GSB Professional Certificate",
    year: "2026",
  },
  {
    category: "MIT Executive Education",
    issuer: "Massachusetts Institute of Technology",
    items: [
      "MIT Chief Operating Officer Program",
      "MIT Designing and Building AI Products and Services",
      "MIT IoT Design and Application",
      "MIT No Code AI and Machine Learning",
    ],
    relatedHref: "/education/mit-coo-program",
    summary: "Four MIT credentials across COO leadership, AI product strategy, IoT, and no-code machine learning.",
    title: "MIT Executive, AI, and IoT Programs",
    year: "2023",
  },
  {
    category: "Generative AI",
    issuer: "AWS Partner",
    summary: "Generative AI essentials for partner-led solution delivery.",
    title: "AWS Partner Generative AI Essentials",
    year: "2024",
  },
  {
    category: "Blockchain",
    issuer: "Blockchain Training Alliance",
    summary: "Certified blockchain solution architecture.",
    title: "BTA Certified Blockchain Solution Architect",
    year: "2019",
  },
  {
    category: "Data Science",
    issuer: "EMC",
    summary: "Foundational data science associate credential.",
    title: "EMC Data Science Associate",
    year: "2013",
  },
];

export function getProfileCredentials(locale: string) {
  const isJa = locale === "ja";

  return {
    copy: {
      badge: isJa ? "資格" : "Credentials",
      title: isJa ? "資格・認定" : "Credentials and Certifications",
      summary: isJa
        ? "エグゼクティブリーダーシップ、AI、IoT、ブロックチェーン、データサイエンスにまたがる認定資格。"
        : "Certifications spanning executive leadership, AI, IoT, blockchain, and data science.",
      backLabel: isJa ? "ホームへ戻る" : "Back to Home",
      relatedLabel: isJa ? "関連ページ" : "Related page",
      yearLabel: isJa ? "年" : "Year",
      issuerLabel: isJa ? "発行機関" : "Issuer",
      categoryLabel: isJa ? "領域" : "Area",
    },
    credentials,
  };
}
