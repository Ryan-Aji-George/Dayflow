/* Onwards — service worker.
   A browser will only offer to install an app that has one of these with a
   fetch handler, which is why the Install button never appeared. It also
   keeps the app working with no connection: the page is served from the
   cache first and refreshed in the background. Nothing here touches your
   data — habits, sessions, notes and portions all live in IndexedDB on the
   device and are never sent anywhere. */

const CACHE = 'onwards-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./', './index.html']).catch(() => {}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* The fetch handler is the part the browser insists on. Cached copy first so
   the app opens instantly and offline; a fresh copy is fetched alongside and
   stored for next time. */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  e.respondWith(
    caches.match(req).then(hit => {
      const live = fetch(req)
        .then(res => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => hit);          /* offline: fall back to whatever was kept */
      return hit || live;
    })
  );
});
