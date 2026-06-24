import { DatabaseProvider } from "./index";
import {
  EntityMetadata,
  FullTranslation,
  MediaCatalog,
  EntityType
} from "@kakehashi/content-schema";
import admin from "firebase-admin";

export class FirestoreDatabaseProvider implements DatabaseProvider {
  private db: admin.firestore.Firestore;

  constructor() {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
    this.db = admin.firestore();
  }

  async getEntity(id: string): Promise<EntityMetadata | null> {
    const doc = await this.db.collection("entities").doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as EntityMetadata;
  }

  async getTranslation(entityId: string, locale: string): Promise<FullTranslation | null> {
    const doc = await this.db
      .collection("entities")
      .doc(entityId)
      .collection("translations")
      .doc(locale)
      .get();
    if (!doc.exists) return null;
    return doc.data() as FullTranslation;
  }

  async listEntities(type?: EntityType): Promise<EntityMetadata[]> {
    let query: admin.firestore.Query = this.db.collection("entities");
    if (type) {
      query = query.where("type", "==", type);
    }
    const snap = await query.get();
    const result: EntityMetadata[] = [];
    snap.forEach((doc) => {
      result.push(doc.data() as EntityMetadata);
    });
    return result;
  }

  async getMediaCatalog(entityId: string): Promise<MediaCatalog | null> {
    const doc = await this.db.collection("media_catalogs").doc(entityId).get();
    if (!doc.exists) return null;
    return doc.data() as MediaCatalog;
  }

  async searchSimilarContent(
    embedding: number[],
    limit: number = 3
  ): Promise<Array<{ entity_id: string; locale: string; title: string; content: string; score: number }>> {
    try {
      // Replaces AlloyDB + Vertex Vector Search with Firestore Native findNearest API
      const collectionRef = this.db.collection("content_vectors");
      // @ts-ignore - findNearest might require experimental typings but is supported in firebase-admin v12+
      const vectorQuery = collectionRef.findNearest({
        vectorField: "embedding",
        queryVector: embedding,
        limit: limit,
        distanceMeasure: "COSINE"
      });
      const snap = await vectorQuery.get();
      const result: Array<{ entity_id: string; locale: string; title: string; content: string; score: number }> = [];
      snap.forEach((doc: any) => {
        const data = doc.data();
        result.push({
          entity_id: data.entity_id,
          locale: data.locale,
          title: data.title,
          content: data.content,
          score: doc.createTime ? 1.0 : 0.9 // Fallback score logic for UI rendering
        });
      });
      return result;
    } catch (e) {
      console.error("Firestore native vector search failed:", e);
      return [];
    }
  }
}
