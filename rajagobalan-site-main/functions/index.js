"use strict";

const path = require("path");
if (process.env.FUNCTIONS_EMULATOR === "true") {
  require("dotenv").config({ path: path.join(__dirname, ".env.example") });
  require("dotenv").config({ path: path.join(__dirname, ".env"), override: true });
}

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Callable AI coach (2nd gen) — authenticated user only; reads last 7 daily_logs.
 */
exports.aiCoach = onCall({ region: "us-central1" }, async (request) => {
  if (!request.auth || !request.auth.uid) {
    throw new HttpsError("unauthenticated", "Sign in required.");
  }

  const uid = request.auth.uid;

  const snap = await admin
    .firestore()
    .collection("daily_logs")
    .where("uid", "==", uid)
    .orderBy("date", "desc")
    .limit(7)
    .get();

  let msg = "Stay consistent.";

  snap.forEach((doc) => {
    const d = doc.data() || {};
    const sleep = d.activities && typeof d.activities.sleep === "number" ? d.activities.sleep : 0;
    const physical = d.activities && typeof d.activities.physical === "number" ? d.activities.physical : 0;
    if (sleep < 6) msg = "Sleep dropped. Fix tonight.";
    else if (physical < 1) msg = "Move first tomorrow.";
  });

  return { message: msg };
});

/**
 * recognizeFood — Gemini vision callable.
 *
 * Request:  { imageBase64: string, mimeType: string }
 * Response: { text: string, dishName: string, cuisine: string }
 *
 * Gemini returns a JSON envelope with:
 *   - dishName  : short name for diary / display
 *   - cuisine   : cuisine / region
 *   - text      : full Markdown analysis (ingredients, recipe, nutrition, pairings)
 */
exports.recognizeFood = onCall({ region: "us-central1" }, async (request) => {
  try {
    return await runRecognizeFood(request);
  } catch (e) {
    if (e instanceof HttpsError) throw e;
    console.error("recognizeFood unexpected", e);
    throw new HttpsError(
      "internal",
      "Something went wrong. Please try again in a moment."
    );
  }
});

async function runRecognizeFood(request) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new HttpsError(
      "failed-precondition",
      "Set GEMINI_API_KEY on the Cloud Functions service (or functions/.env for the emulator)."
    );
  }

  const imageBase64 = request.data && request.data.imageBase64;
  const mimeType = (request.data && request.data.mimeType) || "image/jpeg";

  if (typeof imageBase64 !== "string" || imageBase64.length < 20) {
    throw new HttpsError(
      "invalid-argument",
      "Missing or invalid image data. Please choose another photo."
    );
  }
  if (imageBase64.length > 6 * 1024 * 1024) {
    throw new HttpsError(
      "invalid-argument",
      "Image is too large. Use a photo under about 4 MB."
    );
  }

  const geminiModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-preview";
  const genUrl =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    geminiModel +
    ":generateContent?key=" +
    encodeURIComponent(geminiKey);

  const prompt =
    "Analyse the meal in this photo. Return ONLY a single JSON object — no markdown fences, no preamble.\n\n" +
    "JSON structure:\n" +
    "{\n" +
    '  "dishName": "Short common name of the dish",\n' +
    '  "cuisine": "Cuisine type or region (e.g. Japanese-Chinese fusion)",\n' +
    '  "description": "One or two sentences describing what you see in the photo.",\n' +
    '  "nutrition": {\n' +
    '    "servingSize": "estimated total edible portion in grams e.g. 350 g",\n' +
    '    "calories": "range e.g. 500–700 kcal",\n' +
    '    "protein": "range e.g. 30–45 g",\n' +
    '    "carbs": "range e.g. 60–80 g",\n' +
    '    "fat": "range e.g. 20–35 g",\n' +
    '    "sodium": "range e.g. 1500–2500 mg",\n' +
    '    "fiber": "range e.g. 5–10 g",\n' +
    '    "note": "One sentence overall nutritional profile."\n' +
    "  },\n" +
    '  "text": "Full Markdown details (see format below)"\n' +
    "}\n\n" +
    'The "text" field must be a Markdown string with these sections:\n' +
    "## Visible Ingredients\n" +
    "List every visible ingredient with a brief note.\n\n" +
    "## Step-by-Step Recipe (Approximate)\n" +
    "Numbered cooking steps for a home cook to recreate the dish.\n\n" +
    "## Suggested Pairings\n" +
    "List complementary sides, drinks, or accompaniments.\n\n" +
    "Rules: dishName concise (e.g. 'Mapo Tofu Don'). All nutrition values are rough per-serving estimates. " +
    "Use ## headings, * bullets, and 1. numbered lists in text. No JSON inside text.";

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType.startsWith("image/") ? mimeType : "image/jpeg",
              data: imageBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048,
    },
  };

  let gRes;
  try {
    gRes = await fetch(genUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Gemini fetch error", err);
    throw new HttpsError(
      "unavailable",
      "Could not reach the vision service. Check your network and try again."
    );
  }

  const gRaw = await gRes.text();

  if (!gRes.ok) {
    console.error("Gemini HTTP error", gRes.status, gRaw.slice(0, 400));
    let apiMsg = "";
    try {
      const j = JSON.parse(gRaw);
      if (j.error && typeof j.error.message === "string") apiMsg = j.error.message;
    } catch { /* ignore */ }
    if (gRes.status === 400 || gRes.status === 403) {
      throw new HttpsError(
        "internal",
        "The vision API rejected this request. Check that GEMINI_API_KEY is valid and GEMINI_MODEL is correct."
      );
    }
    if (gRes.status === 429) {
      throw new HttpsError("resource-exhausted", "Vision API rate limit reached. Please try again in a minute.");
    }
    throw new HttpsError(
      "internal",
      apiMsg ? apiMsg.slice(0, 240) : "Vision analysis failed. Please try again."
    );
  }

  let gData;
  try {
    gData = JSON.parse(gRaw);
  } catch {
    throw new HttpsError("internal", "Received an invalid response from the vision service.");
  }

  const cand0 = gData.candidates && gData.candidates[0];
  if (!cand0) {
    const block = gData.promptFeedback && gData.promptFeedback.blockReason;
    throw new HttpsError(
      "failed-precondition",
      block
        ? "This image could not be processed (content policy). Try a different photo."
        : "The model returned no result for this image. Try another photo or angle."
    );
  }

  if (cand0.finishReason === "SAFETY" || cand0.finishReason === "RECITATION") {
    throw new HttpsError(
      "failed-precondition",
      "This image could not be analyzed (safety policy). Try a different food photo."
    );
  }

  const rawText =
    cand0.content && cand0.content.parts
      ? cand0.content.parts.map((p) => p.text || "").join("")
      : "";

  // Parse the JSON envelope Gemini returns
  let envelope = null;
  try {
    const stripped = rawText.replace(/```json\s*|```/gi, "").trim();
    const start = stripped.indexOf("{");
    if (start !== -1) {
      envelope = JSON.parse(stripped.slice(start));
    }
  } catch {
    // fall through to plain-text fallback
  }

  const dishName =
    envelope && typeof envelope.dishName === "string" && envelope.dishName.trim()
      ? envelope.dishName.trim()
      : "Meal";
  const cuisine =
    envelope && typeof envelope.cuisine === "string" && envelope.cuisine.trim()
      ? envelope.cuisine.trim()
      : "";
  const description =
    envelope && typeof envelope.description === "string" && envelope.description.trim()
      ? envelope.description.trim()
      : "";
  const nutrition =
    envelope && envelope.nutrition && typeof envelope.nutrition === "object"
      ? {
          servingSize: String(envelope.nutrition.servingSize || ""),
          calories: String(envelope.nutrition.calories || ""),
          protein:  String(envelope.nutrition.protein  || ""),
          carbs:    String(envelope.nutrition.carbs    || ""),
          fat:      String(envelope.nutrition.fat      || ""),
          sodium:   String(envelope.nutrition.sodium   || ""),
          fiber:    String(envelope.nutrition.fiber    || ""),
          note:     String(envelope.nutrition.note     || ""),
        }
      : null;
  const text =
    envelope && typeof envelope.text === "string" && envelope.text.trim()
      ? envelope.text.trim()
      : rawText.trim();

  if (!text && !dishName) {
    throw new HttpsError(
      "internal",
      "Could not read the AI response for this image. Try again with a clearer food photo."
    );
  }

  return { text, dishName, cuisine, description, nutrition };
}
