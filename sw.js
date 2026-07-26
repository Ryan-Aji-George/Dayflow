/* Dayflow service worker — app shell cache + offline fallback */
const VERSION = 'dayflow-v1';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== VERSION + '-ext').map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* fonts and other cross-origin assets: serve cached, refresh in background */
  if (url.origin !== location.origin) {
    e.respondWith(caches.open(VERSION + '-ext').then(async cache => {
      const hit = await cache.match(req);
      const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }

  /* app shell: cache first, fall back to the shell for navigations */
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy));
      return res;
    }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
  );
});
