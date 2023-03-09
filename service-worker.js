const cacheName = "precache-v1"
const cacheUrls = [
  './',
  'output.dat',
  'img.png',
];

self.addEventListener('install', e => {
  console.log('install');
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(cacheUrls))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  console.log('activate');
  e.waitUntil(
    caches.keys().then(keys => {
      return keys.filter(key => key !== cacheName);
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  console.log('fetch');
  if (!e.request.url.startsWith(self.location.origin)) {
    return
  }

  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request)
    })
  );
});
