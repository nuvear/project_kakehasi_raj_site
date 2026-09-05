# Rajkumar Rajagobalan — Campus & Coast

Source for the bilingual personal website, AI Leadership Diary, and linked AI Transformation Command Center.

## Maintenance engineer: start here

1. [Maintenance engineer onboarding](docs/MAINTENANCE_ENGINEER_ONBOARDING.md): architecture, access, source ownership, local setup and recovery.
2. [Campus & Coast brand guide](docs/CAMPUS_COAST_BRAND.md): the shared identity and its application across the website.
3. [Release engineering and hosting](docs/RELEASE_ENGINEER_HOSTING.md): Firebase Hosting and Cloud Run boundaries.
4. [Diary release and access management](docs/DIARY_RELEASE.md): the independent diary service.

This is a **public source repository**. Do not commit credentials, user reflections, private source archives or the restricted diary manuscript. Authorized maintainers restore the manuscript using `python3 apps/diary/scripts/restore-manuscript.py` before building that app.

## Local development

Use Node 20 and pnpm 9.12.0. Run `pnpm install --frozen-lockfile`, then `pnpm --filter web dev` for the public website. The local filesystem content provider is used unless `FIREBASE_PROJECT_ID` is set. See the onboarding guide before accessing production.

Run `pnpm test` for site and diary suites, and `pnpm --filter web build` for the public site build. The Command Center frontend is a separate npm project under `rajagobalan-site-main/apps/enterprise-ai-platform/frontend`; its production build needs `NEXT_PUBLIC_API_URL` set to the intended API.

The production domain is [www.rajagobalan.com](https://www.rajagobalan.com). Deployments use the existing Firebase/Cloud Run infrastructure. A styling update does not require content ingestion, DNS changes or a Firebase Hosting release.
