# GATE command-center promotional draft

Prepared 7 September 2026 in `codex/gate-command-center-pitch`, an isolated worktree based on `f123be6`. This is a reviewable draft, not a public website deployment. The main website checkout contains substantial unrelated working changes; none were incorporated, overwritten or published by this draft.

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

A dedicated locale route replaces the generic app rendering only for `ai-transformation-command-center`. It uses scoped CSS and no bespoke client JavaScript. The shared app page, legacy demo component, legacy runtime, deployment guide and Firebase rewrites remain unchanged. The existing URL and locale switch are retained. Catalogue Markdown, summaries and the app URL now describe GATE. The Japanese copy is retained as `review_required` for editorial acceptance.

Visible pitch copy is in `apps/web/lib/gate-pitch.ts`; synchronized Markdown under `content/apps/ai-transformation-command-center/` supports catalogue and retrieval content. Keep those forms aligned when editing. The changed migration checks now assert GATE positioning while retaining the legacy routing/deployment tests.

## Executed validation

- Installed the existing lockfile without changing it. Initial dependency symlinks were rejected by Turbopack and left schema tests without package-local dependencies; replacing them with a normal worktree install resolved those setup failures.
- All 36 website tests across six files passed after updating the two obsolete legacy-copy assertions.
- Typecheck, targeted ESLint and the complete Next.js production build passed. No new test suite was introduced for static copy/layout.
- English and Japanese routes returned HTTP 200 in local browser review. Desktop 1440×1000, tablet 1024×768 and mobile 390×844 inspections found no page horizontal overflow. A Japanese punctuation-wrap issue was corrected and rechecked.
- Language switching worked. The application link opened the actual GATE workspace using the existing authorized owner session. Simulation/manual link destinations were inspected. No email was sent and no GATE record was changed.
- Browser error log inspection returned no application errors during draft review. The final preview uses the production standalone build on loopback port 3105.

## Handoff and publication

The draft is committed locally. It has not been pushed to the public GitHub repository or deployed. A local preview is available at `http://127.0.0.1:3105/en/apps/ai-transformation-command-center`; Japanese uses `/ja/`.

For publication, apply only this draft's owned paths to the verified current website release baseline, incorporating the existing website work through its own review. Rebuild and verify the two marketing routes, catalogue metadata and unchanged legacy/docs routes before deploying the Kakehashi service. Do not deploy the whole older worktree baseline, change Firebase routing, expose the private GATE Site, or migrate the legacy application's data as a side effect of publishing this promotional page.
