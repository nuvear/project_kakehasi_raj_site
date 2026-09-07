# Education photo journey

Added to both profile languages, within `#education` above the existing education cards. The seven institutions follow the owner's requested order. No qualification, attendance date, or database record was added. Sainik School is included in the photo journey based on the owner's request.

The carousel advances every six seconds once the current image loads and the carousel is visible. It pauses while hovered or in a hidden browser tab. Focus on navigation/credit controls, manual selection, and arrow-key navigation stop rotation until Play is selected. Visitors with reduced-motion preferences start paused; the existing reduced-motion CSS disables crossfades. The rotation button remains directly operable without its own focus event reversing its intended action.

Photographs are self-hosted and served through Next Image. The current and next photograph load on entry to the section; later photographs are loaded progressively. Original image files retain their own licensing terms. Responsive cropping and optimized delivery do not transfer image copyright to this website.

## Photo provenance (retrieved 2026-09-06)

| File | Subject and credit | Source and reuse terms |
| --- | --- | --- |
| `sainik.jpg` | Cadets on parade on campus; Sainik School Amaravathinagar | [Official school website](https://www.sainikschoolamaravathinagar.edu.in/), `assets/images/banner/img_02.jpg`. Institutional photograph; no open license was stated. Copyright remains with its owner. |
| `american-campus.jpg` | Red-brick campus architecture; image supplied by the profile owner | User attachment `The American College.jpg`, selected 2026-09-06. Photographer and reuse license were not supplied; no Commons attribution or open license is asserted. |
| `madras-entrance.jpg` | Entrance gate, Madras Institute of Technology; supplied by the profile owner | User attachment `mit-front.jpg`, selected 2026-09-06. Photographer and reuse license were not supplied; no Commons attribution or open license is asserted. |
| `shizuoka-campus.jpg` | Hamamatsu Campus building and courtyard; Shizuoka University ABP | [Official image selected by the owner](https://www.abp.icsu.shizuoka.ac.jp/images/schoollife/campus/img_ph02.jpg), retrieved 2026-09-06. No open license asserted. |
| `anaheim-building.webp` | Anaheim University building; supplied by the profile owner | User attachment `Anaheim-University-USA.webp`, selected 2026-09-06. Photographer and reuse license were not supplied; no open license is asserted. |
| `mit.jpg` | Great Dome; Calvinkrishy | [Commons source](https://commons.wikimedia.org/wiki/File:MIT_Main_Apr09.JPG), used under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). |
| `stanford.jpg` | Knight Management Center; Steve Castillo | [Commons source](https://commons.wikimedia.org/wiki/File:Knight_Management_Center.jpg), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). |

These are sourced photographs, not generated substitutes. The owner subsequently selected a university building photograph for Anaheim. The current slide does not identify this building as the Tokyo learning center; the original archival photograph remains in Git history. Photo credits and license links appear with each slide. CC BY-SA photographs and any responsive presentation adaptations remain under their stated licenses; the website code has separate terms. Institutional image attribution is not a representation of an open reuse license or a permission grant.

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

## Owner-selected photo replacement — 2026-09-06

Replaced the American College and Shizuoka photographs with the exact attachment and URL supplied by the owner. Captions and credits in both languages now describe these photographs. New asset paths prevent cached versions of the previous photos from appearing. Source bytes are unchanged; Next Image handles responsive delivery. The originals remain in Git history.

Released as `kakehashi-app-00024-rnl` (100% traffic), image tag `education-photos-20260906-2`, Cloud Build `07376ff8-bd7c-4ab5-a961-b6bef580b212` (SUCCESS). Rollback revision: `kakehashi-app-00023-j8d`. Production build passed. Live checks confirmed both original image files match the selected source bytes, both optimized images return HTTP 200, and both locale pages contain the slideshow. Evidence: `docs/verification/selected-photos-live-20260906.json`.

## Owner-selected Madras Institute of Technology photo — 2026-09-06

Replaced the administrative-block photograph with the exact `mit-front.jpg` attachment. Both language captions now identify the entrance gate. Updated source credit and a new asset URL prevent stale attribution and cached-image reuse. The previous image remains in Git history.

Released as `kakehashi-app-00025-5qr` (100% traffic), image tag `madras-photo-20260906-1`, Cloud Build `6884f281-28d4-490a-bdc1-a838278b8ac5` (SUCCESS). Rollback revision: `kakehashi-app-00024-rnl`. Production build passed. Live original image matches the attachment byte for byte; its optimized image and both locale pages return HTTP 200. Evidence: `docs/verification/madras-photo-live-20260906.json`.

## Owner-selected Anaheim University building photo — 2026-09-06

Replaced the archival Tokyo gathering photograph with the exact `Anaheim-University-USA.webp` attachment. Captions now describe the visible university building, and the eyebrow identifies the Akio Morita School of Business without labeling this building as Tokyo. Existing education records are unchanged. A new WebP asset URL avoids cached copies of the old photo.

Released as `kakehashi-app-00026-p6p` (100% traffic), image tag `anaheim-photo-20260906-1`, Cloud Build `b860816e-6b9f-4fe5-adfe-d7a078b01231` (SUCCESS). Rollback revision: `kakehashi-app-00025-5qr`. Production build passed. Live original WebP matches the attachment byte for byte; the optimized image and both locale pages return HTTP 200. Evidence: `docs/verification/anaheim-photo-live-20260906.json`.
