// CACHE KILLER — clears all caches and self-unregisters immediately.
// This service worker exists solely to undo any previous caching.
// Production data is always fetched from the server — no local cache.

self.addEventListener('install', (event) => {
  console.log('[SW] Cache-killer install — clearing all caches');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        console.log('[SW] Deleting cache:', key);
        return caches.delete(key);
      }))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Cache-killer activate — unregistering self');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
     .then(() => self.registration.unregister())
  );
});

// Pass all fetches through to the network — no caching whatsoever
self.addEventListener('fetch', () => {});
