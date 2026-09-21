/* FastFit service worker — offline app shell + runtime cache
   v2 adds the Form Coach: caches MediaPipe (tasks-vision + wasm) and the pose
   model on first online use, so scoring keeps working offline afterwards. */
const CACHE = 'fastfit-v2';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];
/* large cross-origin assets: cache-first, filled on first successful load */
const RUNTIME = ['xlsx.full.min.js', 'jsdelivr.net/npm/@mediapipe', 'mediapipe-models', 'storage.googleapis.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Runtime CDN assets (SheetJS, MediaPipe libs/wasm/model): cache-first
  if (RUNTIME.some(u => req.url.includes(u))) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
      }).catch(()=>hit))
    );
    return;
  }
  // same-origin: cache-first, fall back to network then cache it
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(()=>caches.match('./index.html')))
  );
});
/* clicking a notification focuses the app */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window'}).then(cs => {
    for (const c of cs) { if ('focus' in c) return c.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow('./index.html');
  }));
});
