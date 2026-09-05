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

Record final revisions and live smoke checks below after publishing. Update only the service image, preserving environment variables, secrets, service account and routing.

Previous main revision: `kakehashi-app-00021-clj`.
Previous Command Center revision: `command-center-web-00003-8lm`.

If live checks fail, route traffic back to the previous revision for that service; do not change unrelated services or Firebase Hosting.
