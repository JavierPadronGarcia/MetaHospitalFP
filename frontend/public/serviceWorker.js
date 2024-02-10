let CACHE_NAME = 'my-site-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/*'
];

const offlineMessages = [];
let token = '';
let backendEndpoint = '';

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

self.addEventListener('sync', (event) => {
  if (event.tag === 'message-sync') {
    fetch(backendEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: offlineMessages })
    }).then(response => {
      if (response.ok) {

        offlineMessages.splice(0, offlineMessages.length);
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'sync-message', data: 'Actualizando chat' });
          });
        });
      } else {
        console.log('ERROR');
      }
    })
  }
})

self.addEventListener('message', event => {
  if (event.data.action === 'offlineMessage') {
    const message = event.data.message;
    if (!token) token = event.data.token;
    if (!backendEndpoint) backendEndpoint = event.data.backendEndpoint;

    offlineMessages.push(message);
  }
})

self.addEventListener('push', async (event) => {

  const message = await event.data.json();
  let { title, description, image } = message;

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