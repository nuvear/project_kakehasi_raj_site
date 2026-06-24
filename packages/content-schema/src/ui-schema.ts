import { z } from "zod";

export const UIComponentTypeEnum = z.enum([
  "ProfileHero",
  "BiographySection",
  "EducationCard",
  "EducationStory",
  "InstitutionContext",
  "ExperienceTimeline",
  "CareerProgression",
  "VentureCaseStudy",
  "MetricGrid",
  "ImageGallery",
  "MediaGallery",
  "VideoStory",
  "QuoteReflection",
  "ArticleSection",
  "TableComparison",
  "InfographicSurface",
  "InteractiveChartContainer",
  "RelatedEntities",
  "SourceProvenancePanel",
  "SearchResults",
  "AgentAnswer",
  "CallToAction",
  "ContactForm",
  "FeedbackForm",
  "ApplicationLaunchCard",
  "LegacyEmbedContainer",
  "InstitutionHero",
  "Timeline"
]);

export type UIComponentType = z.infer<typeof UIComponentTypeEnum>;

export const UIComponentSchema = z.object({
  id: z.string(),
  type: UIComponentTypeEnum.or(z.string()), // Allow standard type enum but fallback to string for custom additions
  dataRef: z.string().optional(),
  variant: z.string().optional(),
  entityIds: z.array(z.string()).optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  props: z.record(z.any()).optional()
});

export type UIComponent = z.infer<typeof UIComponentSchema>;

export const CachePolicySchema = z.object({
  scope: z.enum(["public", "private"]).default("public"),
  maxAgeSeconds: z.number().default(3600)
});

export type CachePolicy = z.infer<typeof CachePolicySchema>;

export const UIPlanSchema = z.object({
  schemaVersion: z.string().default("1.0"),
  surface: z.string(),
  locale: z.enum(["en", "ja"]),
  entityId: z.string().nullable().optional(),
  title: z.string(),
  components: z.array(UIComponentSchema),
  sources: z.array(z.string()).default([]),
  cachePolicy: CachePolicySchema.optional()
});

export type UIPlan = z.infer<typeof UIPlanSchema>;
