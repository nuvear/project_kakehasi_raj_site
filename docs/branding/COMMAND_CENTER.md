# AI Transformation Command Center brand

Scope: `/apps/ai-transformation-command-center/**`. Recorded from the adopted frontend on 7 September 2026.

## Identity

Use an adjacent Campus & Coast palette led by coastal slate. The application should feel calm, analytical and practical. Keep the independent `R.` personal mark and the product name visible; use clear workspace navigation and restrained decoration. Stanford's institutional logo is not an application mark.

## Palette

| Role | Value |
| --- | --- |
| Primary / analytical emphasis | `#4D6471` |
| Primary container | `#E4E9E9` |
| Deep navigation / on-primary-container | `#263B45` |
| Secondary / personal accent | `#8C1515` |
| Secondary and tertiary containers | `#F1E3DB` |
| Deep secondary text | `#641C19` |
| Tertiary accent | `#B83B27` |
| Workspace / reading panel | `#F6F3EC` / `#FFFCF7` |
| Main / secondary text | `#2E2D29` / `#5E5A53` |
| Surface variant / border | `#EDE7DC` / `#D7CDBC` |
| Additional chart accents | `#6C8589`, `#557568` |

Use existing semantic success, warning and risk tokens for status. Do not turn every chart series cardinal or rely only on colour to distinguish results. This guide records the implemented warm light presentation; do not assume the website's dark palette has been implemented here.

## Typography and layout

DM Sans is the interface font. Libre Caslon Display is used for the personal owner mark (20px), with Georgia/serif fallback. Heading tracking is `-0.015em`. Retain the component hierarchy for dashboard numbers, labels, tables and form controls; Geist is not a global replacement.

Use warm paper panels, restrained borders and minimal shadow. The wide-screen shell has a 225px navigation column and a shrinkable content region. Collapse navigation on portrait tablets and phones. Stack result charts, scores and page actions when width is limited. Keep touch controls usable and form text legible. Deliberately scrollable data tables may scroll inside their own regions; the page itself should not overflow.

Write concise, direct labels and explain assessments without overstating certainty. Keep brand styling separate from calculation, scoring and data semantics.

## Implementation and review

Source root: `rajagobalan-site-main/apps/enterprise-ai-platform/frontend/`. Brand stylesheet: `src/styles/campus-coast.css`; shell: `src/components/Layout.jsx`; landing page: `src/pages/index.jsx`. Preserve the underlying `globals.css` semantic tokens and application behavior.

Review navigation, project forms and maturity results at 1440, 1024, 768, 390 and 320px. See [responsive review](../RESPONSIVE_REVIEW.md) for retained evidence and known scope. Deployment is managed separately from the main website; consult release documentation.
