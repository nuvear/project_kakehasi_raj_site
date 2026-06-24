/**
 * Foodie AI — Firebase callable recognizeFood (Gemini on server).
 * Displays: dish name, cuisine, description, structured nutrition, collapsible full details.
 * Meal diary in localStorage.
 */
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-functions.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked@12.0.2/+esm";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/+esm";

marked.setOptions({ gfm: true, breaks: true });

function normalizeGeminiMarkdown(md) {
  let s = String(md || "").replace(/\r\n/g, "\n");
  s = s.replace(/([^\n#])(#{2,6}\s)/g, "$1\n\n$2");
  s = s.replace(/([^\n\d])(\d+\.\s+\*\*)/g, "$1\n\n$2");
  s = s.replace(/([:;])\s*(\* )/g, "$1\n\n$2");
  s = s.replace(/(\))\s+(\* \*\*)/g, "$1\n\n$2");
  s = s.replace(/(\*\*[^:]+:\s+)(\* \*\*)/g, "$1\n$2");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function mdToSafeHtml(md) {
  return DOMPurify.sanitize(marked.parse(normalizeGeminiMarkdown(md)));
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}

function safeDataImageUrl(u) {
  if (typeof u !== "string" || !u.startsWith("data:image/")) return "";
  return u;
}

// ── Firebase init ──────────────────────────────────────────────────────────────

const FX_REGION = "us-central1";
const MAX_BYTES = 4 * 1024 * 1024;
const HISTORY_KEY = "mealHistory";
const MAX_ENTRIES = 20;

if (!firebaseConfig.apiKey || String(firebaseConfig.apiKey).indexOf("REPLACE") !== -1) {
  const b = document.getElementById("configBanner");
  if (b) b.classList.add("show");
}

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, FX_REGION);

// Connect to local emulator when running on localhost
if (
  typeof location !== "undefined" &&
  (location.hostname === "localhost" || location.hostname === "127.0.0.1")
) {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

// ── DOM refs ───────────────────────────────────────────────────────────────────

const imageInput       = document.getElementById("imageInput");
const btnPick          = document.getElementById("btnPick");
const preview          = document.getElementById("preview");
const resultsDiv       = document.getElementById("results");
const loadingDiv       = document.getElementById("loading");
const historyContainer = document.getElementById("historyContainer");

btnPick.addEventListener("click", () => imageInput.click());
document.addEventListener("DOMContentLoaded", displayHistory);

// ── Image pick & analyse ───────────────────────────────────────────────────────

imageInput.addEventListener("change", async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > MAX_BYTES) {
    showError("Image is too large (max 4 MB)."); return;
  }
  if (!file.type.startsWith("image/")) {
    showError("Please choose an image file."); return;
  }

  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";

  const base64Image = await fileToBase64(file);
  const m = String(base64Image).match(/^data:([^;]+);base64,(.+)$/);
  if (!m) { showError("Could not read image."); return; }

  await analyzeFood(m[2], m[1], file);
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

function createThumbnailDataUrl(file, maxW = 320) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxW) { h = Math.round((h * maxW) / w); w = maxW; }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(""); return; }
      ctx.drawImage(img, 0, 0, w, h);
      try { resolve(canvas.toDataURL("image/jpeg", 0.82)); } catch { resolve(""); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(""); };
    img.src = url;
  });
}

// ── Core analysis call ─────────────────────────────────────────────────────────

async function analyzeFood(base64Data, mimeType, file) {
  resultsDiv.classList.remove("show");
  loadingDiv.classList.add("show");

  try {
    const fn = httpsCallable(functions, "recognizeFood");
    const res = await fn({ imageBase64: base64Data, mimeType });
    const d = res.data || {};

    const dishName   = typeof d.dishName   === "string" ? d.dishName.trim()   : "Meal";
    const cuisine    = typeof d.cuisine    === "string" ? d.cuisine.trim()    : "";
    const description = typeof d.description === "string" ? d.description.trim() : "";
    const nutrition  = d.nutrition && typeof d.nutrition === "object" ? d.nutrition : null;
    const text       = typeof d.text === "string" ? d.text.trim() : "";

    if (!dishName && !text) {
      showError("No response from the model."); return;
    }

    renderResult({ dishName, cuisine, description, nutrition, text });

    let thumb = "";
    try { thumb = await createThumbnailDataUrl(file); } catch { thumb = ""; }

    saveToHistory({ dishName: dishName || "Meal", cuisine: cuisine || "—", thumbDataUrl: thumb });

  } catch (e) {
    console.error(e);
    showError(e.message || "Something went wrong. Ensure GEMINI_API_KEY is set on the Cloud Run service.");
  } finally {
    loadingDiv.classList.remove("show");
  }
}

// ── Render ─────────────────────────────────────────────────────────────────────

function renderResult({ dishName, cuisine, description, nutrition, text }) {
  const nutritionHtml = nutrition ? buildNutritionHtml(nutrition) : "";
  const detailsHtml   = text
    ? `<details class="foodie-details">
        <summary class="foodie-details-summary">
          <span>Full details — ingredients, recipe &amp; pairings</span>
          <span class="foodie-details-chevron" aria-hidden="true">▾</span>
        </summary>
        <div class="foodie-details-body foodie-md">${mdToSafeHtml(text)}</div>
       </details>`
    : "";

  resultsDiv.innerHTML = `
    <div class="foodie-result-header">
      <h2 class="foodie-result-name">${escapeHtml(dishName)}</h2>
      ${cuisine ? `<span class="foodie-result-cuisine">${escapeHtml(cuisine)}</span>` : ""}
      ${description ? `<p class="foodie-result-desc">${escapeHtml(description)}</p>` : ""}
    </div>
    ${nutritionHtml}
    ${detailsHtml}
  `;
  resultsDiv.classList.add("show");
}

function buildNutritionHtml(n) {
  const items = [
    { label: "Calories",      icon: "🔥", value: n.calories },
    { label: "Protein",       icon: "💪", value: n.protein  },
    { label: "Carbohydrates", icon: "🌾", value: n.carbs    },
    { label: "Fat",           icon: "🫒", value: n.fat      },
    { label: "Sodium",        icon: "🧂", value: n.sodium   },
    { label: "Fiber",         icon: "🥦", value: n.fiber    },
  ];

  const cards = items
    .map(({ label, icon, value }) => {
      if (!value) return "";
      return `
        <div class="foodie-nut-card">
          <span class="foodie-nut-icon" aria-hidden="true">${icon}</span>
          <span class="foodie-nut-value">${escapeHtml(value)}</span>
          <span class="foodie-nut-label">${escapeHtml(label)}</span>
        </div>`;
    })
    .join("");

  const servingLabel = n.servingSize
    ? `per serving · <span class="foodie-nut-serving">${escapeHtml(n.servingSize)}</span>`
    : "per serving";

  const noteHtml = n.note
    ? `<p class="foodie-nut-note">${escapeHtml(n.note)}</p>`
    : "";

  return `
    <div class="foodie-nutrition">
      <h3 class="foodie-nut-heading">Estimated Nutrition <span class="foodie-nut-badge">${servingLabel}</span></h3>
      <div class="foodie-nut-grid">${cards}</div>
      ${noteHtml}
    </div>`;
}

function showError(msg) {
  resultsDiv.innerHTML = `<p class="foodie-error-plain">❌ ${escapeHtml(msg)}</p>`;
  resultsDiv.classList.add("show");
  loadingDiv.classList.remove("show");
}

// ── History ────────────────────────────────────────────────────────────────────

function saveToHistory({ dishName, cuisine, thumbDataUrl }) {
  let history = [];
  try { history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { history = []; }
  history.unshift({ date: new Date().toLocaleString(), dishName, cuisine, thumbDataUrl: thumbDataUrl || "" });
  if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  displayHistory();
}

function displayHistory() {
  if (!historyContainer) return;
  let history = [];
  try { history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { history = []; }

  if (history.length === 0) {
    historyContainer.innerHTML = `<p class="foodie-history-empty">No meals scanned yet. Snap a photo to start your diary.</p>`;
    return;
  }

  historyContainer.innerHTML = history
    .map((item, index) => {
      const dish = (typeof item.dishName === "string" && item.dishName) ? item.dishName : "Meal";
      const cuis = (typeof item.cuisine  === "string" && item.cuisine)  ? item.cuisine  : "—";
      const dataUrl = safeDataImageUrl(item.thumbDataUrl);
      const thumb = dataUrl
        ? `<img class="history-thumb" src="${dataUrl.replace(/"/g, "&quot;")}" alt="" />`
        : `<div class="history-thumb history-thumb--placeholder" aria-hidden="true"><i class="fas fa-utensils"></i></div>`;
      return `
        <div class="history-item">
          ${thumb}
          <div class="history-body">
            <div class="history-date">🗓️ ${escapeHtml(item.date)}</div>
            <div class="history-dish">${escapeHtml(dish)}</div>
            <div class="history-cuisine">${escapeHtml(cuis)}</div>
            <button type="button" class="delete-btn" data-index="${index}">Delete</button>
          </div>
        </div>`;
    })
    .join("");

  historyContainer.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.getAttribute("data-index"), 10);
      deleteHistoryItem(i);
    });
  });
}

function deleteHistoryItem(index) {
  let history = [];
  try { history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { history = []; }
  if (index >= 0 && index < history.length) history.splice(index, 1);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  displayHistory();
}
