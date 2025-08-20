const CACHE_NAME = 'movies-v1'

self.addEventListener('install', event =>{
    event.waitUnitil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addA11([
                '/',
                '/index.html',
                '/style.css',
                '/app.js',
                '/manifest.json',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png'
            ])
        })
    );
});

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch event - try network first, fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Put a copy in cache
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request)) // fallback to cache if offline
  );
});