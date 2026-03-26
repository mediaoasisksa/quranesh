// Service Worker for caching Quran text offline
const CACHE_NAME = 'quran-recitation-cache-v1';
const QURAN_API_PATTERN = /\/api\/quran-text/;

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cache opened');
      return cache;
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Cache-first strategy for Quran API
self.addEventListener('fetch', (event) => {
  if (!QURAN_API_PATTERN.test(event.request.url)) {
    return;
  }

  console.log('[SW] Fetching:', event.request.url);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', event.request.url);
        return cachedResponse;
      }

      console.log('[SW] Fetching from network:', event.request.url);
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          console.log('[SW] Caching new resource:', event.request.url);
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Message event for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW] Cache cleared');
        event.ports[0].postMessage({ success: true });
      })
    );
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urls).then(() => {
          console.log('[SW] URLs cached:', urls);
          event.ports[0].postMessage({ success: true });
        });
      })
    );
  }
});
