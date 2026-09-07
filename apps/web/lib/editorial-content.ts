import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import { FullTranslationSchema } from "@kakehashi/content-schema";

// Only reviewed learning/product copy is file-published. Profile records stay in Firestore.
const reviewedFolders: Record<string, string> = {
  "insight.enterprise-ai-reference-guide": "insights/enterprise-ai-reference-guide",
  "app.ai-transformation-command-center": "apps/ai-transformation-command-center",
};
export function getReviewedTranslation(entityId: string, locale: string) {
  const folder = reviewedFolders[entityId];
  if (!folder) return null;
  if (locale !== "en" && locale !== "ja") throw new Error("Unsupported editorial locale");
  const roots = process.env.KAKEHASHI_CONTENT_DIR
    ? [process.env.KAKEHASHI_CONTENT_DIR]
    : [path.resolve(process.cwd(), "content"), path.resolve(process.cwd(), "../../content")];
  const root = roots.find((p) => fs.existsSync(path.join(p, folder, `${locale}.md`)));
  if (!root) throw new Error("Reviewed content is missing from this release");
  const source = fs.readFileSync(path.join(root, folder, `${locale}.md`), "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("Reviewed content frontmatter is invalid");
  return FullTranslationSchema.parse({entity_id: entityId, frontmatter: yaml.load(match[1]), content_markdown: match[2].trim()});
}
export function getReferenceGuide(locale: string) {
  const guide = getReviewedTranslation("insight.enterprise-ai-reference-guide", locale)!;
  return { ...guide.frontmatter, last_editorial_review: guide.frontmatter.last_editorial_review ?? "", content: guide.content_markdown };
}
