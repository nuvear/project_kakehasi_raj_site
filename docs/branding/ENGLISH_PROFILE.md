# English personal profile brand

Scope: `/en` only. This is the approved exception to the website's default editorial typography, recorded 7 September 2026.

## Purpose and voice

Help visitors know Rajkumar as a person, engineer, leader and founder. Write in a candid, humble first-person voice. State leadership responsibilities clearly, acknowledge colleagues and shared progress, and avoid job-seeking language or promotional superlatives. Preserve the headline “Learning, leading, and building together.” unless the owner requests a change. Do not invent achievements or biographical details. The supplied LinkedIn text and current role entry are the factual sources; see [editorial review](../PROFILE_EDITORIAL_REVIEW.md).

## Typography

Use Geist Sans for headings, body, navigation and the personal wordmark, with Arial/sans-serif fallback. Use Geist Mono for numeric section markers. The reference is the GATE application. Keep this scoped through `.profile-typography`; Japanese and linked pages retain the default family.

| Role | Current responsive size | Weight |
| --- | --- | --- |
| Hero | `clamp(2.125rem, 4.5vw, 4rem)` | 600 |
| Hero at 700px and below | `clamp(2rem, 9vw, 2.75rem)` | 600 |
| Section heading | `clamp(1.875rem, 3vw, 2.75rem)` | 600 |
| Card heading | `clamp(1.375rem, 2vw, 1.75rem)` | 600 |
| Name/introduction | `1.375rem` | 600 |
| Narrative paragraphs | `1.0625rem`; hero/approach becomes `1rem` at 700px and below | Inherited body weight |
| Navigation / action links | `.875rem` / `.9375rem` | Follow component |
| Eyebrows and credits | `.8125rem` | Eyebrows 600 |

These are CSS values, not fixed screenshot dimensions. Keep browser zoom and wrapping usable; do not shrink text to force a desktop layout onto a phone.

## Colour and affiliation

Use the shared cardinal/ivory palette and existing dark-mode tokens. The first-screen sequence is Stanford affiliation, leadership headline, name and personal introduction.

Display the exact supplied [Stanford GSB SVG](https://www.gsb.stanford.edu/themes/custom/gsb/logo.svg), saved at `apps/web/public/images/stanford-gsb-logo.svg`. Preserve its original artwork, colours and proportions. Current presentation uses a white backing with 10px padding; the image is 240px wide, 210px at viewport widths up to 400px, and constrained to available width. This backing also preserves dark-mode legibility.

Keep “Stanford GSB Alumni” and “Stanford Executive Program · 2025–2026” with the image. The group links to `/en/education/stanford-executive-program`, with a cardinal left rule and space before the main headline. The program context is part of the affiliation treatment. Do not repurpose this wordmark as the site logo, app icon or a badge on unrelated products. The personal `R.` identity remains in the header.

## Photography and implementation

Use the owner's existing portrait, the credited bridge photograph and the documented education slideshow. Preserve the natural photo treatment and quiet reading surfaces.

Source: `apps/web/components/CampusHome.tsx`, `apps/web/app/campus.css`, `apps/web/app/[locale]/page.tsx`. Verify the callout remains visible in the first viewport at 1440, 768, 390 and 320px and check both themes. Keep links, focus treatment and logo alternative text meaningful. The release evidence and factual reconciliation remain in the separate profile documents.
