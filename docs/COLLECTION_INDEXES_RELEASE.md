# Collection indexes — 2026-09-18

P0.3: add real marketing collection indexes so `/experience`, `/education`, `/ventures`, and `/apps` are pages, not Next.js 404s.

## Outcome

Live on [www.rajagobalan.com](https://www.rajagobalan.com):

- `GET /{en,ja}/experience|education|ventures|apps` → `200` HTML (not the default Next 404)
- Each index lists the live child pages for that collection
- Unprefixed `/experience`, `/education`, `/ventures`, `/apps` → `307` to `/en/...` (existing locale middleware)
- Interior header links those indexes; home header still uses in-page hashes for Experience, Education, Credentials, and Ventures
- `/sitemap.xml` lists the eight new index URLs (52 marketing `<loc>`s total)
- P0.2 venture facts unchanged: Nuvear founder Oct 2025; Innuir CEO and Founder Aug 2026; AAGNAA earlier
- `/diary` and `/100days` Hosting rewrites were not changed

## Source

| Item | Value |
| --- | --- |
| Worktree | `/Users/rajkumarrajagobalan/raj-site-campus-coast` |
| Branch | `cursor/collection-indexes-0897` |
| Implementation commit | `a722972` |
| GitHub | https://github.com/nuvear/project_kakehasi_raj_site/tree/cursor/collection-indexes-0897 |

Did not use dirty `/Users/rajkumarrajagobalan/raj-site`.

## Cloud Run

| Item | Value |
| --- | --- |
| Service | `kakehashi-app` |
| Ready revision (100%) | `kakehashi-app-00041-han` |
| Image tag | `kakehashi-app:collection-indexes-20260918-1` |
| Digest | `sha256:83e1630d119fa9a3a2ec00693fb4b98ba65ddc464607975a2416fa24c99f4d1e` |
| Cloud Build | `fdaa9796-0038-4377-a3df-44e4d05bc307` SUCCESS |
| Tagged URL | https://collection-indexes---kakehashi-app-olazdd633a-uc.a.run.app |
| Rollback revision | `kakehashi-app-00039-wom` (ventures honesty; collection indexes 404 again) |

Env (`FIREBASE_PROJECT_ID`, `KAKEHASHI_CONTENT_DIR`), secret `gemini-api-key`, service account `kakehashi-app-sa@rajagobalan-site.iam.gserviceaccount.com`, CPU 1, memory 512Mi, concurrency 80, and port 8080 were preserved. Hosting catch-all still targets this service.

Staged with `python3 scripts/stage-site-release.py`. Did **not** `firebase deploy`.

## Hosting

No rewrite, redirect, or static-file change.

| Item | Value |
| --- | --- |
| Version | `sites/rajagobalan-site/versions/d3ad5f6433a14ad4` (unchanged) |
| Release | `sites/rajagobalan-site/releases/1789638453747000` (unchanged) |
| Rewrites | `/diary`, `/diary/**`, `/100days`, `/100days/**`, `**` |

## Verification

Local `http://127.0.0.1:43141`: unit tests `tests/seo/collection-indexes.test.ts` and `tests/seo/robots-sitemap.test.ts` passed (22 SEO tests). Production build listed `ƒ /[locale]/experience`, `education`, `ventures`, and `apps`.

Live after traffic switch:

```text
https://www.rajagobalan.com/en/experience  200  Experience | Rajkumar Rajagobalan
https://www.rajagobalan.com/ja/experience  200  職歴 | Rajkumar Rajagobalan
https://www.rajagobalan.com/en/education   200  Education | Rajkumar Rajagobalan
https://www.rajagobalan.com/ja/education   200  学歴 | Rajkumar Rajagobalan
https://www.rajagobalan.com/en/ventures    200  Innuir, Nuvear, AAGNAA
https://www.rajagobalan.com/ja/ventures    200  same children
https://www.rajagobalan.com/en/apps        200  Command Center only
https://www.rajagobalan.com/ja/apps        200  Command Center only
https://www.rajagobalan.com/experience     307  /en/experience
https://www.rajagobalan.com/sitemap.xml    200  application/xml, 52 locs including the eight indexes
https://www.rajagobalan.com/robots.txt     200  text/plain
https://www.rajagobalan.com/diary          200
https://www.rajagobalan.com/diary/api/health  200
https://www.rajagobalan.com/100days        303  /100days/sign-in
```

Evidence: `docs/verification/collection-indexes-live-20260918.json`.

## Rollback

```bash
gcloud run services update-traffic kakehashi-app \
  --project=rajagobalan-site \
  --region=us-central1 \
  --to-revisions=kakehashi-app-00039-wom=100
```

That restores the ventures-honesty revision. Collection indexes will 404 again. Hosting does not need a rollback.
