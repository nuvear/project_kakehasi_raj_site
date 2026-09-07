import type { MetadataRoute } from "next";
import { getDatabase } from "@/lib/public-database";
import { getEntityRoute } from "@/lib/entity-routes";
import { isPublicEntity } from "@/lib/public-entities";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entities = (await (await getDatabase()).listEntities()).filter(isPublicEntity);
  const paths = new Set<string>(["/en", "/ja", "/en/insights", "/ja/insights", "/en/credentials", "/ja/credentials"]);
  for (const entity of entities) for (const locale of ["en", "ja"] as const) {
    const route = getEntityRoute(entity.id, locale);
    if (route) paths.add(route);
  }
  return [...paths].sort().map(p => ({url: `https://www.rajagobalan.com${p}`}));
}
