// sw.js — service worker: makes the app installable and usable offline
const CACHE = 'frontedge-v1';                         // bump this name to force users onto a new version
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icons/icon-192.png'];

// install: pre-cache the app shell so the first offline open works
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();                                 // activate the new worker immediately
});

// activate: delete caches from older versions
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();                               // take control of open tabs
});

// fetch: network-first for API calls, cache-first (stale-while-revalidate) for everything else
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;             // never cache POSTs (AI chat)
  if (url.pathname.startsWith('/api/')) return;       // live data: let it hit the network
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request)
        .then((res) => {
          if (res.ok && url.origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match('/index.html')); // offline fallback
      return cached || network;
    })
  );
});
