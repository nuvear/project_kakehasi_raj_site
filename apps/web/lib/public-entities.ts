import type { EntityMetadata } from "@kakehashi/content-schema";

export const retiredEntityIds = new Set(["app.to-do-list", "framework.enterprise-ai-transformation"]);
export function isPublicEntity(entity: EntityMetadata) {
  return entity.visibility === "public" && entity.sensitivity === "public" && entity.publish_status === "published" && !retiredEntityIds.has(entity.id);
}
