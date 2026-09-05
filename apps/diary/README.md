# AI Leadership Diary — hosted application

A redesigned executive reading and workbook application at `https://www.rajagobalan.com/diary`.

## Architecture

- Dedicated Next.js application, `basePath: /diary`, deployed to Cloud Run service `ai-leadership-diary` in `us-central1`.
- Firebase Hosting routes `/diary` and `/diary/**` to this service before the existing Kakehashi catch-all. Other routes and GoDaddy records are unchanged.
- Firebase Authentication: independent Google or email/password accounts in `rajagobalan-site`. Email verification is required.
- Firebase Admin verifies bearer tokens, including revocation. Every API operation checks the current diary membership.
- Firestore collections `diaryMembers`, `diaryStates`, and `diaryAccessAudit` are server-only. Existing Firestore rules deny direct client access to these collections.
- The runtime service account has datastore user and Firebase Auth viewer permissions. No private key files or application-owned passwords are used.

## Access and privacy

The verified account matching `DIARY_OWNER_EMAIL` becomes the initial administrator on first sign-in. Other verified accounts request access and remain pending until approved. Administrators can approve, revoke, and assign roles through Manage access. They cannot read another participant's reflections through the application. Administrators cannot change their own access or the configured owner's account.

Users sign out through the sidebar. Firebase authentication uses browser-session persistence; diary state is never written to browser localStorage. Unsaved changes trigger a leaving warning. New identities clear private in-memory state.

## Content and compatibility

`content/diary.json` is a faithful snapshot of the original compiled diary. `content/dimensions.json` and `content/signals.json` preserve the original maturity descriptions and governance examples. The desktop source remains at `/Users/rajkumarrajagobalan/Apple_Intelligence/EnterpriseAIFramework/12-week-workshop/diary`.

Edit manuscript sources in the original `split_manuscript` folder, compile with its existing script, then import the resulting data into this application's content snapshot. Do not edit the original compiled JS manually.

The application retains all twelve weeks, front/back matter, the P&L calculator, governance workbook, reflection workbooks, maturity assessment, manifesto certificate, reading preferences and JSON backup compatibility. Imported markup is rendered as text in fields; markdown content uses React Markdown without raw HTML execution.

## Development and checks

Restore the restricted manuscript first with `python3 apps/diary/scripts/restore-manuscript.py` using an authorized Google Cloud identity. The manuscript is intentionally excluded from the public repository.

From the repository root:

```sh
pnpm --filter @kakehashi/diary dev
pnpm --filter @kakehashi/diary test
pnpm --filter @kakehashi/diary build
```

Local preview: `http://127.0.0.1:3012/diary`. Local authenticated API development requires appropriate Google Application Default Credentials. `.env.example` documents runtime settings. Firebase web configuration is public client configuration, not a server secret.

`tests/access.test.ts` checks anonymous and invalid tokens, verified email, pending/revoked access, per-user reads/writes, optimistic concurrency, role enforcement, ownership protection, audit records, source chapter count and import/calculator compatibility.

`node scripts/live-smoke.mjs https://SERVICE-HOST/diary` exercises deployed authentication and storage with two disposable test accounts. It sends no emails and removes its accounts and records in `finally`.

## Release

Use `scripts/stage-release.py` to create a minimal build context containing only this application and the dependency manifests. This excludes unrelated, uncommitted Kakehashi work. The application Dockerfile is copied to the context root. Build the context with Cloud Build, deploy its exact image to the dedicated service, run live smoke checks, then publish the two Firebase Hosting rewrites for target `main` only.

See the repository’s `docs/DIARY_RELEASE.md` for the concrete release record.

## Operational limits

Google's interactive OAuth flow requires a real participant to complete Google sign-in. Automated service tests validate email/password and authorization but do not impersonate a real Google user. The app prevents silent concurrent overwrites; on a conflict, export unsaved work and load the saved version. JSON exports provide user-controlled backup; an organization-wide backup/retention policy is separate operational work.
