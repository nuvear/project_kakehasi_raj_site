# Project Kakehashi Current Migration Scope

Date: 2026-06-25

## Source Of Truth

Project Kakehashi started from:

- `project-kakehashi-requirements.md`
- the original site and application source under `rajagobalan-site-main/`

The newer monorepo implementation is recovery work toward that original objective. It should be corrected and extended, not treated as a fresh greenfield replacement.

## Active Recovery Wave

The current active migration scope is limited to three enterprise-AI items:

| Phase | Item | Legacy source | Target |
|---|---|---|---|
| 5.5 | Enterprise AI Reference Guide | `rajagobalan-site-main/enterprise-ai-reference-guide.md` | `/[locale]/insights/enterprise-ai-reference-guide` |
| 6.1 | Enterprise AI Transformation Framework | `rajagobalan-site-main/framework.html`, `rajagobalan-site-main/ai-transformation-framework.jsx` | `/[locale]/frameworks/enterprise-ai-transformation` |
| 7.1 | AI Transformation Command Center | `rajagobalan-site-main/ai-transformation-command-center.html`, `rajagobalan-site-main/deployment-guide.html`, `rajagobalan-site-main/apps/enterprise-ai-platform/` | `/[locale]/apps/ai-transformation-command-center` plus the Cloud Run sub-app boundary |

## Deferred From This Wave

These legacy items remain part of the overall inventory, but they are intentionally not active in this recovery wave:

- Blood Pressure App design
- Responsible AI Strategy and infographic
- Responsible AI Governance
- BP Chart
- CrewAI Guide
- Foodie AI
- Innuir / HealthKitSync

Do not migrate, rewrite, redirect, or remove those items unless the owner explicitly reopens their wave.

## Definition Of Done For The Active Wave

Each active item must pass these gates before it is treated as migrated:

- Source content is migrated from the original source tree, not replaced by placeholders.
- English canonical route renders deterministic content without the agent.
- Japanese route exists with an honest translation status; unreviewed machine text must not be presented as approved.
- Legacy route treatment is documented in `migrations/route-manifest.yaml`.
- Metadata, canonical links, alternate locale links, internal links, and old-route behavior are verified.
- The page or app remains usable when the agent/model layer is disabled.
- Rollback remains possible because the legacy source is preserved.

## Immediate Recovery Order

1. Lock the route manifest to the active wave.
2. Replace placeholder Reference Guide content with the full source markdown.
3. Restore the Framework canonical route and connect it to the Reference Guide.
4. Stabilize the Command Center as a registered app entry with a clear Cloud Run/sub-app boundary.
5. Run build, route, metadata, link, and smoke checks.

## Command Center Boundary Decision

The full AI Transformation Command Center runtime remains the existing Cloud Run sub-application at `/apps/ai-transformation-command-center`. The localized Kakehashi routes under `/[locale]/apps/ai-transformation-command-center` are canonical shell entry pages that describe and launch the runtime; they are not a replacement for the full sub-app.

The legacy `deployment-guide.html` source is explicitly marked `Internal — Confidential`. The localized Kakehashi deployment docs route should therefore expose only reviewed public deployment notes until the owner approves the full runbook disclosure level.

The current runtime/API/CORS contract is recorded in `docs/command-center-runtime-contract.md`. On 2026-06-25, production `command-center-api` was updated so browser preflight from `https://www.rajagobalan.com` succeeds instead of returning `400 Disallowed CORS origin`.

## Production Alignment Snapshot

On 2026-06-25, the active wave was aligned in production:

- `kakehashi-app` was deployed from the root Dockerfile to revision `kakehashi-app-00015-td2` using image tag `manual-20260625-4`.
- The root Dockerfile build asserts that `/app/content` contains the active migration content and does not contain a nested `content/content` duplicate.
- Firestore was refreshed through `/api/ingest`; the final clean run processed 9 entities.
- Firebase Hosting target `main` serves localized Kakehashi app entry pages while preserving `/apps/ai-transformation-command-center` as the standalone runtime path.
- `command-center-web` was rebuilt and deployed to revision `command-center-web-00003-8lm`.
- `command-center-api` remains on CORS-fixed revision `command-center-api-00003-hjb`.

Do not rely on Cloud Run source-buildpack deploys for the Kakehashi shell. The active production contract is explicit Docker image build, Cloud Run deploy, Firestore ingest, Firebase Hosting deploy if routing changes, then route and browser smoke checks.
