# English profile typography and LinkedIn reconciliation — 2026-09-07

Scope: `/en` only. The route wraps its existing content in `.profile-typography`; all new font rules are scoped to it. No layout, colour, image or navigation redesign. No changes to Japanese copy, detail pages, shared content records, or independent applications.

Typography keeps Libre Caslon Display for the hero and uses DM Sans for clearer section/card headings, identity and body text. Responsive sizes improve hierarchy and supporting-label readability without introducing another font download.

The public LinkedIn page could only be partially read (https://www.linkedin.com/in/rajkumar-rajagobalan/; public search excerpt https://sg.linkedin.com/in/rajkumar-rajagobalan). The owner then supplied the About text and current experience entry in this task. That supplied text is the authority for the profile updates: 27+ years, Innuir Founder CEO from October 2025 in Singapore, privacy-first longitudinal patient identity, AAGNAA $700K funding and patents, Capgemini €160M/320+ projects/35.4% margin/4.5 of 5 satisfaction, Altran integration, and Eli Lilly 42 initiatives/nine production transitions within 18 months. Innuir follows the current role entry; the About section's older Nuvear name is not propagated. No financial figures were independently audited.

English-only presentation overrides sit in `CampusHome.tsx`, preserving existing entity links and Japanese/database records. Future authoritative updates to shared content should explicitly reconcile these profile summaries rather than silently overwrite them.

Validation: production build passed. Browser checks at 1440, 1024, 768, 390 and 320px found no content outside the viewport. Japanese homepage and English Insights page have no typography scope marker. Existing desktop and phone screenshots were reviewed. No other services need release.

Rollback revision observed before this release: `kakehashi-app-00029-8x9`.
