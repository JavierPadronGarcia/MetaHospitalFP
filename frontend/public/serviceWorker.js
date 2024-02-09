let CACHE_NAME = 'my-site-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/*'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  )
  self.skipWaiting();
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// const storedRequests = JSON.parse(localStorage.getItem('offlineMessages')) || [];

// if (storedRequests.length !== 0) {
//   storedRequests.forEach(async (message) => {
//     try {
//       const response = await fetch('', {
//         method: 'POST',
//         headers: {
//           'Content-type': 'application/json',
//         },
//         body: JSON.stringify(message),
//       });

//       if (response.ok) {
//         storedRequests.splice(storedRequests.indexOf(message), 1);
//         localStorage.removeItem('offlineMessages');
//       }
//     } catch (err) {
//       console.log('Error al enviar mensaje: ', err);
//     }
//   });
// }