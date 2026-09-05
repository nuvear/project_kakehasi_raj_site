# AI Transformation Command Center Runtime Contract

Date: 2026-06-25

This document records the active Project Kakehashi boundary for Wave 7.1, the AI Transformation Command Center.

## Boundary

Kakehashi owns the localized catalogue and entry pages:

- `/en/apps/ai-transformation-command-center`
- `/ja/apps/ai-transformation-command-center`
- `/en/apps/ai-transformation-command-center/docs/deployment`
- `/ja/apps/ai-transformation-command-center/docs/deployment`

The standalone Command Center runtime remains the legacy sub-application:

- `/apps/ai-transformation-command-center`
- `/apps/ai-transformation-command-center/dashboard`
- `/apps/ai-transformation-command-center/discovery`
- `/apps/ai-transformation-command-center/portfolio`
- `/apps/ai-transformation-command-center/maturity`
- `/apps/ai-transformation-command-center/roi`
- `/apps/ai-transformation-command-center/architecture`
- `/apps/ai-transformation-command-center/wardley`
- `/apps/ai-transformation-command-center/roadmap`
- `/apps/ai-transformation-command-center/slides`

Do not rewrite localized Kakehashi app routes directly to the runtime. They are shell entry pages and must remain readable even if the runtime is down.

## Services

| Service | Owner | Runtime | Public role |
|---|---|---|---|
| `kakehashi-app` | Kakehashi shell | Next.js App Router | Localized app entry, docs, catalogue, SEO |
| `command-center-web` | Command Center runtime | Next.js Pages Router | Dashboard UI under `/apps/ai-transformation-command-center` |
| `command-center-api` | Command Center runtime | FastAPI | JSON and file API under `/api/*` |

## Frontend Contract

The legacy frontend source is under:

- `rajagobalan-site-main/apps/enterprise-ai-platform/frontend/`

Required configuration:

- `frontend/next.config.js` must keep `basePath: '/apps/ai-transformation-command-center'`.
- `frontend/src/utils/api.js` uses `NEXT_PUBLIC_API_URL` and calls `${NEXT_PUBLIC_API_URL}/api/*`.
- Because the browser calls the backend host directly, production CORS is mandatory.
- `NEXT_PUBLIC_API_URL` is baked at build time, so changing the backend URL requires rebuilding the frontend image.

Current production frontend env:

- `NEXT_PUBLIC_API_URL=https://command-center-api-537634522206.us-central1.run.app`
- Current production frontend revision: `command-center-web-00003-8lm` (deployed 2026-06-25)

## Backend Contract

The legacy backend source is under:

- `rajagobalan-site-main/apps/enterprise-ai-platform/backend/`

Current API route ownership:

- `GET /api/health`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/{id}`
- `PUT /api/projects/{id}`
- `DELETE /api/projects/{id}`
- `POST /api/discovery/generate`
- `POST /api/maturity/assess`
- `GET /api/maturity/{company_id}`
- `POST /api/roi/simulate`
- `POST /api/architecture/generate`
- `POST /api/roadmap/generate`
- `POST /api/wardley/generate`
- `POST /api/slides/export?company_id={uuid}`

## Direct Browser-to-Backend CORS Contract

The backend reads `CORS_ORIGINS` as an exact comma-separated allowlist. Origins must not include path prefixes.

Production `command-center-api` was updated on 2026-06-25 to revision `command-center-api-00003-hjb` with:

```text
CORS_ORIGINS=https://www.rajagobalan.com,https://rajagobalan.com,https://rajagobalan-site.web.app,https://rajagobalan-site.firebaseapp.com,https://command-center-web-olazdd633a-uc.a.run.app,https://command-center-web-537634522206.us-central1.run.app,http://localhost:3000,http://localhost:3005,http://localhost:8000
```

This fixed the observed production failure where preflight from `https://www.rajagobalan.com` returned `400 Disallowed CORS origin`.

## Firebase Hosting Contract

`firebase.json` for target `main` must keep the runtime rewrites before the catch-all `kakehashi-app` rewrite:

```json
[
  {
    "source": "/apps/ai-transformation-command-center",
    "run": { "serviceId": "command-center-web", "region": "us-central1" }
  },
  {
    "source": "/apps/ai-transformation-command-center/**",
    "run": { "serviceId": "command-center-web", "region": "us-central1" }
  },
  {
    "source": "**",
    "run": { "serviceId": "kakehashi-app", "region": "us-central1" }
  }
]
```

Do not add `/*/apps/ai-transformation-command-center` rewrites. Locale-prefixed paths belong to Kakehashi entry pages.

## Smoke Checks

Run these checks after deployment or runtime config changes:

```bash
curl -I -L https://www.rajagobalan.com/apps/ai-transformation-command-center
curl -sS https://command-center-api-537634522206.us-central1.run.app/api/health
curl -i -X OPTIONS \
  -H 'Origin: https://www.rajagobalan.com' \
  -H 'Access-Control-Request-Method: GET' \
  https://command-center-api-537634522206.us-central1.run.app/api/health
```

Expected results:

- Runtime page returns `200`.
- API health returns `{"status":"ok","version":"7.0"}`.
- Preflight returns `200` and `access-control-allow-origin: https://www.rajagobalan.com`.
- Browser dashboard load shows no CORS, 404, or failed-fetch errors.

## Local Runtime Checks

From `rajagobalan-site-main/apps/enterprise-ai-platform`:

```bash
docker compose up --build
curl http://localhost:8000/api/health
curl -I http://localhost:3005/apps/ai-transformation-command-center
```

The Compose backend explicitly sets `PORT=8000` so the documented host URL and the container listener remain aligned. Cloud Run still uses the backend Dockerfile default `PORT=8080`.

## Demo Limitations

- The Cloud Run backend uses pre-seeded SQLite for a cost-to-zero showcase. Runtime writes are not durable across container replacement.
- OpenAI-dependent flows require `OPENAI_API_KEY`.
- The deployment guide from the legacy source remains review-gated because it is marked internal and confidential.
