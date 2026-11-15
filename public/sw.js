// Tasami Business for Safety Systems - Production Service Worker
const CACHE_NAME = 'tasami-safety-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.jpg',
  '/icons/pwa-192x192.png',
  '/icons/pwa-512x512.png',
  '/icons/apple-touch-icon.png',
  '/tasami-qr.png',
  '/tasami-qr.svg'
];

// Install: Cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('SW Precache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network first with Cache fallback for seamless real-time Firebase & updates
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Ignore non-GET requests or Firebase Firestore/Google APIs
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('youtube.com') ||
    url.hostname.includes('googletagmanager.com')
  ) {
    return;
  }

  // Static assets (images, fonts, scripts): Stale-While-Revalidate
  if (
    req.destination === 'image' ||
    req.destination === 'font' ||
    req.destination === 'script' ||
    req.destination === 'style'
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(req);
        const fetchPromise = fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(req, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // HTML navigation requests: Network first, cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Other GET requests
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
