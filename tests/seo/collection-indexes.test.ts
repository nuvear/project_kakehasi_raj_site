import { describe, expect, test } from "vitest";
import { listCollectionItems } from "../../apps/web/lib/collection-index";
import { getMarketingSitemapEntries } from "../../apps/web/lib/marketing-sitemap";
import { shouldSkipLocalePrefix } from "../../apps/web/lib/i18n";
import {
  languageSwitchPath,
  siteNavHref,
} from "../../apps/web/lib/site-nav";

process.env.MOCK_DB = "true";
delete process.env.FIREBASE_PROJECT_ID;
delete process.env.KAKEHASHI_CONTENT_DIR;

describe("collection index listings", () => {
  test("experience index lists live role pages in both locales", async () => {
    const en = await listCollectionItems("experience", "en");
    const ja = await listCollectionItems("experience", "ja");
    const enHrefs = en.map((item) => item.href);
    const jaHrefs = ja.map((item) => item.href);

    expect(enHrefs).toContain("/en/experience/capgemini-apac-delivery-gpo");
    expect(enHrefs).toContain("/en/experience/capgemini-japan");
    expect(enHrefs).toContain("/en/experience/hcl-eli-lilly-co-innovation-lab");
    expect(jaHrefs).toContain("/ja/experience/capgemini-apac-delivery-gpo");
    expect(en.length).toBe(ja.length);
    expect(en.length).toBeGreaterThanOrEqual(5);
  });

  test("education index lists live programme pages", async () => {
    const items = await listCollectionItems("education", "en");
    const hrefs = items.map((item) => item.href);

    expect(hrefs).toContain("/en/education/stanford-executive-program");
    expect(hrefs).toContain("/en/education/mit-coo-program");
    expect(items.length).toBeGreaterThanOrEqual(5);
  });

  test("ventures index keeps P0.2 facts and lists live children", async () => {
    const items = await listCollectionItems("ventures", "en");
    const bySlug = Object.fromEntries(items.map((item) => [item.slug, item]));

    expect(Object.keys(bySlug).sort()).toEqual(["aagnaa", "innuir", "nuvear"]);
    expect(bySlug.nuvear.meta).toContain("Founder");
    expect(bySlug.nuvear.meta).toContain("Oct 2025");
    expect(bySlug.innuir.meta).toContain("CEO and Founder");
    expect(bySlug.innuir.meta).toContain("Aug 2026");
    expect(bySlug.aagnaa.meta).toMatch(/Earlier/);
    expect(bySlug.innuir.href).toBe("/en/ventures/innuir");
    expect(bySlug.nuvear.href).toBe("/en/ventures/nuvear");
    expect(bySlug.aagnaa.href).toBe("/en/ventures/aagnaa");
  });

  test("apps index lists the live command center and omits to-do-list", async () => {
    const items = await listCollectionItems("apps", "en");
    const hrefs = items.map((item) => item.href);

    expect(hrefs).toContain("/en/apps/ai-transformation-command-center");
    expect(hrefs.some((href) => href.includes("to-do-list"))).toBe(false);
    expect(items).toHaveLength(1);
  });
});

describe("interior nav points at collection indexes", () => {
  test("home keeps in-page hashes; interior pages use index URLs", () => {
    expect(siteNavHref("experience", "en", true)).toBe("/en#experience");
    expect(siteNavHref("education", "ja", true)).toBe("/ja#education");
    expect(siteNavHref("ventures", "en", true)).toBe("/en#ventures");
    expect(siteNavHref("credentials", "en", true)).toBe("/en#credentials");

    expect(siteNavHref("experience", "en", false)).toBe("/en/experience");
    expect(siteNavHref("education", "ja", false)).toBe("/ja/education");
    expect(siteNavHref("ventures", "en", false)).toBe("/en/ventures");
    expect(siteNavHref("credentials", "en", false)).toBe("/en/credentials");
    expect(siteNavHref("apps", "en", true)).toBe("/en/apps");
    expect(siteNavHref("apps", "ja", false)).toBe("/ja/apps");
    expect(siteNavHref("insights", "en", true)).toBe("/en/insights");
  });

  test("language switch stays on the same collection index", () => {
    expect(languageSwitchPath("experience", "en")).toBe("/ja/experience");
    expect(languageSwitchPath("apps", "ja")).toBe("/en/apps");
    expect(languageSwitchPath("home", "en")).toBe("/ja");
    expect(languageSwitchPath("none", "en", "/ja/experience/capgemini-japan")).toBe(
      "/ja/experience/capgemini-japan",
    );
  });
});

describe("unprefixed collection paths stay locale-prefixed by middleware", () => {
  test("experience, education, ventures, and apps indexes are not skipped", () => {
    expect(shouldSkipLocalePrefix("/experience")).toBe(false);
    expect(shouldSkipLocalePrefix("/education")).toBe(false);
    expect(shouldSkipLocalePrefix("/ventures")).toBe(false);
    expect(shouldSkipLocalePrefix("/apps")).toBe(false);
  });
});

describe("sitemap lists collection indexes", () => {
  test("adds en/ja experience, education, ventures, and apps indexes", async () => {
    const urls = (await getMarketingSitemapEntries()).map((entry) => entry.url);
    const indexes = ["/experience", "/education", "/ventures", "/apps"];

    for (const locale of ["en", "ja"]) {
      for (const index of indexes) {
        expect(urls).toContain(`https://www.rajagobalan.com/${locale}${index}`);
      }
    }
  });
});
