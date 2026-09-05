# Campus & Coast website release — 2026-09-06

## Scope and source

The owner approved extending the diary identity to the whole main website and linked first-party pages. Maintenance onboarding was drafted and pushed first in commit `dcad5ca`, before redesign changes began. The review branch is `codex/campus-coast-site`, in a separate local worktree `~/raj-site-campus-coast`; the original `~/raj-site` checkout and its local history are preserved.

The website uses an editorial homepage with a bridge hero, portrait, AI tools, leadership history, ventures, education and credentials. Linked English/Japanese pages share the typography, colour tokens, navigation and reading surfaces. The Command Center gets a coordinated slate workspace, responsive navigation and a rebuilt overview. The diary retains its approved identity and independent authentication.

No content ingestion, Hosting rewrite change, DNS change, Firestore write or API deployment is part of this visual release. The current live content inventory has 18 entities. Local preview content additionally includes a to-do app; it is not silently ingested into production.

## Build and dependency notes

The main website and Command Center use Next.js 15.5.25 for this release. The Command Center previously used 14.1.0; its Pages Router and API base path are preserved. Primary chart series use coastal slate while semantic success/risk colours remain. PostCSS and Sharp overrides resolve transitive dependency advisories without a Next major-version migration. The diary remains a separate deployed release; its app source/deployment record is in `DIARY_RELEASE.md`.

Build inputs are staged with `scripts/stage-site-release.py`, excluding diary content, environment files, caches and unrelated projects. The Command Center has its own ignore files and Dockerfile. Its build must set `NEXT_PUBLIC_API_URL=https://command-center-api-537634522206.us-central1.run.app`.

## Validation

- Site/content regression suite: 36 tests passed.
- Diary access suite: 17 tests passed.
- Main and Command Center production builds: passed before release staging.
- Local English/Japanese route crawl: 42 reachable routes returned HTTP 200.
- These are build, source and HTTP checks. Browser visual/interaction testing and an interactive Google OAuth login were not performed in this release.

## Deployment and rollback

The services were updated by image only, preserving environment variables, secrets, service accounts and routing.

Previous main revision: `kakehashi-app-00021-clj`.
Previous Command Center revision: `command-center-web-00003-8lm`.

If live checks fail, route traffic back to the previous revision for that service; do not change unrelated services or Firebase Hosting.

## Published release

Source implementation commit: `16eb700` on `codex/campus-coast-site` (PR #1).

| Service | Ready revision | Image tag | Cloud Build |
| --- | --- | --- | --- |
| Main website | `kakehashi-app-00022-5r2` | `kakehashi-app:campus-coast-20260906-1` | `22241b91-171d-41d1-a8d3-9a14bb6ddf7a` |
| Command Center | `command-center-web-00004-5df` | `command-center-web:campus-coast-20260906-1` | `a3502217-176f-48b3-948f-3e9ac90a0803` |

Both images are in `us-central1-docker.pkg.dev/rajagobalan-site/cloud-run-source-deploy`. Both revisions serve 100% of their respective service traffic. Previous revisions above remain the rollback targets.

Live main-site checks: all 40 reachable English/Japanese routes returned HTTP 200. Both homepages contain the new Campus & Coast markup. The bridge asset, monogram and optimized image endpoint returned 200. `/diary` returned 200, and the apex GET retained its 301 redirect. The 42-route local preview includes the additional unpublished to-do app, explaining the count difference.

Primary text/background contrast checks ranged from 6.08:1 to 14.12:1 across body, muted copy, buttons, cardinal/slate accents, dark mode and footer. These are token-pair calculations, not a substitute for browser accessibility testing.

Live Command Center checks: all 10 pages returned HTTP 200 and the new workspace markup, the application icon returned 200, and the existing API health endpoint returned 200 with the expected www CORS origin. Route evidence is saved in `docs/verification/campus-coast-public-routes.json` and `docs/verification/campus-coast-command-center-routes.json`.
