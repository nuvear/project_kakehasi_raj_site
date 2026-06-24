import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import admin from "firebase-admin";
import { getEmbedding } from "@/lib/ai";

const CONTENT_DIR = "/Users/rajkumarrajagobalan/raj-site/content";

// Initial public media catalog mapping to load
const defaultMediaCatalogs: Record<string, unknown> = {
  "education.stanford-executive-program": {
    entity_id: "education.stanford-executive-program",
    media: [
      {
        id: "img.stanford-campus",
        type: "image",
        url: "/images/stanford-campus.jpg",
        mime_type: "image/jpeg",
        locale: "all",
        permissions: "public",
        alt_text: {
          en: "Stanford GSB Campus",
          ja: "スタンフォード大学GSBキャンパス"
        }
      }
    ]
  }
};

function parseMarkdownFile(content: string) {
  const parts = content.split("---");
  if (parts.length >= 3) {
    const yamlContent = parts[1];
    const markdownContent = parts.slice(2).join("---").trim();
    const frontmatter = yaml.load(yamlContent) as Record<string, unknown>;
    return { frontmatter, content_markdown: markdownContent };
  }
  return { frontmatter: null, content_markdown: content.trim() };
}

function getEntityFolders(dir: string): string[] {
  const folders: string[] = [];
  if (!fs.existsSync(dir)) return folders;

  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      const subDirPath = path.join(dir, item.name);
      if (fs.existsSync(path.join(subDirPath, "entity.yaml"))) {
        folders.push(subDirPath);
      } else {
        folders.push(...getEntityFolders(subDirPath));
      }
    }
  }
  return folders;
}

export async function GET() {
  try {
    const isMock = process.env.MOCK_DB === "true" || !process.env.FIREBASE_PROJECT_ID;

    if (isMock) {
      return NextResponse.json({
        status: "success",
        message: "Mock mode: scanned content directory but did not write to Firestore.",
        foldersFound: getEntityFolders(CONTENT_DIR)
      });
    }

    // Initialize Firebase Admin if not already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
    const firestore = admin.firestore();

    const entityFolders = getEntityFolders(CONTENT_DIR);
    const results = [];

    for (const folder of entityFolders) {
      // 1. Parse entity.yaml
      const entityYamlPath = path.join(folder, "entity.yaml");
      const entityYamlText = fs.readFileSync(entityYamlPath, "utf-8");
      const entityMetadata = yaml.load(entityYamlText) as Record<string, unknown>;
      const entityId = entityMetadata.id as string | undefined;

      if (!entityId) {
        console.warn(`Entity folder at ${folder} is missing ID field in entity.yaml`);
        continue;
      }

      // Write entity metadata to Firestore
      await firestore.collection("entities").doc(entityId).set(entityMetadata);

      const folderFiles = fs.readdirSync(folder);
      const localesIngested = [];

      // 2. Parse locale translations (e.g. en.md, ja.md)
      for (const file of folderFiles) {
        if (file.endsWith(".md")) {
          const locale = path.basename(file, ".md");
          const mdPath = path.join(folder, file);
          const mdText = fs.readFileSync(mdPath, "utf-8");
          const { frontmatter, content_markdown } = parseMarkdownFile(mdText);

          const translationData = {
            entity_id: entityId,
            frontmatter: {
              locale,
              ...frontmatter
            },
            content_markdown
          };

          // Save to subcollection /entities/{entityId}/translations/{locale}
          await firestore
            .collection("entities")
            .doc(entityId)
            .collection("translations")
            .doc(locale)
            .set(translationData);

          // 3. Generate content embedding and write to content_vectors collection
          const title = (frontmatter?.title as string | undefined) || "";
          const summary = (frontmatter?.summary as string | undefined) || "";
          const textToEmbed = `Title: ${title}\nSummary: ${summary}\nContent: ${content_markdown}`;
          const embedding = await getEmbedding(textToEmbed);

          const vectorDocId = `${entityId}_${locale}`;
          
          // Support experimental / native vector types in firebase-admin v12+ if available
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const vectorValue = typeof (admin.firestore.FieldValue as any).vector === "function"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? (admin.firestore.FieldValue as any).vector(embedding)
            : embedding;

          await firestore.collection("content_vectors").doc(vectorDocId).set({
            entity_id: entityId,
            locale,
            title,
            content: `${summary}\n${content_markdown}`,
            embedding: vectorValue
          });

          localesIngested.push(locale);
        }
      }

      // 4. Ingest default media catalogs if mapped
      if (defaultMediaCatalogs[entityId]) {
        await firestore
          .collection("media_catalogs")
          .doc(entityId)
          .set(defaultMediaCatalogs[entityId] as Record<string, unknown>);
      }

      results.push({
        entityId,
        locales: localesIngested,
        hasMedia: !!defaultMediaCatalogs[entityId]
      });
    }

    return NextResponse.json({
      status: "success",
      message: `Ingestion completed. Processed ${results.length} entities.`,
      entities: results
    });
  } catch (error) {
    console.error("ingest endpoint error:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
