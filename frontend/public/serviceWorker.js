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
  )
})

self.addEventListener('push', async function (event) {
  console.log("notifications will be displayed here");

  const message = await event.data.json();
  let { title, description, image } = message;
  console.log({ message });

  await event.waitUntil(
    self.registration.showNotification(title, {
      body: description,
      icon: image,
      actions: [
        {
          action: "some action",
          title: title,
          icon: ''
        },
      ],
    })
  );
});