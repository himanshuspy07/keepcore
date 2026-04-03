const CACHE_NAME = 'keep-core-cache-v1';

self.addEventListener('install', (event) => {
  // The service worker is being installed.
  // No pre-caching needed as we cache on the fly.
  self.skipWaiting();
});

// On fetch, try cache, then network, and update cache.
self.addEventListener('fetch', (event) => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For navigation requests, use a network-first strategy.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try the network first.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // The network failed, try to serve from cache.
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match('/');
          return cachedResponse;
        }
      })()
    );
    return;
  }

  // For other requests (assets), use a cache-first strategy.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      
      // Return from cache if available.
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Otherwise, fetch from network, cache it, and return it.
      try {
        const networkResponse = await fetch(event.request);
        // Response must be cloned to be used by both cache and browser.
        const responseToCache = networkResponse.clone();
        await cache.put(event.request, responseToCache);
        return networkResponse;
      } catch (error) {
        console.error('Service Worker fetch failed:', error);
        // You could return an offline fallback asset here.
      }
    })()
  );
});

// Clean up old caches on activation.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
