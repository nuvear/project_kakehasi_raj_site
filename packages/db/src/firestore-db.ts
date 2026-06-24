import { DatabaseProvider } from "./index";
import {
  EntityMetadata,
  FullTranslation,
  MediaCatalog,
  EntityType,
  ContactRequest,
  Feedback,
  ContentProposal,
  AuditLog
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
      const collectionRef = this.db.collection("content_vectors");
      // @ts-ignore - findNearest is supported in firebase-admin v12+
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
          score: doc.createTime ? 1.0 : 0.9
        });
      });
      return result;
    } catch (e) {
      console.error("Firestore native vector search failed:", e);
      return [];
    }
  }

  async saveContactRequest(request: ContactRequest, idempotencyKey: string): Promise<boolean> {
    const keyRef = this.db.collection("idempotency_keys").doc(idempotencyKey);
    return this.db.runTransaction(async (transaction) => {
      const keyDoc = await transaction.get(keyRef);
      if (keyDoc.exists) return true;

      const requestRef = this.db.collection("contact_requests").doc();
      transaction.set(requestRef, {
        ...request,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      transaction.set(keyRef, {
        used_at: admin.firestore.FieldValue.serverTimestamp()
      });
      return true;
    });
  }

  async saveFeedback(feedback: Feedback, idempotencyKey: string): Promise<boolean> {
    const keyRef = this.db.collection("idempotency_keys").doc(idempotencyKey);
    return this.db.runTransaction(async (transaction) => {
      const keyDoc = await transaction.get(keyRef);
      if (keyDoc.exists) return true;

      const feedbackRef = this.db.collection("feedback").doc();
      transaction.set(feedbackRef, {
        ...feedback,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      transaction.set(keyRef, {
        used_at: admin.firestore.FieldValue.serverTimestamp()
      });
      return true;
    });
  }

  async createContentProposal(proposal: ContentProposal, idempotencyKey: string): Promise<string> {
    const keyRef = this.db.collection("idempotency_keys").doc(idempotencyKey);
    return this.db.runTransaction(async (transaction) => {
      const keyDoc = await transaction.get(keyRef);
      if (keyDoc.exists) {
        return keyDoc.data()?.proposal_id as string;
      }

      const proposalRef = this.db.collection("content_proposals").doc();
      const proposalId = proposalRef.id;
      transaction.set(proposalRef, {
        ...proposal,
        id: proposalId,
        status: "pending",
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
      transaction.set(keyRef, {
        proposal_id: proposalId,
        used_at: admin.firestore.FieldValue.serverTimestamp()
      });
      return proposalId;
    });
  }

  async approveContentProposal(proposalId: string, actor: string): Promise<boolean> {
    const proposalRef = this.db.collection("content_proposals").doc(proposalId);
    return this.db.runTransaction(async (transaction) => {
      const proposalDoc = await transaction.get(proposalRef);
      if (!proposalDoc.exists) return false;
      const data = proposalDoc.data() as ContentProposal & { status: string };
      if (data.status === "approved") return true;

      const entityRef = this.db.collection("entities").doc(data.entityId);
      const entityDoc = await transaction.get(entityRef);
      if (!entityDoc.exists) return false;

      transaction.update(proposalRef, {
        status: "approved",
        approved_by: actor,
        approved_at: admin.firestore.FieldValue.serverTimestamp()
      });
      transaction.update(entityRef, {
        ...data.fields
      });
      return true;
    });
  }

  async logAudit(log: AuditLog): Promise<void> {
    await this.db.collection("audit_logs").doc(log.id).set({
      ...log,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  async checkRateLimit(
    ipHash: string,
    action: string,
    limit: number,
    windowSec: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const docId = `${ipHash}_${action}`;
    const limitRef = this.db.collection("rate_limits").doc(docId);

    return this.db.runTransaction(async (transaction) => {
      const doc = await transaction.get(limitRef);
      const now = Date.now();
      const windowMs = windowSec * 1000;

      let timestamps: number[] = [];
      if (doc.exists) {
        timestamps = (doc.data()?.timestamps || []) as number[];
      }

      timestamps = timestamps.filter((ts) => now - ts < windowMs);

      if (timestamps.length >= limit) {
        return { allowed: false, remaining: 0 };
      }

      timestamps.push(now);
      transaction.set(limitRef, { timestamps }, { merge: true });
      return {
        allowed: true,
        remaining: limit - timestamps.length
      };
    });
  }
}
