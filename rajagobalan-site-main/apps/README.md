# Apps layout

| Path | Role |
|------|------|
| `marketing-site/` | Marketing / public site — **Vite root is still repo root** (see `marketing-site/README.md`). |
| `discipline-app/` | Discipline MVP — copied to `dist/discipline/` on every `npm run build` (`scripts/copy-discipline.mjs`). Live at **`/discipline/`**. |
| `enterprise-ai-platform/` | Next.js AI platform (not part of Firebase static deploy unless separately integrated). |

## Rules (Phase 1)

- **Path-based app** at `https://www.rajagobalan.com/discipline/` — no subdomain, no Firebase multi-site.
- **Auth / backend**: defer to Phase 2 (Firebase Auth, Firestore, or subdomain when needed).
