import { describe, expect, test } from "vitest";
import { headingId } from "../../apps/web/lib/markdown-headings";
import { getReferenceGuide } from "../../apps/web/lib/editorial-content";
import { isPublicEntity } from "../../apps/web/lib/public-entities";
import { MockDatabaseProvider } from "../../packages/db/src/mock-db";

describe("reviewed public content", () => {
  test("keeps old published database records out of public discovery", async () => {
    const db = new MockDatabaseProvider();
    const framework = await db.getEntity("framework.enterprise-ai-transformation");
    expect(framework).not.toBeNull();
    expect(isPublicEntity({...framework!, publish_status: "published"})).toBe(false);
    expect((await db.listEntities()).filter(isPublicEntity).map(e => e.id)).not.toContain("app.to-do-list");
  });
  test("guide chapter anchors are unique, nonempty and retain Japanese text", () => {
    for (const locale of ["en", "ja"]) {
      const guide = getReferenceGuide(locale);
      const headings = [...guide.content.matchAll(/^#{1,2} (.+)$/gm)].map(m => headingId(m[1]));
      expect(headings.every(Boolean)).toBe(true);
      expect(new Set(headings).size).toBe(headings.length);
    }
    expect(headingId("このガイドの使い方")).toBe("このガイドの使い方");
  });
  test("editorial reader rejects unsupported locale paths", () => {
    expect(() => getReferenceGuide("../../profile/about/en")).toThrow("Unsupported editorial locale");
  });
});

describe("public API publication boundary", () => {
  test("hides retired records and replaces stale GATE text while keeping biography intact", async () => {
    const { publicationView } = await import("../../apps/web/lib/public-database");
    const source = new MockDatabaseProvider();
    const oldTranslation = source.getTranslation.bind(source);
    source.getTranslation = async (id, locale) => id === "app.ai-transformation-command-center"
      ? {...(await oldTranslation(id, locale))!, content_markdown: "OLD DEMO ROI CLAIM"}
      : oldTranslation(id, locale);
    source.searchSimilarContent = async () => [
      {entity_id: "framework.enterprise-ai-transformation", locale: "en", title: "Old framework", content: "OLD FRAMEWORK", score: 1},
      {entity_id: "app.ai-transformation-command-center", locale: "en", title: "Old demo", content: "OLD DEMO ROI CLAIM", score: .9},
    ];
    const publicDb = publicationView(source);
    expect(await publicDb.getEntity("framework.enterprise-ai-transformation")).toBeNull();
    expect(await publicDb.getTranslation("framework.enterprise-ai-transformation", "en")).toBeNull();
    const gate = await publicDb.getTranslation("app.ai-transformation-command-center", "en");
    expect(gate?.frontmatter.title).toContain("GATE");
    expect(gate?.content_markdown).not.toContain("OLD DEMO ROI CLAIM");
    expect(await publicDb.getTranslation("profile.about", "en")).toEqual(await oldTranslation("profile.about", "en"));
    const results = await publicDb.searchSimilarContent([0], 3);
    expect(results).toHaveLength(1);
    expect(results[0].title).toContain("GATE");
    expect(results[0].content).not.toContain("OLD DEMO ROI CLAIM");
    expect(await publicDb.getTranslation("app.ai-transformation-command-center", "../../secrets")).toBeNull();
  });
});
