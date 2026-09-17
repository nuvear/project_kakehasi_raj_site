import { describe, expect, test } from "vitest";
import robots from "../../apps/web/app/robots";
import {
  hasPublicLocalePrefix,
  isCrawlerFilePath,
  isPublicLocale,
  shouldSkipLocalePrefix,
} from "../../apps/web/lib/i18n";
import { getMarketingSitemapEntries } from "../../apps/web/lib/marketing-sitemap";

process.env.MOCK_DB = "true";
delete process.env.FIREBASE_PROJECT_ID;

describe("locale prefix middleware helpers", () => {
  test("treats only en and ja as public locales", () => {
    expect(isPublicLocale("en")).toBe(true);
    expect(isPublicLocale("ja")).toBe(true);
    expect(isPublicLocale("robots.txt")).toBe(false);
    expect(isPublicLocale("fr")).toBe(false);
  });

  test("does not locale-prefix crawler files or other dotted first segments", () => {
    expect(isCrawlerFilePath("/robots.txt")).toBe(true);
    expect(isCrawlerFilePath("/sitemap.xml")).toBe(true);
    expect(shouldSkipLocalePrefix("/robots.txt")).toBe(true);
    expect(shouldSkipLocalePrefix("/sitemap.xml")).toBe(true);
    expect(shouldSkipLocalePrefix("/ads.txt")).toBe(true);
    expect(shouldSkipLocalePrefix("/manifest.json")).toBe(true);
    expect(hasPublicLocalePrefix("/robots.txt")).toBe(false);
  });

  test("still prefixes ordinary marketing paths and leaves localized ones alone", () => {
    expect(shouldSkipLocalePrefix("/credentials")).toBe(false);
    expect(shouldSkipLocalePrefix("/insights")).toBe(false);
    expect(hasPublicLocalePrefix("/en")).toBe(true);
    expect(hasPublicLocalePrefix("/ja/insights")).toBe(true);
    expect(shouldSkipLocalePrefix("/apps/ai-transformation-command-center")).toBe(
      true,
    );
    expect(shouldSkipLocalePrefix("/api/ingest")).toBe(true);
  });
});

describe("robots.txt metadata", () => {
  test("points crawlers at the XML sitemap and keeps /diary out of the index", () => {
    const document = robots();
    expect(document.sitemap).toBe("https://www.rajagobalan.com/sitemap.xml");
    expect(document.host).toBe("https://www.rajagobalan.com");
    const rules = Array.isArray(document.rules) ? document.rules[0] : document.rules;
    expect(rules.allow).toBe("/");
    expect(rules.disallow).toEqual(["/diary", "/diary/"]);
  });
});

describe("marketing XML sitemap", () => {
  test("lists live en/ja marketing URLs and omits diary", async () => {
    const entries = await getMarketingSitemapEntries();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://www.rajagobalan.com/en");
    expect(urls).toContain("https://www.rajagobalan.com/ja");
    expect(urls).toContain("https://www.rajagobalan.com/en/insights");
    expect(urls).toContain(
      "https://www.rajagobalan.com/ja/frameworks/enterprise-ai-transformation",
    );
    expect(urls).toContain(
      "https://www.rajagobalan.com/en/apps/ai-transformation-command-center",
    );
    expect(urls).toContain(
      "https://www.rajagobalan.com/en/apps/ai-transformation-command-center/docs/deployment",
    );
    expect(urls).toContain(
      "https://www.rajagobalan.com/en/experience/capgemini-apac-delivery-gpo",
    );
    expect(urls).toContain("https://www.rajagobalan.com/en/ventures/nuvear");
    expect(urls).toContain("https://www.rajagobalan.com/en/credentials");

    expect(urls.some((url) => url.includes("/diary"))).toBe(false);
    expect(urls.some((url) => url.includes("/100days"))).toBe(false);
    expect(urls.some((url) => url.includes("to-do-list"))).toBe(false);
    expect(urls.some((url) => url.includes("/ventures/innuir"))).toBe(false);

    const home = entries.find(
      (entry) => entry.url === "https://www.rajagobalan.com/en",
    );
    expect(home?.alternates?.languages).toMatchObject({
      en: "https://www.rajagobalan.com/en",
      ja: "https://www.rajagobalan.com/ja",
    });
  });
});
