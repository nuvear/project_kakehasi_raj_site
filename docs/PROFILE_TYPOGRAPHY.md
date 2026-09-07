# English profile typography and LinkedIn reconciliation — 2026-09-07

Scope: `/en` only. The route wraps its existing content in `.profile-typography`; all new font rules are scoped to it. No layout, colour, image or navigation redesign. No changes to Japanese copy, detail pages, shared content records, or independent applications.

The owner subsequently selected GATE as the font reference. Verified `gate-web/app/layout.tsx` and `app/globals.css`: Geist Sans is its interface font and Geist Mono its technical font. The English profile now loads those fonts at page scope, uses Geist Sans for headings/body, and Geist Mono for numeric markers. Font sizes remain responsive and adapted to the profile.

The public LinkedIn page could only be partially read (https://www.linkedin.com/in/rajkumar-rajagobalan/; public search excerpt https://sg.linkedin.com/in/rajkumar-rajagobalan). The owner then supplied the About text and current experience entry in this task. That supplied text is the authority for the profile updates: 27+ years, Innuir Founder CEO from October 2025 in Singapore, privacy-first longitudinal patient identity, AAGNAA $700K funding and patents, Capgemini €160M/320+ projects/35.4% margin/4.5 of 5 satisfaction, Altran integration, and Eli Lilly 42 initiatives/nine production transitions within 18 months. Innuir follows the current role entry; the About section's older Nuvear name is not propagated. No financial figures were independently audited.

English-only presentation overrides sit in `CampusHome.tsx`, preserving existing entity links and Japanese/database records. Future authoritative updates to shared content should explicitly reconcile these profile summaries rather than silently overwrite them.

Validation: production build passed. Browser checks at 1440, 1024, 768, 390 and 320px found no content outside the viewport. Japanese homepage and English Insights page have no typography scope marker. Existing desktop and phone screenshots were reviewed. No other services need release.

Rollback revision observed before this release: `kakehashi-app-00029-8x9`.

Published final Geist release: `kakehashi-app-00031-nv2`, 100% traffic, image `profile-geist-20260907-1`, Cloud Build `5a395d02-06d9-4507-9d88-00a050c6f5f2` (SUCCESS). Previous revision `kakehashi-app-00030-xbs` carried the initial type pairing and supplied content. Live browser checks confirm Geist at all five widths with no detected overflow, and no profile typography marker on `/ja` or `/en/insights`. Live HTML confirms the supplied role and delivery/venture metrics.
