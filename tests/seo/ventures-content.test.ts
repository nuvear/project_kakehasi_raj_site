import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import { describe, expect, test } from "vitest";

const contentRoot = path.join(__dirname, "../../content/ventures");

function loadEntity(slug: string) {
  const raw = fs.readFileSync(
    path.join(contentRoot, slug, "entity.yaml"),
    "utf-8",
  );
  return yaml.load(raw) as Record<string, unknown>;
}

function loadLocale(slug: string, locale: "en" | "ja") {
  const raw = fs.readFileSync(
    path.join(contentRoot, slug, `${locale}.md`),
    "utf-8",
  );
  const parts = raw.split("---");
  const frontmatter = (yaml.load(parts[1]) || {}) as Record<string, unknown>;
  return { frontmatter, body: parts.slice(2).join("---") };
}

describe("venture content matches operator facts", () => {
  test("Nuvear is a current venture founded in October 2025", () => {
    const entity = loadEntity("nuvear");
    const en = loadLocale("nuvear", "en");
    const ja = loadLocale("nuvear", "ja");

    expect(entity.company_name).toBe("Nuvear");
    expect(entity.role).toBe("Founder");
    expect(entity.start_date).toBe("2025-10");
    expect(entity.end_date).toBeNull();
    expect(en.frontmatter.summary).toBe(
      "Current venture. Founder since October 2025.",
    );
    expect(ja.frontmatter.summary).toBe("現在の事業。2025年10月より創業者。");
    expect(en.body).toContain("founder since October 2025");
    expect(ja.body).toContain("2025年10月から創業者");
  });

  test("Innuir is a current venture with CEO and Founder since August 2026", () => {
    const entity = loadEntity("innuir");
    const en = loadLocale("innuir", "en");
    const ja = loadLocale("innuir", "ja");

    expect(entity.company_name).toBe("Innuir");
    expect(entity.role).toBe("CEO and Founder");
    expect(entity.start_date).toBe("2026-08");
    expect(entity.end_date).toBeNull();
    expect(en.frontmatter.summary).toBe(
      "Current venture. CEO and Founder since August 2026. Product development and patent filing are in progress.",
    );
    expect(ja.frontmatter.summary).toBe(
      "現在の事業。2026年8月よりCEO兼創業者。製品開発と特許出願を進めています。",
    );
    expect(en.body).toContain("Product development and patent filing are in progress.");
    expect(en.body).not.toMatch(/HealthKit|connected health|patent number/i);
    expect(ja.body).toContain("製品開発と特許出願を進めています。");
  });

  test("AAGNAA is an earlier venture with the existing date range", () => {
    const entity = loadEntity("aagnaa");
    const en = loadLocale("aagnaa", "en");
    const ja = loadLocale("aagnaa", "ja");

    expect(entity.role).toBe("Co-Founder & Director");
    expect(entity.start_date).toBe("2011-09");
    expect(entity.end_date).toBe("2020-02");
    expect(String(en.frontmatter.summary)).toMatch(/^Earlier venture\./);
    expect(String(ja.frontmatter.summary)).toMatch(/^以前の事業。/);
    expect(en.body).toContain("earlier venture");
    expect(en.body).toContain("September 2011 to February 2020");
    expect(ja.body).toContain("以前の事業");
    expect(en.body).not.toMatch(/\$700K|IoT\/AR\/VR/);
  });
});
