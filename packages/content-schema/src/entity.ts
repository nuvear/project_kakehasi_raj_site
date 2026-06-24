import { z } from "zod";

export const EntityTypeEnum = z.enum([
  "profile",
  "education",
  "experience",
  "venture",
  "insight",
  "guide",
  "framework",
  "app"
]);

export const VisibilityEnum = z.enum(["public", "private"]);
export const PublishStatusEnum = z.enum(["draft", "published", "archived"]);
export const SensitivityEnum = z.enum(["public", "confidential"]);

export const ClaimsPolicySchema = z.object({
  may_summarize: z.boolean().default(true),
  may_infer_relationships: z.boolean().default(true),
  may_change_credential_wording: z.boolean().default(false)
});

export const BaseEntitySchema = z.object({
  id: z.string(),
  type: EntityTypeEnum,
  canonical_slug: z.string(),
  visibility: VisibilityEnum.default("public"),
  publish_status: PublishStatusEnum.default("draft"),
  sensitivity: SensitivityEnum.default("public"),
  agent_use: z.boolean().default(true),
  claims_policy: ClaimsPolicySchema.default({
    may_summarize: true,
    may_infer_relationships: true,
    may_change_credential_wording: false
  }),
  ui_capabilities: z.array(z.string()).default([]),
  start_date: z.string().optional()
});

// Specific Metadata Schemas
export const EducationMetadataSchema = BaseEntitySchema.extend({
  type: z.literal("education"),
  institution: z.object({
    id: z.string(),
    official_name: z.string()
  }),
  programme: z.object({
    official_name: z.string()
  }),
  start_date: z.string(), // YYYY-MM
  end_date: z.string().nullable() // YYYY-MM or null if current
});

export const ExperienceMetadataSchema = BaseEntitySchema.extend({
  type: z.literal("experience"),
  company: z.object({
    id: z.string(),
    official_name: z.string()
  }),
  role: z.string(),
  start_date: z.string(),
  end_date: z.string().nullable()
});

export const VentureMetadataSchema = BaseEntitySchema.extend({
  type: z.literal("venture"),
  company_name: z.string(),
  role: z.string(),
  start_date: z.string(),
  end_date: z.string().nullable()
});

export const InsightMetadataSchema = BaseEntitySchema.extend({
  type: z.literal("insight"),
  category: z.string(),
  tags: z.array(z.string()).default([])
});

export const GuideMetadataSchema = BaseEntitySchema.extend({
  type: z.literal("guide"),
  category: z.string(),
  tags: z.array(z.string()).default([])
});

export const FrameworkMetadataSchema = BaseEntitySchema.extend({
  type: z.literal("framework"),
  version: z.string()
});

export const AppMetadataSchema = BaseEntitySchema.extend({
  type: z.literal("app"),
  app_url: z.string().optional()
});

export const ProfileMetadataSchema = BaseEntitySchema.extend({
  type: z.literal("profile")
});

export const EntityMetadataSchema = z.discriminatedUnion("type", [
  ProfileMetadataSchema,
  EducationMetadataSchema,
  ExperienceMetadataSchema,
  VentureMetadataSchema,
  InsightMetadataSchema,
  GuideMetadataSchema,
  FrameworkMetadataSchema,
  AppMetadataSchema
]);

export type EntityType = z.infer<typeof EntityTypeEnum>;
export type BaseEntity = z.infer<typeof BaseEntitySchema>;
export type EntityMetadata = z.infer<typeof EntityMetadataSchema>;

export type EducationMetadata = z.infer<typeof EducationMetadataSchema>;
export type ExperienceMetadata = z.infer<typeof ExperienceMetadataSchema>;
export type VentureMetadata = z.infer<typeof VentureMetadataSchema>;
export type InsightMetadata = z.infer<typeof InsightMetadataSchema>;
export type GuideMetadata = z.infer<typeof GuideMetadataSchema>;
export type FrameworkMetadata = z.infer<typeof FrameworkMetadataSchema>;
export type AppMetadata = z.infer<typeof AppMetadataSchema>;
export type ProfileMetadata = z.infer<typeof ProfileMetadataSchema>;
