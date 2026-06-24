import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@kakehashi/db";
import { getEmbedding, generateUIPlanFromAI } from "@/lib/ai";
import { UIPlanSchema, UIPlan } from "@/lib/ui-schema";
import admin from "firebase-admin";

// Simple in-memory cache for mock mode
const mockCache = new Map<string, UIPlan>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages, locale = "en" } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Parameter 'messages' array is required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content || "";
    const queryLower = userQuery.toLowerCase();

    // Guardrail Check: Detect Prompt Injection / Unsafe requests (FR-022 / NFR-SEC-008 / Scenario E)
    const injectionPatterns = [
      /ignore\s+(?:the\s+)?(?:above|previous|system)\s+instructions/i,
      /system\s+instruction/i,
      /system\s+prompt/i,
      /reveal\s+(?:the\s+)?system/i,
      /bypass\s+guardrails/i,
      /override\s+system/i,
      /request\s+(?:api\s+)?credentials/i,
      /gcp\s+credentials/i,
      /firebase\s+credentials/i,
      /private\s+key/i,
      /secret\s+key/i,
      /api\s+key/i,
      /execute\s+(?:raw\s+)?code/i,
      /run\s+(?:raw\s+)?code/i,
      /raw\s+(?:javascript|python|bash|sh|shell|executable)/i,
      /rm\s+-rf/i,
      /delete\s+(?:the\s+)?database/i,
      /drop\s+table/i,
      /reveal\s+unpublished/i,
      /administrative\s+tool/i,
      /admin\s+tool/i
    ];

    const isInjectionAttempt = injectionPatterns.some(pattern => pattern.test(userQuery));

    if (isInjectionAttempt) {
      const matchedPattern = injectionPatterns.find(pattern => pattern.test(userQuery))?.toString() || "unknown";
      console.warn(`[Security Alert] Prompt injection blocked. Matched pattern: ${matchedPattern}. Locale: ${locale}`);
      return NextResponse.json(
        { error: "Security Guardrail Triggered: Potential prompt injection or unauthorized tool request detected." },
        { status: 400 }
      );
    }

    const isMock = process.env.MOCK_DB === "true" || (!process.env.FIREBASE_PROJECT_ID && !process.env.GEMINI_API_KEY);

    // 1. Mock Mode Handler
    if (isMock) {
      const cacheKey = `${locale}:${queryLower}`;
      if (mockCache.has(cacheKey)) {
        return NextResponse.json({ uiPlan: mockCache.get(cacheKey), cached: true, mode: "mock" });
      }

      // Generate dynamic mock UI Plan based on query keywords
      let mockPlan: UIPlan;

      if (queryLower.includes("stanford") || queryLower.includes("gsb")) {
        mockPlan = {
          schemaVersion: "1.0",
          surface: "education-story",
          locale: locale as "en" | "ja",
          entityId: "education.stanford-executive-program",
          title: locale === "ja" ? "スタンフォード・エグゼクティブ・プログラム (Mock)" : "Stanford Executive Program (Mock)",
          components: [
            {
              id: "hero-1",
              type: "InstitutionHero",
              dataRef: "education.stanford-executive-program",
              variant: "editorial"
            },
            {
              id: "gallery-1",
              type: "MediaGallery",
              dataRef: "education.stanford-executive-program"
            },
            {
              id: "timeline-1",
              type: "Timeline",
              dataRef: "education.stanford-executive-program"
            },
            {
              id: "related-1",
              type: "RelatedEntities",
              entityIds: ["education.mit-coo-program", "venture.nuvear"]
            }
          ],
          sources: ["education.stanford-executive-program@rev-mock"],
          cachePolicy: { scope: "public", maxAgeSeconds: 3600 }
        };
      } else if (queryLower.includes("mit") || queryLower.includes("sloan")) {
        mockPlan = {
          schemaVersion: "1.0",
          surface: "education-story",
          locale: locale as "en" | "ja",
          entityId: "education.mit-coo-program",
          title: locale === "ja" ? "MIT Sloan エグゼクティブ証明書 (Mock)" : "MIT Sloan Advanced Certificate (Mock)",
          components: [
            {
              id: "hero-1",
              type: "InstitutionHero",
              dataRef: "education.mit-coo-program",
              variant: "minimal"
            },
            {
              id: "timeline-1",
              type: "Timeline",
              dataRef: "education.mit-coo-program"
            },
            {
              id: "related-1",
              type: "RelatedEntities",
              entityIds: ["education.stanford-executive-program", "experience.capgemini-japan"]
            }
          ],
          sources: ["education.mit-coo-program@rev-mock"],
          cachePolicy: { scope: "public", maxAgeSeconds: 3600 }
        };
      } else if (queryLower.includes("capgemini") || queryLower.includes("consulting")) {
        mockPlan = {
          schemaVersion: "1.0",
          surface: "career-timeline",
          locale: locale as "en" | "ja",
          entityId: "experience.capgemini-japan",
          title: locale === "ja" ? "キャップジェミニでの役職 (Mock)" : "Capgemini Experience (Mock)",
          components: [
            {
              id: "hero-1",
              type: "ProfileHero",
              dataRef: "experience.capgemini-japan"
            },
            {
              id: "bio-1",
              type: "BiographySection",
              dataRef: "experience.capgemini-japan"
            },
            {
              id: "timeline-1",
              type: "Timeline",
              dataRef: "experience.capgemini-japan"
            },
            {
              id: "related-1",
              type: "RelatedEntities",
              entityIds: ["venture.nuvear", "venture.aagnaa"]
            }
          ],
          sources: ["experience.capgemini-japan@rev-mock"],
          cachePolicy: { scope: "public", maxAgeSeconds: 3600 }
        };
      } else if (
        queryLower.includes("nuvear") ||
        queryLower.includes("health") ||
        queryLower.includes("wearable")
      ) {
        mockPlan = {
          schemaVersion: "1.0",
          surface: "project-detail",
          locale: locale as "en" | "ja",
          entityId: "venture.nuvear",
          title: locale === "ja" ? "Nuvear ヘルステック (Mock)" : "Nuvear Tech Health Analytics (Mock)",
          components: [
            {
              id: "hero-1",
              type: "ProfileHero",
              dataRef: "venture.nuvear",
              variant: "venture"
            },
            {
              id: "bio-1",
              type: "BiographySection",
              dataRef: "venture.nuvear"
            },
            {
              id: "related-1",
              type: "RelatedEntities",
              entityIds: ["venture.aagnaa", "experience.capgemini-japan"]
            }
          ],
          sources: ["venture.nuvear@rev-mock"],
          cachePolicy: { scope: "public", maxAgeSeconds: 3600 }
        };
      } else {
        // General profile / fallback
        mockPlan = {
          schemaVersion: "1.0",
          surface: "about-me",
          locale: locale as "en" | "ja",
          entityId: "profile.about",
          title: locale === "ja" ? "ラジクマール・ラジャゴバランについて (Mock)" : "About Rajkumar Rajagobalan (Mock)",
          components: [
            {
              id: "hero-1",
              type: "ProfileHero",
              dataRef: "profile.about"
            },
            {
              id: "bio-1",
              type: "BiographySection",
              dataRef: "profile.about"
            },
            {
              id: "related-1",
              type: "RelatedEntities",
              entityIds: ["education.stanford-executive-program", "venture.nuvear", "experience.capgemini-japan"]
            }
          ],
          sources: ["profile.about@rev-mock"],
          cachePolicy: { scope: "public", maxAgeSeconds: 3600 }
        };
      }

      // Validate mock plan matches schema
      const parseResult = UIPlanSchema.safeParse(mockPlan);
      if (!parseResult.success) {
        console.error("Mock plan failed schema validation:", parseResult.error);
        return NextResponse.json({ error: "Invalid mock plan structure" }, { status: 500 });
      }

      mockCache.set(cacheKey, parseResult.data);
      return NextResponse.json({ uiPlan: parseResult.data, cached: false, mode: "mock" });
    }

    // 2. Live Mode Handler (Firestore + Vertex AI / Gemini)
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
    const firestore = admin.firestore();

    // Cache lookup using base64 encoded slug of query
    const cacheDocId = Buffer.from(`${locale}:${queryLower}`).toString("base64url");
    try {
      const cachedDoc = await firestore.collection("ui_plan_cache").doc(cacheDocId).get();
      if (cachedDoc.exists) {
        const cachedPlan = cachedDoc.data();
        const parseResult = UIPlanSchema.safeParse(cachedPlan);
        if (parseResult.success) {
          return NextResponse.json({ uiPlan: parseResult.data, cached: true, mode: "live" });
        }
      }
    } catch (err) {
      console.warn("Firestore cache lookup failed, proceeding with generation:", err);
    }

    // A. Embed user query
    const embedding = await getEmbedding(userQuery);

    // B. Similarity search on Firestore content vector collection
    const db = await getDatabase();
    const matches = await db.searchSimilarContent(embedding, 5);

    // C. Stuff context text
    let contextText = "";
    const seenEntityIds = new Set<string>();
    const sourceIds: string[] = [];

    for (const match of matches) {
      if (seenEntityIds.has(match.entity_id)) continue;
      seenEntityIds.add(match.entity_id);

      const entity = await db.getEntity(match.entity_id);
      const translation = await db.getTranslation(match.entity_id, locale);

      if (entity) {
        contextText += `Entity ID: ${entity.id}\n`;
        contextText += `Type: ${entity.type}\n`;
        contextText += `Metadata: ${JSON.stringify(entity)}\n`;
        sourceIds.push(`${entity.id}@rev-live`);
      }
      if (translation) {
        contextText += `Title: ${translation.frontmatter.title}\n`;
        contextText += `Summary: ${translation.frontmatter.summary}\n`;
        contextText += `Markdown Details:\n${translation.content_markdown}\n`;
      }
      contextText += `\n---\n`;
    }

    if (contextText === "") {
      // Add profile about as fallback context if nothing matched
      const defaultEntityId = "profile.about";
      const entity = await db.getEntity(defaultEntityId);
      const translation = await db.getTranslation(defaultEntityId, locale);
      if (entity && translation) {
        contextText += `Entity ID: ${entity.id}\nType: ${entity.type}\nMetadata: ${JSON.stringify(entity)}\n`;
        contextText += `Title: ${translation.frontmatter.title}\nSummary: ${translation.frontmatter.summary}\nMarkdown Details:\n${translation.content_markdown}\n`;
        sourceIds.push(`${entity.id}@rev-fallback`);
      }
    }

    // D. Request Gemini 2.5 Flash to generate UI Plan
    const responseText = await generateUIPlanFromAI(userQuery, contextText, locale as "en" | "ja");

    // E. Parse response and clean markdown fences if present
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      const lines = cleanJson.split("\n");
      if (lines[0].startsWith("```")) {
        lines.shift();
      }
      if (lines[lines.length - 1].startsWith("```")) {
        lines.pop();
      }
      cleanJson = lines.join("\n").trim();
    }

    const generatedPlanObj = JSON.parse(cleanJson);
    // Ensure sources lists correct live revs
    if (!generatedPlanObj.sources || generatedPlanObj.sources.length === 0) {
      generatedPlanObj.sources = sourceIds;
    }

    // F. Validate returned plan against Zod schema
    const validationResult = UIPlanSchema.safeParse(generatedPlanObj);

    if (!validationResult.success) {
      console.error("AI-generated UI Plan failed Zod validation:", validationResult.error);
      return NextResponse.json(
        { error: "AI generated an invalid UI Plan structure", details: validationResult.error },
        { status: 500 }
      );
    }

    const validatedPlan = validationResult.data;

    // G. Write UI plan back to cache
    try {
      await firestore.collection("ui_plan_cache").doc(cacheDocId).set(validatedPlan);
    } catch (err) {
      console.warn("Failed to write generated UI plan to Firestore cache:", err);
    }

    return NextResponse.json({ uiPlan: validatedPlan, cached: false, mode: "live" });
  } catch (error) {
    console.error("agent endpoint error:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
