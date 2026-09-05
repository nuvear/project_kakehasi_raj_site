# AI Leadership Diary release — 2026-09-05

Status: published and verified at `https://www.rajagobalan.com/diary`.

Cloud Run revision: `ai-leadership-diary-00002-74b`. Cloud Build: `1b77c4df-b0e4-402b-97f8-1c2c3fa6c3af`. Firebase Hosting release: `sites/rajagobalan-site/releases/1788617725080000`.

## Application

- URL: `https://www.rajagobalan.com/diary`
- Source: `apps/diary/`
- Cloud Run: `ai-leadership-diary`, `us-central1`, project `rajagobalan-site`
- Image: `us-central1-docker.pkg.dev/rajagobalan-site/cloud-run-source-deploy/ai-leadership-diary:release-20260905-3`
- Runtime identity: `ai-leadership-diary@rajagobalan-site.iam.gserviceaccount.com`
- Runtime settings: `FIREBASE_PROJECT_ID=rajagobalan-site`, `DIARY_OWNER_EMAIL=Rajkumar.Rajagobalan@gmail.com`, port 8080, 512Mi, CPU 1, concurrency 40, minimum 0, maximum 5, timeout 60s.
- Permissions: `roles/datastore.user`, `roles/firebaseauth.viewer`.

## Identity and access

Firebase email/password was already enabled. Google sign-in was configured but disabled and was enabled for this release. The existing authorized domains already included `www.rajagobalan.com`. Other authentication provider settings were preserved.

Sign in with the verified owner email above to create the initial administrator membership. Other verified accounts are pending until approved in **Manage access**. Application roles are separate from Firebase project administration. Revocation is checked on each protected request. Diary APIs do not expose private reflections to administrators.

The three diary Firestore collections are `diaryMembers`, `diaryStates`, `diaryAccessAudit`. The currently published Firestore rules were inspected and already deny direct client access to these collections, so no rules deployment was necessary.

## Hosting change

Two rewrites are added before the existing catch-all:

1. `/apps/ai-transformation-command-center` → existing `command-center-web`
2. `/apps/ai-transformation-command-center/**` → existing `command-center-web`
3. `/diary` → `ai-leadership-diary`
4. `/diary/**` → `ai-leadership-diary`
5. `**` → existing `kakehashi-app`

The existing Firebase Hosting version is cloned with all static files. Only its serving configuration receives the two diary rewrites. This avoids publishing unrelated local static assets or uncommitted Kakehashi changes. `apps/diary/scripts/hosting-release.py` checks that all other serving configuration is identical before release. Its concrete IDs are in `docs/diary-hosting-release.json`; the prior version snapshot is in `docs/diary-hosting-before.json`.

GoDaddy DNS, Microsoft 365 email records, HealthKit Hosting, Kakehashi, and Command Center services are unchanged. The main website is not rebuilt or redeployed. No content ingestion is required for the diary.

## Validation

- Next.js production build and TypeScript checks: pass.
- 17 access/data validation tests: pass.
- Complete manuscript equality against original compiled source: pass.
- Primary light and dark text/button palette contrasts: 5.61:1 or higher for tested pairs.
- Live service test: email/password sign-in, pending membership, admin approval, content retrieval, persistent save, version conflict rejection, cross-user isolation, direct Firestore denial, participant admin denial and immediate revocation: pass on the initial service revision and again through the final domain on the branded release.
- Two disposable live test accounts and their diary records were removed after each test run.
- Final domain HTML, bridge photograph, icon, English/Japanese site pages, Command Center runtime and catalogue page, and Command Center API health all returned HTTP 200.
- The final browser handoff displayed the live sign-in page with email and Google options.
- Main root retained its 307 redirect to `/en`; apex GET retained its 301 redirect to www; Command Center CORS preflight returned 200. GoDaddy apex HEAD returned 405, so its forwarding was verified with GET.
- Firebase Hosting static-file paths and hashes were compared exactly before release; all seven existing static files were preserved.
- Interactive Google OAuth and visual browser interaction are not claimed as tested. Google provider enablement, domain allowlisting and implementation are verified; a real user completes Google OAuth.

## Brand and assets

See `docs/diary-design/BRAND.md` and `docs/diary-design/brand-board.svg` for the Campus & Coast identity, palette and sources. The bridge photograph by Griffin Wooldridge is used under the Unsplash License and credited in the sign-in screen. Stanford campus imagery is reference material only.

## Rollback

Before the diary hosting release, the main Hosting version was `sites/rajagobalan-site/versions/80b00118bd0ff9ef`. Create a Firebase Hosting release pointing to that finalized version to restore the exact prior site and remove the diary routes. Leave other services and DNS untouched.

To roll back only the diary after future releases, route `ai-leadership-diary` traffic to a previously verified revision using `gcloud run services update-traffic`. Do not use Kakehashi's service name for diary rollback.
