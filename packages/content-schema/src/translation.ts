import { z } from "zod";
import { LocalizedTextSchema } from "./media.js"; // Use .js extension for TS ESM compatibility

export const LocaleEnum = z.enum(["en", "ja"]);

export const TranslationStatusEnum = z.enum([
  "missing",
  "draft_machine",
  "draft_human",
  "review_required",
  "approved",
  "published",
  "stale"
]);

export const SEOMetadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).default([])
});

export const TranslationFrontmatterSchema = z.object({
  locale: LocaleEnum,
  title: z.string(),
  summary: z.string(),
  translation_status: TranslationStatusEnum.default("draft_machine"),
  last_editorial_review: z.string().optional(), // YYYY-MM-DD
  seo: SEOMetadataSchema.optional()
});

export const FullTranslationSchema = z.object({
  entity_id: z.string(),
  frontmatter: TranslationFrontmatterSchema,
  content_markdown: z.string()
});

export type Locale = z.infer<typeof LocaleEnum>;
export type TranslationStatus = z.infer<typeof TranslationStatusEnum>;
export type SEOMetadata = z.infer<typeof SEOMetadataSchema>;
export type TranslationFrontmatter = z.infer<typeof TranslationFrontmatterSchema>;
export type FullTranslation = z.infer<typeof FullTranslationSchema>;
