# Deployment Guide — rajagobalan.com

Instructions for deploying this application to https://www.rajagobalan.com via Firebase Hosting.

---

## 1. Current Publication Status

| Item | Details |
|------|---------|
| **Platform** | Firebase Hosting |
| **Firebase project** | `rajagobalan-site` |
| **Live URL** | https://www.rajagobalan.com |
| **Content root** | `dist/` (Vite build output) |
| **Deployment type** | Build → Deploy (Vite + Firebase) |

### Deployed pages

| Path | File | Purpose |
|------|------|---------|
| `/` | `index.html` | Resume / Homepage |
| `/framework.html` | `framework.html` | Raj's Enterprise AI Framework (React app) |
| `/blogs.html` | `blogs.html` | Blogs page |
| `/blogs` | → `/blogs.html` | Rewrite for clean URL |
| `/discipline/` | `discipline/index.html` | Discipline app (MVP); source in `apps/discipline-app/`, copied to `dist/discipline/` after Vite build |
| `/discipline`, `/discipline/**` | → `/discipline/index.html` | Firebase rewrites (client-side routes later) |
| `/enterprise-ai-reference-guide.html` | `enterprise-ai-reference-guide.html` | Reference guide |
| `/404` | `404.html` | Custom 404 page |

### Configuration files

- **`firebase.json`** — Hosting config (`public: "dist"`, rewrites)
- **`.firebaserc`** — Firebase project ID (`rajagobalan-site`)
- **`vite.config.js`** — Multi-page build input

---

## 2. Prerequisites

1. **Node.js** (v18+ recommended) and **npm**

2. **Firebase CLI** installed:
   ```bash
   npm install -g firebase-tools
   ```

3. **Authentication**:
   ```bash
   firebase login
   ```

4. **Project access** — Deploy permissions for `rajagobalan-site`

---

## 3. Deployment Steps

### Build

```bash
npm install
npm run build
```

This produces the `dist/` directory with all HTML, JS, CSS, and static assets.

### Deploy to production

```bash
firebase deploy --only hosting
```

Or deploy everything:

```bash
firebase deploy
```

### One-liner

```bash
npm run build && firebase deploy --only hosting
```

---

## 4. Static Assets

- **`public/`** — Files here are copied to `dist/` root during build
  - `public/404.html` → `dist/404.html`
  - `public/profile.jpg` → `dist/profile.jpg` (add your photo here)

- **Profile photo** — Place `profile.jpg` in `public/` for the resume hero. If missing, the image is hidden via `onerror="this.remove()"`.

---

## 5. Preview Before Deploy

```bash
# Local preview of production build
npm run build && npm run preview

# Firebase preview channel (temporary live URL)
firebase hosting:channel:deploy preview
```

---

## 6. Post-Deployment Verification

1. **Homepage**: https://www.rajagobalan.com
2. **Framework**: https://www.rajagobalan.com/framework.html
3. **Blogs**: https://www.rajagobalan.com/blogs.html (or /blogs)
4. **Reference Guide**: https://www.rajagobalan.com/enterprise-ai-reference-guide.html
5. **404**: Visit a non-existent URL to confirm custom 404

---

## 7. Domain & Custom Setup

- **Primary domain**: `www.rajagobalan.com`
- **Blog subdomain**: `blogs.rajagobalan.com` → redirects to `/blogs/` (or `/blogs.html`)

Configure in [Firebase Console](https://console.firebase.google.com) → **Hosting** → **Custom domains**.

---

## 8. Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run build` | Build to `dist/` |
| `npm run preview` | Preview build locally |
| `firebase login` | Authenticate |
| `firebase deploy --only hosting` | Deploy to production |
| `firebase hosting:channel:deploy preview` | Create preview URL |

---

## 9. Troubleshooting

| Issue | Action |
|-------|--------|
| "Permission denied" | Check access to `rajagobalan-site` in Firebase Console |
| "Project not found" | Run `firebase use rajagobalan-site` |
| Build fails | Run `npm install` and ensure Node v18+ |
| Page returns 404 | Verify file is in Vite `input` (vite.config.js) or `public/` |
| Old content cached | Hard refresh (Ctrl+Shift+R / Cmd+Shift+R) |

---

## 10. Git repository & update workflow (GitHub: `nuvear/rajagobalan-site`)

Source for **www.rajagobalan.com** can live in a single Git repo (**https://github.com/nuvear/rajagobalan-site**). Use that URL only; `https://github.com/rajagobalan/rajagobalan-site` is not a valid repository. Firebase Hosting still deploys from your machine or CI; Git is the **version history**, not the live host.

### One-time: create the remote and push

1. On GitHub, create an empty repository named **`rajagobalan-site`** under the **`nuvear`** org (or your account), with no README/license if you already have local commits.
2. In the project root (skip `git init` / `commit` if this repo is already initialized with history):
   ```bash
   git init
   git branch -M main
   git remote add origin https://github.com/nuvear/rajagobalan-site.git
   git add -A
   git commit -m "Initial commit: rajagobalan.com site source"
   git push -u origin main
   ```

### Day-to-day: change the live site

Git records **source**; **Firebase** updates **production**. Typical loop:

1. **Branch** (optional but recommended): `git checkout -b feature/my-change`
2. **Edit** HTML/JS in `apps/`, root pages, `public/`, or `functions/` as needed.
3. **Build & check locally:**
   ```bash
   npm install
   cd functions && npm install && cd ..
   npm run build
   npm run preview
   ```
   For Foodie/Discipline APIs locally, use `npm run local` (see `docs/foodie-local-development.md`).
4. **Commit & push:**
   ```bash
   git add -A
   git commit -m "Describe the change"
   git push origin main    # or push your branch and open a PR, then merge to main
   ```
5. **Deploy to www.rajagobalan.com** (requires `firebase login` and access to project `rajagobalan-site`):
   - **Static site only:** `npm run deploy` (hosting)
   - **Hosting + Firestore + Cloud Functions:** `npm run deploy:discipline`

`dist/` is **not** committed (see `.gitignore`); production is always produced by `npm run build` at deploy time.

### Secrets

- Never commit **`functions/.env`**. Set production keys in **Google Cloud Console** → Cloud Run (Functions) → environment variables, or Firebase/GCP secrets as you prefer.
- Optional: add **`functions/.env.example`** to the repo (without real keys) as a template.

### GitHub Actions CI (automatic deploy on `main`)

The workflow **`.github/workflows/deploy.yml`** runs on every **push to `main`** (and can be triggered manually under **Actions → Deploy to Firebase → Run workflow**). It installs dependencies, runs **`npm run build`**, then **`firebase deploy --only hosting,firestore,functions`** to project **`rajagobalan-site`** — same targets as **`npm run deploy:discipline`**.

**One-time setup — repository secret**

1. On your machine (logged into Firebase with access to `rajagobalan-site`):
   ```bash
   firebase login:ci
   ```
   Copy the token it prints.
2. In GitHub: **nuvear/rajagobalan-site** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Name: **`FIREBASE_TOKEN`**
   - Value: paste the token from step 1.

Without **`FIREBASE_TOKEN`**, the workflow fails at the deploy step. Function runtime secrets (e.g. **`GEMINI_API_KEY`**) stay in **GCP / Cloud Run** — they are not set in GitHub; CI only uploads new function **code**.
