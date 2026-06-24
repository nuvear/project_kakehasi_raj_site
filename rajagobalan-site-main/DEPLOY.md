# Deployment Guide — rajagobalan-site

This document is the single authoritative reference for how both public URLs are built and deployed. Read this before making any infrastructure change.

---

## The Two-URL Map

| Public URL | Firebase Hosting Target | Source Folder (in repo) | Build Step |
|---|---|---|---|
| `www.rajagobalan.com` | `main` | `dist/` (built from repo root) | `npm run build` |
| `healthkitsync.rajagobalan.com` | `healthkitsync` | `healthkitsync/` (built from `healthkitsync-src/`) | `pnpm --prefix healthkitsync-src run build` |

Both targets live in the same repository: **`nuvear/rajagobalan-site`**.

---

## The One Deploy Path

```
git push origin main
    ↓
GitHub Actions: .github/workflows/deploy.yml
    ↓
1. npm ci                          (install root deps)
2. npm run build                   (build main site → dist/)
3. pnpm --prefix healthkitsync-src install
4. pnpm --prefix healthkitsync-src run build
5. cp -r healthkitsync-src/dist/public healthkitsync
    ↓
firebase deploy --only hosting --token $FIREBASE_TOKEN
    ↓
Both targets deployed simultaneously
```

**There is no other deploy path.** Do not run `firebase deploy` manually unless recovering from a CI outage.

---

## Repository Structure

```
rajagobalan-site/
├── dist/                    ← Built main site (gitignored)
├── healthkitsync/           ← Built HealthKitSync portal (gitignored)
├── healthkitsync-src/       ← HealthKitSync source (React + Vite + pnpm)
│   └── client/
│       └── public/
│           └── tasks.json   ← Live plan data — edit this to update the portal
├── firebase.json            ← Hosting targets, rewrites, cache headers
├── .firebaserc              ← Target aliases (main, healthkitsync)
├── .github/workflows/
│   └── deploy.yml           ← CI/CD pipeline
└── DEPLOY.md                ← This file
```

---

## Required GitHub Secret

| Secret Name | Purpose | How to Rotate |
|---|---|---|
| `FIREBASE_TOKEN` | Authenticates `firebase deploy` in CI | Run `npx firebase-tools login:ci` locally, then update the secret in GitHub → Settings → Secrets → Actions |

---

## Cache Policy

| Asset Type | Cache-Control | Rationale |
|---|---|---|
| `*.html` | `no-cache, no-store, must-revalidate` | Always fetch latest shell |
| `*.js`, `*.css` | `public, max-age=31536000, immutable` | Vite hashes filenames; safe to cache forever |
| `tasks.json` | `no-cache, no-store, must-revalidate` | Live plan data; must always be fresh |

---

## DNS Records

Both domains point to Firebase Hosting via CNAME. Verify in Firebase Console → Hosting → Custom domains.

| Domain | Type | Points to |
|---|---|---|
| `www.rajagobalan.com` | CNAME | `rajagobalan-site.web.app` |
| `healthkitsync.rajagobalan.com` | CNAME | `rajagobalan-site-healthkitsync.web.app` |
| `rajagobalan.com` (apex) | A | Firebase IP (redirects to www) |

---

## Uptime Monitoring

Both URLs are monitored via **UptimeRobot** (free tier). Alerts are sent by email on HTTP non-200 or timeout > 10 s.

- Monitor 1: `https://www.rajagobalan.com` — keyword check: `Rajagobalan`
- Monitor 2: `https://healthkitsync.rajagobalan.com` — keyword check: `HealthKitSync`

---

## Cross-Reference

| Topic | Document |
|---|---|
| HealthKitSync product spec | `nuvear/healthkit` → `README.md` |
| SwiftUI implementation guide | `nuvear/healthkit` → `DEVELOPER_GUIDE.md` |
| Live plan data | `healthkitsync-src/client/public/tasks.json` |
| Firebase hosting config | `firebase.json` |
| CI/CD pipeline | `.github/workflows/deploy.yml` |

---

*Last updated: 1 Apr 2026*
