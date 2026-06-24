import { z } from "zod";

export const MediaTypeEnum = z.enum(["image", "video", "document"]);
export const MediaPermissionEnum = z.enum(["public", "private"]);
export const MediaLocaleEnum = z.enum(["en", "ja", "all"]);

export const LocalizedTextSchema = z.object({
  en: z.string().default(""),
  ja: z.string().default("")
});

export const MediaItemSchema = z.object({
  id: z.string(),
  type: MediaTypeEnum,
  url: z.string(), // Local asset path relative to public/ or external URL
  mime_type: z.string(),
  locale: MediaLocaleEnum.default("all"),
  permissions: MediaPermissionEnum.default("public"),
  captions: LocalizedTextSchema.optional(),
  alt_text: LocalizedTextSchema.optional()
});

export const MediaCatalogSchema = z.object({
  entity_id: z.string(),
  media: z.array(MediaItemSchema)
});

export type MediaItem = z.infer<typeof MediaItemSchema>;
export type MediaCatalog = z.infer<typeof MediaCatalogSchema>;
