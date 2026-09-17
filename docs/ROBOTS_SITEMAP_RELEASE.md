# Robots and sitemap routing — 2026-09-17

P0.1: stop the locale catch-all from swallowing dotted crawler files, and serve a real `/robots.txt` and `/sitemap.xml` on [www.rajagobalan.com](https://www.rajagobalan.com).

## Outcome

Live:

- `GET /robots.txt` → `200` `text/plain` (not HTML; `lang="robots.txt"` is gone)
- `GET /sitemap.xml` → `200` `application/xml` listing live marketing URLs in `en` and `ja`
- `/diary` is `Disallow` in robots and is not listed in the XML sitemap
- `/diary` and `/100days` Hosting rewrites were not changed

## Source

| Item | Value |
| --- | --- |
| Worktree | `/Users/rajkumarrajagobalan/raj-site-campus-coast` |
| Branch | `cursor/robots-sitemap-15c0` |
| Implementation commits | `b9fa60a`, `04adf27` |
| GitHub | https://github.com/nuvear/project_kakehasi_raj_site/tree/cursor/robots-sitemap-15c0 |

`04adf27` keeps `[locale]` pages dynamic so HTML stays `private, no-store`. Do not restore `generateStaticParams` on the locale layout without an explicit cache decision.

## Cloud Run

| Item | Value |
| --- | --- |
| Service | `kakehashi-app` |
| Ready revision (100%) | `kakehashi-app-00037-tid` |
| Image tag | `kakehashi-app:robots-sitemap-20260917-2` |
| Digest | `sha256:45ba00c6e3f9b673b932d89dd5d68b05a0fa78c6396529c904afde89dc09ba4c` |
| Cloud Build | `d751bfd4-2cba-449a-8a8f-fb713d0a927e` SUCCESS |
| Tagged URL | https://robots-sitemap---kakehashi-app-olazdd633a-uc.a.run.app |
| Rollback revision | `kakehashi-app-00034-vgd` (Stanford logo; restores the HTML crawler-file bug) |

Env, secret, service account, CPU, memory, concurrency and port were preserved. Hosting catch-all still targets this service.

An earlier candidate `kakehashi-app-00035-siw` (`robots-sitemap-20260917-1`) prerendered locale HTML (`s-maxage=31536000`). It is not serving traffic.

## Hosting

No rewrite change. Diary remains first; `/100days` remains before the catch-all.

Identical clone published only to clear CDN objects left by the brief SSG revision:

| Item | Before | After |
| --- | --- | --- |
| Version | `sites/rajagobalan-site/versions/08fe5a519baba09e` | `sites/rajagobalan-site/versions/d3ad5f6433a14ad4` |
| Release | `sites/rajagobalan-site/releases/1789485208709000` | `sites/rajagobalan-site/releases/1789638453747000` |
| Rewrites | `/diary`, `/diary/**`, `/100days`, `/100days/**`, `**` | same |
| Static file hashes | 12 files | identical to source clone |

Did **not** `firebase deploy` from campus-coast `firebase.json`.

## Verification

Local (`http://127.0.0.1:43127`): unit tests `tests/seo/robots-sitemap.test.ts` (5 passed); production build listed `○ /robots.txt` and `○ /sitemap.xml`; curl showed `text/plain` / `application/xml`.

Live `curl -sI` after traffic switch and Hosting clone:

```text
https://www.rajagobalan.com/robots.txt   200  content-type: text/plain
https://www.rajagobalan.com/sitemap.xml  200  content-type: application/xml
https://www.rajagobalan.com/en           200  cache-control: private, no-store
https://www.rajagobalan.com/ja           200  cache-control: private, no-store
https://www.rajagobalan.com/diary        200
https://www.rajagobalan.com/diary/api/health  {"status":"ok"}
https://www.rajagobalan.com/100days      303  /100days/sign-in
https://www.rajagobalan.com/ads.txt      404  (not a fake locale homepage)
```

Sitemap body: 42 `<loc>` URLs, both locales, no `/diary`, `/100days`, or `to-do-list`. Evidence: `docs/verification/robots-sitemap-live-20260917.json`.
