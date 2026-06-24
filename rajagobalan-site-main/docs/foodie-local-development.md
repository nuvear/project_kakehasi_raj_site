# Foodie AI — Local Development Setup

**App:** Foodie AI PWA  
**Stack:** Firebase Hosting (static) + Firebase Cloud Functions (2nd gen)  
**Local URL:** `http://localhost:4173/foodie/`

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 22.x (see `functions/package.json` `engines`) | https://nodejs.org |
| npm | 10.x+ | Bundled with Node |
| Firebase CLI | Latest (this repo pins `firebase-tools` in root `devDependencies`) | `npm install -g firebase-tools` or use `npx firebase` |
| Java (JRE) | 11+ | Optional for **functions-only** emulator; required if you run other emulators (e.g. Firestore) or full Emulator Suite |

Verify installs:

```bash
node --version      # v22.x.x recommended
npm --version       # 10.x.x
firebase --version
java -version       # if using emulators that need the JVM
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

# Optional — defaults in code if not set (see functions/index.js)
# GEMINI_MODEL=gemini-2.0-flash
```

### Getting API Keys

- **Gemini API key** — [Google AI Studio](https://aistudio.google.com/app/apikey)
- **USDA API key** — [FoodData Central API signup](https://fdc.nal.usda.gov/api-key-signup.html) (free, instant)

---

## 5. Firebase Login (first time only)

Required for **`firebase deploy`**. For local emulator-only work you may still need a default project (`.firebaserc`).

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

1. Builds the project (`vite build` + `copy-discipline` + `copy-foodie` → `dist/`)
2. Starts the **Firebase Functions emulator** on port **5001**
3. Starts the **Vite preview server** on port **4173**

Both processes run concurrently. You will see output from both in the same terminal.

---

## 7. Open the App

```
http://localhost:4173/foodie/
```

The app connects to the **Functions emulator** when the hostname is `localhost` or `127.0.0.1` (see `apps/foodie-app/app.js` → `connectFunctionsEmulator`). No extra client config is required.

---

## How It Works Locally

```
Browser (localhost:4173)
    │
    ├─ Static files served by Vite preview
    │   └─ apps/foodie-app/ → dist/foodie/ (after build)
    │
    └─ Firebase Callable Functions → 127.0.0.1:5001 (emulator)
            ├─ recognizeFood   (photo → Gemini REST + USDA)
            └─ lookupFoodByName (text → USDA only)
```

API keys are read from `functions/.env` by the emulator. They are **never** sent to the browser.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `apps/foodie-app/index.html` | Main PWA entry point |
| `apps/foodie-app/app.js` | Client logic, callables, localStorage diary |
| `apps/foodie-app/sw.js` | Service worker (cache; bump version when changing SW) |
| `apps/discipline-app/firebase-config.js` | Copied to `dist/foodie/firebase-config.js` at build |
| `functions/index.js` | Cloud Functions — Gemini + USDA callables |
| `functions/.env` | Local secrets (gitignored — create manually) |
| `functions/.env.example` | Template for `.env` |
| `package.json` | Root scripts (`npm run local`, `npm run build`, `npm run deploy`) |
| `firebase.json` | Hosting rewrites (`/foodie/`), functions config |

---

## Available npm Scripts

| Script | What it does |
|--------|----------------|
| `npm run local` | Build + Functions emulator + Vite preview (4173) |
| `npm run build` | Build only → `dist/` |
| `npm run deploy` | **Build + deploy Hosting only** (`firebase deploy --only hosting`) |
| `npm run deploy:discipline` | Build + deploy **hosting + Firestore + functions** |

To deploy **Functions** (API keys for production), use `npm run deploy:discipline` or:

```bash
npm run build && firebase deploy --only functions
```

(`npm run deploy` alone does **not** update Cloud Functions.)

---

## Troubleshooting

**Port already in use**

```bash
lsof -ti:4173 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

**Emulator not starting — Java missing** (if your Firebase tools version requires it)

```bash
# macOS
brew install openjdk@11
```

**`GEMINI_API_KEY` not set error**  
Check that `functions/.env` exists and contains valid keys. The emulator logs when it loads `.env`.

**Stale UI after code changes**  
Bump `apps/foodie-app/sw.js` `CACHE_NAME` and/or `index.html` `app.js?v=` query string. Hard-reload: macOS `Cmd+Shift+R`, Windows/Linux `Ctrl+Shift+R`, or DevTools → Application → Service Workers → Unregister.

**Build fails with rollup error on Linux**

```bash
npm install @rollup/rollup-linux-x64-gnu --no-save   # x64
# or
npm install @rollup/rollup-linux-arm64-gnu --no-save  # ARM64
```

---

## Deploying to Production

1. **Hosting (static site, including `/foodie/`):**

   ```bash
   npm run deploy
   ```

2. **Cloud Functions (Gemini + USDA):**  
   This repo reads **`process.env.GEMINI_API_KEY`**, **`USDA_API_KEY`**, and optional **`GEMINI_MODEL`** in `functions/index.js`. It does **not** use Firebase `defineSecret()` in code, so production keys are typically set as **environment variables** on the **Cloud Run** service that backs each function (Firebase Console → Functions → … → or Google Cloud Console → Cloud Run → select the service → **Edit & deploy new revision** → **Variables**).

   Alternatively, migrate to [Firebase parameterized configuration / secrets](https://firebase.google.com/docs/functions/config-env) and wire `secrets` in `onCall` if you want `firebase functions:secrets:set` — that would require a small code change today.

3. **Full stack (hosting + Firestore rules + functions):**

   ```bash
   npm run deploy:discipline
   ```

---

*Last updated: 2026-03-31*
