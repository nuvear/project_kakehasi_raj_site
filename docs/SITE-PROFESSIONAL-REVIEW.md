# Professional website review and GATE replacement

Review date: 7 September 2026. Branch: `codex/site-professional-review`.

## Approved direction

The owner requested review and cleanup of the entire public website, retaining the professional profile, GATE and useful learning resources. The owner explicitly confirmed that the previous **Enterprise AI Transformation Framework** must be replaced by GATE. This supersedes the narrower June migration scope and the earlier instruction to preserve the old framework/demo presentation.

The work starts from published Campus & Coast commit `9a25c872b3d3b99a65f529556b5e0de29213d160`, incorporating the subsequent GATE pitch draft. The original dirty checkout and the published baseline checkout are preserved.

## Findings and changes

| Area | Finding | Published behavior in this release |
|---|---|---|
| Product identity | Framework v8 and the legacy Command Center competed as separate products | One GATE offering, with a direct navigation item and consistent homepage/resource links |
| GATE presentation | Prototype figures and broad automation claims overstated delivery | Evidence-led pitch, five executive perspectives, demonstrable capabilities, clear pilot/access boundaries and application/manual/simulation links |
| Legacy framework and demos | Duplicated pages and a separate showcase runtime fragmented the journey | Old framework, demo runtime and deployment-note URLs redirect to GATE; obsolete demo components are removed |
| Resources | Generic catalogue, decorative figures and redundant entries | Four purposeful resources: GATE, reference guide, executive simulation and personal Diary |
| Reference guide | Unsupported ROI/case figures, inaccurate attribution and overly broad claims | Revised 21-chapter English learning guide, useful Japanese overview, chapter navigation, practical evidence questions and official source links |
| Portrait | Heavy monochrome treatment and a dated photo frame | First owner-supplied studio portrait in natural colour, with a clean 4:5 crop, correct image dimensions and responsive sizing; source photograph unaltered |
| Professional profile | Useful career, education and venture records | Retained, with the earlier Japan role linked from the regional role |
| Hosting configuration | An unused Next-style host condition in Firebase would be dropped by the CLI, turning it into an unconditional catch-all redirect | Removed the invalid rule; existing GoDaddy apex forwarding remains unchanged |
| Search discovery | `sitemap.xml`, `robots.txt` and arbitrary locale-like paths returned duplicate homepages | Real XML sitemap and plaintext robots file, canonical EN/JA routes and proper unknown-path 404s |
| Public content API | Historical Firestore copy could contradict the new pages | Read-time publication filter and reviewed GATE/guide text, without rewriting biography records or historical vectors; agent cache version advanced |
| Diary navigation | Client-side prefetch crossed into a separate application | Ordinary document navigation into the independent Diary runtime |
| HealthKitSync subdomain | Public placeholder | Permanent redirect to the existing Nuvear venture page, with a fallback link |
| Public maintenance endpoint | An unauthenticated GET could rewrite production content | `/api/ingest` returns 410 and performs no writes |

Original guide manuscripts and earlier release/pitch documents are in `docs/archive/pre-gate-review/` and excluded from the public image. Removed components remain recoverable in Git. Archived source entities remain in the repository. The publication filter prevents archived/retired records appearing in public reads even if old Firestore records are still marked published.

The review covered the 40 reachable localized main-site pages, the two unlinked Japan-role pages, ten separate legacy Command Center paths, and the legacy entry URLs, apex, blog alias, Diary and HealthKitSync surfaces documented in the retained route inventory. It is a review of discovered public routes, not a claim to enumerate unknown third-party sites or private account contents.

## Content and system boundaries

GATE is a working restricted preview. Its public page links to `https://gate-enterprise.praba.chatgpt.site`, `/simulation` and `/guide`; it does not grant access. `/gate` enterprise deployment and billing remain planned. No GATE Site visibility, account or project record is changed by this release.

The Japanese guide is explicitly an overview; the full English guide is linked. Japanese editorial metadata remains `review_required`. The copy does not promise ISO certification, complete legal coverage, continuous enterprise-wide audit or realized financial returns.

Existing biography, career, venture and education data remain in Firestore. No content ingestion or database migration is run. The public reader applies the new editorial text to retrieved GATE/guide records; the historical vector index is not rebuilt, so this release does not claim new semantic-ranking evaluation. The legacy Cloud Run demo/API services and their data are retained, but their custom-domain paths are retired. Diary authentication and hosting remain independent. DNS is unchanged.

## Executed validation

- 40 website tests and 17 Diary tests pass, including stale-record publication, current API text, chapter anchors and disabled public ingestion.
- Complete Next.js production build, lint and type checking pass.
- Release HTTP checks cover canonical pages, headings, guide anchors, sitemap/robots, legacy redirects, unknown-path 404s and read-only public API behavior.
- Browser layout review covers all 38 canonical EN/JA routes at widths 320, 390, 768, 1024 and 1440 (190 combinations), checking one main heading and no horizontal page overflow.
- Live interaction review found that wrapped chapter labels had unreliable click targets in the in-app browser. Chapter links now use full-width blocks with 44px minimum targets and explicit guide-path navigation; the final chapter jump was rechecked.
- Representative screenshots and mobile navigation, language switching, theme switching, guide chapter links and cross-application Diary navigation are inspected separately.

These are bounded checks, not a WCAG certification or authenticated end-to-end test of the independent GATE/Diary applications. No form is submitted, email sent or customer data changed.

## Release record

Published on 7 September 2026 through the existing GoDaddy / Firebase / Cloud Run stack. No DNS change, Firestore ingestion, GATE Site publication or Diary deployment was performed.

| Release item | Verified value |
|---|---|
| Source | `e9618a6` plus chapter-navigation follow-up `bc67a15` |
| Review PR | [PR #2](https://github.com/nuvear/project_kakehasi_raj_site/pull/2), against the actual published baseline |
| Initial Cloud Build | `95760edf-8713-4455-8981-74e5b97b7421` — success |
| Initial Cloud Run revision | `kakehashi-app-00028-rpx` |
| Main Hosting version | `bf9932393de56009` |
| Main Hosting release | `1788747273537000` at `2026-09-07T02:14:33.537Z` |
| HealthKitSync Hosting version | `7a1f7fd9b9bc7dcc` |
| HealthKitSync Hosting release | `1788747270266000` at `2026-09-07T02:14:30.266Z` |
| Runtime configuration | Environment, secrets references, service account, resources, ports, concurrency, startup probe, timeout and scaling settings match the pre-release configuration |
| HTTP/API verification | 63 checks pass on both direct Cloud Run and the public www domain |
| Browser verification | 38 canonical EN/JA pages at five widths: 190 checks pass; two initial reads were repeated after the streamed page loaded |
| Independent entry points | All ten old demo paths redirect to GATE; HealthKitSync redirects to Nuvear; apex still redirects to www; Diary opens its independent sign-in; new portrait asset returns 200 |

The chapter-navigation follow-up is published: Cloud Build `787eac27-13d6-4bcc-b824-fbc62e866b7d` succeeded; image `professional-20260907-2` has digest `sha256:f061489f348e8b2a76987fcdccd5cf80c2888c6b003e2297eabf8d147dc237fe`; revision **`kakehashi-app-00029-8x9` serves 100% of traffic**. Firebase routing/assets are unchanged by this follow-up. All 63 public HTTP/API checks pass again. Both guide locales pass at all five widths (10 targeted checks), and the wrapped final-chapter link moves to its heading in the live mobile browser.

Evidence is retained in `docs/verification/professional-*-20260907.json`. No new browser errors were observed during the release check window; earlier local prefetch errors are outside that window. The existing blog subdomain serves the same main site, whose canonical URLs identify www.

See [the hosting runbook](RELEASE_ENGINEER_HOSTING.md) for staging and rollback. Pre-release runtime `kakehashi-app-00027-v6t` and Hosting version IDs are retained in `professional-hosting-before-20260907.json`.
