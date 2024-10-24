const CACHE_NAME = 'xidada-cache-v1';
const urlsToCache = [
  '/xidada/',
  '/xidada/index.html',
  '/xidada/admin.html',
  '/xidada/manifest.json',
  '/xidada/icons/icon-72x72.png',
  '/xidada/icons/icon-96x96.png',
  '/xidada/icons/icon-128x128.png',
  '/xidada/icons/icon-144x144.png',
  '/xidada/icons/icon-152x152.png',
  '/xidada/icons/icon-192x192.png',
  '/xidada/icons/icon-384x384.png',
  '/xidada/icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css',
  'https://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/css/ionicons.min.css',
  'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js',
  'https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
