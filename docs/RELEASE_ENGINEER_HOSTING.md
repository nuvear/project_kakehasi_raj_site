# Main website hosting runbook

Current release contract: 7 September 2026. See [professional review and release evidence](SITE-PROFESSIONAL-REVIEW.md). The older full infrastructure inventory is retained as [historical context](archive/pre-gate-review/RELEASE_ENGINEER_HOSTING.md); its ingestion and legacy-demo publishing procedures are obsolete.

## Ownership

- Public website: `https://www.rajagobalan.com`, Firebase project `rajagobalan-site`, Cloud Run `kakehashi-app` in `us-central1`.
- DNS: existing GoDaddy configuration; apex forwards to www. Do not change DNS for this release.
- Main image: `us-central1-docker.pkg.dev/rajagobalan-site/cloud-run-source-deploy/kakehashi-app:<release-tag>`.
- Main public Git repository: `nuvear/project_kakehasi_raj_site`. This release is on `codex/site-professional-review`, based on published `codex/campus-coast-site`.
- `/diary` and `/diary/**`: independent `ai-leadership-diary` service. Main-site builds exclude the Diary application and manuscript.
- GATE's current private Site is independent. Hosting GATE at `/gate` is a separate enterprise-runtime deployment.

## Routing contract

Firebase redirects old `/apps/ai-transformation-command-center` paths and old framework/deployment HTML entry points permanently to `/en/apps/ai-transformation-command-center`. Next also handles these paths on direct Cloud Run access and redirects localized framework/deployment pages to the matching localized GATE page. Retired to-do pages redirect to resources. Guide HTML redirects to the guide.

Firebase rewrite order is now:

1. `/diary` to `ai-leadership-diary`.
2. `/diary/**` to `ai-leadership-diary`.
3. `**` to `kakehashi-app`.

The `healthkitsync` Firebase target redirects all paths to `https://www.rajagobalan.com/en/ventures/nuvear`. No Cloud Run service, storage, database or DNS record is deleted.

## Build and deploy

1. Run `pnpm test`, `pnpm --filter web build`, `git diff --check` and the browser/HTTP checks. Use `MOCK_DB=true` and the worktree's `KAKEHASHI_CONTENT_DIR` for local checks.
2. Commit reviewed source. Run `python3 scripts/stage-site-release.py`; use its returned directory as the Cloud Build input. Inspect its manifest. This excludes Diary, local environment files, caches and docs.
3. Build with `gcloud builds submit --project rajagobalan-site --tag <image> <staged-directory>`. Use the existing Dockerfile, not source-buildpacks.
4. Recheck the currently serving revision. Deploy the image with `gcloud run deploy kakehashi-app --project rajagobalan-site --region us-central1 --image <image>`. Preserve existing environment, secrets, service account, IAM and scaling configuration; do not reset them for an image release.
5. Deploy only the changed hosting targets: `firebase deploy --only hosting:main,hosting:healthkitsync --project rajagobalan-site --non-interactive`. Verified CLI for this release: `firebase-tools@15.29.0`.
6. Run `python3 scripts/check-professional-release.py https://www.rajagobalan.com --output <evidence.json>`; inspect the live site at desktop, tablet and phone sizes in both languages. Verify independent Diary sign-in, HealthKitSync redirect and apex forwarding. Do not submit forms or log in as part of this read-only review.
7. Record the image digest, Cloud Build ID, Cloud Run revision and Hosting release identifiers in the release record. Commit/push the live evidence.

The old public `/api/ingest` endpoint is retired and returns 410. **Do not use historical ingestion commands.** Reviewed GATE and guide text ships with the image and is applied by the public read layer. Biography data remains in Firestore. Any future content migration needs a separate scoped, authenticated procedure.

## Rollback

Before this release, the main service serves `kakehashi-app-00027-v6t`. Restore it with:

```bash
gcloud run services update-traffic kakehashi-app --project rajagobalan-site --region us-central1 --to-revisions kakehashi-app-00027-v6t=100
```

For a complete rollback, use Firebase Hosting release history to restore the pre-release version for each hosting target. Do not blindly redeploy the baseline `firebase.json`: it contains an unsupported Next-style `has` condition which Firebase drops, leaving an unconditional catch-all redirect. If rebuilding the old config, omit that invalid rule and use the static assets from commit `9a25c872b3d3b99a65f529556b5e0de29213d160` in a separate checkout. Recheck both public route contracts. Restore runtime and hosting together; do not overwrite an unrelated dirty checkout. Firestore and Diary require no rollback because this release does not change them.
