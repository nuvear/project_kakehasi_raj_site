import { getDatabase as getSourceDatabase, type DatabaseProvider } from "@kakehashi/db";
import { isPublicEntity } from "./public-entities";
import { getReviewedTranslation } from "./editorial-content";
import { GATE_URL } from "./gate-pitch";

type PublicReader = Pick<DatabaseProvider, "getEntity" | "getTranslation" | "listEntities" | "getMediaCatalog" | "searchSimilarContent">;

// Apply publication policy without rewriting historical Firestore records or vectors.
export function publicationView(source: PublicReader): PublicReader {
  const currentEntity = (entity: Awaited<ReturnType<PublicReader["getEntity"]>>) => {
    if (!entity || !isPublicEntity(entity)) return null;
    return entity.id === "app.ai-transformation-command-center" ? {...entity, app_url: GATE_URL} : entity;
  };
  const view: PublicReader = {
    async getEntity(id) { return currentEntity(await source.getEntity(id)); },
    async listEntities(type) { return (await source.listEntities(type)).flatMap(e => { const current = currentEntity(e); return current ? [current] : []; }); },
    async getTranslation(id, locale) {
      if (!(await view.getEntity(id)) || (locale !== "en" && locale !== "ja")) return null;
      return getReviewedTranslation(id, locale) ?? source.getTranslation(id, locale);
    },
    async getMediaCatalog(id) { return await view.getEntity(id) ? source.getMediaCatalog(id) : null; },
    async searchSimilarContent(embedding, requestedLimit = 3) {
      const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(20, Math.floor(requestedLimit))) : 3;
      const candidates = await source.searchSimilarContent(embedding, Math.min(40, limit * 3));
      const results = [];
      for (const candidate of candidates) {
        const translation = await view.getTranslation(candidate.entity_id, candidate.locale);
        if (!translation) continue;
        results.push({...candidate, title: translation.frontmatter.title, content: `${translation.frontmatter.summary}\n${translation.content_markdown}`});
        if (results.length === limit) break;
      }
      return results;
    },
  };
  return view;
}
export async function getDatabase() { return publicationView(await getSourceDatabase()); }
