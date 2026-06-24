# Migration Plan — Replace rajagobalan.com with This Application

Plan to replace the current static site at https://www.rajagobalan.com with this Vite-built application (resume + Enterprise AI Framework + Blogs).

---

## 1. Current vs. New Structure

### Current deployment (Firebase Hosting)

| Path | File | Content |
|------|------|---------|
| `/` | `public/index.html` | Simple homepage |
| `/blogs/` | `public/blogs/index.html` | Blog placeholder |
| `/404` | `public/404.html` | Custom 404 |

- **Content root**: `public/`
- **Build**: None (static HTML only)

### New application (this project)

| Path | File | Content |
|------|------|---------|
| `/` | `index.html` | Full resume (Rajkumar Rajagobalan) |
| `/framework.html` | `framework.html` | Raj's Enterprise AI Framework (React app) |
| `/blogs.html` | `blogs.html` | Blogs page with framework link |
| `/enterprise-ai-reference-guide.html` | `enterprise-ai-reference-guide.html` | Reference guide (HTML from MD) |

- **Build**: Vite (`npm run build`) → outputs to `dist/`
- **Assets**: JS/CSS bundled by Vite; static files from `public/` copied to `dist/`

---

## 2. URL Mapping & Redirects

| Old URL | New URL | Action |
|---------|---------|--------|
| `/` | `/` | Replace — new resume replaces old homepage |
| `/blogs/` | `/blogs.html` | Redirect — old blog path → new blogs page |
| N/A | `/framework.html` | New — Enterprise AI Framework |
| N/A | `/enterprise-ai-reference-guide.html` | New — Reference guide |

**Firebase rewrites** (in `firebase.json`) to handle:
- `/blogs` and `/blogs/` → `/blogs.html`
- Clean URLs if desired (e.g. `/blogs` without `.html`)

---

## 3. Implementation Checklist

### Phase 1: Build & static assets

- [ ] **1.1** Create `public/` directory for static assets
  - `public/profile.jpg` — hero photo (copy from existing site or add placeholder)
  - Any other images/favicons

- [ ] **1.2** Verify Vite build output
  - Run `npm run build`
  - Confirm `dist/` contains: `index.html`, `framework.html`, `blogs.html`, `enterprise-ai-reference-guide.html`, `assets/`
  - Confirm `profile.jpg` is at `dist/profile.jpg` (Vite copies `public/` contents to `dist/` root)

- [ ] **1.3** Add `base` to `vite.config.js` if site is not at root (e.g. subpath)
  - For `www.rajagobalan.com` root deployment, `base: '/'` (default) is correct

### Phase 2: Firebase configuration

- [ ] **2.1** Create or update `firebase.json`:
  ```json
  {
    "hosting": {
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        { "source": "/blogs", "destination": "/blogs.html" },
        { "source": "/blogs/", "destination": "/blogs.html" }
      ]
    }
  }
  ```

- [ ] **2.2** Create or update `.firebaserc`:
  ```json
  {
    "projects": {
      "default": "rajagobalan-site"
    }
  }
  ```

- [ ] **2.3** Add `dist/` to `.gitignore` (if not already) — build output should not be committed

### Phase 3: 404 and error handling

- [ ] **3.1** Create `public/404.html` — custom 404 page matching site design, with link back to `/`

- [ ] **3.2** Ensure Firebase serves `404.html` for unknown paths (default behavior)

### Phase 4: Domain and subdomain

- [ ] **4.1** `blogs.rajagobalan.com` — currently redirects to `/blogs/`
  - After migration, redirect should point to `/blogs.html` (or `/blogs` via rewrite)
  - Verify in Firebase Console → Hosting → Custom domains

- [ ] **4.2** `www.rajagobalan.com` — no change; continues to serve from Firebase Hosting

### Phase 5: Pre-deployment verification

- [ ] **5.1** Run `npm run build` and `npm run preview` — test locally
- [ ] **5.2** Check all links: Home, Blogs, Framework, Reference Guide, Contact (mailto)
- [ ] **5.3** Test on mobile viewport
- [ ] **5.4** Verify `profile.jpg` loads (or gracefully hides via `onerror="this.remove()"`)

### Phase 6: Deployment

- [ ] **6.1** `firebase login` (if not already)
- [ ] **6.2** `firebase use rajagobalan-site`
- [ ] **6.3** `npm run build`
- [ ] **6.4** `firebase deploy --only hosting`
- [ ] **6.5** Verify live: https://www.rajagobalan.com

---

## 4. File Changes Summary

| File | Action |
|------|--------|
| `vite.config.js` | Already has multi-page input; add `base` if needed |
| `firebase.json` | Create/update — `public: "dist"`, add rewrites |
| `.firebaserc` | Create/update — project `rajagobalan-site` |
| `public/` | Create — add `profile.jpg`, `404.html` |
| `DEPLOYMENT.md` | Update — new build steps, `dist/` as root |

---

## 5. Rollback Plan

If issues occur post-deployment:

1. Keep a backup of the current `public/` contents from the existing repo
2. Revert `firebase.json` to `"public": "public"`
3. Restore old `public/` files
4. Run `firebase deploy --only hosting`

---

## 6. Post-Migration Tasks

- [ ] Update DEPLOYMENT.md with new build + deploy instructions
- [ ] Add `profile.jpg` to repo or document where it comes from
- [ ] Consider CI/CD (e.g. GitHub Actions) for `npm run build` + `firebase deploy` on push
- [ ] Update any external links pointing to old `/blogs/` URL

---

## 7. Quick Reference Commands

```bash
# Build
npm run build

# Preview build locally
npm run preview

# Deploy to Firebase
firebase deploy --only hosting

# Preview deploy (optional)
firebase hosting:channel:deploy preview
```
