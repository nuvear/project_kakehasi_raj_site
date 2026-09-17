import type { EntityMetadata } from "@kakehashi/content-schema";

/** Catalogue pages that exist in source but are not on the live marketing tree. */
export const EXCLUDED_ENTITY_IDS = new Set(["app.to-do-list"]);

export function isLiveMarketingEntity(entity: EntityMetadata): boolean {
  if (EXCLUDED_ENTITY_IDS.has(entity.id)) {
    return false;
  }

  return entity.visibility === "public" && entity.publish_status === "published";
}
