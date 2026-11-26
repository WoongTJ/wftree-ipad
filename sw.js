/* 워크플로우 트리 제작기 아이패드판. 온라인이면 네트워크 우선, 실패 시에만 캐시. 문서는 캐시하지 않는다. */
const CACHE = 'wftree-1.2.4-ipad.3';
const BUILD = '1.2.4-ipad.3';
const SHELL = [
  './',
  './index.html',
  './version.json',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon.svg',
  './fonts/NotoSansKR-Regular.woff',
  './fonts/NotoSansKR-Medium.woff',
  './fonts/NotoSansKR-Bold.woff'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(event.request, copy));
      }
      return res;
    }).catch(() => caches.match(event.request).then(hit => hit || caches.match('./index.html')))
  );
});
