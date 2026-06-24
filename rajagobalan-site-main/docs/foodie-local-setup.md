# Foodie AI — Local Development Setup

**App:** Foodie AI PWA
**Stack:** Firebase Hosting (static) + Firebase Cloud Functions (2nd gen)
**Local URL:** `http://localhost:4173/foodie/`

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 22.x | https://nodejs.org |
| npm | 10.x+ | Bundled with Node |
| Firebase CLI | Latest | `npm install -g firebase-tools` |
| Java (JRE) | 11+ | Required by Firebase emulator |

Verify installs:

```bash
node --version      # v22.x.x
npm --version       # 10.x.x
firebase --version  # 13.x.x
java -version       # openjdk 11 or higher
```

---

## 1. Clone / Open the Project

```bash
cd "Enterprise AI Transformation"
```

---

## 2. Install Root Dependencies

```bash
npm install
```

---

## 3. Install Functions Dependencies

```bash
cd functions
npm install
cd ..
```

---

## 4. Configure API Keys

The Functions emulator reads secrets from `functions/.env`.
This file is **gitignored** — you must create it manually.

```bash
cp functions/.env.example functions/.env
```

Open `functions/.env` and fill in your keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
USDA_API_KEY=your_usda_api_key_here

# Optional — defaults to gemini-2.0-flash if not set
# GEMINI_MODEL=gemini-2.0-flash
```

### Getting API Keys

- **Gemini API key** — [Google AI Studio](https://aistudio.google.com/app/apikey)
- **USDA API key** — [FoodData Central API signup](https://fdc.nal.usda.gov/api-key-signup.html) (free, instant)

---

## 5. Firebase Login (first time only)

```bash
firebase login
```

Follow the browser prompt to authenticate with your Google account that has access to the Firebase project.

---

## 6. Run Locally

```bash
npm run local
```

This single command:
1. Builds the project (`vite build` + copies static files to `dist/`)
2. Starts the **Firebase Functions emulator** on port `5001`
3. Starts the **Vite preview server** on port `4173`

Both processes run concurrently. You will see output from both in the same terminal.

---

## 7. Open the App

```
http://localhost:4173/foodie/
```

The app automatically connects to the local Functions emulator when running on `localhost` — no config change needed.

---

## How It Works Locally

```
Browser (localhost:4173)
    │
    ├─ Static files served by Vite preview
    │   └─ apps/foodie-app/ → dist/foodie/
    │
    └─ Firebase Callable Functions → localhost:5001 (emulator)
            ├─ recognizeFood   (photo → Gemini + USDA)
            └─ lookupFoodByName (text → USDA only)
```

API keys are read from `functions/.env` by the emulator. They are **never** sent to the browser.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `apps/foodie-app/index.html` | Main PWA entry point |
| `apps/foodie-app/app.js` | All client-side logic |
| `apps/foodie-app/sw.js` | Service worker (offline cache) |
| `functions/index.js` | Cloud Functions — Gemini + USDA callables |
| `functions/.env` | Local secrets (gitignored — create manually) |
| `functions/.env.example` | Template for `.env` |
| `package.json` | Root scripts (`npm run local`, `npm run build`, `npm run deploy`) |
| `firebase.json` | Firebase project config (hosting rewrites, functions) |

---

## Available npm Scripts

| Script | What it does |
|--------|-------------|
| `npm run local` | Build + start emulator + start preview server |
| `npm run build` | Build only (outputs to `dist/`) |
| `npm run deploy` | Build + deploy hosting to Firebase |
| `npm run deploy:discipline` | Build + deploy hosting + Firestore + Functions |

---

## Troubleshooting

**Port already in use**
```bash
# Kill whatever is on port 4173 or 5001
lsof -ti:4173 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

**Emulator not starting — Java missing**
```bash
# macOS
brew install openjdk@11

# Ubuntu/Debian
sudo apt install openjdk-11-jre
```

**`GEMINI_API_KEY` not set error**
Check that `functions/.env` exists and contains a valid key. The emulator will print this error if the file is missing or the key is blank.

**Stale UI after code changes**
The service worker caches aggressively. Hard-reload in the browser:
- macOS: `Cmd + Shift + R`
- Windows/Linux: `Ctrl + Shift + R`

Or open DevTools → Application → Service Workers → click **Unregister**, then reload.

**Build fails with rollup error on Linux**
```bash
npm install @rollup/rollup-linux-x64-gnu --no-save   # x64
# or
npm install @rollup/rollup-linux-arm64-gnu --no-save  # ARM64
```

---

## Deploying to Production

Once testing is complete:

```bash
npm run deploy
```

Secrets for production are set on the Cloud Functions service directly — **not** from `functions/.env`:

```bash
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set USDA_API_KEY
```

---

*Last updated: 2026-03-31*
