const CACHE = 'sortemax-v8';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
  '/icons/duriup-yt.png',
  '/icons/cinema-ballad.jpg',
  '/icons/qr-baixar.svg'
];
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap';

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      // 글꼴은 실패해도 설치가 막히지 않게 따로 받음
      c.add(FONT_CSS).catch(function() {});
      return c.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  if (e.request.method !== 'GET') return;
  // 결과 데이터·API·통계 요청은 캐시 안 함(항상 최신, 실패는 앱이 직접 처리)
  if (url.includes('/data/') ||
      url.includes('servicebus2.caixa.gov.br') ||
      url.includes('raw.githubusercontent.com') ||
      url.includes('googletagmanager.com') ||
      url.includes('google-analytics.com')) {
    return;
  }
  // 화면(HTML)은 항상 새 버전을 먼저 받고, 안 되면 저장본
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request).then(function(res) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put('/index.html', clone); });
        return res;
      }).catch(function() {
        return caches.match('/index.html');
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(res) {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        return res;
      });
    })
  );
});
