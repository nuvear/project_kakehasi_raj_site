# Responsive review — 2026-09-06

## Coverage

Reviewed the 40 published English/Japanese profile routes, all 10 Command Center routes, and the Diary sign-in page in headless Chrome at 1440, 1024, 768, 390 and 320 CSS pixels. This is browser emulation, not a physical-device certification. The signed-in Diary workspace was not tested because the isolated browser has no account session; its existing responsive source was reviewed and no Diary code was changed.

The initial review found content clipped by the page boundary despite no document scrollbar: Japanese text inherited `word-break: keep-all`, and grid children expanded to their content width. The Command Center maturity result overflowed at tablet and narrow-phone widths. Some controls and photo captions were too small for comfortable touch use.

## Changes

- Natural Japanese line breaking and shrinkable content columns across the homepage and detail templates.
- Larger theme, language, menu and slideshow controls; legible captions, credits and school selectors.
- Two-row narrow-screen header, single-column tablet tool cards, and proportional phone slideshow images.
- Command Center navigation collapses on portrait tablets, leaving the workspace full width.
- Maturity score/chart stack when space is limited; rating controls use a full-width row on phones.
- Phone page actions stack below their headings; form fields avoid mobile input zoom.

## Validation

- Production builds: main site and Command Center passed.
- Existing regression tests: 36 site/content plus 17 Diary tests passed.
- All 255 local page/viewport combinations returned 200 and had no detected document overflow or uncontained content clipping. Deliberately scrollable tables and credential tabs remain scrollable.
- Phone profile menu opens, navigates, and closes. Theme switching works. All seven photo selections load correctly and stop automatic rotation.
- Tablet Command Center menu opens and closes after navigation. The phone project form opens without saving. Assessment controls and results fit at 320px without submitting data.
- Screenshots reviewed for desktop/tablet/phone homepage, Japanese detail pages, education carousel, credentials, Diary sign-in, and Command Center forms/results. Screenshot captures of animated charts need a settling interval; intermediate animation frames are not data changes.
- No account creation, form submission, assessment submission, or business-data write was performed.

Evidence: `docs/verification/responsive-local-20260906.json`, `responsive-interactions-20260906.json`, and `cc-responsive-interactions-20260906.json`.

## Repeat the browser check

`scripts/check-responsive.cjs` requires Playwright and installed Chrome. Use `PLAYWRIGHT_MODULE` to point to an existing Playwright installation without changing production dependencies. `SITE_BASE`, `CC_BASE`, `WIDTHS`, `PATH_FILTER`, and `RESPONSIVE_OUTPUT` configure targets/output. Default local ports are 3013 and 3014. Local Command Center reads may be forwarded to the existing public API; writes are blocked by the check. For production checks set both bases to `https://www.rajagobalan.com`.

Only the main website and Command Center frontend need releasing. Preserve Hosting rewrites, APIs, content records and Diary authentication. Previous rollback revisions are `kakehashi-app-00026-p6p` and `command-center-web-00004-5df`.
