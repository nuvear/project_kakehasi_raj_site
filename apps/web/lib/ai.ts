import { GoogleGenerativeAI } from "@google/generative-ai";
import { VertexAI } from "@google-cloud/vertexai";

/**
 * Generates text embeddings using Vertex AI SDK or Google Generative AI (Gemini).
 * Falls back to mock embeddings if credentials are not configured or MOCK_DB=true.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const isMock = process.env.MOCK_DB === "true" || (!process.env.FIREBASE_PROJECT_ID && !process.env.GEMINI_API_KEY);

  if (isMock) {
    // Return a mock embedding vector (768 dimensions)
    return Array.from({ length: 768 }, (_, i) => Math.sin(i + text.length) * 0.1);
  }

  // 1. Try Vertex AI client SDK if FIREBASE_PROJECT_ID is provided
  if (process.env.FIREBASE_PROJECT_ID && process.env.MOCK_DB !== "true") {
    try {
      const vertexAI = new VertexAI({
        project: process.env.FIREBASE_PROJECT_ID,
        location: process.env.GCP_LOCATION || "us-central1"
      });
      // In Vertex AI, we can use the embedding model
      // Note: we can use the REST endpoint or the vertex sdk wrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vertexModel = vertexAI.preview.getGenerativeModel({ model: "text-embedding-004" }) as any;
      const response = await vertexModel.embedContent({
        content: { parts: [{ text }] }
      });
      if (response && response.embedding?.values) {
        return response.embedding.values;
      }
    } catch (err) {
      console.warn("Vertex AI SDK embedding failed, trying Gemini API:", err);
    }
  }

  // 2. Try Google Generative AI with GEMINI_API_KEY
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(text);
      if (result.embedding?.values) {
        return result.embedding.values;
      }
    } catch (err) {
      console.error("Google Generative AI embedding failed:", err);
    }
  }

  // Fallback mock vector if both SDK calls fail
  return Array.from({ length: 768 }, (_, i) => Math.sin(i + text.length) * 0.1);
}

/**
 * Prompts Gemini 2.5 Flash to generate a structured Dynamic UI Plan based on query context.
 */
export async function generateUIPlanFromAI(
  userMessage: string,
  contextText: string,
  locale: "en" | "ja"
): Promise<string> {
  const isMock = process.env.MOCK_DB === "true" || !process.env.GEMINI_API_KEY;

  if (isMock) {
    throw new Error("AI provider is in mock mode or GEMINI_API_KEY is not defined");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const systemInstruction = `
You are the Lead UI Orchestrator Agent for Project Kakehashi.
Your task is to analyze the visitor message, retrieve relevant context about Rajkumar Rajagobalan, and compose a structured Dynamic UI Plan in JSON format.
The output MUST validate against the Zod schema for a UI Plan:
{
  "schemaVersion": "1.0",
  "surface": string, // e.g. "education-story", "career-timeline", "project-detail", "search-results", "about-me"
  "locale": "${locale}",
  "entityId": string | null, // The main entity ID being viewed, or null
  "title": string, // The display title of the generated view
  "components": Array<{
    "id": string, // unique ID, e.g. "hero-1"
    "type": string, // One of: "ProfileHero", "BiographySection", "EducationCard", "EducationStory", "InstitutionContext", "ExperienceTimeline", "CareerProgression", "VentureCaseStudy", "MetricGrid", "ImageGallery", "MediaGallery", "VideoStory", "QuoteReflection", "ArticleSection", "TableComparison", "InfographicSurface", "InteractiveChartContainer", "RelatedEntities", "SourceProvenancePanel", "SearchResults", "AgentAnswer", "CallToAction", "ContactForm", "FeedbackForm", "SEOAuditReport", "ArticleBrief", "ApplicationLaunchCard", "LegacyEmbedContainer", "InstitutionHero", "Timeline"
    "dataRef": string | null, // optional reference to data sources, e.g. "education.stanford-executive-program.summary"
    "variant": string | null, // optional style variation
    "entityIds": string[] | null, // optional array of related entity IDs (e.g. for RelatedEntities)
    "title": string | null, // optional inline title
    "content": string | null, // optional inline markdown/text content
    "props": object | null // optional custom attributes:
    // - For "SEOAuditReport": {"issues": Array<{entityId: string, entityType: string, locale: "en"|"ja"|"all", issueType: string, severity: "error"|"warning"|"info", details: string, fix: string}>}
    // - For "ArticleBrief": {"titleSuggested": string, "descriptionSuggested": string, "audience": string, "keywords": string[], "structure": string[], "references": string[]}
  }>,
  "sources": string[], // list of source IDs used (e.g., "education.stanford-executive-program@rev-12")
  "cachePolicy": {
    "scope": "public" | "private",
    "maxAgeSeconds": number
  }
}

Guidelines:
1. ONLY use information present in the context. Do not invent or hallucinate credentials, dates, or affiliations.
2. Ground all component details in the provided context.
3. When the context contains programmatic SEO Audit results (list of issues), map them to an "SEOAuditReport" component in the components list.
4. When requested to generate an article brief or writing outline, use the "ArticleBrief" component with suggested meta title/description, target audience, keywords, structure/headings, and references from the context.
5. Keep the JSON strictly valid and return only the JSON object.
`;

  const prompt = `
User Message: "${userMessage}"
Locale: "${locale}"

Context data retrieved:
---
${contextText}
---

Generate the Dynamic UI Plan now.
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction
  });

  const responseText = result.response.text();
  return responseText;
}
