# Campus & Coast — website brand guide

This guide extends the approved AI Leadership Diary identity to Rajkumar Rajagobalan's public website. It is an independent personal brand, inspired by Stanford campus architecture and the Golden Gate Bridge. The personal identity uses the independent `R.` mark. The English profile additionally displays the owner-selected Stanford GSB logo within its alumni/program callout; this is an affiliation element, not the website's master brand. See [English profile guidelines](branding/ENGLISH_PROFILE.md).

## Visual foundation

| Role | Light colour | Use |
| --- | --- | --- |
| Cardinal | `#8C1515` | Primary actions, emphasis, identity |
| Deep cardinal | `#641C19` | Footer and strong editorial surfaces |
| Bridge orange | `#B83B27` | Small accents and illustrations |
| Sandstone | `#D8C3A5` | Secondary details and architectural warmth |
| Ivory | `#F6F3EC` | Page canvas |
| Warm paper | `#FFFCF7` | Reading panels and cards |
| Charcoal | `#2E2D29` | Primary text |
| Coastal slate | `#4D6471` | Analytical tools and secondary emphasis |
| Deep coastal slate | `#263B45` | Ventures and Command Center navigation |

Cardinal is Stanford's published primary colour. Bridge orange is a design interpretation, not an official bridge paint specification. See the source references in [the original diary guide](diary-design/BRAND.md).

Default typography (Japanese homepage and linked editorial pages): Libre Caslon Display for editorial headings and the personal wordmark; DM Sans for navigation, body copy, labels and controls. Japanese uses system fallbacks where the Latin fonts have no glyphs. Prefer readable line lengths and generous Japanese line heights. The website's existing theme preference remains light/dark/system; dark mode uses warm charcoal, pale terracotta and pale coastal slate.

## Composition

The homepage is a continuous editorial journey: introduction, personal perspective, AI toolkit, experience, ventures, education, credentials and contact. Use the portrait for personal identity; the bridge connects the visual story to the approved diary. Avoid adding unverified business metrics, invented clients or unsupported achievement claims.

Sections have different rhythms: illustrated tool cards, chronological experience rows, a coastal venture band, education panels and compact credentials. Linked pages use a large serif title, quiet metadata, a clear return link and a paper reading surface. Existing calculators, search, filters and frameworks keep their functions.

The `R.` monogram is an independent mark. The diary keeps its open-book application mark. The Command Center shares the personal mark while using slate as its primary application colour. Semantic success, warning and risk colours in charts remain distinguishable from brand colours.

## Assets and implementation

- Main website: `apps/web/app/campus.css`, `components/CampusHome.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`, `DetailPageShell.tsx` and `InsightsCatalogueClient.tsx`.
- Main fonts: `apps/web/app/[locale]/layout.tsx`, served through Next font handling.
- Main icon: `apps/web/app/icon.svg`.
- Command Center: `frontend/src/styles/campus-coast.css`, `components/Layout.jsx` and `pages/index.jsx` beneath `rajagobalan-site-main/apps/enterprise-ai-platform/`.
- Photograph: `apps/web/public/images/golden-gate.jpg`, reused from the approved diary. Griffin Wooldridge, Unsplash: <https://unsplash.com/photos/golden-gate-bridge-san-francisco-california-SNdAWKVN1q0>. The footer credits the photographer. Education photographs are documented separately in [photo provenance](EDUCATION_SLIDESHOW.md); retain their captions and credits.
- Portrait: the owner's existing public `raj-headshot.png`; no synthetic portrait.

Keep this reusable guide separate from deployment and functional instructions. See [maintenance onboarding](MAINTENANCE_ENGINEER_ONBOARDING.md) and [release engineering](RELEASE_ENGINEER_HOSTING.md).

## Maintenance acceptance

Check both English and Japanese routes, readable text, visible keyboard focus, mobile navigation, reduced-motion behaviour, the theme controls, the insights search/filter and links into the diary and Command Center. Run the production builds and site/diary regression suites. Check the actual first-party route graph and retain a release record. Browser visual and interaction checks should be recorded separately from HTTP/build checks; never describe one as the other.

## Activity-specific guidelines

Use the [brand index](branding/README.md) to select the correct activity. The English profile overrides the default font pairing with Geist Sans/Mono; do not extend that exception to other routes automatically. The Diary retains its open-book identity and reading themes. The Command Center uses the adjacent coastal-slate palette.
