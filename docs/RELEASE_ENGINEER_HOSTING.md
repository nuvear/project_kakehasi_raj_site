# Release Engineer Hosting Runbook — www.rajagobalan.com

Verified live on 2026-09-05 against DNS, HTTPS headers, Firebase Hosting, and Cloud Run in GCP project `rajagobalan-site`.

Source of truth for current production is the **Kakehashi monorepo** at `/Users/rajkumarrajagobalan/raj-site` (not the older Vite/static pipeline under `rajagobalan-site-main/.github/workflows/deploy.yml`).

---

> Diary extension (2026-09-05): `/diary` is now served by dedicated Cloud Run service `ai-leadership-diary`. See [DIARY_RELEASE.md](DIARY_RELEASE.md) for its authentication, release and rollback record. The main Kakehashi service was not redeployed.

## 1. Identity

| Item | Value |
|---|---|
| Public URL | `https://www.rajagobalan.com` |
| Apex | `https://rajagobalan.com` → 301 to www (GoDaddy forwarding) |
| Firebase project | `rajagobalan-site` |
| GCP project number | `537634522206` |
| GCP region | `us-central1` |
| Firestore | Native, location `nam5` (multi-region US) |
| Domain registrar | GoDaddy.com, LLC |
| Nameservers | `ns21.domaincontrol.com`, `ns22.domaincontrol.com` |
| Domain created / expiry | 2017-04-18 / 2028-04-18 |
| Owner deploy identity | `Rajkumar.Rajagobalan@gmail.com` |
| Local repo | `/Users/rajkumarrajagobalan/raj-site` |

---

## 2. Traffic path

```text
Client
  → GoDaddy DNS
      www  CNAME  rajagobalan-site.web.app
      apex A      15.197.225.128, 3.33.251.168  (GoDaddy/AWS forwarder)
  → Firebase Hosting + Fastly CDN  (server: Google Frontend)
      SSL / HSTS / HTTP/2 / HTTP/3
  → Cloud Run rewrite
      /apps/ai-transformation-command-center/**  → command-center-web
      **                                         → kakehashi-app
  → Next.js (kakehashi-app)  307 / → /en
```

Observed production headers on `/en`:

- `server: Google Frontend`
- `x-powered-by: Next.js`
- `strict-transport-security: max-age=31556926`
- `x-served-by: cache-nrt-*` (Fastly edge; JP clients hit NRT)
- `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`

---

## 3. DNS inventory

| Name | Type | Target / value | Role |
|---|---|---|---|
| `www.rajagobalan.com` | CNAME | `rajagobalan-site.web.app` | Primary site |
| `rajagobalan.com` | A | `15.197.225.128`, `3.33.251.168` | Apex forward to www (GoDaddy, not Firebase) |
| `blogs.rajagobalan.com` | CNAME | `rajagobalan-site.web.app` | Same Firebase site as www |
| `healthkitsync.rajagobalan.com` | CNAME | `rajagobalan-site-healthkitsync.web.app` | Second Firebase Hosting target |
| `rajagobalan.com` | NS | `ns21` / `ns22.domaincontrol.com` | GoDaddy DNS |
| `rajagobalan.com` | MX | `0 rajagobalan-com.mail.protection.outlook.com` | Microsoft 365 |
| `rajagobalan.com` | TXT | `v=spf1 include:spf.protection.outlook.com -all` | Mail SPF |
| `rajagobalan.com` | TXT | `NETORGFT4786685.onmicrosoft.com` | M365 domain proof |
| `rajagobalan.com` | TXT | `google-site-verification=0IoPqur2jpN9pHH8ao0VlPVmQ_6DbSGb7iIuj7-aOqk` | Search Console |

`command.rajagobalan.com` and `api.rajagobalan.com` are **not** delegated.

Firebase Hosting sites:

| Site ID | Default URL | Hosting target |
|---|---|---|
| `rajagobalan-site` | `https://rajagobalan-site.web.app` | `main` |
| `rajagobalan-site-healthkitsync` | `https://rajagobalan-site-healthkitsync.web.app` | `healthkitsync` |

Also reachable: `https://rajagobalan-site.firebaseapp.com`.

---

## 4. Runtime services (live)

All in `us-central1`. Project number appears in the numbered `*.run.app` URLs.

| Service | Ready | Image | Latest revision | Public URL |
|---|---|---|---|---|
| `kakehashi-app` | Yes | `us-central1-docker.pkg.dev/rajagobalan-site/cloud-run-source-deploy/kakehashi-app:manual-20260626-5` | `kakehashi-app-00021-clj` (2026-06-26) | `https://kakehashi-app-537634522206.us-central1.run.app` and `https://kakehashi-app-olazdd633a-uc.a.run.app` |
| `command-center-web` | Yes | `gcr.io/rajagobalan-site/command-center-web:latest` | `command-center-web-00003-8lm` (2026-06-25) | `https://command-center-web-537634522206.us-central1.run.app` |
| `command-center-api` | Yes | `gcr.io/rajagobalan-site/command-center-api:latest` | `command-center-api-00003-hjb` (2026-06-25) | `https://command-center-api-537634522206.us-central1.run.app` |
| `aicoach` | **No** | missing GCF artifact | 2026-05-11 | broken — do not route public traffic |
| `recognizefood` | **No** | same missing image | 2026-05-11 | broken — do not route public traffic |

Shared Cloud Run settings (the three healthy services):

- CPU 1 / memory 512Mi
- concurrency 80
- timeout 300s
- max scale 20
- min scale **0** (cold start after idle)
- startup CPU boost on
- ingress all / `--allow-unauthenticated`
- `PORT` for kakehashi image is **8080** (Dockerfile). Do not set Terraform’s `8787` on a live deploy.

---

## 5. Environment and secrets

### kakehashi-app

| Name | Value | Notes |
|---|---|---|
| `FIREBASE_PROJECT_ID` | `rajagobalan-site` | Required for Firestore-backed pages |
| `KAKEHASHI_CONTENT_DIR` | `/app/content` | Bundled markdown/YAML in the image |
| `GEMINI_API_KEY` | Secret Manager `gemini-api-key:latest` | Agent features; site must still render if unset |
| `PORT` | 8080 (image default) | Cloud Run injects `PORT` if overridden |

Service account: `kakehashi-app-sa@rajagobalan-site.iam.gserviceaccount.com`  
IAM: `roles/datastore.user`, `roles/aiplatform.user`

### command-center-web

| Name | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://command-center-api-537634522206.us-central1.run.app` |

**Build-time bake-in.** Changing the API URL requires a **rebuild** of the frontend image (`cloudbuild.yaml` `--build-arg`), not only a Cloud Run env update.  
`basePath` must stay `/apps/ai-transformation-command-center`.  
SA: default compute `537634522206-compute@developer.gserviceaccount.com`

### command-center-api

| Name | Value |
|---|---|
| `DATABASE_URL` | `sqlite:///ai_platform.db` |
| `CORS_ORIGINS` | exact allowlist below |

```text
https://www.rajagobalan.com,https://rajagobalan.com,https://rajagobalan-site.web.app,https://rajagobalan-site.firebaseapp.com,https://command-center-web-olazdd633a-uc.a.run.app,https://command-center-web-537634522206.us-central1.run.app,http://localhost:3000,http://localhost:3005,http://localhost:8000
```

Origins must be exact hosts, no path. Missing `https://www.rajagobalan.com` causes `400 Disallowed CORS origin` on preflight.

SQLite is **ephemeral**. Writes die when the instance scales to zero. Showcase only.

OpenAI-backed Command Center flows need `OPENAI_API_KEY` if those features are used.

### Secret Manager

| Secret | Used by |
|---|---|
| `gemini-api-key` | `kakehashi-app` |

---

## 6. Firebase Hosting contract

File: `firebase.json`, target `main`, public dir `apps/web/public` (static crumbs only; pages come from Cloud Run).

**Redirects (do not drop):**

| Source | Destination | Type |
|---|---|---|
| `/framework.html` | `/en/frameworks/enterprise-ai-transformation` | 302 |
| `/enterprise-ai-reference-guide.html` | `/en/insights/enterprise-ai-reference-guide` | 302 |
| `/ai-transformation-command-center.html` | `/en/apps/ai-transformation-command-center` | 302 |
| `/deployment-guide.html` | `/en/apps/ai-transformation-command-center/docs/deployment` | 302 |
| `**` when host is `rajagobalan.com` | `https://www.rajagobalan.com/:path*` | 301 |

The apex 301 in Firebase only applies if apex traffic actually reaches Firebase. Today apex is forwarded by GoDaddy before Firebase. Keep both layers.

**Rewrites — order is mandatory:**

1. `/apps/ai-transformation-command-center` → Cloud Run `command-center-web`
2. `/apps/ai-transformation-command-center/**` → Cloud Run `command-center-web`
3. `/diary` → Cloud Run `ai-leadership-diary`
4. `/diary/**` → Cloud Run `ai-leadership-diary`
5. `**` → Cloud Run `kakehashi-app`

Do **not** add `/*/apps/ai-transformation-command-center` rewrites. `/en/...` and `/ja/...` are Kakehashi catalogue pages and must stay up if Command Center is down.

Deploy hosting:

```bash
cd /Users/rajkumarrajagobalan/raj-site
npx -y firebase-tools@latest deploy --only hosting:main --project rajagobalan-site
```

HealthKit Sync (separate site):

```bash
npx -y firebase-tools@latest deploy --only hosting:healthkitsync --project rajagobalan-site
```

---

## 7. Route ownership

| Path | Owner | Must stay up if |
|---|---|---|
| `/` → `/en` | kakehashi-app | always |
| `/en/**`, `/ja/**` | kakehashi-app | Command Center down |
| `/diary`, `/diary/**` | ai-leadership-diary | independent diary runtime |
| `/en/apps/ai-transformation-command-center` | kakehashi-app entry | runtime down |
| `/apps/ai-transformation-command-center/**` | command-center-web | shell down (direct runtime) |
| `/api/*` on Command Center host | command-center-api | called from browser, not via Firebase rewrite |

After content deploys, ingest Firestore from the **new** kakehashi revision:

```bash
curl https://kakehashi-app-537634522206.us-central1.run.app/api/ingest
```

Expected: `Processed 9 entities` for the current wave. Duplicate-entity reports usually mean a nested `content/content` in the image — fail the release.

---

## 8. Release procedure (production)

Do **not** use Cloud Run source-buildpacks for the shell. Use the root `Dockerfile`.

### A. Kakehashi shell (www)

```bash
cd /Users/rajkumarrajagobalan/raj-site
TAG="manual-$(date +%Y%m%d)-1"
IMAGE="us-central1-docker.pkg.dev/rajagobalan-site/cloud-run-source-deploy/kakehashi-app:${TAG}"

gcloud builds submit --project rajagobalan-site --tag "$IMAGE" .

gcloud run deploy kakehashi-app \
  --image "$IMAGE" \
  --project rajagobalan-site \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --service-account kakehashi-app-sa@rajagobalan-site.iam.gserviceaccount.com \
  --update-env-vars FIREBASE_PROJECT_ID=rajagobalan-site,KAKEHASHI_CONTENT_DIR=/app/content \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest

curl -sS https://kakehashi-app-537634522206.us-central1.run.app/api/ingest
```

Image build asserts:

- `/app/content/insights/enterprise-ai-reference-guide/en.md` exists
- `/app/content/apps/ai-transformation-command-center/en.md` exists
- `/app/content/content` does **not** exist

### B. Command Center API

```bash
cd /Users/rajkumarrajagobalan/raj-site/rajagobalan-site-main/apps/enterprise-ai-platform/backend
gcloud builds submit --project rajagobalan-site --tag gcr.io/rajagobalan-site/command-center-api .

gcloud run deploy command-center-api \
  --image gcr.io/rajagobalan-site/command-center-api:latest \
  --project rajagobalan-site \
  --region us-central1 \
  --allow-unauthenticated \
  --update-env-vars '^|^DATABASE_URL=sqlite:///ai_platform.db|CORS_ORIGINS=https://www.rajagobalan.com,https://rajagobalan.com,https://rajagobalan-site.web.app,https://rajagobalan-site.firebaseapp.com,https://command-center-web-olazdd633a-uc.a.run.app,https://command-center-web-537634522206.us-central1.run.app,http://localhost:3000,http://localhost:3005,http://localhost:8000'
```

Container listens on **8080** in Cloud Run. Local Compose uses `PORT=8000`.

### C. Command Center web

```bash
cd /Users/rajkumarrajagobalan/raj-site/rajagobalan-site-main/apps/enterprise-ai-platform/frontend
gcloud builds submit --project rajagobalan-site --config cloudbuild.yaml .

gcloud run deploy command-center-web \
  --image gcr.io/rajagobalan-site/command-center-web:latest \
  --project rajagobalan-site \
  --region us-central1 \
  --allow-unauthenticated \
  --update-env-vars NEXT_PUBLIC_API_URL=https://command-center-api-537634522206.us-central1.run.app
```

### D. Hosting (only if `firebase.json` changed)

```bash
cd /Users/rajkumarrajagobalan/raj-site
npx -y firebase-tools@latest deploy --only hosting:main --project rajagobalan-site
```

### E. Smoke (required)

```bash
curl -sI -o /dev/null -w "%{http_code} %{redirect_url}\n" https://www.rajagobalan.com
curl -sI -o /dev/null -w "%{http_code}\n" https://www.rajagobalan.com/en
curl -sI -o /dev/null -w "%{http_code}\n" https://rajagobalan.com
curl -I -L https://www.rajagobalan.com/apps/ai-transformation-command-center
curl -sS https://command-center-api-537634522206.us-central1.run.app/api/health
curl -i -X OPTIONS \
  -H 'Origin: https://www.rajagobalan.com' \
  -H 'Access-Control-Request-Method: GET' \
  https://command-center-api-537634522206.us-central1.run.app/api/health
```

Expect:

- www `/` → 307 `/en`, then 200
- apex → 301 `https://www.rajagobalan.com`
- Command Center page 200
- API `{"status":"ok","version":"7.0"}`
- Preflight 200 and `access-control-allow-origin: https://www.rajagobalan.com`

---

## 9. Rollback

```bash
# List revisions
gcloud run revisions list --project rajagobalan-site --region us-central1 --service kakehashi-app

# Pin traffic to last known good (example: kakehashi-app-00021-clj)
gcloud run services update-traffic kakehashi-app \
  --project rajagobalan-site \
  --region us-central1 \
  --to-revisions kakehashi-app-00021-clj=100
```

Hosting rollback: redeploy the previous `firebase.json` from git, or use Firebase Hosting release history in the console.

Do not destroy Firestore via Terraform (`deletion_policy = ABANDON` on the default DB).

---

## 10. Terraform drift (do not apply blindly)

`infra/terraform/` is **not** a 1:1 match of production:

| Setting | Terraform | Live |
|---|---|---|
| kakehashi image | `gcr.io/rajagobalan-site/kakehashi-app:latest` | Artifact Registry `.../kakehashi-app:manual-20260626-5` |
| `PORT` | `8787` | image `8080` |
| max instances | 5 | 20 |
| Command Center services | not in TF | deployed via gcloud |

Treat Terraform as IAM/Firestore scaffolding, not the deploy path, until it is reconciled.

---

## 11. Other accounts a release engineer will touch

| System | Role |
|---|---|
| GoDaddy | DNS, apex forwarding, nameservers |
| Google Cloud / Firebase | Hosting, Cloud Run, Artifact Registry, GCR, Firestore, Secret Manager |
| Microsoft 365 | MX / SPF only — not web hosting |
| GitHub Actions (`rajagobalan-site-main`) | **Legacy** Vite + `firebase deploy` on `main`. Do not run that workflow against current Kakehashi production without a migration review. |
| UptimeRobot | Has historically monitored `www.rajagobalan.com` (503s after scale-to-zero cold starts are possible) |

---

## 12. Known operational risks

1. **Cold start** — min instances = 0. First hit after idle can be slow or look like a 503 to monitors.
2. **CORS** — Command Center browser calls the API host directly. Always keep www in `CORS_ORIGINS`.
3. **Rewrite order** — a misplaced catch-all sends Command Center to kakehashi-app (404/wrong app).
4. **Content ingest** — shell pages can be stale until `/api/ingest` runs on the new revision.
5. **Apex split-brain** — apex is GoDaddy forwarding, www is Firebase. Changing only one side breaks `rajagobalan.com`.
6. **Broken leftover services** — `aicoach` and `recognizefood` are not Ready (missing container image). Leave them off the public path.
7. **Confidential** — full `deployment-guide.html` is marked internal. Public `/en/.../docs/deployment` must stay the reviewed notes only.

---

## 13. Contacts / code map

| Concern | Path |
|---|---|
| Hosting rewrites | `firebase.json` |
| Firebase targets | `.firebaserc` |
| Shell image | `Dockerfile` |
| Shell app | `apps/web/` |
| Content | `content/` |
| Command Center FE | `rajagobalan-site-main/apps/enterprise-ai-platform/frontend/` |
| Command Center API | `rajagobalan-site-main/apps/enterprise-ai-platform/backend/` |
| Runtime contract | `docs/command-center-runtime-contract.md` |
| Migration wave | `docs/current-migration-scope.md` |
| Architect overview | `ARCHITECT_ONBOARDING.md` |
