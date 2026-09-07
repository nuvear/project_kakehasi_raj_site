# AI Leadership Diary — Campus & Coast

## Identity

An independent executive diary by Rajkumar Rajagobalan. The visual idea connects the reflective quality of Stanford's sandstone courtyards with the Golden Gate Bridge's confident engineering. Keep the existing product name and original editorial content.

The identity uses a literary serif wordmark, an open-book icon, precise interface typography, warm paper-like reading surfaces and a restrained orange accent. The institutional inspiration informs the design; the product is not presented as a Stanford program or affiliated service. Do not use Stanford seals or university wordmarks.

## Palette

| Color | Hex | Role |
|---|---|---|
| Cardinal | `#8C1515` | Primary buttons, active navigation, top rule |
| Bridge orange | `#B83B27` | Progress, chapter numbers, charts, certificate accent |
| Sandstone | `#D8C3A5` | Dividers, framing, architectural warmth |
| Campus ivory | `#F6F3EC` | Workspace background |
| Paper | `#FFFFFF` | Cards and primary reading surface |
| Warm paper | `#FFFCF7` | Sign-in form surface |
| Charcoal | `#2E2D29` | Main text |
| Coastal slate | `#4D6471` | Secondary chart structure |
| Deep cardinal | `#641C19` | Brand depth |

Cardinal and charcoal follow Stanford's published digital values. Sandstone, bridge orange, ivory and coastal slate are design interpretations of the reference imagery, not claimed paint matches or pixel-sampled official specifications.

## Typography and composition

- Libre Caslon Display: wordmark, major titles, chapter reading titles and certificate.
- DM Sans: navigation, buttons, labels and data.
- Georgia: long-form reading by default, with the original sans-serif option retained.
- Serif titles are spacious and editorial; controls stay clear and compact.
- The sign-in screen uses the bridge photograph with a dark warm overlay. Reading and workbook screens prioritize uninterrupted content.
- Light, dark and sepia settings share the same visual identity. Dark mode uses lighter terracotta for accessible interactive text.

## Reference sources

- Stanford homepage: https://www.stanford.edu/
- Stanford primary colors: https://identity.stanford.edu/design-elements/color/primary-colors/
- Stanford campus reference: https://rde.stanford.edu/conferences/non-student-summer-housing-housing-choices
- Golden Gate Bridge color history: https://www.goldengate.org/bridge/history-research/bridge-features/color-art-deco-styling/
- Golden Gate photograph: Griffin Wooldridge, https://unsplash.com/photos/golden-gate-bridge-san-francisco-california-SNdAWKVN1q0
- Photograph license: Unsplash License, https://unsplash.com/license

The licensed photograph is saved at `apps/diary/public/images/golden-gate.jpg` and credited on the sign-in screen. Campus photographs are research references and are not republished.

## Activity boundary and theme implementation

This guide remains specific to the Diary; the English profile's subsequent Geist typography and Stanford alumni logo do not change the Diary identity. Use the [activity index](../branding/README.md) when working across applications.

The implemented dark workspace uses background `#211A18`, surface `#2D2420`, text `#F4EBDF` and interactive accent `#EDA68D`. Sepia uses background `#F2ECE0`, surface `#FFFAF0`, text `#493D2E` and accent `#7B5D39`. Preserve these activity-specific tokens rather than copying the public website's dark theme.

Use a reflective, practical and encouraging editorial voice. Keep chapter reading spacious, navigation precise, and workbook inputs clear. Preserve the long-form reading font preference. Authentication and account management screens should use direct, unambiguous labels.

Implementation: `apps/diary/app/style.css`; assets: `apps/diary/public/images/`; visual reference: [brand board](brand-board.svg). Check the reading workspace as well as sign-in when validating future changes; public sign-in screenshots alone do not prove authenticated workspace behavior.
