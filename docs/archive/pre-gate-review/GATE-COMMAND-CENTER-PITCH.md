# GATE command-center promotional draft

Prepared 7 September 2026 in `codex/gate-command-center-pitch`. The original draft was based on `f123be6`; after reading the user-referenced task **Clarify Sites requirements**, it was rebased onto the actual published Campus & Coast source `9a25c872b3d3b99a65f529556b5e0de29213d160`. The original draft is preserved on `codex/gate-pitch-original-draft`. This remains a reviewable draft, not a public website deployment. The original main checkout and released Campus & Coast checkout are unchanged.

## Review of the current public page

The public English page was inspected in the browser at `https://www.rajagobalan.com/en/apps/ai-transformation-command-center`. It still described the legacy command-center prototype, linked its separate runtime and included an embedded demo with sample 190–310% ROI figures. Its claims included real-time portfolio visibility, automatic opportunity/ROI generation, architecture generation and long-range roadmap generation. Those claims do not accurately describe GATE's current delivered scope. Runtime and deployment implementation notes also interrupted the buyer-facing narrative.

The revised positioning is **GATE — Your AI Transformation Command Center**, led by **Lead your AI portfolio with evidence.** The short pitch is:

> GATE brings AI projects, approved knowledge and accountable decisions into one workspace. Give leadership a clearer view of what to advance, what needs intervention and what should pause.

## Page structure

1. GATE identity, value proposition, a pilot-enquiry link and the current application link.
2. A clearly labeled workflow illustration: purpose, evidence, gaps, decision.
3. The leadership question: which initiatives deserve the next commitment?
4. Six delivered capability areas: portfolio, evidence, adviser, governance gap review, decisions and integration foundations.
5. CFO, CIO, CEO, CTO and Legal questions, with permissions kept distinct from review perspectives.
6. Separate simulation and manual links.
7. Demonstrable features, enterprise-specific acceptance work and explicit boundaries.
8. A focused invitation to discuss one portfolio review.

The application, simulation and manual links point to the existing private GATE Site. The copy states that the current preview is owner-only and does not grant access or offer public registration. The contact link opens an email draft to the existing public contact address; no message was sent.

## Claim discipline

Implementation claims were checked against the GATE repository's current implementation status, user manual and version-14 release evidence. Current source is `95257d65dba3e4f708712138874068b500026baa`, with documentation follow-up `8926dc1`. Claims distinguish implemented API/MCP/provider capabilities from live customer acceptance. No certifications, customer logos, realized returns, comprehensive legal coverage, turnkey connectors or continuous automatic enterprise audit are claimed. `/gate` on the custom domain and commercial billing remain planned. The reference to optional Notion/NotebookLM and unadopted OpenRAG is a capability boundary, not a new roadmap commitment.

## Implementation boundary

A dedicated locale route replaces the generic app rendering only for `ai-transformation-command-center`. It uses scoped CSS, the released shared SiteHeader/SiteFooter, and the existing theme/mobile navigation. There is no bespoke client state in the marketing content. The shared app page, legacy demo component, legacy runtime, deployment guide and Firebase rewrites remain unchanged. The existing URL and locale switch are retained. Catalogue Markdown, summaries and the app URL now describe GATE. The Japanese copy is retained as `review_required` for editorial acceptance.

Visible pitch copy is in `apps/web/lib/gate-pitch.ts`; synchronized Markdown under `content/apps/ai-transformation-command-center/` supports catalogue and retrieval content. Keep those forms aligned when editing. The changed migration checks now assert GATE positioning while retaining the legacy routing/deployment tests.

## Executed validation

- Installed the existing lockfile without changing it. Initial dependency symlinks were rejected by Turbopack and left schema tests without package-local dependencies; replacing them with a normal worktree install resolved those setup failures.
- All 36 website tests across six files passed after updating the two obsolete legacy-copy assertions.
- Typecheck, targeted ESLint and the complete Next.js production build passed. No new test suite was introduced for static copy/layout.
- English and Japanese routes returned HTTP 200 in local browser review. Desktop 1440×1000, tablet 1024×768 and mobile 390×844 inspections found no page horizontal overflow. A Japanese punctuation-wrap issue was corrected and rechecked.
- Language switching worked. The application link opened the actual GATE workspace using the existing authorized owner session. Simulation/manual link destinations were inspected. No email was sent and no GATE record was changed.
- Browser error log inspection returned no application errors during draft review. The final preview uses the production standalone build on loopback port 3105.

After rebasing onto the published Campus & Coast source, validation was repeated with its existing frozen lockfile and Next.js 15.5.25. The production build, lint/typecheck, 36 website tests and 17 Diary tests passed (53 tests total). The Diary tests required restoring the existing ignored local `apps/diary/content/diary.json` from the released worktree; that manuscript remains excluded from Git and the main-site release staging.

The shared header, footer, mobile menu and light/dark theme controls were checked in the browser. Both localized routes had no horizontal page overflow at 320, 390 and 1024 pixels; desktop rendering was also reviewed at 1440 pixels. English and Japanese phone screenshots and the Japanese tablet rendering were inspected. Language navigation and all three GATE destinations were checked, and the browser error log was empty. These are local draft checks, not a new public deployment verification.

## Handoff and publication

The draft is committed locally. It has not been pushed to the public GitHub repository or deployed. A local preview is available at `http://127.0.0.1:3105/en/apps/ai-transformation-command-center`; Japanese uses `/ja/`.

The draft now includes the verified current website baseline. Publish the staged main-site image through the existing Kakehashi release process after the draft is accepted. Recheck the current deployed revision before changing traffic, and verify the marketing routes, catalogue metadata and unchanged legacy/docs routes. No Firebase rewrite, DNS change, GATE Site access change, legacy-data migration or Diary deployment is needed for this promotional page.

## Hosting handoff from Clarify Sites requirements

The referenced task is `01a071af-ca59-7213-a728-46046d282f68`. Its original user instructions specify GoDaddy DNS, Firebase Hosting in project `rajagobalan-site`, and Next.js on Cloud Run. Later turns establish `raj-site-campus-coast` / `codex/campus-coast-site` as the published source, preserving the original dirty checkout. PR #1 is still open and points to `9a25c872b3d3b99a65f529556b5e0de29213d160`.

A live read-only Cloud Run inspection on 7 September confirms `kakehashi-app-00027-v6t` serves 100% of the main-site traffic using `kakehashi-app:responsive-20260906-1`. This agrees with `docs/RESPONSIVE_REVIEW.md`; the older runbook's June revision is historical. Use `scripts/stage-site-release.py` to stage the main website, preserving runtime settings, Firebase rewrites and unrelated services. The localized `/en/apps/...` and `/ja/apps/...` pages belong to `kakehashi-app`; `/apps/ai-transformation-command-center` remains the separate legacy runtime.

The established main-site region is `us-central1`. That is a verified existing deployment choice, not an approval of US residency for future GATE customer evidence. Hosting GATE itself at `/gate` still requires its enterprise identity, PostgreSQL/storage and operational setup; it is separate from publishing this marketing page.
