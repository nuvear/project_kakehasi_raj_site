/**
 * Network-first: always try fresh JS/HTML when online (fixes stale Markdown renderer).
 * Offline falls back to cache. Bump CACHE_NAME when changing caching rules.
 */
const CACHE_NAME = "foodie-cache-v10";
const BASE = self.location.pathname.replace(/\/[^/]+$/, "/");

const urlsToCache = [
  BASE + "index.html",
  BASE + "app.js",
  BASE + "manifest.json",
  BASE + "sw.js",
  BASE + "firebase-config.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(req))
  );
});
