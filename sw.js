// Mission Board service worker: makes the app installable and lets it open offline.
// Pages are fetched fresh when online (so updates arrive) and fall back to the
// last saved copy when offline. Sign-in and database traffic are never touched.
const CACHE = 'mission-board-v1';
const SHELL = ['./', 'index.html', 'firebase-config.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const putInCache = (req, res) => {
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
};

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Our own files: network first, saved copy when offline.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req).then((res) => putInCache(req, res))
        .catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined))),
    );
    return;
  }

  // Fonts and the versioned Firebase SDK never change: saved copy first.
  if (/^(fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)
    || (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'))) {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => putInCache(req, res))));
  }
  // Everything else (Google sign-in, Firestore) goes straight to the network.
});
