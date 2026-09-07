# Website session handoff — 7 September 2026

Read this file first when resuming the website enhancement task. This is a point-in-time handoff; verify Git and live service state before making a new release. The owner will provide further enhancements later. No enhancement is currently pending, and no background work is requested.

## Resume location and source control

- Active implementation worktree: `/Users/rajkumarrajagobalan/raj-site-campus-coast`.
- Branch: `codex/campus-coast-site`.
- GitHub: https://github.com/nuvear/project_kakehasi_raj_site (existing PR #1).
- Last implementation commit: `b20e8a1` (Stanford logo); release record: `f2ef3df`. Both pushed. Working tree was clean before this handoff.
- Preserve the original `/Users/rajkumarrajagobalan/raj-site` checkout and workshop source. The task's working directory can still be the workshop; always set the correct workdir explicitly.

## Owner's intent and accepted design

The site is a personal introduction, not a job application. Use an honest, humble, warm tone. Leadership must remain explicit: the owner has led teams across engineering, client delivery, regional portfolios, and venture building. Credit colleagues without understating his responsibility.

The owner approved the Campus & Coast branding inspired by Stanford buildings/website and the San Francisco bridge: cardinal accents, warm neutral surfaces, architectural photography. Preserve the adopted visual direction. The English profile uses GATE-inspired Geist Sans and Geist Mono, scoped to `/en`; do not silently apply its typography or editorial overrides to Japanese or other pages.

The owner wanted Stanford alumni status visible at first glance, then explicitly supplied the logo URL below. This is completed on `/en`. An ambient browser tab on `/ja` is not an instruction to extend English-only changes to Japanese.

## Completed work and entry points

- Website branding and linked-page redesign; engineer onboarding and GitHub updates. See `docs/MAINTENANCE_ENGINEER_ONBOARDING.md` and the existing hosting/release documentation.
- Timed education slideshow in both languages. See `docs/EDUCATION_SLIDESHOW.md`, `apps/web/lib/education-photos.ts`, and `apps/web/components/EducationSlideshow.tsx`. Seven institutions: Sainik School Amaravathinagar, American College Madurai, Madras Institute of Technology, Shizuoka Hamamatsu, Anaheim/Akio Morita, MIT USA, Stanford GSB. Rotation is six seconds while visible after image load, with accessible pause/manual selection and reduced-motion behavior.
- Exact owner-selected photos are already installed: American College attachment, Madras entrance attachment, Anaheim building attachment, and Shizuoka URL https://www.abp.icsu.shizuoka.ac.jp/images/schoollife/campus/img_ph02.jpg. Keep provenance/captions; do not describe Anaheim's pictured building as the Tokyo campus.
- Responsive review across main site, Command Center and Diary sign-in. See `docs/RESPONSIVE_REVIEW.md`, `scripts/check-responsive.cjs`, and retained evidence under `docs/verification/`. 51 public pages × five widths passed the published browser audit. Authenticated Diary workspace was not browser-tested; do not claim otherwise.
- English-only typography and supplied LinkedIn content reconciliation: `docs/PROFILE_TYPOGRAPHY.md`.
- Humble profile wording, restored leadership emphasis, prominent Stanford affiliation and supplied logo: `docs/PROFILE_EDITORIAL_REVIEW.md`.

## Current English profile

Main presentation: `apps/web/components/CampusHome.tsx`. Scoped styling: `apps/web/app/campus.css`. Font loading/wrapper: `apps/web/app/[locale]/page.tsx` (`.profile-typography`). Shared content records and Japanese copy were preserved by English presentation overrides; reconcile these deliberately in future content edits.

- Hero: “Learning, leading, and building together.”
- Introduction identifies Rajkumar as engineer, leader and founder, based in Singapore with many years of work in Japan, currently building Innuir for connected healthcare.
- Leadership approach describes clear direction, responsibility for decisions/outcomes, cross-cultural teams and shared progress.
- Homepage footer invitation: “Always glad to connect.” Other pages retain shared defaults.
- First-screen callout: Stanford logo, “Stanford GSB Alumni”, and “Stanford Executive Program · 2025–2026”, linking to `/en/education/stanford-executive-program`.
- Logo: exact SVG from https://www.gsb.stanford.edu/themes/custom/gsb/logo.svg, self-hosted at `apps/web/public/images/stanford-gsb-logo.svg`; original colours/proportions, white backing for dark-mode legibility. Scope is English profile only.

The user-supplied LinkedIn About and experience entry are the content authority: 27+ years; Innuir Founder CEO from October 2025, Singapore; privacy-first longitudinal patient identity; AAGNAA $700K raised and patents; Capgemini €160M portfolio/320+ projects; Eli Lilly innovation lab 42 initiatives, nine production transitions in 18 months. Financial/delivery figures are owner-supplied, not independently audited. Use Innuir from the current role rather than the About section's older Nuvear name. Dense margin/satisfaction figures were omitted from the personal introduction to keep its tone natural. Do not invent roles, attendance, degrees, dates, hobbies or personal details.

## Hosting and latest published release

Domain: https://www.rajagobalan.com. Firebase project `rajagobalan-site`, Cloud Run region `us-central1`. Firebase Hosting is a thin CDN with rewrites to Next.js on Cloud Run, not a static-only deployment. GoDaddy manages the domain; no DNS changes are needed for these enhancements.

- Main service: `kakehashi-app`.
- Latest verified revision: `kakehashi-app-00034-vgd`, serving 100% traffic.
- Image: `us-central1-docker.pkg.dev/rajagobalan-site/cloud-run-source-deploy/kakehashi-app:stanford-logo-20260907-1`.
- Successful Cloud Build: `87544c40-8c85-4a58-bed6-7897a53121a3`.
- Previous revision/rollback for the logo release: `kakehashi-app-00033-x59`.
- Last recorded Command Center frontend revision: `command-center-web-00005-xkj`; separate service, verify if touching it.
- Preserve independent Diary authentication/privacy, Command Center API, Firestore data and Hosting rewrite order. Profile changes require only the main service.

The logo release passed the production build and local five-width checks (1440/1024/768/390/320). Live browser checks at 1440/768/390/320 confirmed loaded logo and affiliation in the first viewport, with no horizontal overflow. The live SVG returned HTTP 200 and matched the supplied bytes. Latest local dev server was stopped after verification.

## Release workflow and next-session checks

Read the repository's applicable instructions and current release documentation before editing. Inspect `git status`, branch and live revision rather than assuming this snapshot remains current. Follow the new user request's scope; do not restart completed redesign work.

Use `python3 scripts/stage-site-release.py` to generate a fresh main-site staging directory. Do not reuse old `/tmp` files or stale stage directories. Build the staged source with the existing Docker/Cloud Build workflow, then deploy the resulting image to `kakehashi-app` preserving service settings. Record build/image/revision and rollback in the relevant documentation, push the branch, and verify the actual public page on desktop/tablet/phone. Consult existing release documentation for commands and prerequisites; temporary session scripts are not durable dependencies.

The user has authorized website implementation, publishing and GitHub updates throughout this task. Continue routine reversible work without repeated permission questions. Ask only when required information or a materially new scope decision is missing. No automated follow-up is required.

## Brand guideline library

The owner subsequently requested saving activity-specific brand guidelines. Start at [brand index](branding/README.md): public website defaults, English profile exception, Diary and Command Center. These documents describe adopted design separately from functional and deployment requirements.
