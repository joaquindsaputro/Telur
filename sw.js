const CACHE_NAME = 'telur-studio-v17';

// Daftar file yang wajib disimpan di HP
const urlsToCache = [
  './',
  './index.html',
  './data.csv',
  './manifest.json',
  // Cache script eksternal agar aman saat offline
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// Saat aplikasi diinstal, simpan file ke cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Membuka cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Saat aplikasi dibuka, coba ambil dari cache dulu, kalau gagal baru download
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Ditemukan di cache
        }
        return fetch(event.request); // Ambil dari internet
      })
  );
});

// Bersihkan cache lama jika ada update
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
