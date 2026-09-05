# Maintenance engineer onboarding

Start here for the website and AI Leadership Diary. This guide was prepared on 2026-09-06 before the Campus & Coast website redesign. Read the concrete release records before changing production.

## 1. First-hour orientation

1. Read this guide, `docs/RELEASE_ENGINEER_HOSTING.md`, `docs/DIARY_RELEASE.md`, and `docs/diary-design/BRAND.md`.
2. Confirm your repository and branch: the public GitHub repository is `nuvear/project_kakehasi_raj_site`. A maintenance checkpoint precedes the redesign on `codex/campus-coast-site`.
3. Inventory the whole checkout and inspect `git status`. Preserve unfinished work; do not use a blanket reset, clean, stash, or force-push.
4. Run `pnpm install --frozen-lockfile` using the repository's pnpm version. Never commit `.env`, dependency folders, build caches, generated credentials, or diary user exports.
5. Start the main shell with `pnpm --filter web dev`. Start the diary separately with `pnpm --filter @kakehashi/diary dev` after retrieving its restricted manuscript.
6. Run the relevant tests and production build. Check both English and Japanese routes, keyboard navigation, mobile layouts, and theme behavior for UI changes.
7. Read the release procedure for the specific service. The public website and diary have separate deployable images.

## 2. Architecture and route ownership

| Surface | Source | Production owner |
|---|---|---|
| `/` → `/en`; `/en/**`; `/ja/**` | `apps/web` | Cloud Run `kakehashi-app` |
| `/diary` and `/diary/**` | `apps/diary` | Cloud Run `ai-leadership-diary` |
| `/apps/ai-transformation-command-center/**` | `rajagobalan-site-main/apps/enterprise-ai-platform/frontend` | Cloud Run `command-center-web` |
| Command Center API host | sibling `backend` | Cloud Run `command-center-api` |
| HealthKit Sync subdomain | `healthkitsync` | separate Firebase Hosting target |

All Cloud Run services above are in project `rajagobalan-site`, region `us-central1`. Firebase Hosting target `main` is the CDN and route dispatcher. Pages come from Cloud Run, not a static export. The GoDaddy `www` CNAME points to Firebase; GoDaddy forwards the apex to www. Microsoft 365 DNS serves email and is unrelated to web releases.

Preserve rewrite order: Command Center exact route and descendants, diary exact route and descendants, then the Kakehashi catch-all. Locale-prefixed Command Center pages belong to Kakehashi. Never redirect those catalogue pages to the runtime implicitly.

## 3. Source map

- `apps/web/app/[locale]`: bilingual pages and metadata.
- `apps/web/components`: shared navigation, profile/experience content, article and analytical views.
- `apps/web/app/globals.css`: existing structural CSS. The new site brand layer is documented in the website redesign release record when available.
- `content`: public bilingual Markdown and YAML entities. Keep slugs, identifiers, links and dates stable during design work.
- `packages/db`: Firestore-backed and local/mock content providers.
- `apps/diary/app/diary.tsx`: client reading, workbooks, account UI and save queue.
- `apps/diary/app/api/[...path]/route.ts`: authenticated server operations.
- `apps/diary/lib/server.ts`: Firebase token verification and membership checks.
- `apps/diary/lib/model.ts`: accepted state shape, limits and deterministic calculations.
- `apps/diary/content/diary.json`: restricted manuscript snapshot; intentionally excluded from public Git.
- `apps/diary/content/dimensions.json` and `signals.json`: public interface definitions.
- `docs/diary-design`: adopted identity, palette, typography, source references and photo attribution.

## 4. Public repository versus restricted content

The repository is public. Keep full diary manuscript content and user work out of it. The diary's protected content endpoint does not make a public Git copy private.

An authorized engineer can retrieve the deployed manuscript using `apps/diary/scripts/restore-manuscript.py`. This uses the existing private Cloud Build source archive, extracts only the known manuscript file, and verifies its recorded SHA-256. It requires Google Cloud read access to the private build-source object. It never changes bucket visibility. The file remains ignored by Git after restoration.

The original editorial sources remain with the owner in `Apple_Intelligence/EnterpriseAIFramework/12-week-workshop/diary/split_manuscript`. Edit those Markdown files, run the original compiler, then update the restricted snapshot through the owner-approved release process. Do not hand-edit the original generated JS or publish the manuscript to public storage.

Public Firebase browser configuration is not a server credential. Never commit Firebase Admin private keys, Google access tokens, client secrets, service-account JSON, user exports, or real reflections. Runtime services use workload identity/Application Default Credentials.

## 5. Diary account operations

The owner email configured in `DIARY_OWNER_EMAIL` becomes the initial administrator only after Firebase verifies that email. Participants sign in with Google or email/password, verify email, and request access. New memberships are pending. Use **Manage access** to approve, revoke, or change a participant's role.

Application administration does not grant Google Cloud/Firebase administration, and application administrators cannot read another participant's private reflections through diary APIs. The configured owner and the acting administrator's own membership are protected from changes in the account screen.

Collections:

| Collection | Purpose |
|---|---|
| `diaryMembers` | UID, verified email, role and access status |
| `diaryStates` | One private state document per Firebase UID, plus optimistic version |
| `diaryAccessAudit` | Actor, target and access changes |

Every protected operation verifies the Firebase bearer token, checks token revocation, and checks current membership on the server. Never replace that with a client-only route guard. Existing published Firestore rules deny direct client access to diary collections. Firebase Admin bypasses client rules, so server authorization is mandatory.

The application keeps diary edits in memory and saves to Firestore. Authentication uses browser-session persistence. Do not introduce a shared localStorage diary cache. On a save conflict, export unsaved work before loading the saved version. Do not silently overwrite another session.

## 6. Routine maintenance recipes

### Content or styling change

Preserve the manuscript, business calculations, stable IDs, bilingual routes and existing interactions. Use the brand guide for palette and type choices. Check the changed view in light/dark themes and at mobile width. Run the corresponding production build; visual changes alone do not require changing database schemas, Firebase providers or DNS.

### A participant cannot sign in

Check provider enablement, authorized domain, verified email, and the participant's membership status. A revoked or pending membership is not a password problem. For Google popup issues, let the participant complete the actual Google sign-in; do not collect their password or bypass verification. Password reset and email verification use Firebase's configured email flow.

### Diary changes are not saving

Check the displayed error, authentication/session state, `/diary/api/health`, Cloud Run logs, service-account permissions, and Firestore availability. A 409 means another session saved a newer version; preserve the user's unsaved export. A 401 is an identity/session issue; a 403 is email or membership access. Do not log workbook payloads while diagnosing.

### Main website content looks stale

Determine whether the issue is the deployed image, bundled content or Firestore content. Kakehashi may require ingestion after deliberate public content changes. Do not run ingest merely for a color or layout release. The historic nine-entity migration count is a previous release baseline, not a permanent invariant after authorized content expansion.

### Command Center writes disappear

Its API uses ephemeral SQLite in Cloud Run. This is a known showcase limitation; diary persistence is Firestore-backed and is independent. Do not represent Command Center SQLite as durable production storage.

## 7. Test and release discipline

Run from the repository root:

```sh
pnpm test
pnpm --filter web build
pnpm --filter @kakehashi/diary test
pnpm --filter @kakehashi/diary build
```

Only run the diary build after its restricted content has been restored. The diary suite tests access boundaries, role changes, imports, version conflicts and calculator parity. `scripts/live-smoke.mjs` in that app creates disposable accounts for deployed checks, sends no emails, and removes the accounts and records afterward. Use it only against the intended service/project with an authorized Google identity.

Before production, record the current service revision, image digest, environment variable names, service account and Hosting release. Build an image from the reviewed commit. Preserve runtime variables and secrets when updating only an image. The Kakehashi Dockerfile bundles `content/`; use it rather than Cloud Run source-buildpacks. The diary uses its own Dockerfile and minimal staging script.

For a visual-only main-site release, update `kakehashi-app`; do not rebuild or deploy the diary, API or unrelated apps. For a Command Center frontend theme update, rebuild its image with the existing `NEXT_PUBLIC_API_URL` baked in. Preserve `basePath`. Rebuild each owned UI that changed.

Deploy Firebase Hosting only when routing or hosted files changed. A route-only release may clone the live Hosting version and preserve its existing static-file hashes, as the diary release did. The diary `hosting-release.py` is a one-release record for the initial diary route addition; do not rerun it blindly for future changes.

After release, check `/`, `/en`, `/ja`, key linked detail pages, `/diary`, Command Center runtime and catalogue pages, API health and CORS. Test the apex with GET if GoDaddy rejects HEAD. Record actual checks and limitations rather than inheriting prior release claims.

## 8. Rollback and incident handover

Rollback a failed Cloud Run change by restoring traffic to the recorded previous ready revision of that service. A diary rollback must not target Kakehashi. Restore the prior Firebase Hosting version only if Hosting changed. Do not apply Terraform blindly: its known runtime settings differ from production. Do not delete Firestore, reset Auth users, or change DNS as a response to a UI issue.

In an incident handover, record the affected URL, UTC/Japan time, symptom, last known good revision, exact failing request/status, changes attempted and the rollback result. Exclude credentials and user content. Keep the release record, root hosting runbook, and this guide aligned with the actual deployed architecture.

## 9. Design extension scope authorized on 2026-09-06

The implemented extension is documented in [Campus & Coast brand guide](CAMPUS_COAST_BRAND.md) and [the website release record](CAMPUS_COAST_RELEASE.md). New maintenance work should start from the `codex/campus-coast-site` branch (PR #1) until it is merged; the original local checkout has separate earlier work.

The owner approved applying the diary's Campus & Coast identity to the entire main website and its first-party linked webpages. The main identity remains cardinal/sandstone/ivory with serif headings. Adjacent coastal or terracotta accents may distinguish analytical tools, ventures and education while retaining common navigation and typography. Preserve editorial content, English/Japanese parity and working tools. External sites reached by links remain external; they are not owned application surfaces.
