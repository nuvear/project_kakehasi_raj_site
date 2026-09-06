# Education photo journey

Added to both profile languages, within `#education` above the existing education cards. The seven institutions follow the owner's requested order. No qualification, attendance date, or database record was added. Sainik School is included in the photo journey based on the owner's request.

The carousel advances every six seconds once the current image loads and the carousel is visible. It pauses while hovered or in a hidden browser tab. Focus on navigation/credit controls, manual selection, and arrow-key navigation stop rotation until Play is selected. Visitors with reduced-motion preferences start paused; the existing reduced-motion CSS disables crossfades. The rotation button remains directly operable without its own focus event reversing its intended action.

Photographs are self-hosted and served through Next Image. The current and next photograph load on entry to the section; later photographs are loaded progressively. Original image files retain their own licensing terms. Responsive cropping and optimized delivery do not transfer image copyright to this website.

## Photo provenance (retrieved 2026-09-06)

| File | Subject and credit | Source and reuse terms |
| --- | --- | --- |
| `sainik.jpg` | Cadets on parade on campus; Sainik School Amaravathinagar | [Official school website](https://www.sainikschoolamaravathinagar.edu.in/), `assets/images/banner/img_02.jpg`. Institutional photograph; no open license was stated. Copyright remains with its owner. |
| `american.jpg` | Daniel Poor Memorial Library; N. Vivekananthamoorthy | [Commons source](https://commons.wikimedia.org/wiki/File:The_American_College,_Madurai,Tamil_Nadu,_India.jpg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). |
| `madras.jpg` | Administrative block, Madras Institute of Technology; Anna University | [Commons source](https://commons.wikimedia.org/wiki/File:Administrative_block,_Madras_institute_of_technology.jpg), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), as declared on the file page. |
| `shizuoka.jpg` | Hamamatsu Campus panorama; Jfr0595 | [Commons source](https://commons.wikimedia.org/wiki/File:Hamamatsucampus.JPG), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). |
| `anaheim.jpg` | MBA students at the former Akio Morita Learning Center, Tokyo; Anaheim University archive | [Original photograph](https://anaheim.edu/wp-content/uploads/2025/01/DSC_1194-1-scaled.jpeg). The university's public media metadata explicitly identifies the former Tokyo learning center. No open license was stated; institutional copyright retained. |
| `mit.jpg` | Great Dome; Calvinkrishy | [Commons source](https://commons.wikimedia.org/wiki/File:MIT_Main_Apr09.JPG), used under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). |
| `stanford.jpg` | Knight Management Center; Steve Castillo | [Commons source](https://commons.wikimedia.org/wiki/File:Knight_Management_Center.jpg), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). |

These are sourced photographs, not generated substitutes. The Anaheim image is an archival student gathering at its former Tokyo learning center; the slide does not imply it is a current Tokyo campus. Avoid replacing it with Anaheim's California building or with the newer generated images present in its media library. Photo credits and license links appear with each slide. CC BY-SA photographs and any responsive presentation adaptations remain under their stated licenses; the website code has separate terms. Institutional image attribution is not a representation of an open reuse license or a permission grant.

## Maintenance

- Photo/caption order and attribution: `apps/web/lib/education-photos.ts`.
- Interaction: `apps/web/components/EducationSlideshow.tsx`.
- Styling: education slideshow section of `apps/web/app/campus.css`.
- Integration: `apps/web/components/CampusHome.tsx`.
- Assets: `apps/web/public/images/education/`.
- Release only `kakehashi-app`; no Hosting, API, diary or database change is needed.

## Production release — 2026-09-06

- Live: https://www.rajagobalan.com/en#education and https://www.rajagobalan.com/ja#education.
- Cloud Build: `c64fd054-c58d-4c41-b508-11c295d0147e` — SUCCESS.
- Main service: `kakehashi-app-00023-j8d`, serving 100% of traffic.
- Image: `us-central1-docker.pkg.dev/rajagobalan-site/cloud-run-source-deploy/kakehashi-app:education-20260906-1`.
- Previous revision for rollback: `kakehashi-app-00022-5r2`.
- Validation: production build, 36 site/content tests and 17 diary tests passed. Both live locale homepages include all seven selectors. All seven optimized photo URLs returned HTTP 200 with image content types (49–136 KB at width 1080). All 40 crawled locale routes returned successfully.
- Evidence: `docs/verification/education-live-checks-20260906.json` and `docs/verification/education-live-routes-20260906.json`.

HTTP/build validation does not represent browser interaction QA. Firebase Hosting configuration, content records and independent services were not changed by this release.
