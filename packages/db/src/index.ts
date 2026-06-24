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

export interface DatabaseProvider {
  getEntity(id: string): Promise<EntityMetadata | null>;
  getTranslation(entityId: string, locale: string): Promise<FullTranslation | null>;
  listEntities(type?: EntityType): Promise<EntityMetadata[]>;
  getMediaCatalog(entityId: string): Promise<MediaCatalog | null>;
  searchSimilarContent(
    embedding: number[],
    limit?: number
  ): Promise<Array<{ entity_id: string; locale: string; title: string; content: string; score: number }>>;

  // Write operations
  saveContactRequest(request: ContactRequest, idempotencyKey: string): Promise<boolean>;
  saveFeedback(feedback: Feedback, idempotencyKey: string): Promise<boolean>;
  createContentProposal(proposal: ContentProposal, idempotencyKey: string): Promise<string>;
  approveContentProposal(proposalId: string, actor: string): Promise<boolean>;
  logAudit(log: AuditLog): Promise<void>;
  checkRateLimit(
    ipHash: string,
    action: string,
    limit: number,
    windowSec: number
  ): Promise<{ allowed: boolean; remaining: number }>;
}

let dbProvider: DatabaseProvider;

export async function getDatabase(): Promise<DatabaseProvider> {
  if (dbProvider) return dbProvider;

  const isMock = process.env.MOCK_DB === "true" || !process.env.FIREBASE_PROJECT_ID;

  if (isMock) {
    const { MockDatabaseProvider } = await import("./mock-db");
    dbProvider = new MockDatabaseProvider();
  } else {
    const { FirestoreDatabaseProvider } = await import("./firestore-db");
    dbProvider = new FirestoreDatabaseProvider();
  }

  return dbProvider;
}
