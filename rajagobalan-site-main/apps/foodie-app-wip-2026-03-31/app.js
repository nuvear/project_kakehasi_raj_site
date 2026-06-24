/**
 * Foodie AI — Firebase callables (Gemini vision + USDA hybrid + manual USDA lookup).
 * Diary: localStorage (no Auth/Firestore required).
 */
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-functions.js";

const FX_REGION = "us-central1";
const MAX_BYTES = 4 * 1024 * 1024;
const HISTORY_KEY = "mealHistory";
const MAX_ENTRIES = 20;

if (!firebaseConfig.apiKey || String(firebaseConfig.apiKey).indexOf("REPLACE") !== -1) {
  const b = document.getElementById("configBanner");
  if (b) b.classList.remove("hidden");
}

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app, FX_REGION);

const isLocalHost =
  typeof location !== "undefined" &&
  (location.hostname === "localhost" || location.hostname === "127.0.0.1");
if (isLocalHost) {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

const imageInput = document.getElementById("imageInput");
const dropZone = document.getElementById("dropZone");
const preview = document.getElementById("preview");
const uploadPrompt = document.getElementById("uploadPrompt");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const loading = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const results = document.getElementById("results");
const controls = document.getElementById("controls");
const unitSelect = document.getElementById("unitSelect");
const historyContainer = document.getElementById("historyContainer");
const userIdDisplay = document.getElementById("userIdDisplay");
const manualSearchUI = document.getElementById("manualSearchUI");
const manualFoodInput = document.getElementById("manualFoodInput");
const manualSearchBtn = document.getElementById("manualSearchBtn");

if (userIdDisplay) {
  userIdDisplay.textContent = "Local diary";
  userIdDisplay.title = "Meals saved in this browser only";
}

let currentMealData = null;
let currentBase64 = null;
let currentMime = null;
let pendingFile = null;

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}

function mapCallableError(err) {
  const raw = err && err.code != null ? String(err.code) : "";
  const code = raw.replace(/^functions\//, "");
  const msg = (err && err.message) || "";
  if (code === "failed-precondition" || code === "invalid-argument") return msg || "Request could not be completed.";
  if (code === "unavailable") return msg || "Service unavailable. Try again.";
  if (code === "internal" && msg && msg.length < 500) return msg;
  if (msg && msg.length < 500) return msg;
  return "Something went wrong. Please try again.";
}

/**
 * Maps Cloud Function payload { ai, per100g, usdaLabel, fdcId, nutrientSource } → UI model.
 */
function mapServerPayloadToMeal(d, manualLookup) {
  if (!d || typeof d !== "object" || !d.ai || !d.per100g) return null;
  const ai = d.ai;
  const per = d.per100g;
  const name = (typeof ai.dish === "string" && ai.dish.trim()
    ? ai.dish
    : typeof ai.searchableName === "string"
      ? ai.searchableName
      : "Meal"
  ).trim();
  let g = ai.estimatedWeightGrams;
  if (typeof g === "string") g = parseFloat(String(g).replace(/,/g, ""));
  if (typeof g !== "number" || !Number.isFinite(g) || g <= 0) g = 200;

  let source;
  if (d.nutrientSource === "usda") {
    source = `USDA FoodData Central${d.fdcId != null ? ` · FDC ${d.fdcId}` : ""}`;
    if (typeof d.usdaLabel === "string" && d.usdaLabel.trim()) {
      source += ` · ${d.usdaLabel.trim()}`;
    }
  } else {
    source = "AI-estimated nutrients (no confident USDA match)";
  }

  const mapN = (v) => (v != null && Number.isFinite(Number(v)) ? Number(v) : null);
  const mapCore = (v) => Number(v) || 0;

  return {
    name,
    cuisine: typeof ai.cuisine === "string" && ai.cuisine.trim() ? ai.cuisine.trim() : "—",
    weight: g,
    description: typeof ai.description === "string" ? ai.description : "",
    nutrients: {
      // Core macros (always a number)
      energy:   mapCore(per.energy),
      protein:  mapCore(per.protein),
      fat:      mapCore(per.fat),
      carbs:    mapCore(per.carbs),
      fiber:    mapCore(per.fiber),
      sodium:   mapCore(per.sodium),
      // Extended — null means "no data"
      saturatedFat:       mapN(per.saturatedFat),
      transFat:           mapN(per.transFat),
      monounsaturatedFat: mapN(per.monounsaturatedFat),
      polyunsaturatedFat: mapN(per.polyunsaturatedFat),
      omega3:             mapN(per.omega3),
      cholesterol:        mapN(per.cholesterol),
      sugar:              mapN(per.sugar),
      addedSugar:         mapN(per.addedSugar),
      starch:             mapN(per.starch),
      glucose:            mapN(per.glucose),
      fructose:           mapN(per.fructose),
      sucrose:            mapN(per.sucrose),
      lactose:            mapN(per.lactose),
      maltose:            mapN(per.maltose),
      galactose:          mapN(per.galactose),
      potassium:          mapN(per.potassium),
      calcium:            mapN(per.calcium),
      iron:               mapN(per.iron),
      phosphorus:         mapN(per.phosphorus),
      selenium:           mapN(per.selenium),
      zinc:               mapN(per.zinc),
      vitaminA:           mapN(per.vitaminA),
      retinol:            mapN(per.retinol),
      betaCarotene:       mapN(per.betaCarotene),
      thiamine:           mapN(per.thiamine),
      riboflavin:         mapN(per.riboflavin),
      vitaminB6:          mapN(per.vitaminB6),
      folate:             mapN(per.folate),
      vitaminB12:         mapN(per.vitaminB12),
      vitaminC:           mapN(per.vitaminC),
      vitaminD:           mapN(per.vitaminD),
      vitaminE:           mapN(per.vitaminE),
      vitaminK:           mapN(per.vitaminK),
      water:              mapN(per.water),
      nitrogen:           mapN(per.nitrogen),
    },
    source,
    manualLookup: !!manualLookup
  };
}

if (dropZone && imageInput) {
  dropZone.addEventListener("click", (e) => {
    if (e.target === imageInput) return;
    imageInput.click();
  });
}

if (analyzeBtn) analyzeBtn.addEventListener("click", () => handleAnalysis(null));
if (clearBtn) clearBtn.addEventListener("click", clearAll);
if (unitSelect) unitSelect.addEventListener("change", () => renderNutritionalTable());

document.addEventListener("DOMContentLoaded", displayHistory);

if (imageInput) {
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      handleAnalysisError("Image is too large (max 4 MB).");
      return;
    }
    if (!file.type.startsWith("image/")) {
      handleAnalysisError("Please choose an image file.");
      return;
    }
    pendingFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target && ev.target.result;
      if (typeof dataUrl !== "string") return;
      const parts = dataUrl.split(",");
      currentBase64 = parts[1] || "";
      currentMime = file.type || "image/jpeg";
      if (preview) {
        preview.src = dataUrl;
        preview.classList.remove("hidden");
      }
      if (uploadPrompt) uploadPrompt.classList.add("hidden");
      if (analyzeBtn) analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  });
}

if (manualSearchBtn && manualFoodInput) {
  manualSearchBtn.addEventListener("click", async () => {
    const dishName = manualFoodInput.value.trim();
    if (!dishName) return;
    if (manualSearchUI) manualSearchUI.classList.add("hidden");
    await handleAnalysis({ query: dishName });
  });
  manualFoodInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      manualSearchBtn.click();
    }
  });
}

async function handleAnalysis(manualParams) {
  const isManual = !!(manualParams && manualParams.query && String(manualParams.query).trim());

  setLoading(true, isManual ? `Looking up "${manualParams.query}"…` : "Analyzing photo…");
  if (results) results.classList.add("hidden");
  if (controls) controls.classList.add("hidden");

  try {
    let data;
    if (isManual) {
      const fn = httpsCallable(functions, "lookupFoodByName");
      const res = await fn({ query: manualParams.query.trim() });
      data = res.data;
      currentMealData = mapServerPayloadToMeal(data, true);
    } else {
      if (!currentBase64) throw new Error("Select a photo first.");
      const fn = httpsCallable(functions, "recognizeFood");
      const res = await fn({
        imageBase64: currentBase64,
        mimeType: currentMime || "image/jpeg"
      });
      data = res.data;
      currentMealData = mapServerPayloadToMeal(data, false);
    }

    if (!currentMealData) {
      throw new Error("No dish identified. Try another photo or search manually.");
    }

    renderNutritionalTable();
    const thumb = pendingFile ? await createThumbnailDataUrl(pendingFile) : "";
    saveToHistory({
      dishName: currentMealData.name,
      cuisine: currentMealData.cuisine || "—",
      thumbDataUrl: thumb,
      ai: {
        dish: currentMealData.name,
        searchableName: currentMealData.name,
        estimatedWeightGrams: currentMealData.weight,
        description: currentMealData.description,
        cuisine: "—"
      },
      per100g: currentMealData.nutrients,
      source: currentMealData.source,
      manualLookup: currentMealData.manualLookup
    });
    if (manualFoodInput) manualFoodInput.value = "";
  } catch (err) {
    console.error(err);
    const msg =
      err && typeof err.message === "string" && err.message
        ? err.message
        : mapCallableError(err);
    handleAnalysisError(msg);
  } finally {
    setLoading(false);
  }
}

function createThumbnailDataUrl(file, maxW = 320) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxW) {
        h = Math.round((h * maxW) / w);
        w = maxW;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("");
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      } catch {
        resolve("");
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("");
    };
    img.src = url;
  });
}

function saveToHistory(entry) {
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    history = [];
  }
  history.unshift({
    date: new Date().toLocaleString(),
    ...entry
  });
  if (history.length > MAX_ENTRIES) history.length = MAX_ENTRIES;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  displayHistory();
}

function safeDataImageUrl(u) {
  if (typeof u !== "string" || !u.startsWith("data:image/")) return "";
  return u;
}

function displayHistory() {
  if (!historyContainer) return;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    history = [];
  }

  if (history.length === 0) {
    historyContainer.innerHTML =
      "<p class=\"text-slate-400 text-center py-8 italic\">No scans yet. Your history will appear here.</p>";
    return;
  }

  historyContainer.innerHTML = history
    .map((item, index) => {
      const dish =
        typeof item.dishName === "string" && item.dishName
          ? item.dishName
          : "Meal";
      const dataUrl = safeDataImageUrl(item.thumbDataUrl);
      const thumb = dataUrl
        ? `<img class="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0" src="${dataUrl.replace(/"/g, "&quot;")}" alt="" />`
        : `<div class="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0"><i class="fas fa-utensils"></i></div>`;
      return `
        <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-3 items-center">
          ${thumb}
          <div class="flex-1 min-w-0">
            <div class="font-bold text-slate-800 truncate">${escapeHtml(dish)}</div>
            <div class="text-[10px] text-slate-400">${escapeHtml(item.date)}</div>
          </div>
          <button type="button" class="text-slate-300 hover:text-red-500 p-1 text-sm" data-delete-idx="${index}" aria-label="Delete">✕</button>
        </div>`;
    })
    .join("");

  historyContainer.querySelectorAll("[data-delete-idx]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.getAttribute("data-delete-idx"), 10);
      deleteHistoryItem(i);
    });
  });
}

function deleteHistoryItem(index) {
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    history = [];
  }
  if (index >= 0 && index < history.length) {
    history.splice(index, 1);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
  displayHistory();
}

function renderNutritionalTable() {
  if (!currentMealData || !results) return;

  const unit = unitSelect ? unitSelect.value : "g";
  const grams = currentMealData.weight;
  const factor = grams / 100;
  const n = currentMealData.nutrients;

  let displayWeight = String(grams);
  let label = "g";
  if (unit === "oz") {
    displayWeight = (grams / 28.3495).toFixed(1);
    label = "oz";
  } else if (unit === "lb") {
    displayWeight = (grams / 453.592).toFixed(2);
    label = "lb";
  }

  const portionNote = currentMealData.manualLookup
    ? "200 g default portion · USDA search (manual)"
    : "AI portion estimate · scaled from per 100 g";

  const tableHeader = `
    <thead>
      <tr class="text-slate-400 font-semibold border-b border-slate-100">
        <td class="py-2 text-xs">Nutrient</td>
        <td class="py-2 text-right text-xs">Per 100g</td>
        <td class="py-2 text-right text-xs text-sky-600">Total</td>
      </tr>
    </thead>`;

  const sectionHeader = (title) =>
    `<tr><td colspan="3" class="pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">${escapeHtml(title)}</td></tr>`;

  results.innerHTML = `
    <div class="border-b border-slate-100 pb-4">
      <h3 class="text-2xl font-bold text-slate-800">${escapeHtml(currentMealData.name)}</h3>
      ${currentMealData.cuisine && currentMealData.cuisine !== "—"
        ? `<span class="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-100">${escapeHtml(currentMealData.cuisine)}</span>`
        : ""}
      <p class="text-slate-500 text-sm mt-2">${escapeHtml(currentMealData.description || "—")}</p>
    </div>

    <div class="bg-sky-50 p-4 rounded-2xl flex items-center justify-between mt-4">
      <span class="text-sky-800 font-bold">Estimated Portion</span>
      <span class="text-sky-600 font-black text-xl">${escapeHtml(displayWeight)} ${escapeHtml(label)}</span>
    </div>
    <p class="text-[10px] text-slate-400 mt-2">${escapeHtml(portionNote)}</p>

    <table class="w-full text-sm mt-4">
      ${tableHeader}
      <tbody>
        ${renderNutrientRow("Energy (kcal)", n.energy, factor, true)}
        ${renderNutrientRow("Protein (g)", n.protein, factor, true)}
        ${renderNutrientRow("Total Fat (g)", n.fat, factor, true)}
        ${renderNutrientRow("Carbohydrate (g)", n.carbs, factor, true)}
        ${renderNutrientRow("Dietary Fibre (g)", n.fiber, factor, true)}
        ${renderNutrientRow("Sodium (mg)", n.sodium, factor, true)}
      </tbody>
    </table>

    <details class="mt-4 group">
      <summary class="cursor-pointer select-none list-none flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">
        <span>Full Nutritional Breakdown</span>
        <span class="text-slate-400 group-open:rotate-180 transition-transform inline-block">▾</span>
      </summary>
      <div class="mt-2 px-1">
        <table class="w-full text-sm">
          ${tableHeader}
          <tbody>
            ${sectionHeader("Fats")}
            ${renderNutrientRow("Saturated Fat (g)", n.saturatedFat, factor)}
            ${renderNutrientRow("Trans Fat (g)", n.transFat, factor)}
            ${renderNutrientRow("Monounsaturated Fat (g)", n.monounsaturatedFat, factor)}
            ${renderNutrientRow("Polyunsaturated Fat (g)", n.polyunsaturatedFat, factor)}
            ${renderNutrientRow("Omega-3 EPA+DHA (mg)", n.omega3, factor)}
            ${renderNutrientRow("Cholesterol (mg)", n.cholesterol, factor)}

            ${sectionHeader("Carbohydrates & Sugars")}
            ${renderNutrientRow("Sugar (g)", n.sugar, factor)}
            ${renderNutrientRow("Added Sugar (g)", n.addedSugar, factor)}
            ${renderNutrientRow("Starch (g)", n.starch, factor)}
            ${renderNutrientRow("Glucose (g)", n.glucose, factor)}
            ${renderNutrientRow("Fructose (g)", n.fructose, factor)}
            ${renderNutrientRow("Sucrose (g)", n.sucrose, factor)}
            ${renderNutrientRow("Lactose (g)", n.lactose, factor)}
            ${renderNutrientRow("Maltose (g)", n.maltose, factor)}
            ${renderNutrientRow("Galactose (g)", n.galactose, factor)}

            ${sectionHeader("Minerals")}
            ${renderNutrientRow("Potassium (mg)", n.potassium, factor)}
            ${renderNutrientRow("Calcium (mg)", n.calcium, factor)}
            ${renderNutrientRow("Iron (mg)", n.iron, factor)}
            ${renderNutrientRow("Phosphorus (mg)", n.phosphorus, factor)}
            ${renderNutrientRow("Selenium (μg)", n.selenium, factor)}
            ${renderNutrientRow("Zinc (mg)", n.zinc, factor)}

            ${sectionHeader("Vitamins")}
            ${renderNutrientRow("Vitamin A (μg)", n.vitaminA, factor)}
            ${renderNutrientRow("Retinol (μg)", n.retinol, factor)}
            ${renderNutrientRow("β-Carotene (μg)", n.betaCarotene, factor)}
            ${renderNutrientRow("Thiamine B1 (mg)", n.thiamine, factor)}
            ${renderNutrientRow("Riboflavin B2 (mg)", n.riboflavin, factor)}
            ${renderNutrientRow("Vitamin B6 (mg)", n.vitaminB6, factor)}
            ${renderNutrientRow("Folate B9 (μg)", n.folate, factor)}
            ${renderNutrientRow("Vitamin B12 (μg)", n.vitaminB12, factor)}
            ${renderNutrientRow("Vitamin C (mg)", n.vitaminC, factor)}
            ${renderNutrientRow("Vitamin D (IU)", n.vitaminD, factor)}
            ${renderNutrientRow("Vitamin E (mg)", n.vitaminE, factor)}
            ${renderNutrientRow("Vitamin K (μg)", n.vitaminK, factor)}

            ${sectionHeader("Other")}
            ${renderNutrientRow("Water (g)", n.water, factor)}
            ${renderNutrientRow("Nitrogen (g)", n.nitrogen, factor)}
          </tbody>
        </table>
      </div>
    </details>

    <p class="text-[10px] text-slate-400 italic text-right mt-4">${escapeHtml(currentMealData.source)}</p>
  `;

  results.classList.remove("hidden");
  if (controls) controls.classList.remove("hidden");
}

function renderNutrientRow(name, value, factor, primary = false) {
  const hasData = value !== null && value !== undefined && Number.isFinite(Number(value));
  const val = hasData ? Number(value) : null;
  const per100Display = hasData ? val.toFixed(1) : "—";
  const totalDisplay  = hasData ? (val * factor).toFixed(1) : "—";
  const rowClass   = primary ? "border-b border-slate-100" : "border-b border-slate-50";
  const nameClass  = primary ? "py-2.5 text-slate-700 font-semibold text-sm" : "py-2 text-slate-500 text-sm";
  const per100Class = primary ? "py-2.5 text-right font-medium text-slate-400 text-sm" : "py-2 text-right text-slate-400 text-sm";
  const totalClass = primary ? "py-2.5 text-right font-bold text-slate-800 text-sm" : "py-2 text-right font-medium text-slate-600 text-sm";
  return `
    <tr class="${rowClass}">
      <td class="${nameClass}">${escapeHtml(name)}</td>
      <td class="${per100Class}">${escapeHtml(per100Display)}</td>
      <td class="${totalClass}">${escapeHtml(totalDisplay)}</td>
    </tr>
  `;
}

function setLoading(show, text = "Loading…") {
  if (loadingText) loadingText.textContent = text;
  if (loading) loading.classList.toggle("hidden", !show);
  if (analyzeBtn) analyzeBtn.disabled = show;
}

function handleAnalysisError(msg) {
  const safe = escapeHtml(msg);
  if (results) {
    results.innerHTML = `
    <div class="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium" role="alert">
      ⚠️ Analysis failed: ${safe}
    </div>`;
    results.classList.remove("hidden");
  }
  if (controls) controls.classList.add("hidden");
  if (manualSearchUI) manualSearchUI.classList.remove("hidden");
}

function clearAll() {
  currentMealData = null;
  currentBase64 = null;
  currentMime = null;
  pendingFile = null;
  if (preview) {
    preview.src = "";
    preview.classList.add("hidden");
  }
  if (uploadPrompt) uploadPrompt.classList.remove("hidden");
  if (results) {
    results.innerHTML = "";
    results.classList.add("hidden");
  }
  if (controls) controls.classList.add("hidden");
  if (manualSearchUI) manualSearchUI.classList.add("hidden");
  if (manualFoodInput) manualFoodInput.value = "";
  if (imageInput) imageInput.value = "";
  if (analyzeBtn) analyzeBtn.disabled = true;
}
